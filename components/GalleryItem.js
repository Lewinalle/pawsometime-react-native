import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Button, Divider, Avatar, Input } from 'react-native-elements';
import Constants from '../constants/Layout';
import CacheImage from './CacheImage';
import { connect } from 'react-redux';
import { vectorIcon } from '../Utils/Icon';
import { likeResource, addComment, deleteComment } from '../Services/general';
import { deleteGallery } from '../Services/gallery';
import { fetchUserInfo } from '../Services/users';
import UserInfoModal from '../components/UserInfoModal';
import _ from 'lodash';

class GalleryItem extends Component {
	state = {
		showComments: false,
		item: this.props.item,
		isSubmitting: false,
		comment: '',
		modalUser: {},
		showUserModal: false
	};

	// shouldComponentUpdate(nextProps, nextState) {
	// 	return (
	// 		this.props.refreshToggle !== nextProps.refreshToggle ||
	// 		this.state.showComments !== nextState.showComments ||
	// 		this.state.showUserModal !== nextState.showUserModal ||
	// 		this.state.isSubmitting !== nextState.isSubmitting ||
	// 		this.state.item !== nextState.item ||
	// 		this.state.comment !== nextState.comment
	// 	);
	// }

	// componentDidUpdate(prevProps, prevState) {
	// 	if (!_.isEqual(JSON.stringify(prevState.item), JSON.stringify(this.props.item))) {
	// 		this.setState({ item: this.props.item });
	// 	}
	// }

	closeModal = () => {
		this.setState({ modalUser: {}, showUserModal: false });
	};

	handleModalOpen = async (userId = null) => {
		const { currentDBUser = {}, itemUser } = this.props;

		if (userId === currentDBUser.id) {
			return;
		}

		if (userId === itemUser.id) {
			this.setState({ modalUser: itemUser, showUserModal: true });
		} else {
			const user = await fetchUserInfo(userId);
			this.setState({ modalUser: user, showUserModal: true });
		}
	};

	handleLike = async () => {
		const { isSubmitting, item } = this.state;
		const { currentDBUser = {} } = this.props;

		if (isSubmitting) {
			return;
		}

		this.setState({ isSubmitting: true });

		// update frontend first for better UX
		let newItem = item;
		const hasUserLiked = _.includes(item.likes, currentDBUser.id);

		if (hasUserLiked) {
			newItem.likes = newItem.likes.filter((item) => item !== currentDBUser.id);
		} else {
			newItem.likes.push(currentDBUser.id);
		}

		this.setState({ item: newItem });

		// send request
		let body = {
			resource: 'gallery',
			userId: currentDBUser.id
		};

		try {
			await likeResource(item.id, body);
		} catch (err) {
			console.log(err);
		}
		this.setState({ isSubmitting: false });
	};

	handleAddComment = async () => {
		const { isSubmitting, comment, item } = this.state;
		const { currentDBUser = {} } = this.props;

		if (isSubmitting || !comment) return;

		this.setState({ isSubmitting: true });

		const body = {
			resource: 'gallery',
			description: comment,
			userId: currentDBUser.id,
			userName: currentDBUser.username,
			userAvatar: currentDBUser.avatar ? currentDBUser.avatar : null
		};

		const res = await addComment(item.id, body);

		this.setState({ comment: '', item: res });

		Alert.alert(
			'Success!',
			'Your comment has been added.',
			[
				{
					text: 'OK',
					onPress: async () => {
						setTimeout(() => {
							this.setState({ isSubmitting: false });
						}, 1000);
					}
				}
			],
			{ cancelable: false }
		);
	};

	handleDeleteComment = async (commentId) => {
		const { isSubmitting, item } = this.state;

		if (isSubmitting) {
			return;
		}

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this comment?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						this.setState({ isSubmitting: true });

						const body = {
							resource: 'gallery'
						};

						await deleteComment(item.id, commentId, body);

						// update frontend without refreshing
						let newItem = item;
						newItem.comments = newItem.comments.filter((item) => item.id !== commentId);
						this.setState({ item: newItem });

						Alert.alert(
							'Success!',
							'Your comment has been successfully deleted.',
							[
								{
									text: 'Yes'
								}
							],
							{ cancelable: false }
						);

						this.setState({ isSubmitting: false });
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	handleDeleteGallery = async () => {
		const { isSubmitting, item } = this.state;
		const { refresh } = this.props;

		if (isSubmitting) {
			return;
		}

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this photo?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						this.setState({ isSubmitting: true });

						try {
							await deleteGallery(item.id);
						} catch (err) {
							alert('Something went wrong, please try again.');
						}

						Alert.alert(
							'Success!',
							'Your photo has been successfully deleted.',
							[
								{
									text: 'Yes',
									onPress: async () => {
										await refresh();
									}
								}
							],
							{ cancelable: false }
						);

						this.setState({ isSubmitting: false });
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	render() {
		const { currentDBUser = {}, isFirst, itemUser } = this.props;
		const { item, showComments, comment, modalUser, showUserModal } = this.state;

		const dateTime = new Date(item.createdAt);
		const hasUserLiked = _.includes(item.likes, currentDBUser.id);

		return (
			<View style={{ paddingVertical: 4, backgroundColor: '#a3a096' }}>
				{!isFirst && <Divider />}
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingVertical: 4,
						paddingHorizontal: 6
					}}
				>
					<TouchableOpacity onPress={() => this.handleModalOpen(itemUser.id)}>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								maxWidth: Constants.window.width - 230
							}}
						>
							{itemUser && itemUser.avatar ? (
								<Avatar
									containerStyle={{ width: 35, height: 35 }}
									rounded
									source={{
										uri: itemUser.avatar
									}}
								/>
							) : (
								<Avatar
									containerStyle={{ width: 35, height: 35 }}
									rounded
									source={require('../assets/images/profile-default.png')}
								/>
							)}
							<Text numberOfLines={1} style={{ marginLeft: 8, fontSize: 14, fontWeight: 'bold' }}>
								{item.userName}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
						{item.userId === currentDBUser.id && (
							<TouchableOpacity onPress={() => this.props.toEditPage(item)}>
								<View style={{ marginRight: 8 }}>{vectorIcon('AntDesign', 'edit', 22)}</View>
							</TouchableOpacity>
						)}
						{item.userId === currentDBUser.id && (
							<TouchableOpacity onPress={this.handleDeleteGallery}>
								<View style={{ marginRight: 8 }}>{vectorIcon('AntDesign', 'delete', 22)}</View>
							</TouchableOpacity>
						)}
						<Text style={{ fontSize: 14 }}>
							{dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}
						</Text>
					</View>
				</View>
				<CacheImage
					uri={item.photo}
					style={{ width: Constants.window.width, height: Constants.window.width }}
				/>
				<View style={{ padding: 10, paddingBottom: 0 }}>
					<Text style={{ fontSize: 14 }}>{item.description}</Text>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: 8
					}}
				>
					{!showComments && (
						<View style={{ flexGrow: 1, alignContent: 'stretch' }}>
							<Button
								title="Click to see comments..."
								onPress={() => this.setState({ showComments: true })}
								titleStyle={{ fontSize: 14 }}
								containerStyle={{ padding: 0 }}
								buttonStyle={{ padding: 0 }}
								type="outline"
							/>
						</View>
					)}
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
						<TouchableOpacity onPress={this.handleLike}>
							<View style={{ marginRight: 6 }}>
								{vectorIcon('AntDesign', hasUserLiked ? 'like1' : 'like2', 18)}
							</View>
						</TouchableOpacity>
						<Text style={{ marginRight: 18 }}>{item.likes.length}</Text>

						<View style={{ marginRight: 6 }}>
							{vectorIcon('MaterialCommunityIcons', 'comment-multiple-outline', 16)}
						</View>
						<Text style={{ marginRight: 6 }}>{item.comments.length}</Text>
					</View>
				</View>
				{showComments && (
					<View style={{ paddingHorizontal: 10 }}>
						{item.comments.map((c, i) => {
							const dateTime = new Date(c.createdAt);
							return (
								<View key={i}>
									<Divider />
									<View
										style={{
											flex: 1,
											flexDirection: 'row',
											alignItems: 'center',
											paddingHorizontal: 6,
											paddingVertical: 8
										}}
									>
										<TouchableOpacity onPress={() => this.handleModalOpen(c.userId)}>
											<View style={{ paddingRight: 8 }}>
												{c.userAvatar ? (
													<Avatar
														containerStyle={{ width: 38, height: 38 }}
														rounded
														source={{
															uri: c.userAvatar
														}}
													/>
												) : (
													<Avatar
														containerStyle={{ width: 38, height: 38 }}
														rounded
														source={require('../assets/images/profile-default.png')}
													/>
												)}
											</View>
										</TouchableOpacity>
										<View style={{ flex: 1 }}>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent: 'space-between'
												}}
											>
												<TouchableOpacity onPress={() => this.handleModalOpen(c.userId)}>
													<Text style={{ fontSize: 16, fontWeight: 'bold' }}>
														{c.userName}
													</Text>
												</TouchableOpacity>

												<View>
													<View style={{ flex: 1, flexDirection: 'row' }}>
														{c.userId === currentDBUser.id && (
															<TouchableOpacity
																onPress={() => this.handleDeleteComment(c.id)}
															>
																<View style={{ marginRight: 10, marginTop: 2 }}>
																	{vectorIcon('AntDesign', 'delete', 16)}
																</View>
															</TouchableOpacity>
														)}
														<Text>
															{dateTime.toLocaleDateString()},{' '}
															{dateTime.toLocaleTimeString()}
														</Text>
													</View>
												</View>
											</View>
											<View>
												<Text>{c.description}</Text>
											</View>
										</View>
									</View>
								</View>
							);
						})}
						<Divider />
						<View
							style={{
								flexGrow: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								maxWidth: Constants.window.width - 45
							}}
						>
							<Input
								placeholder="Add a comment..."
								value={comment}
								multiline
								numberOfLines={1}
								containerStyle={{
									padding: 0,
									marginBottom: 0
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{
									textAlignVertical: 'top',
									paddingVertical: 4,
									fontSize: 14,
									alignSelf: 'center'
								}}
								onChangeText={(text) => this.setState({ comment: text })}
							/>
							<TouchableOpacity onPress={this.handleAddComment}>
								<View style={{ marginRight: 10 }}>{vectorIcon('Feather', 'plus-circle', 26)}</View>
							</TouchableOpacity>
						</View>
						<Button
							title="Close comments..."
							onPress={() => this.setState({ showComments: false })}
							titleStyle={{ fontSize: 14 }}
							containerStyle={{ padding: 0 }}
							buttonStyle={{ padding: 0 }}
							type="outline"
						/>
					</View>
				)}
				<UserInfoModal
					showModal={showUserModal}
					user={modalUser}
					closeModal={this.closeModal}
					navigation={this.props.navigation}
				/>
			</View>
		);
	}
}

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryItem);

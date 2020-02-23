import React, { useEffect, useState, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	TextInput,
	Picker,
	Alert,
	TouchableOpacity
} from 'react-native';
import { Input, Button, Text, Divider, Avatar } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from '../../constants/Layout';
import * as Permissions from 'expo-permissions';
import { createPost } from '../../Services/posts';
import { connect } from 'react-redux';
import Config from '../../config';
import { fetchPosts } from '../../redux/actions/posts.actions';
import CacheImage from '../../components/CacheImage';
import { vectorIcon } from '../../Utils/Icon';
import { likeResource, addComment, deleteComment } from '../../Services/general';
import { fetchPostInfo, deletePost } from '../../Services/posts';

const PostInfo = (props) => {
	const [ post, setPost ] = useState(props.navigation.getParam('post') ? props.navigation.getParam('post') : {});
	const [ comment, setComment ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ containerWidth, setContainerWidth ] = useState(350);

	const containerRef = useRef(null);

	const postType = props.navigation.getParam('postType');
	const handlePostInfoAction = props.navigation.getParam('handlePostInfoAction');

	const dateTime = new Date(post.updatedAt);
	const hasUserLiked = post.likes.includes(props.currentDBUser.id);

	const refresh = async () => {
		if (isSubmitting) {
			console.log('already submitting, wait!');
			return;
		}

		setIsSubmitting(true);

		const newPost = await fetchPostInfo(post.id, postType);

		setPost(newPost);

		setTimeout(() => {
			setIsSubmitting(false);
		}, 1000);
	};

	const handleLike = async () => {
		if (isSubmitting) {
			console.log('liking, waiting for current liking');
			return;
		}

		setIsSubmitting(true);

		// update frontend first for better UX
		let newPost = post;

		if (hasUserLiked) {
			newPost.likes = newPost.likes.filter((item) => item !== props.currentDBUser.id);
		} else {
			newPost.likes.push(props.currentDBUser.id);
		}

		setPost(newPost);

		// send request
		let body = {
			resource: `posts_${postType}`,
			userId: props.currentDBUser.id
		};

		await likeResource(post.id, body);
		await handlePostInfoAction(post.id, hasUserLiked ? 1 : 0);

		setIsSubmitting(false);
	};

	const handleAddComment = async () => {
		if (!isSubmitting) {
			setIsSubmitting(true);

			console.log('Not Submitting, adding a comment.');

			const body = {
				resource: `posts_${postType}`,
				description: comment,
				userId: props.currentDBUser.id,
				userName: props.currentDBUser.username,
				userAvatar: props.currentDBUser.avatar ? props.currentDBUser.avatar : null
			};

			await addComment(post.id, body);

			setComment('');

			await refresh();

			Alert.alert(
				'Success!',
				'Your comment has been added.',
				[
					{
						text: 'OK',
						onPress: async () => {
							await handlePostInfoAction(post.id, 2);

							setTimeout(() => {
								setIsSubmitting(false);
							}, 1000);
						}
					}
				],
				{ cancelable: false }
			);
		} else {
			console.log('Already Submitting, waiting for current submit');
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (isSubmitting) {
			console.log('already submitting, wait!');
			return;
		}

		console.log('delete!');

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this comment?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						setIsSubmitting(true);

						const body = {
							resource: `posts_${postType}`
						};

						await deleteComment(post.id, commentId, body);

						// update frontend without refreshing
						let newPost = post;
						newPost.comments = newPost.comments.filter((item) => item.id !== commentId);
						setPost(newPost);

						Alert.alert(
							'Success!',
							'Your comment has been successfully deleted.',
							[
								{
									text: 'Yes',
									onPress: async () => {
										await handlePostInfoAction(post.id, 3);
									}
								}
							],
							{ cancelable: false }
						);

						setIsSubmitting(false);
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	const handleDeletePost = async () => {
		if (isSubmitting) {
			console.log('already submitting, wait!');
			return;
		}

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this post?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						setIsSubmitting(true);
						await deletePost(post.id, postType);

						Alert.alert(
							'Success!',
							'Your post has been successfully deleted.',
							[
								{
									text: 'Yes',
									onPress: async () => {
										await handlePostInfoAction(post.id, 4);
										props.navigation.navigate('Board');
									}
								}
							],
							{ cancelable: false }
						);

						setIsSubmitting(false);
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				alignItems: 'stretch'
			}}
		>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={Header.HEIGHT + 50}>
				<ScrollView contentContainerStyle={{}}>
					<View
						ref={containerRef}
						onLayout={() => {
							if (containerRef.current) {
								containerRef.current.measure((x, y, width, height, pageX, pageY) => {
									setContainerWidth(width);
								});
							}
						}}
						style={{ backgroundColor: '#8a8483' }}
					>
						<View style={{ backgroundColor: '#75706f', paddingHorizontal: 10, paddingVertical: 4 }}>
							<Text style={{ fontSize: 24, fontWeight: 'bold' }}>{post.title}</Text>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									width: '100%',
									marginRight: 'auto'
								}}
							>
								<Text>{post.userName}</Text>
								<View>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TouchableOpacity onPress={refresh}>
											<View style={{ marginHorizontal: 10 }}>
												{vectorIcon('FrontAwesome', 'refresh', 22)}
											</View>
										</TouchableOpacity>
										{post.userId === props.currentDBUser.id && (
											<TouchableOpacity onPress={handleDeletePost}>
												<View style={{ marginRight: 10 }}>
													{vectorIcon('AntDesign', 'delete', 22)}
												</View>
											</TouchableOpacity>
										)}
										<Text>
											{dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}
										</Text>
									</View>
								</View>
							</View>
						</View>
						<View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
							<Text style={{ marginBottom: 10 }}>
								{post.description}
								{post.description}
								{post.description}
								{post.description}
								{post.description}
								{post.description}
								{post.description}
								{post.description}
								{post.description}
							</Text>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center'
								}}
							>
								<TouchableOpacity onPress={handleLike}>
									<View style={{ marginRight: 10 }}>
										{vectorIcon('AntDesign', hasUserLiked ? 'like1' : 'like2', 24)}
									</View>
								</TouchableOpacity>
								<Text style={{ marginRight: 26 }}>{post.likes.length}</Text>

								<View style={{ marginRight: 10 }}>
									{vectorIcon('MaterialCommunityIcons', 'comment-multiple-outline', 22)}
								</View>
								<Text style={{ marginRight: 10 }}>{post.comments.length}</Text>
							</View>
						</View>
						{post.attachment && (
							<View>
								<CacheImage
									style={{ width: containerWidth, height: containerWidth }}
									uri={props.currentDBUser.avatar}
								/>
							</View>
						)}
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								maxWidth: Constants.window.width - 38
							}}
						>
							<Input
								placeholder="Add a comment..."
								value={comment}
								multiline
								numberOfLines={2}
								containerStyle={{
									padding: 0,
									marginBottom: 0
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top', paddingVertical: 4 }}
								onChangeText={(text) => setComment(text)}
							/>
							<TouchableOpacity onPress={handleAddComment}>
								<View style={{ marginRight: 10 }}>{vectorIcon('Feather', 'plus-circle', 34)}</View>
							</TouchableOpacity>
						</View>
						{post.comments.map((c, i) => {
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
													source={require('../../assets/images/profile-default.png')}
												/>
											)}
										</View>
										<View style={{ width: Constants.window.width - 60 }}>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent: 'space-between'
												}}
											>
												<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{c.userName}</Text>

												<View>
													<View style={{ flex: 1, flexDirection: 'row' }}>
														{c.userId === props.currentDBUser.id && (
															<TouchableOpacity onPress={() => handleDeleteComment(c.id)}>
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
												<Text>
													{c.description}
													{c.description}
													{c.description}
												</Text>
											</View>
										</View>
									</View>
								</View>
							);
						})}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

PostInfo.navigationOptions = (props) => {
	return {
		title: 'Post Info',
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	};
};

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {
	fetchPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(PostInfo);

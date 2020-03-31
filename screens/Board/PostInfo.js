import React, { useState, useRef } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Input, Text, Divider, Avatar } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import Constants from '../../constants/Layout';
import { connect } from 'react-redux';
import CacheImage from '../../components/CacheImage';
import { vectorIcon } from '../../Utils/Icon';
import { likeResource, addComment, deleteComment } from '../../Services/general';
import { fetchPostInfo, deletePost } from '../../Services/posts';
import { fetchUserInfo } from '../../Services/users';
import Colors from '../../constants/Colors';
import UserInfoModal from '../../components/UserInfoModal';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const PostInfo = (props) => {
	const [ post, setPost ] = useState(props.navigation.getParam('post') ? props.navigation.getParam('post') : {});
	const [ comment, setComment ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ containerWidth, setContainerWidth ] = useState(350);
	const [ modalUser, setModalUser ] = useState({});
	const [ showUserModal, setShowUserModal ] = useState(false);

	const containerRef = useRef(null);

	const postType = props.navigation.getParam('postType');
	const handlePostInfoAction = props.navigation.getParam('handlePostInfoAction');

	const dateTime = new Date(post.updatedAt);
	const hasUserLiked = post.likes.includes(props.currentDBUser.id);

	const refresh = async () => {
		if (isSubmitting) {
			return;
		}

		setIsSubmitting(true);

		const newPost = await fetchPostInfo(post.id, postType);

		setPost(newPost);

		setIsSubmitting(false);
	};

	const handleLike = async () => {
		if (isSubmitting) {
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

		const resItem = await likeResource(post.id, body);

		await handlePostInfoAction(post.id, hasUserLiked ? 1 : 0, resItem);

		setIsSubmitting(false);
	};

	const handleAddComment = async () => {
		if (isSubmitting || !comment) return;

		if (!isSubmitting) {
			setIsSubmitting(true);

			const body = {
				resource: `posts_${postType}`,
				description: comment,
				userId: props.currentDBUser.id,
				userName: props.currentDBUser.username,
				userAvatar: props.currentDBUser.avatar ? props.currentDBUser.avatar : null
			};

			const resItem = await addComment(post.id, body);

			setComment('');

			await refresh();

			Alert.alert(
				'Success!',
				'Your comment has been added.',
				[
					{
						text: 'OK',
						onPress: async () => {
							await handlePostInfoAction(post.id, 2, resItem);

							setIsSubmitting(false);
						}
					}
				],
				{ cancelable: false }
			);
		} else {
		}
	};

	const handleDeleteComment = async (commentId) => {
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
						setIsSubmitting(true);

						const body = {
							resource: `posts_${postType}`
						};

						const resItem = await deleteComment(post.id, commentId, body);

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
										await handlePostInfoAction(post.id, 3, resItem);
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
										await handlePostInfoAction(post.id, 4, null);
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

	const toEditPage = () => {
		Alert.alert(
			'Edit',
			'Are you sure you want to edit this post?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						props.navigation.navigate('CreatePost', {
							originalPost: post,
							postType,
							onCreateBack: props.navigation.getParam('onCreateBack')
						});
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	const handleModalOpen = async (userId = null) => {
		const { currentDBUser = {} } = props;

		if (userId === currentDBUser.id) {
			return;
		}

		const user = await fetchUserInfo(userId);

		setModalUser(user);
		setShowUserModal(true);
	};

	const closeModal = () => {
		setShowUserModal(false);
		setModalUser({});
	};

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					marginTop: 52,
					alignItems: 'center',
					paddingHorizontal: 14,
					maxHeight: 40
				}}
			>
				<TouchableOpacity onPress={() => props.navigation.goBack()}>
					<View style={{ top: 2, paddingRight: 34 }}>
						{vectorIcon('Ionicons', 'ios-arrow-back', 40, Colors.primaryColor)}
					</View>
				</TouchableOpacity>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
						<View style={{ marginRight: 25 }}>
							<View style={{ top: 2 }}>
								{vectorIcon('Entypo', 'blackboard', 28, Colors.primaryColor)}
							</View>
						</View>
					</View>
				</View>
			</View>
			<View style={{ marginBottom: 10, marginTop: 6 }}>
				<Divider style={{ height: 1.5, backgroundColor: Colors.primaryColor }} />
			</View>

			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					alignItems: 'center',
					alignItems: 'stretch',
					paddingHorizontal: 14
				}}
			>
				<ScrollView
					contentContainerStyle={{}}
					refreshControl={<RefreshControl refreshing={isSubmitting} onRefresh={refresh} />}
				>
					<View
						ref={containerRef}
						onLayout={() => {
							if (containerRef.current) {
								containerRef.current.measure((x, y, width, height, pageX, pageY) => {
									setContainerWidth(width);
								});
							}
						}}
						style={{}}
					>
						<View style={{ paddingHorizontal: 0, paddingVertical: 4 }}>
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{post.title}</Text>
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
											<TouchableOpacity onPress={toEditPage}>
												<View style={{ marginRight: 12 }}>
													{vectorIcon('AntDesign', 'edit', 22)}
												</View>
											</TouchableOpacity>
										)}
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
						<View style={{ paddingHorizontal: 0, paddingTop: 4, marginVertical: 6 }}>
							<Text style={{ marginBottom: 10 }}>{post.description}</Text>
						</View>
						{post.attachment && (
							<View style={{ marginBottom: 16 }}>
								<CacheImage
									style={{ width: containerWidth, height: containerWidth }}
									uri={post.attachment}
								/>
							</View>
						)}
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'flex-end',
								alignItems: 'center',
								marginBottom: 10
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
						<Divider />
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								maxWidth: Constants.window.width - 62
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
										<TouchableOpacity onPress={() => handleModalOpen(c.userId)}>
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
										</TouchableOpacity>
										<View style={{ width: Constants.window.width - 60 }}>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent: 'space-between'
												}}
											>
												<TouchableOpacity onPress={() => handleModalOpen(c.userId)}>
													<Text style={{ fontSize: 16, fontWeight: 'bold' }}>
														{c.userName}
													</Text>
												</TouchableOpacity>

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
												<Text>{c.description}</Text>
											</View>
										</View>
									</View>
								</View>
							);
						})}
						<Divider />
					</View>
				</ScrollView>
				<KeyboardSpacer topSpacing={Constants.platform.ios ? 0 : 50} />
				<UserInfoModal
					showModal={showUserModal}
					user={modalUser}
					closeModal={closeModal}
					navigation={props.navigation}
				/>
			</View>
		</View>
	);
};

PostInfo.navigationOptions = ({ navigation }) => ({
	headerShown: false
});

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PostInfo);

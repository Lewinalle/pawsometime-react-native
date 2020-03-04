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
import { connect } from 'react-redux';
import Config from '../../config';
import CacheImage from '../../components/CacheImage';
import { vectorIcon } from '../../Utils/Icon';
import { likeResource, addComment, deleteComment } from '../../Services/general';
import { fetchMeetupInfo, deleteMeetup } from '../../Services/meetups';

const MeetupInfo = (props) => {
	const [ meetup, setMeetup ] = useState(props.navigation.getParam('meetup'));
	const [ comment, setComment ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ containerWidth, setContainerWidth ] = useState(350);

	const containerRef = useRef(null);

	const handleMeetupInfoAction = props.navigation.getParam('handleMeetupInfoAction');

	const dateTime = new Date(meetup.updatedAt);
	const hasUserLiked = meetup.likes.includes(props.currentDBUser.id);

	const refresh = async () => {
		if (isSubmitting) {
			console.log('already submitting, wait!');
			return;
		}

		setIsSubmitting(true);

		const newMeetup = await fetchMeetupInfo(meetup.id);

		setMeetup(newMeetup);

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
		let newMeetup = meetup;

		if (hasUserLiked) {
			newMeetup.likes = newMeetup.likes.filter((item) => item !== props.currentDBUser.id);
		} else {
			newMeetup.likes.push(props.currentDBUser.id);
		}

		setMeetup(newMeetup);

		// send request
		let body = {
			resource: 'meetups',
			userId: props.currentDBUser.id
		};

		const resItem = await likeResource(meetup.id, body);

		// await handleMeetupInfoAction(meetup.id, hasUserLiked ? 1 : 0, resItem);

		setIsSubmitting(false);
	};

	const handleAddComment = async () => {
		if (!isSubmitting) {
			setIsSubmitting(true);

			console.log('Not Submitting, adding a comment.');

			const body = {
				resource: 'meetups',
				description: comment,
				userId: props.currentDBUser.id,
				userName: props.currentDBUser.username,
				userAvatar: props.currentDBUser.avatar ? props.currentDBUser.avatar : null
			};

			const resItem = await addComment(meetup.id, body);

			setComment('');

			await refresh();

			Alert.alert(
				'Success!',
				'Your comment has been added.',
				[
					{
						text: 'OK',
						onPress: async () => {
							// await handleMeetupInfoAction(meetup.id, 2, resItem);

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

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this comment?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						setIsSubmitting(true);

						const body = {
							resource: 'meetups'
						};

						const resItem = await deleteComment(meetup.id, commentId, body);

						// update frontend without refreshing
						let newMeetup = meetup;
						newMeetup.comments = newMeetup.comments.filter((item) => item.id !== commentId);
						setMeetup(newMeetup);

						Alert.alert(
							'Success!',
							'Your comment has been successfully deleted.',
							[
								{
									text: 'Yes',
									onPress: async () => {
										// await handleMeetupInfoAction(meetup.id, 3, resItem);
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

	// const handleDeleteMeetup = async () => {
	// 	if (isSubmitting) {
	// 		console.log('already submitting, wait!');
	// 		return;
	// 	}

	// 	Alert.alert(
	// 		'Warning!',
	// 		'Are you sure you want to delete this meetup?',
	// 		[
	// 			{
	// 				text: 'Yes',
	// 				onPress: async () => {
	// 					setIsSubmitting(true);
	// 					await deleteMeetup(meetup.id);

	// 					Alert.alert(
	// 						'Success!',
	// 						'Your meetup has been successfully deleted.',
	// 						[
	// 							{
	// 								text: 'Yes',
	// 								onPress: async () => {
	// 									await handleMeetupInfoAction(meetup.id, 4, null);
	// 									props.navigation.navigate('Board');
	// 								}
	// 							}
	// 						],
	// 						{ cancelable: false }
	// 					);

	// 					setIsSubmitting(false);
	// 				}
	// 			},
	// 			{
	// 				text: 'No'
	// 			}
	// 		],
	// 		{ cancelable: false }
	// 	);
	// };

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
							<Text style={{ fontSize: 24, fontWeight: 'bold' }}>{meetup.title}</Text>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									width: '100%',
									marginRight: 'auto'
								}}
							>
								<Text>{meetup.userName}</Text>
								<View>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TouchableOpacity onPress={refresh}>
											<View style={{ marginHorizontal: 10 }}>
												{vectorIcon('FrontAwesome', 'refresh', 22)}
											</View>
										</TouchableOpacity>
										{meetup.userId === props.currentDBUser.id && (
											<TouchableOpacity onPress={handleDeleteMeetup}>
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
						<View style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#a2a0a3' }}>
							<Text style={{ marginBottom: 10 }}>{meetup.description}</Text>
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
								<Text style={{ marginRight: 26 }}>{meetup.likes.length}</Text>

								<View style={{ marginRight: 10 }}>
									{vectorIcon('MaterialCommunityIcons', 'comment-multiple-outline', 22)}
								</View>
								<Text style={{ marginRight: 10 }}>{meetup.comments.length}</Text>
							</View>
						</View>
						{meetup.attachment && (
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
						{meetup.comments.map((c, i) => {
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
												<Text>{c.description}</Text>
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

MeetupInfo.navigationOptions = (props) => {
	return {
		title: 'Meetup Info',
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	};
};

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MeetupInfo);

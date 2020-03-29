import React, { useState, useRef } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Divider, Avatar } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import Constants from '../../constants/Layout';
import { connect } from 'react-redux';
import CacheImage from '../../components/CacheImage';
import { vectorIcon } from '../../Utils/Icon';
import { likeResource, addComment, deleteComment } from '../../Services/general';
import { fetchMeetupInfo, deleteMeetup, autoJoin, requestJoin, cancelJoin } from '../../Services/meetups';
import _ from 'lodash';
import MapView, { Marker } from 'react-native-maps';

const MAP_HEIGHT = 200;
const LAT_DELTA = 0.07;
const LON_DELTA = 0.07;

const MeetupInfo = (props) => {
	const [ meetup, setMeetup ] = useState(props.navigation.getParam('meetup'));
	const [ comment, setComment ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ containerWidth, setContainerWidth ] = useState(350);

	const containerRef = useRef(null);

	const handleMeetupInfoAction = props.navigation.getParam('handleMeetupInfoAction');

	const dateTime = new Date(meetup.updatedAt);
	const hasUserLiked = meetup.likes.includes(props.currentDBUser.id);

	// joinStatus - none: 0, pending: 1, joined: 2
	let joinStatus;

	if (meetup && props.currentDBUser) {
		if (_.some(meetup.joined, { userId: props.currentDBUser.id })) {
			joinStatus = 2;
		} else if (_.some(meetup.pending, { userId: props.currentDBUser.id })) {
			joinStatus = 1;
		} else {
			joinStatus = 0;
		}
	}

	const handleJoin = async () => {
		if (isSubmitting) {
			return;
		}

		setIsSubmitting(true);

		switch (joinStatus) {
			case 0:
				Alert.alert(
					'Requesting...',
					'Are you sure you want to request to join this meetup?',
					[
						{
							text: 'Yes',
							onPress: async () => {
								let res;
								let actionType;
								let alertTitle;
								let alertMessage;
								if (meetup.isPrivate && props.currentDBUser.id !== meetup.userId) {
									res = await requestJoin(meetup.id, {
										userId: props.currentDBUser.id,
										userName: props.currentDBUser.username
									});
									actionType = 5;
									alertTitle = 'Requested';
									alertMessage = 'Successfully requested to join this meetup.';
								} else {
									res = await autoJoin(meetup.id, {
										userId: props.currentDBUser.id,
										userName: props.currentDBUser.username
									});
									actionType = 6;
									alertTitle = 'Joined';
									alertMessage = 'Successfully joined this meetup.';
								}
								Alert.alert(
									alertTitle,
									alertMessage,
									[
										{
											text: 'OK'
										}
									],
									{ cancelable: false }
								);
								setMeetup(res);
								handleMeetupInfoAction(res.id, actionType, res);
							}
						},
						{
							text: 'No'
						}
					],
					{ cancelable: false }
				);
				break;
			case 1:
			case 2:
				Alert.alert(
					'Leaving...',
					'Are you sure you want to cancel/leave this meetup?',
					[
						{
							text: 'Yes',
							onPress: async () => {
								let res;
								res = await cancelJoin(meetup.id, {
									userId: props.currentDBUser.id,
									userName: props.currentDBUser.username
								});
								setMeetup(res);
								handleMeetupInfoAction(res.id, 9, res);
								Alert.alert(
									'Cancelled',
									'Successfully left this meetup.',
									[
										{
											text: 'OK'
										}
									],
									{ cancelable: false }
								);
							}
						},
						{
							text: 'No'
						}
					],
					{ cancelable: false }
				);
				break;
			default:
				break;
		}

		setTimeout(() => {
			setIsSubmitting(false);
		}, 1000);
	};

	const refresh = async () => {
		if (isSubmitting) {
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

		await handleMeetupInfoAction(meetup.id, hasUserLiked ? 1 : 0, resItem);

		setIsSubmitting(false);
	};

	const handleAddComment = async () => {
		if (isSubmitting || !comment) return;

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
							await handleMeetupInfoAction(meetup.id, 2, resItem);

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
										await handleMeetupInfoAction(meetup.id, 3, resItem);
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

	const handleDeleteMeetup = async () => {
		if (isSubmitting) {
			console.log('already submitting, wait!');
			return;
		}

		Alert.alert(
			'Warning!',
			'Are you sure you want to delete this meetup?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						setIsSubmitting(true);
						await deleteMeetup(meetup.id);

						Alert.alert(
							'Success!',
							'Your meetup has been successfully deleted.',
							[
								{
									text: 'Yes',
									onPress: async () => {
										await handleMeetupInfoAction(meetup.id, 4, null);
										props.navigation.navigate('Meetup');
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

	const renderJoinButton = () => {
		let title = '';

		switch (joinStatus) {
			case 0:
				title = 'Join';
				break;
			case 1:
				title = 'Cancel';
				break;
			case 2:
				title = 'Leave';
				break;
			default:
				break;
		}

		return (
			<View style={{ marginRight: 10 }}>
				<Button
					title={title}
					buttonStyle={{ paddingVertical: 4, paddingHorizontal: 10 }}
					onPress={handleJoin}
				/>
			</View>
		);
	};

	const renderStatusText = () => {
		let message = '';

		switch (joinStatus) {
			case 0:
				message = 'You are not in this meetup';
				break;
			case 1:
				message = "You've requested to join this meetup";
				break;
			case 2:
				message = "You've joined this meetup";
				break;
			default:
				break;
		}

		return (
			<View
				style={{
					marginHorizontal: 6,
					flex: 1
				}}
			>
				<Text numberOfLines={2} style={{ flex: 1, textAlign: 'right', textAlignVertical: 'center' }}>
					{message}
				</Text>
			</View>
		);
	};

	const toEditPage = () => {
		Alert.alert(
			'Edit',
			'Are you sure you want to edit this meetup?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						props.navigation.navigate('CreateMeetup', {
							originalMeetup: meetup,
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

	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				alignItems: 'stretch'
			}}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior="height"
				keyboardVerticalOffset={Constants.platform.ios ? Header.HEIGHT : Header.HEIGHT + 50}
			>
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
											<TouchableOpacity onPress={toEditPage}>
												<View style={{ marginRight: 12 }}>
													{vectorIcon('AntDesign', 'edit', 22)}
												</View>
											</TouchableOpacity>
										)}
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
							<View>
								<Text style={{ marginBottom: 10 }}>{meetup.description}</Text>
							</View>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center'
								}}
							>
								{renderStatusText()}
								{renderJoinButton()}
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
						<MapView
							style={{
								width: containerWidth,
								height: MAP_HEIGHT
							}}
							initialRegion={{
								latitude: meetup.latlon.lat,
								longitude: meetup.latlon.lon,
								latitudeDelta: LAT_DELTA,
								longitudeDelta: LON_DELTA
							}}
						>
							<Marker
								coordinate={{
									latitude: meetup.latlon.lat,
									longitude: meetup.latlon.lon
								}}
							/>
						</MapView>
						{meetup.attachment && (
							<View>
								<CacheImage
									style={{ width: containerWidth, height: containerWidth }}
									uri={meetup.attachment}
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

MeetupInfo.navigationOptions = ({ navigation }) => {
	const meetup = navigation.getParam('meetup');
	return {
		title: meetup.title,
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	};
};

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MeetupInfo);

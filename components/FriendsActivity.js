import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking, RefreshControl } from 'react-native';
import { Input, Button, ListItem, Card, Divider, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchFriendsActivity } from '../redux/actions/others.actions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatUsersIdsParams } from '../Utils/FormatParams';
import { fetchMeetupInfo } from '../Services/meetups';
import { fetchUserGallery } from '../redux/actions/gallery.actions';
import { fetchUserInfo } from '../Services/users';
import { fetchPostInfo } from '../Services/posts';
import Colors from '../constants/Colors';
import NoContent from './NoContent';

const STACKSIZE = 10;
const boardTypes = [ 'general', 'qna', 'tips', 'trade' ];

const FriendsActivity = (props) => {
	const { friendsActivity, currentDBUser } = props;
	const [ activities, setActivities ] = useState(props.friendsActivity);
	const [ currentStack, setCurrentStack ] = useState(1);
	const [ showLoadMore, setShowLoadMore ] = useState(false);
	const [ isFetching, setIsFetching ] = useState(false);

	useEffect(
		() => {
			setActivities(props.friendsActivity);
			setShowLoadMore(props.friendsActivity.length > STACKSIZE);
		},
		[ props.friendsActivity ]
	);

	const loadMore = async () => {
		const newCurrentStack = currentStack + 1;
		setCurrentStack(newCurrentStack);
		setShowLoadMore(activities.length > newCurrentStack * STACKSIZE);
	};

	const resetStack = () => {
		setCurrentStack(1);
	};

	const refresh = async () => {
		setIsFetching(true);

		await props.fetchFriendsActivity(currentDBUser.id, {
			friendsActivity: formatUsersIdsParams(currentDBUser.friends.friends)
		});

		resetStack();
		setShowLoadMore(props.friendsActivity.length > STACKSIZE);
		setIsFetching(false);
	};

	const handleCardClick = async (item) => {
		switch (item.resource) {
			case 'meetup':
				await fetchMeetupInfo(item.resourceId).then((res) => {
					props.navigation.navigate('Meetup', { toSpecificMeetup: res });
				});
				return;
			case 'post':
				await fetchPostInfo(item.resourceId, item.resourceType).then((res) => {
					const typeIndex = boardTypes.findIndex((i) => i === item.resourceType);
					props.navigation.navigate('Board', {
						toSpecificPost: res,
						postType: typeIndex
					});
				});
				return;
			case 'gallery':
				await fetchUserInfo(item.userId).then(async (res) => {
					await props.fetchUserGallery(item.userId, 1);
					props.navigation.navigate('UserGallery', { galleryUser: res });
				});
				return;
			case 'user':
				props.navigation.navigate('Friends');
				return;
			default:
				return;
		}
	};

	const generateMessage = (item) => {
		switch (item.resource) {
			case 'meetup':
				switch (item.action) {
					case 'create':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								created a meetup.
							</Text>
						);
					case 'update':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								updated a meetup.
							</Text>
						);
					default:
						return;
				}
			case 'post':
				switch (item.action) {
					case 'create':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								created a {item.resourceType} post.
							</Text>
						);
					case 'update':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								updated a {item.resourceType} post.
							</Text>
						);
					default:
						return;
				}
			case 'gallery':
				switch (item.action) {
					case 'create':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								added a photo.
							</Text>
						);
					case 'update':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								updated gallery.
							</Text>
						);
					default:
						return;
				}
			case 'user':
				if (item.resourceId !== props.currentDBUser.id) {
					return;
				}
				switch (item.action) {
					case 'connect':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								You are now friends with {item.userName}
							</Text>
						);
					case 'request':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								sent a friend request.
							</Text>
						);
					case 'update':
						return (
							<Text numberOfLines={2} style={{ fontSize: 14 }}>
								updated profile.
							</Text>
						);
					default:
						return;
				}
			default:
				return;
		}
	};

	return (
		<View style={{ flex: 1, marginTop: 10 }}>
			{(!activities || activities.length === 0) && (
				<NoContent
					title="No Friends Activities"
					message="Come back later to check your friends activities once again!"
				/>
			)}
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refresh} />}
			>
				<View>
					{activities.slice(0, STACKSIZE * currentStack).map((item, index) => {
						const dateTime = new Date(item.createdAt);
						const message = generateMessage(item);
						if (!message) {
							return null;
						}
						return (
							<View key={index}>
								<Card
									key={index}
									containerStyle={{
										elevation: 0,
										paddingTop: 20,
										paddingBottom: 8,
										paddingHorizontal: 14,
										margin: 0,
										borderWidth: 0
									}}
								>
									<TouchableOpacity onPress={() => handleCardClick(item)}>
										<View>
											<View style={{ flex: 1, flexDirection: 'row' }}>
												<View style={{ flex: 1, paddingLeft: 6 }}>
													<View style={{}}>
														<Text style={{ fontWeight: 'bold', fontSize: 14 }}>
															{item.userName}
														</Text>
													</View>
													<View
														style={{
															flex: 1,
															flexDirection: 'row',
															justifyContent: 'space-between',
															marginBottom: 3
														}}
													>
														{generateMessage(item)}
													</View>
													<View style={{ flex: 1, flexDirection: 'row' }}>
														<Text style={{ flex: 1, fontSize: 12, textAlign: 'left' }}>
															{dateTime.toLocaleDateString()},{' '}
															{dateTime.toLocaleTimeString()}
														</Text>
														<Text style={{ fontSize: 12, textAlign: 'right' }}>
															click to go to tab
														</Text>
													</View>
												</View>
											</View>
										</View>
									</TouchableOpacity>
								</Card>
								<Divider style={{ height: 2, backgroundColor: '#f7f7f7' }} />
							</View>
						);
					})}
					{showLoadMore && (
						<TouchableOpacity onPress={loadMore} style={{ marginBottom: 6 }}>
							<View
								style={{
									marginHorizontal: 14,
									padding: 4,
									borderWidth: 0.5,
									borderRadius: 25,
									backgroundColor: '#f7da9c'
								}}
							>
								<Text style={{ fontSize: 14, textAlign: 'center' }}>LOAD MORE</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = ({ auth, others }) => ({
	friendsActivity: others.friendsActivity,
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = { fetchFriendsActivity, fetchUserGallery };

export default connect(mapStateToProps, mapDispatchToProps)(FriendsActivity);

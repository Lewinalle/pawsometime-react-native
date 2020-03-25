import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Input, Card, SearchBar } from 'react-native-elements';
import UserCardList from '../../components/UserCardList';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, getUsers, updateUser, acceptFriend, requestFriend } from '../../Services/users';
import { formatUsersIdsParams } from '../../Utils/FormatParams';
import _ from 'lodash';

const Friends = (props) => {
	const [ searchTerm, setSearchTerm ] = useState('');
	const { currentDBUser } = props;
	const [ isFetching, setIsFetching ] = useState(false);

	const [ pendingUsers, setPendingUsers ] = useState(null);
	const [ sentUsers, setSentUsers ] = useState(null);
	const [ friendsUsers, setFriendsUsers ] = useState(null);

	const [ allPendingUsers, setAllPendingUsers ] = useState(null);
	const [ allSentUsers, setAllSentUsers ] = useState(null);
	const [ allFriendsUsers, setAllFriendsUsers ] = useState(null);

	useEffect(() => {
		const fetchFriends = async () => {
			setIsFetching(true);

			const concatArr = _.concat(
				currentDBUser.friends.pending,
				currentDBUser.friends.sent,
				currentDBUser.friends.friends
			);

			if (concatArr.length > 0) {
				let params = {
					userIds: formatUsersIdsParams(concatArr)
				};

				const fetchedUsers = await getUsers(params);

				const pendings = _.filter(fetchedUsers, (user) => _.includes(currentDBUser.friends.pending, user.id));
				await setPendingUsers(pendings);
				await setAllPendingUsers(pendings);

				const sents = _.filter(fetchedUsers, (user) => _.includes(currentDBUser.friends.sent, user.id));
				await setSentUsers(sents);
				await setAllSentUsers(sents);

				const friends = _.filter(fetchedUsers, (user) => _.includes(currentDBUser.friends.friends, user.id));
				await setFriendsUsers(friends);
				await setAllFriendsUsers(friends);
			} else {
				setPendingUsers([]);
				setAllPendingUsers([]);

				setSentUsers([]);
				setAllSentUsers([]);

				setFriendsUsers([]);
				setAllFriendsUsers([]);
			}

			setIsFetching(false);
		};

		fetchFriends();
	}, []);

	const handleSearch = (search) => {
		setSearchTerm(search);

		const compareFn = (user) =>
			(user.username && _.includes(user.username.toLowerCase(), search.toLowerCase())) ||
			(user.description && _.includes(user.description.toLowerCase(), search.toLowerCase()));

		const pendings = _.filter(allPendingUsers, compareFn);
		setPendingUsers(pendings);

		const sents = _.filter(allSentUsers, compareFn);
		setSentUsers(sents);

		const friends = _.filter(allFriendsUsers, compareFn);
		setFriendsUsers(friends);
	};

	const updateAction = async (friend, actionType) => {
		// 0: request, 1: accept, 2: reject, 3: cancel, 4: remove
		if (actionType < 0 || actionType > 4) {
			return;
		}

		let newSents;
		let newPendings;
		let newFriends;

		switch (actionType) {
			case 0:
				newSents = allSentUsers;
				let targetIndex = _.findIndex(newSents, { id: friend.id });
				if (targetIndex === -1) {
					newSents.push(friend);
				} else {
					newSents.splice(targetIndex, 1, friend);
				}
				setAllSentUsers(newSents);
				break;

			case 1:
				newPendings = allPendingUsers;
				_.remove(newPendings, (u) => u.id === friend.id);
				setAllPendingUsers(newPendings);

				newFriends = allFriendsUsers;
				let targetFriendIndex = _.findIndex(newFriends, { id: friend.id });
				if (targetFriendIndex === -1) {
					newFriends.push(friend);
				} else {
					newFriends.splice(targetFriendIndex, 1, friend);
				}
				setAllFriendsUsers(newFriends);
				break;

			case 2:
				newPendings = allPendingUsers;
				_.remove(newPendings, (u) => u.id === friend.id);
				setAllPendingUsers(newPendings);
				break;

			case 3:
				newSents = allSentUsers;
				_.remove(newSents, (u) => u.id === friend.id);
				setAllSentUsers(newSents);
				break;

			case 4:
				newFriends = allFriendsUsers;
				_.remove(newFriends, (u) => u.id === friend.id);
				setAllFriendsUsers(newFriends);
				break;
		}

		handleSearch(searchTerm);
	};

	const renderEmpty = () => {
		if (pendingUsers.length === 0 && sentUsers.length === 0 && friendsUsers.length === 0) {
			if (searchTerm) {
				return (
					<View style={{ marginBottom: 8 }}>
						<UserCardList
							users={[]}
							title="No Friends Found"
							userType="empty"
							updateAction={(friend, actionType) => updateAction(friend, actionType)}
							navigation={props.navigation}
						/>
					</View>
				);
			} else {
				return (
					<Card
						title="No Firends Yet"
						image={require('../../assets/images/profile-default.png')}
						imageStyle={{ height: 350 }}
						containerStyle={{ margin: 0, borderRadius: 8 }}
					>
						<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
							<Text style={{ fontSize: 14 }}>Try connect with others!</Text>
						</View>
					</Card>
				);
			}
		}
		return null;
	};

	if (!pendingUsers || !sentUsers || !friendsUsers) {
		return null;
	}

	return (
		<View style={{ padding: 5, flex: 1, flexDirection: 'column', alignItems: 'center' }}>
			<View style={{ marginBottom: 10, padding: 10, backgroundColor: 'grey', alignSelf: 'stretch' }}>
				<SearchBar
					containerStyle={{ backgroundColor: 'white', borderTopWidth: 0, borderBottomWidth: 0 }}
					inputContainerStyle={{ backgroundColor: 'white' }}
					placeholder="Search friends.."
					onChangeText={handleSearch}
					value={searchTerm}
				/>
			</View>
			<ScrollView
				style={{ alignSelf: 'stretch', paddingTop: 0 }}
				contentContainerStyle={{ padding: 8, backgroundColor: 'grey' }}
			>
				{renderEmpty()}
				{pendingUsers.length > 0 && (
					<View style={{ marginBottom: 8 }}>
						<UserCardList
							users={pendingUsers}
							title="Requests Received"
							userType="pending"
							updateAction={(friend, actionType) => updateAction(friend, actionType)}
							navigation={props.navigation}
						/>
					</View>
				)}
				{sentUsers.length > 0 && (
					<View style={{ marginBottom: 8 }}>
						<UserCardList
							users={sentUsers}
							title="Pending Requests"
							userType="sent"
							updateAction={(friend, actionType) => updateAction(friend, actionType)}
							navigation={props.navigation}
						/>
					</View>
				)}
				{friendsUsers.length > 0 && (
					<View style={{}}>
						<UserCardList
							users={friendsUsers}
							title="Friends"
							userType="friends"
							updateAction={(friend, actionType) => updateAction(friend, actionType)}
							navigation={props.navigation}
						/>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

Friends.navigationOptions = {
	title: 'Friends'
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentDBUser: auth.currentDBUser,
	currentCognitoUser: auth.currentCognitoUser
});

const mapDispatchToProps = {
	setAuthStatus,
	setCognitoUser,
	setDBUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);

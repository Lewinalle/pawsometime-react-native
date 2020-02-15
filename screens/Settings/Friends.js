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
	// // REMOVE BELOW TO TEST
	// const [ pendingUsers, setPendingUsers ] = useState(pendingUsersTest);
	// const [ sentUsers, setSentUsers ] = useState(sentUsersTest);
	// const [ friendsUsers, setFriendsUsers ] = useState(friendsUsersTest);

	// let allPendingUsers = pendingUsersTest;
	// let allSentUsers = sentUsersTest;
	// let allFriendsUsers = friendsUsersTest;

	// TODO: UNCOMMENT BELOW TO TEST
	const { currentDBUser } = props;
	const [ isFetching, setIsFetching ] = useState(true);
	const [ pendingUsers, setPendingUsers ] = useState([]);
	const [ sentUsers, setSentUsers ] = useState([]);
	const [ friendsUsers, setFriendsUsers ] = useState([]);

	let allPendingUsers;
	let allSentUsers;
	let allFriendsUsers;

	useEffect(() => {
		const fetchFriends = async () => {
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

				const allPendingUsers = _.filter(fetchedUsers, (user) => _.includes(user.friends.pending, user.id));
				await setPendingUsers(allPendingUsers);

				const allSentUsers = _.filter(fetchedUsers, (user) => _.includes(user.friends.sent, user.id));
				await setSentUsers(allSentUsers);

				const allFriendsUsers = _.filter(fetchedUsers, (user) => _.includes(user.friends.friends, user.id));
				await setFriendsUsers(allFriendsUsers);
			}

			setIsFetching(false);
		};
		fetchFriends();
	}, []);

	const handleSearch = (search) => {
		setSearchTerm(search);

		const pendings = _.filter(
			allPendingUsers,
			(user) =>
				_.includes(user.username.toLowerCase(), search.toLowerCase()) ||
				_.includes(user.description.toLowerCase(), search.toLowerCase())
		);
		setPendingUsers(pendings);

		const sents = _.filter(allSentUsers, (user) => (user) =>
			_.includes(user.username.toLowerCase(), search.toLowerCase()) ||
			_.includes(user.description.toLowerCase(), search.toLowerCase())
		);
		setSentUsers(sents);

		const friends = _.filter(
			allFriendsUsers,
			(user) =>
				_.includes(user.username.toLowerCase(), search.toLowerCase()) ||
				_.includes(user.description.toLowerCase(), search.toLowerCase())
		);
		setFriendsUsers(friends);
	};

	const renderNoFriends = () => {
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
	};

	if (isFetching) {
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
				{pendingUsers.length === 0 && sentUsers.length === 0 && friendsUsers.length === 0 && renderNoFriends()}
				{pendingUsers.length > 0 && (
					<View style={{ marginBottom: 8 }}>
						<UserCardList users={pendingUsers} title="Received requests" userType="pending" />
					</View>
				)}
				{sentUsers.length > 0 && (
					<View style={{ marginBottom: 8 }}>
						<UserCardList users={sentUsers} title="Pending requests" userType="sent" />
					</View>
				)}
				{friendsUsers.length > 0 && (
					<View style={{}}>
						<UserCardList users={friendsUsers} title="Friends" userType="friends" />
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

//TODO DELETE BELOW AFTER AND CLEAN UP CODE
const pendingUsersTest = [
	{
		avatar: 'https://pawsometime-serverless-s3.s3-us-west-2.amazonaws.com/bb3eba54-20ba-4177-a331-91399d096cfe.jpg',
		createdAt: 1581384629928,
		description: 'description one',
		email: 'email one',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '11111',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'name one'
	}
];

const sentUsersTest = [
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description two',
		email: 'email two',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22222',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'name two'
	}
];

const friendsUsersTest = [
	{
		avatar: null,
		createdAt: 1581384629928,
		description:
			'description modifieddescription modifieddescription modifieddescription modifieddescription modifieddescription modified',
		email: 'email three',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '33333',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	}
];

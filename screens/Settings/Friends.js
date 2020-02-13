import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Input, Card } from 'react-native-elements';
import UserCardList from '../../components/UserCardList';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, fetchUsers, updateUser, acceptFriend, requestFriend } from '../../Services/users';
import _ from 'lodash';

const Friends = (props) => {
	// TODO: UNCOMMENT BELOW TO TEST
	// const { user } = props;
	// const [ isFetching, setIsFetching ] = useState(true);
	// const [ pendingUsers, setPendingUsers ] = useState([]);
	// const [ sentUsers, setSentUsers ] = useState([]);
	// const [ friendsUsers, setFriendsUsers ] = useState([]);

	// useEffect(() => {
	// 	const fetchFriends = async () => {
	// 		let params = '';
	// 		const concatArr = _.concat(user.friends.pending, user.friends.sent, user.friends.friends);
	// 		concatArr.map((id) => {
	// 			if (params !== '') {
	// 				params += ',';
	// 			}
	// 			params += id;
	// 			params = `userIds=[${params}]`;
	// 		});
	// 		const fetchedUsers = await fetchUsers(params);

	// 		const pendings = _.filter(fetchedUsers, (user) => _.includes(user.friends.pending, user.id));
	// 		await setPendingUsers(pendings);

	// 		const sents = _.filter(fetchedUsers, (user) => _.includes(user.friends.sent, user.id));
	// 		await setSentUsers(sents);

	// 		const friends = _.filter(fetchedUsers, (user) => _.includes(user.friends.friends, user.id));
	// 		await setFriendsUsers(friends);

	// 		setIsFetching(false);
	// 	};
	// 	fetchFriends();
	// }, []);

	const renderNoFriends = () => {
		return (
			<Card
				title="No Firends Yet"
				image={require('../../assets/images/default-profile.jpg')}
				imageStyle={{ height: 350 }}
				containerStyle={{ margin: 0, borderRadius: 8 }}
			>
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<Text style={{ fontSize: 14 }}>Try connect with others!</Text>
				</View>
			</Card>
		);
	};

	// if (isFetching) {
	// 	return null;
	// }

	return (
		<View style={{ padding: 5, flex: 1, flexDirection: 'column', alignItems: 'center' }}>
			<View style={{ marginBottom: 10, padding: 10, backgroundColor: 'grey', alignSelf: 'stretch' }}>
				<Text>Search Users</Text>
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

const pendingUsers = [
	{
		avatar: null,
		createdAt: 1581384629928,
		description:
			'description modifieddescription modifieddescription modifieddescription modifieddescription modifieddescription modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	}
];

const sentUsers = [
	{
		avatar: null,
		createdAt: 1581384629928,
		description:
			'description modifieddescription modifieddescription modifieddescription modifieddescription modifieddescription modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	}
];

const friendsUsers = [
	{
		avatar: null,
		createdAt: 1581384629928,
		description:
			'description modifieddescription modifieddescription modifieddescription modifieddescription modifieddescription modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	},
	{
		avatar: null,
		createdAt: 1581384629928,
		description: 'description modified',
		email: 'alphaboy000@gmail.com',
		friends: {
			friends: [],
			pending: [],
			sent: []
		},
		id: '22b28c22-c9e9-4ee1-91bc-afd47733bb1c',
		neverLoggedIn: false,
		updatedAt: 1581455320366,
		username: 'Lewis one'
	}
];

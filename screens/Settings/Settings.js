import React from 'react';
import { View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { SettingsListItem } from '../../components/SettingsListItem';
import { connect } from 'react-redux';
import { signOut } from '../../redux/actions/auth.actions';
import { Auth } from 'aws-amplify';
import AdmobBanner from '../../components/AdmobBanner';
import { fetchUserPosts } from '../../redux/actions/posts.actions';
import { fetchUserMeetups } from '../../redux/actions/meetups.actions';
import store from '../../redux/store';

const settingItems = [
	{
		title: 'Change Profile',
		description: 'Update your picture and greetings',
		icon: 'AntDesign.profile',
		iconSize: 27,
		to: 'ChangeProfile'
	},
	{
		title: 'Friends',
		description: 'Find and add friends',
		icon: 'FontAwesome5.user-friends',
		iconSize: 21,
		to: 'Friends'
	},
	{
		title: 'Search Users',
		description: 'Search users to add friends',
		icon: 'MaterialCommunityIcons.account-search',
		iconSize: 25,
		to: 'SearchUsers'
	},
	{
		title: 'My Meetups',
		description: 'Check and manage my meetups',
		icon: 'MaterialCommunityIcons.account-search',
		iconSize: 25,
		to: 'Meetup'
	},
	// {
	// 	title: 'Change Password',
	// 	description: 'Change my password',
	// 	icon: 'SimpleLineIcons.lock-open',
	// 	iconSize: 26,
	// 	to: 'ChangePassword'
	// },
	{
		title: 'About',
		description: 'View details and description of application',
		icon: 'Feather.info',
		iconSize: 28,
		to: 'About'
	}
];

const Settings = (props) => {
	const handleItemClick = async (item) => {
		switch (item.title) {
			case 'My Meetups':
				await props
					.fetchUserMeetups(props.currentDBUser.id, {
						lat: props.currentLocation.lat,
						lon: props.currentLocation.lon
					})
					.then(() =>
						props.navigation.navigate(item.to, {
							myMeetups: props.userMeetups
						})
					);
				return;
			default:
				props.navigation.navigate(item.to);
				return;
		}
	};
	return (
		<View style={{ flex: 1 }}>
			{settingItems.map((item, index) => (
				<SettingsListItem
					key={index}
					title={item.title}
					description={item.description}
					icon={item.icon}
					iconSize={item.iconSize}
					onPress={() => handleItemClick(item)}
				/>
			))}
			{/* {profileSettings.map((item, index) => (
				<SettingsListItem
					key={index}
					title={item.title}
					description={item.description}
					icon={item.icon}
					iconSize={item.iconSize}
					onPress={() => props.navigation.navigate(item.to)}
				/>
			))}
			{appSettings.map((item, index) => (
				<SettingsListItem
					key={index}
					title={item.title}
					description={item.description}
					icon={item.icon}
					iconSize={item.iconSize}
					onPress={() => props.navigation.navigate(item.to)}
				/>
			))} */}
			<SettingsListItem
				key="sign-out"
				title="Sign Out"
				description="Sign out from the app"
				icon="AntDesign.logout"
				iconSize={26}
				onPress={async () => {
					Alert.alert(
						'Sign Out',
						'Do you really want to logout?',
						[
							{
								text: 'Yes',
								onPress: async () => {
									await AsyncStorage.removeItem('user_id');
									await props.signOut();
									await Auth.signOut();
									props.navigation.navigate('Auth');
								}
							},
							{
								text: 'No'
							}
						],
						{ cancelable: false }
					);
				}}
			/>
			<View style={{ marginTop: 'auto' }}>
				<AdmobBanner />
			</View>
		</View>
	);
};

Settings.navigationOptions = {
	title: 'Settings'
};

const mapStateToProps = ({ others, meetups, posts, auth }) => ({
	currentDBUser: auth.currentDBUser,
	currentLocation: others.currentLocation,
	meetups: meetups.meetups,
	userMeetups: meetups.userMeetups,
	userGeneralPosts: posts.userGeneralPosts,
	userQuestionPosts: posts.userQuestionPosts,
	userTipPosts: posts.userTipPosts,
	userTradePosts: posts.userTradePosts
});

const mapDispatchToProps = {
	fetchUserMeetups,
	fetchUserPosts,
	signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

import React from 'react';
import { View, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { SettingsListItem } from '../../components/SettingsListItem';
import { connect } from 'react-redux';
import { signOut } from '../../redux/actions/auth.actions';
import { Auth } from 'aws-amplify';

const profileSettings = [
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
		title: 'My Meetups',
		description: 'View and manage my meetups',
		icon: 'FontAwesome.meetup',
		iconSize: 24,
		to: 'MyMeetups'
	},
	{
		title: 'My Posts',
		description: 'View and manage my posts',
		icon: 'Entypo.news',
		iconSize: 26,
		to: 'MyPosts'
	}
];

const appSettings = [
	{
		title: 'About',
		description: 'View details and description of application',
		icon: 'Feather.info',
		iconSize: 28,
		to: 'About'
	}
];

const Settings = (props) => {
	return (
		<View>
			{profileSettings.map((item, index) => (
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
			))}
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
		</View>
	);
};

const mapDispatchToProps = {
	signOut
};

export default connect(null, mapDispatchToProps)(Settings);

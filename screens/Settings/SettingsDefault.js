import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SettingsListItem } from '../../components/SettingsListItem';

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

const SettingsDefault = (props) => {
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
		</View>
	);
};

export default SettingsDefault;

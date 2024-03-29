import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, FontAwesome, Entypo, FontAwesome5, AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import Home from '../screens/Home/Home';

import Settings from '../screens/Settings/Settings';
import About from '../screens/Settings/About';
import ChangeProfile from '../screens/Settings/ChangeProfile';
import MyMeetups from '../screens/Settings/MyMeetups';
import MyPosts from '../screens/Settings/MyPosts';
import Friends from '../screens/Settings/Friends';
import SearchUsers from '../screens/Settings/SearchUsers';
import ChangePassword from '../screens/Settings/ChangePassword';

import Meetup from '../screens/Meetup/Meetup';
import CreateMeetup from '../screens/Meetup/CreateMeetup';
import MeetupInfo from '../screens/Meetup/MeetupInfo';

import Board from '../screens/Board/Board';
import CreatePost from '../screens/Board/CreatePost';
import PostInfo from '../screens/Board/PostInfo';

import Gallery from '../screens/Gallery/Gallery';
import UserGallery from '../screens/Gallery/UserGallery';
import CreateGallery from '../screens/Gallery/CreateGallery';

const config = {
	headerLayoutPreset: 'left'
};

/** Home Tab */

const HomeStack = createStackNavigator(
	{
		Home
	},
	config
);

HomeStack.navigationOptions = {
	title: 'Home',
	tabBarLabel: 'Home',
	tabBarIcon: ({ focused }) => (
		<FontAwesome5
			name="home"
			size={24}
			style={{ marginBottom: -5 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	),
	tabBarOptions: { activeTintColor: Colors.primaryColor }
};

HomeStack.path = '';

/** Meetup Tab */

const MeetupStack = createStackNavigator(
	{
		Meetup,
		CreateMeetup,
		MeetupInfo
	},
	config
);

MeetupStack.navigationOptions = {
	tabBarLabel: 'Meetup',
	tabBarIcon: ({ focused }) => (
		<FontAwesome
			name="meetup"
			size={26}
			style={{ marginBottom: -5 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	),
	tabBarOptions: { activeTintColor: Colors.primaryColor }
};

MeetupStack.path = '';

/** Board Tab */

const BoardStack = createStackNavigator(
	{
		Board,
		CreatePost,
		PostInfo
	},
	config
);

BoardStack.navigationOptions = {
	tabBarLabel: 'Board',
	tabBarIcon: ({ focused }) => (
		<Entypo
			name="blackboard"
			size={23}
			style={{ marginBottom: -5 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	),
	tabBarOptions: { activeTintColor: Colors.primaryColor }
};

BoardStack.path = '';

/** Gallery Tab */

const GalleryStack = createStackNavigator(
	{
		Gallery,
		UserGallery,
		CreateGallery
	},
	config
);

GalleryStack.navigationOptions = {
	tabBarLabel: 'Gallery',
	tabBarIcon: ({ focused }) => (
		<Ionicons
			name="md-photos"
			size={22}
			style={{ marginBottom: -4 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	),
	tabBarOptions: { activeTintColor: Colors.primaryColor }
};

GalleryStack.path = '';

/** Settings Tab */

const SettingsStack = createStackNavigator(
	{
		Settings,
		ChangeProfile,
		Friends,
		SearchUsers,
		MyMeetups,
		MyPosts,
		ChangePassword,
		About
	},
	config
);

SettingsStack.navigationOptions = {
	tabBarLabel: 'Profile',
	tabBarIcon: ({ focused }) => (
		<AntDesign
			name="profile"
			size={26}
			style={{ marginBottom: -4 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	),
	tabBarOptions: { activeTintColor: Colors.primaryColor }
};

SettingsStack.path = '';

/** Combine All Tabs */

const tabNavigator = createBottomTabNavigator({
	HomeStack,
	MeetupStack,
	BoardStack,
	GalleryStack,
	SettingsStack
});

tabNavigator.path = '';

export default tabNavigator;

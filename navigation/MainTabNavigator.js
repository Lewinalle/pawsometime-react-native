import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, FontAwesome, Entypo, FontAwesome5, AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import Home from '../screens/Home/Home';
import Settings from '../screens/Settings/Settings';
import Help from '../screens/Settings/Help';
import About from '../screens/Settings/About';
import Meetup from '../screens/Meetup/Meetup';
import Board from '../screens/Board/Board';
import Shopping from '../screens/Shopping/Shopping';

const config = Platform.select({
	web: { headerMode: 'screen' },
	default: {}
});

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
	)
};

HomeStack.path = '';

/** Meetup Tab */

const MeetupStack = createStackNavigator(
	{
		Meetup
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
	)
};

MeetupStack.path = '';

/** Board Tab */

const BoardStack = createStackNavigator(
	{
		Board
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
	)
};

BoardStack.path = '';

/** Shoppings Tab */

const ShoppingStack = createStackNavigator(
	{
		Shopping
	},
	config
);

ShoppingStack.navigationOptions = {
	tabBarLabel: 'Shopping',
	tabBarIcon: ({ focused }) => (
		<FontAwesome
			name="shopping-bag"
			size={22}
			style={{ marginBottom: -4 }}
			color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
		/>
	)
};

ShoppingStack.path = '';

/** Settings Tab */

const SettingsStack = createStackNavigator(
	{
		Settings,
		Help,
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
	)
};

SettingsStack.path = '';

/** Combine All Tabs */

const tabNavigator = createBottomTabNavigator({
	HomeStack,
	MeetupStack,
	BoardStack,
	ShoppingStack,
	SettingsStack
});

tabNavigator.path = '';

export default tabNavigator;

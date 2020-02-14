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
import ChangePassword from '../screens/Settings/ChangePassword';
import Meetup from '../screens/Meetup/Meetup';
import Board from '../screens/Board/Board';
import Shopping from '../screens/Shopping/Shopping';
import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import Register from '../screens/Auth/Register';
import ResendVerification from '../screens/Auth/ResendVerification';

const config = Platform.select({
	web: { headerMode: 'screen' },
	default: {}
});

/** Auth flow Stack */

const AuthStack = createStackNavigator(
	{
		Login,
		ForgotPassword,
		Register,
		ResendVerification
	},
	config
);

AuthStack.navigationOptions = {};

AuthStack.path = '';

export default AuthStack;

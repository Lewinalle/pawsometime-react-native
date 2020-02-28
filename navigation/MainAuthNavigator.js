import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

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

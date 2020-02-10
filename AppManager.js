import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

import Amplify from 'aws-amplify';
import Config from './config';

const AppManager = (props) => {
	Amplify.configure({
		Auth: {
			mandatorySignId: true,
			region: Config.COGNITO_REGION,
			userPoolId: Config.COGNITO_POOL_ID,
			userPoolWebClientId: Config.COGNITO_APP_CLIENT_ID
		}
	});
	return <AppNavigator />;
};

export default AppManager;

const styles = StyleSheet.create({});

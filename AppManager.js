import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Amplify, { Auth } from 'aws-amplify';
import Config from './config';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from './redux/actions/auth.actions';
import { fetchUserInfo } from './Services/users';

const AppManager = (props) => {
	Amplify.configure({
		Auth: {
			mandatorySignId: true,
			region: Config.COGNITO_REGION,
			userPoolId: Config.COGNITO_POOL_ID,
			userPoolWebClientId: Config.COGNITO_APP_CLIENT_ID
		}
	});

	useEffect(() => {
		const persistUserAuth = async () => {
			try {
				const session = await Auth.currentSession();
				await props.setAuthStatus(true);
				console.log('Current Session in AppManager.js: ');
				console.log(session);

				const user = await Auth.currentAuthenticatedUser();
				await props.setCognitoUser(user);
				console.log('Current Authenticated User in AppManager.js: ');
				console.log(user);

				const DBUser = await fetchUserInfo(user.attributes.sub);
				await props.setDBUser(user);
				console.log('Current DB User in AppManager.js: ');
				console.log(DBUser);
			} catch (err) {
				console.log(err);
			}
		};
		persistUserAuth();
	}, []);

	return <AppNavigator />;
};

const styles = StyleSheet.create({});

const mapDispatchToProps = {
	setAuthStatus,
	setCognitoUser,
	setDBUser
};

export default connect(null, mapDispatchToProps)(AppManager);

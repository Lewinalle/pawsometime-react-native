import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ImageBackground, AsyncStorage } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser } from '../../redux/actions/auth.actions';
import { setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, updateUser } from '../../Services/users';

import dimensions from '../../constants/Layout';
import { validator } from '../../Utils/Validator';

import _ from 'lodash';

const Loading = (props) => {
	useEffect(() => {
		const redirect = async () => {
			if (await AsyncStorage.getItem('user_id')) {
				props.navigation.navigate('Main');
			} else {
				props.navigation.navigate('Auth');
			}
		};
		redirect();
	}, []);

	return (
		<ImageBackground
			source={require('../../assets/images/profile-default.png')}
			style={{ width: '100%', height: '100%' }}
		/>
	);
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

export default connect(mapStateToProps, mapDispatchToProps)(Loading);

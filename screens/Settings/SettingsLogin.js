import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser } from '../../redux/actions/auth.actions';
import { setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, updateUser } from '../../Services/users';

import { validator } from '../../Utils/Validator';

import _ from 'lodash';

const SettingsLogin = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false
	});
	const [ isLoggingin, setIsLoggingin ] = useState(false);

	// // TODO: Comment out below to prevent displaying login while loggedin
	// useEffect(() => {
	// 	if (props.isAuthenticated) {
	// 		props.setPageType('default');
	// 	}
	// }, []);

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearErrorState();

		if (!email || !password) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsLoggingin(true);

			const user = await Auth.signIn({
				username: email,
				password
			});

			console.log(user);

			await props.setAuthStatus(true);
			await props.setCognitoUser(user);

			try {
				const DBUser = await fetchUserInfo(user.attributes.sub);

				let updatedUser;
				if (DBUser && DBUser.neverLoggedIn) {
					const body = JSON.stringify({ neverLoggedIn: false });
					updatedUser = await updateUser(user.attributes.sub, body);
				}

				await props.setDBUser(updatedUser ? updatedUser : DBUser);

				props.setPageType('default');

				setIsLoggingin(false);

				if (updatedUser) {
					Alert.alert(
						'Wecome to Pawsometime!',
						'You can set your greetings and profile picture in Profile tab.',
						[ { text: 'OK' } ],
						{ cancelable: false }
					);
				}
			} catch (err) {
				console.log(err);
			}
		} catch (error) {
			let err = null;
			!error.message ? (err = { message: error }) : (err = error);
			console.log(err);
			setIsLoggingin(false);
			setErrors({ ...errors, cognito: err });
		}
	};

	const onInputChange = (target, text) => {
		if (target === 'email') {
			setEmail(text);
		}
		if (target === 'password') {
			setPassword(text);
		}
	};

	// // TODO: Comment out below to prevent displaying login while loggedin
	// if (props.isAuthenticated) {
	// 	return null;
	// }

	return (
		<View>
			<Input
				label="EMAIL"
				placeholder="email"
				value={email}
				autoCompleteType="email"
				onChangeText={(text) => onInputChange('email', text)}
			/>
			<Input
				label="PASSWORD"
				placeholder="password"
				value={password}
				autoCompleteType="password"
				secureTextEntry
				onChangeText={(text) => onInputChange('password', text)}
			/>

			<Button title="Sign In" onPress={handleSubmit} disabled={isLoggingin} />
			<Text>{errors.blankfield ? 'Email and Password must be provided' : ''}</Text>
			<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>
		</View>
	);
};

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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsLogin);

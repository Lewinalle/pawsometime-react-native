import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import { ScrollView } from 'react-native-gesture-handler';
import { getUsers } from '../../Services/users';

const Register = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false,
		email: '',
		password: '',
		passwordmatch: null
	});
	const [ isRegistering, setIsRegistering ] = useState(false);

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false,
			email: '',
			password: '',
			passwordmatch: null
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearErrorState();

		if (!email || !password || !confirmPassword || !username) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsRegistering(true);

			const signUpResponse = await Auth.signUp({
				username: email,
				password,
				attributes: {
					name: username
				}
			});

			console.log('signUpResponse: ', signUpResponse);

			setIsRegistering(false);

			Alert.alert(
				'Verification email sent!',
				"Please verify through the email you've received to complete Sign-Up process.",
				[ { text: 'OK', onPress: () => props.navigation.navigate('Login') } ],
				{ cancelable: false }
			);
		} catch (error) {
			let err = null;
			!error.message
				? (err = { message: error })
				: error.code === 'InvalidLambdaResponseException'
					? (err = 'Username has already been taken.')
					: (err = error);
			console.log(err);
			setIsRegistering(false);
			setErrors({ ...errors, cognito: err });
		}
	};

	const onInputChange = (target, text) => {
		const validated = validator(target, text);

		if (target === 'email') {
			setEmail(text);
			if (!validated) {
				setErrors({
					...errors,
					email: 'Email entered is not valid.'
				});
			} else {
				setErrors({
					...errors,
					email: ''
				});
			}
		}
		if (target === 'password') {
			setPassword(text);
			if (!validated) {
				if (confirmPassword !== '' && confirmPassword !== text) {
					setErrors({
						...errors,
						password:
							'Password must be at least 8 characters and contain: 1+ upper-case, 1+ lower-case and 1+ number.',
						passwordmatch: false
					});
				} else {
					setErrors({
						...errors,
						password:
							'Password must be at least 8 characters and contain: 1+ upper-case, 1+ lower-case and 1+ number.'
					});
				}
			} else {
				if (confirmPassword !== '' && confirmPassword !== text) {
					setErrors({
						...errors,
						password: '',
						passwordmatch: false
					});
				} else {
					setErrors({
						...errors,
						password: '',
						passwordmatch: true
					});
				}
			}
		}
		if (target === 'confirm_password') {
			setConfirmPassword(text);

			if (password !== '' && password !== text) {
				setErrors({ ...errors, passwordmatch: false });
			} else {
				setErrors({ ...errors, passwordmatch: true });
			}
		}
		if (target === 'username') {
			setUsername(text);
		}
	};

	return (
		<ScrollView>
			<View>
				<Input
					label="EMAIL"
					placeholder="email"
					value={email}
					errorMessage={errors.email}
					autoCompleteType="email"
					onChangeText={(text) => onInputChange('email', text)}
				/>
				<Input
					label="PASSWORD"
					placeholder="password"
					value={password}
					errorMessage={errors.password}
					autoCompleteType="password"
					secureTextEntry
					onChangeText={(text) => onInputChange('password', text)}
				/>
				<Input
					label="CONFIRM PASSWORD"
					placeholder="password"
					value={confirmPassword}
					errorMessage={errors.passwordmatch === false ? 'Password do not match.' : ''}
					secureTextEntry
					onChangeText={(text) => onInputChange('confirm_password', text)}
				/>
				<Input
					label="USERNAME (MUST BE UNIQUE)"
					placeholder="username"
					value={username}
					onChangeText={(text) => onInputChange('username', text)}
				/>

				<Button
					title="Submit"
					onPress={handleSubmit}
					disabled={
						errors.email !== '' || errors.password !== '' || errors.passwordmatch !== true || isRegistering
					}
				/>
				{errors.blankfield && (
					<Text style={{ paddingHorizontal: 10, color: 'red', marginTop: 4 }}>
						{errors.blankfield ? 'Every field must be filled.' : ''}
					</Text>
				)}
				{errors.cognito && (
					<Text style={{ paddingHorizontal: 10, color: 'red', marginTop: 4 }}>
						{errors.cognito && errors.cognito ? errors.cognito : ''}
					</Text>
				)}
			</View>
		</ScrollView>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(Register);

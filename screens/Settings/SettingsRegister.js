import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setAuthUser } from '../../redux/actions/auth.actions';

import { validator } from '../../Utils/Validator';

const SettingsRegister = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false,
		email: '',
		password: '',
		passwordmatch: null,
		duplicateName: null
	});
	const [ isFetching, setIsFetching ] = useState(false);
	const [ isRegistering, setIsRegistering ] = useState(false);

	// // TODO: Comment out below to prevent displaying login while loggedin
	// useEffect(() => {
	// 	if (props.isAuthenticated) {
	// 		props.setPageType('default');
	// 	}
	// }, []);

	const checkAvailability = () => {};

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

			setIsRegistering(false);

			console.log(signUpResponse);

			Alert.alert(
				'Verification email sent!',
				"Please verify through the email you've received to complete Sign-Up process.",
				[ { text: 'OK', onPress: () => props.setPageType('default') } ],
				{ cancelable: false }
			);
		} catch (error) {
			let err = null;
			!error.message
				? (err = { message: error })
				: error.code === 'InvalidLambdaResponseException' ? (err = 'Username is duplicated.') : (err = error);
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
			console.log(password, text, password !== text);
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
				label="USERNAME"
				placeholder="password"
				value={username}
				errorMessage={errors.duplicateName === true ? 'Username has already been taken.' : ''}
				onChangeText={(text) => onInputChange('username', text)}
			/>
			<Button title="Check Availability" onPress={() => checkAvailability()} disabled={isFetching} />

			<Button
				title="Sign Up"
				onPress={handleSubmit}
				disabled={errors.email !== '' || errors.password !== '' || isRegistering}
			/>
			<Text>{errors.blankfield ? 'Every field must be filled.' : ''}</Text>
			<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>
		</View>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

const mapDispatchToProps = {
	setAuthStatus,
	setAuthUser
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsRegister);

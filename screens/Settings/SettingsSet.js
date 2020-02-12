import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import { ScrollView } from 'react-native-gesture-handler';

const SettingsSet = (props) => {
	const [ email, setEmail ] = useState(props.email ? props.email : '');
	const [ password, setPassword ] = useState('');
	const [ code, setCode ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false,
		email: '',
		password: ''
	});
	const [ isSending, setIsSending ] = useState(false);

	// // TODO: Comment out below to prevent displaying login while loggedin
	// useEffect(() => {
	// 	if (props.isAuthenticated) {
	// 		props.setPageType('default');
	// 	}
	// }, []);

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false,
			email: '',
			password: ''
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearErrorState();

		if (!email || !password || !code) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsSending(true);

			const res = await Auth.forgotPasswordSubmit(email, code, password);

			console.log(res);

			setIsSending(false);

			Alert.alert(
				'Success!',
				'Please use the new password to sign in.',
				[ { text: 'OK', onPress: () => props.setPageType('login') } ],
				{ cancelable: false }
			);
		} catch (error) {
			let err = null;
			!error.message ? (err = { message: error }) : (err = error);
			console.log(err);
			setIsSending(false);
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
				setErrors({
					...errors,
					password:
						'Password must be at least 8 characters and contain: 1+ upper-case, 1+ lower-case and 1+ number.'
				});
			} else {
				setErrors({
					...errors,
					password: ''
				});
			}
		}
		if (target === 'code') {
			setCode(text);
		}
	};

	// // TODO: Comment out below to prevent displaying login while loggedin
	// if (props.isAuthenticated) {
	// 	return null;
	// }

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
					label="VERIFICATION CODE"
					placeholder="code"
					value={code}
					onChangeText={(text) => onInputChange('code', text)}
				/>
				<Button
					title="Reset Password"
					onPress={handleSubmit}
					disabled={errors.email !== '' || errors.password !== '' || isSending}
				/>
				<Text>{errors.blankfield ? 'Every field must be filled.' : ''}</Text>
				<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>
				<Button title="Back To Settings" onPress={() => props.setPageType('default')} />
			</View>
		</ScrollView>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(SettingsSet);

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import _ from 'lodash';
import SettingsSet from './SetPassword';
import { ScrollView } from 'react-native-gesture-handler';

const ResendVerification = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false,
		email: ''
	});
	const [ isSending, setIsSending ] = useState(false);

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false,
			email: ''
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearErrorState();

		if (!email) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsSending(true);

			await Auth.resendSignUp(email);

			setIsSending(false);

			Alert.alert(
				'Verification email sent!',
				"Please verify through the email you've received to complete Sign-Up process.",
				[ { text: 'OK', onPress: () => props.navigation.navigate('Login') } ],
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
	};

	return (
		<ScrollView>
			<View>
				<Text>If your verification link has expired, please enter your email to send again.</Text>
				<Input
					label="EMAIL"
					placeholder="email"
					value={email}
					autoCompleteType="email"
					onChangeText={(text) => onInputChange('email', text)}
				/>
				<Button title="Submit" onPress={handleSubmit} disabled={isSending} />
				<Text>{errors.blankfield ? 'Email must be provided.' : ''}</Text>
				<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>
			</View>
		</ScrollView>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(ResendVerification);

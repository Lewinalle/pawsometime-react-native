import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import _ from 'lodash';
import SetPassword from './SetPassword';
import { ScrollView } from 'react-native-gesture-handler';

const ForgotPassword = (props) => {
	const [ isForgotPage, setIsForgotPage ] = useState(true);
	const [ email, setEmail ] = useState(null);
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false,
		email: '',
		password: ''
	});
	const [ isSending, setIsSending ] = useState(false);

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

		if (!email) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsSending(true);

			const res = await Auth.forgotPassword(email);

			setIsSending(false);

			Alert.alert(
				'Verification email sent!',
				'Please check your email to get the reset code and set a new password.',
				[ { text: 'OK', onPress: () => setIsForgotPage(false) } ],
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

	return isForgotPage ? (
		<ScrollView>
			<View>
				<Text>
					Please enter the email address associated with your account and we'll email you a password reset
					link. If you have not registered or verified your email, you won't get this email.
				</Text>
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
	) : (
		<View>
			<SetPassword {...props} email={email} />
		</View>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(ForgotPassword);

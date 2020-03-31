import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import _ from 'lodash';
import SetPassword from './SetPassword';
import { ScrollView } from 'react-native-gesture-handler';
import { getUsers } from '../../Services/users';
import Constants from '../../constants/Layout';
import Colors from '../../constants/Colors';

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

			const existingUser = await getUsers({ email });

			if (existingUser.length > 0) {
				const res = await Auth.forgotPassword(email);

				console.log('forgotPasswordRes: ', res);

				setIsSending(false);

				Alert.alert(
					'Verification email sent!',
					'Please check your email to get the reset code and set a new password.',
					[ { text: 'OK', onPress: () => setIsForgotPage(false) } ],
					{ cancelable: false }
				);
			} else {
				setErrors({
					...errors,
					cognito: 'Email is not found. Please double check the email you registered.'
				});
				setIsSending(false);
			}
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
		<ImageBackground
			source={require('../../assets/images/auth-bg.png')}
			style={{ flex: 1, width: '100%', height: '100%' }}
		>
			<TouchableOpacity onPress={() => props.navigation.goBack()}>
				<View style={{ marginTop: 60, marginLeft: 16 }}>
					<Image source={require('../../assets/images/back-icon.png')} style={{ width: 30, height: 30 }} />
				</View>
			</TouchableOpacity>
			<ScrollView style={{ minHeight: Constants.window.height }}>
				<View style={{ paddingHorizontal: 30, flex: 1 }}>
					<View style={{ flex: 1, alignSelf: 'center', paddingTop: 0, marginTop: 0 }}>
						<Image source={require('../../assets/images/logo.png')} style={{ width: 100, height: 100 }} />
					</View>
					<View style={{ flex: 1, alignSelf: 'center', marginTop: 0, marginBottom: 20 }}>
						<Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Forgot Password</Text>
					</View>
					<View
						style={{
							borderRadius: 10,
							backgroundColor: 'white',
							padding: 20,
							elevation: 10,
							shadowOffset: { width: 5, height: 5 },
							shadowColor: 'grey',
							shadowOpacity: 0.5,
							shadowRadius: 10
						}}
					>
						<Input
							placeholder="Email"
							value={email}
							autoCompleteType="email"
							errorMessage={errors.email ? 'Email is not valid' : ''}
							onChangeText={(text) => onInputChange('email', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Button
							title="SEND"
							onPress={handleSubmit}
							disabled={isSending}
							containerStyle={{
								marginTop: 30,
								marginBottom: 6,
								width: 90,
								alignSelf: 'center'
							}}
							buttonStyle={{
								paddingHorizontal: 12,
								paddingVertical: 8,
								borderRadius: 8,
								backgroundColor: Colors.primaryColor
							}}
							titleStyle={{ fontSize: 14 }}
						/>
						{errors.blankfield && (
							<Text style={{ paddingHorizontal: 10, color: 'red', marginTop: 4 }}>
								{errors.blankfield ? 'Email must be provided.' : ''}
							</Text>
						)}
						{errors.cognito && (
							<Text style={{ paddingHorizontal: 10, color: 'red', marginTop: 4 }}>
								{errors.cognito ? errors.cognito : ''}
							</Text>
						)}
					</View>
					<View
						style={{
							borderRadius: 10,
							backgroundColor: Colors.primaryColor,
							paddingHorizontal: 14,
							paddingVertical: 8,
							marginTop: 50,
							marginHorizontal: 50
						}}
					>
						<Text style={{ color: 'white' }}>
							Please enter the email address associated with your account and we'll email you a password
							reset link. If you have not registered or verified your email, you won't receive this email.
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 60,
							paddingHorizontal: 30
						}}
					>
						<View style={{ marginRight: 14 }}>
							<Image
								source={require('../../assets/images/auth-dog.png')}
								style={{ width: 100, height: 100 }}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	) : (
		<SetPassword {...props} email={email} />
	);
};

ForgotPassword.navigationOptions = ({ navigation }) => ({
	headerShown: false
});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(ForgotPassword);

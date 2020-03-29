import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';
import { getUsers } from '../../Services/users';
import Constants from '../../constants/Layout';
import Colors from '../../constants/Colors';

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

			const existingUser = await getUsers({ email });
			console.log(existingUser);

			if (existingUser.length > 0) {
				if (!existingUser[0].neverLoggedIn) {
					setErrors({
						...errors,
						cognito:
							'Email has already been verified. Please either Login or Reset Password in case you forgot your password.'
					});
					setIsSending(false);
					return;
				}

				const res = await Auth.resendSignUp(email);

				console.log('resendVerificationRes: ', res);

				setIsSending(false);

				Alert.alert(
					'Verification email sent!',
					"Please verify through the email you've received to complete Sign-Up process.",
					[ { text: 'OK', onPress: () => props.navigation.navigate('Login') } ],
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

	return (
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
						<Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Resend Verification</Text>
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
								{errors.blankfield ? 'Every field must be filled.' : ''}
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
							If your verification link has expired, please enter your email to send again.
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 120,
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
	);
};

ResendVerification.navigationOptions = ({ navigation }) => ({
	headerShown: false
});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(ResendVerification);

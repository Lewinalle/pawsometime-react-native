import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import { ScrollView } from 'react-native-gesture-handler';
import { getUsers } from '../../Services/users';

import Constants from '../../constants/Layout';
import Colors from '../../constants/Colors';

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
						<Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Welcome to Pawsometime</Text>
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
							errorMessage={errors.email}
							autoCompleteType="email"
							onChangeText={(text) => onInputChange('email', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Input
							placeholder="Password"
							value={password}
							errorMessage={errors.password}
							autoCompleteType="password"
							secureTextEntry
							onChangeText={(text) => onInputChange('password', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Input
							placeholder="Confirm Password"
							value={confirmPassword}
							errorMessage={errors.passwordmatch === false ? 'Password do not match.' : ''}
							secureTextEntry
							onChangeText={(text) => onInputChange('confirm_password', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Input
							placeholder="Username (Unique)"
							value={username}
							onChangeText={(text) => onInputChange('username', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Button
							title="REGISTER"
							onPress={handleSubmit}
							disabled={
								errors.email !== '' ||
								errors.password !== '' ||
								errors.passwordmatch !== true ||
								isRegistering
							}
							containerStyle={{
								marginTop: 30,
								marginBottom: 6,
								width: 100,
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
								{errors.cognito && errors.cognito ? errors.cognito : ''}
							</Text>
						)}
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 85,
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

Register.navigationOptions = ({ navigation }) => ({
	headerShown: false
});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(Register);

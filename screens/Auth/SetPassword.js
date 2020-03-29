import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';

import { validator } from '../../Utils/Validator';
import { ScrollView } from 'react-native-gesture-handler';
import Constants from '../../constants/Layout';
import Colors from '../../constants/Colors';

const SetPassword = (props) => {
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

			setIsSending(false);

			Alert.alert(
				'Success!',
				'Please use the new password to sign in.',
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
							placeholder="Code"
							value={code}
							onChangeText={(text) => onInputChange('code', text)}
							containerStyle={{ marginBottom: 12 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Button
							title="Reset Password"
							onPress={handleSubmit}
							disabled={errors.email !== '' || errors.password !== '' || isSending}
							containerStyle={{
								marginTop: 30,
								marginBottom: 6,
								width: 160,
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
								{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}
							</Text>
						)}
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

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

export default connect(mapStateToProps)(SetPassword);

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, AsyncStorage, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser } from '../../redux/actions/auth.actions';
import { setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, updateUser } from '../../Services/users';

import dimensions from '../../constants/Layout';
import { validator } from '../../Utils/Validator';

import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';

const Login = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false
	});
	const [ isLoggingin, setIsLoggingin ] = useState(false);

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

			await props.setAuthStatus(true);
			await props.setCognitoUser(user);
			await AsyncStorage.setItem('user_id', user.attributes.sub);

			try {
				const DBUser = await fetchUserInfo(user.attributes.sub);

				let updatedUser;
				if (DBUser && DBUser.neverLoggedIn) {
					const body = JSON.stringify({ neverLoggedIn: false });
					updatedUser = await updateUser(user.attributes.sub, body);
				}

				await props.setDBUser(updatedUser ? updatedUser : DBUser);

				setIsLoggingin(false);

				if (updatedUser) {
					Alert.alert(
						'Wecome to Pawsometime!',
						'You can set your greetings and profile picture in Profile tab.',
						[ { text: 'OK', onPress: () => props.navigation.navigate('Main') } ],
						{ cancelable: false }
					);
				} else {
					props.navigation.navigate('Main');
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

	return (
		<ScrollView style={styles.scrollView}>
			<View style={styles.container}>
				<View style={styles.innerContainer}>
					<Input
						label="EMAIL"
						placeholder="pawsometime@gmail.com"
						value={email}
						autoCompleteType="email"
						onChangeText={(text) => onInputChange('email', text)}
						containerStyle={{ marginBottom: 15 }}
					/>
					<Input
						label="PASSWORD"
						placeholder="password"
						value={password}
						autoCompleteType="password"
						secureTextEntry
						onChangeText={(text) => onInputChange('password', text)}
						containerStyle={{ marginBottom: 20 }}
					/>
					<ScrollView keyboardShouldPersistTaps="always">
						<Button title="Sign In" onPress={handleSubmit} disabled={isLoggingin} />
					</ScrollView>
					{/* <Button title="Sign In" onPress={handleSubmit} disabled={isLoggingin} /> */}
					<Text>{errors.blankfield ? 'Email and Password must be provided' : ''}</Text>
					<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>

					<Button title="Register" onPress={() => props.navigation.navigate('Register')} />
					<Button title="Forgot Password" onPress={() => props.navigation.navigate('ForgotPassword')} />
					<Button
						title="Resend Verification"
						onPress={() => props.navigation.navigate('ResendVerification')}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: 'yellow',
		minHeight: dimensions.window.height
	},
	container: {
		padding: 20
	},
	innerContainer: {
		backgroundColor: 'white',
		padding: 20
	},
	signInButton: {
		marginTop: 10
	}
});

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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

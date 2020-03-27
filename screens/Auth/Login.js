import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, AsyncStorage, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, updateUser } from '../../Services/users';

import { fetchMeetups, fetchUserMeetups } from '../../redux/actions/meetups.actions';
import { fetchPosts, fetchUserPosts } from '../../redux/actions/posts.actions';
import { fetchUserGallery } from '../../redux/actions/gallery.actions';
import { setCurrentLocation, fetchNews, fetchFriendsActivity } from '../../redux/actions/others.actions';
import { formatUsersIdsParams } from '../../Utils/FormatParams';

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
			setErrors({ ...errors, cognito: null, blankfield: true });
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

				if (user) {
					let currentLocation;
					await navigator.geolocation.getCurrentPosition(
						async (position) => {
							currentLocation = {
								lat: position.coords.latitude,
								lon: position.coords.longitude
							};
							await props.setCurrentLocation(currentLocation);
							await props.fetchMeetups({
								lat: currentLocation.lat,
								lon: currentLocation.lon
							});
							await props.fetchUserMeetups(user.attributes.sub, {
								lat: currentLocation.lat,
								lon: currentLocation.lon
							});
						},
						async (error) => {
							await props.fetchMeetups();
							await props.fetchUserMeetups(user.attributes.sub);
						},
						{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
					);
					await props.fetchUserGallery(user.attributes.sub, 0);
					await props.fetchPosts({ type: 'general' });
					await props.fetchUserPosts(user.attributes.sub, { type: 'general' });
					await props.fetchNews();
					await props.fetchFriendsActivity(DBUser.id, {
						friendsActivity: formatUsersIdsParams(DBUser.friends.friends)
					});
				}

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
			setIsLoggingin(false);

			console.log(error);

			const isBlank = !email || !password;
			setErrors({ ...errors, cognito: isBlank ? null : err, blankfield: isBlank });
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
						containerStyle={{ marginBottom: 6 }}
					/>

					{errors.blankfield && (
						<Text style={{ marginBottom: 15, paddingHorizontal: 10, color: '#f73325' }}>
							Email and Password must be provided
						</Text>
					)}
					{errors.cognito &&
					errors.cognito.message && (
						<Text style={{ marginBottom: 15, paddingHorizontal: 10, color: '#f73325' }}>
							{errors.cognito.message}
						</Text>
					)}
					<Button
						title="Sign In"
						onPress={handleSubmit}
						disabled={isLoggingin}
						containerStyle={{ marginBottom: 15 }}
					/>

					<Button
						title="Register"
						onPress={() => props.navigation.navigate('Register')}
						containerStyle={{ marginBottom: 15 }}
					/>
					<Button
						title="Forgot Password"
						onPress={() => props.navigation.navigate('ForgotPassword')}
						containerStyle={{ marginBottom: 15 }}
					/>
					<Button
						title="Resend Verification"
						onPress={() => props.navigation.navigate('ResendVerification')}
						containerStyle={{ marginBottom: 15 }}
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

const mapStateToProps = ({ auth, others, meetups, posts, gallery }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentDBUser: auth.currentDBUser,
	currentCognitoUser: auth.currentCognitoUser,
	currentLocation: others.currentLocation,
	meetups: meetups.meetups,
	userMeetups: meetups.userMeetups,
	generalPosts: posts.generalPosts,
	userGeneralPosts: posts.userGeneralPosts,
	gallery: gallery.gallery,
	userGallery: gallery.userGallery,
	news: others.news,
	friendsActivity: others.friendsActivity
});

const mapDispatchToProps = {
	setAuthStatus,
	setCognitoUser,
	setDBUser,
	fetchMeetups,
	fetchPosts,
	fetchUserPosts,
	fetchUserMeetups,
	fetchUserGallery,
	setCurrentLocation,
	fetchNews,
	fetchFriendsActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

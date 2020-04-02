import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, AsyncStorage, Keyboard, ImageBackground } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
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
import Constants from '../../constants/Layout';

import _ from 'lodash';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { sleep } from '../../Utils/Sleep';

const Login = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false
	});
	const [ isLoggingin, setIsLoggingin ] = useState(false);
	const [ isFirstLogin, setIsFirstLogin ] = useState(false);
	const [ hasLoggedIn, setHasLoggedIn ] = useState(false);

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

			setHasLoggedIn(true);

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

				// setIsLoggingin(false);

				if (updatedUser) {
					Alert.alert(
						'Wecome to Pawsometime!',
						'You can set your greetings and profile picture in Profile tab.',
						[ { text: 'OK' } ],
						{ cancelable: false }
					);
					setIsFirstLogin(true);
				} else {
					// props.navigation.navigate('Main');
					setIsFirstLogin(false);
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

	const checkDataFetched = () => {
		if (hasLoggedIn) {
			if (
				props.news.dogs.length > 0 &&
				props.friendsActivity &&
				props.meetups &&
				props.userMeetups &&
				props.generalPosts &&
				props.userGeneralPosts &&
				props.gallery
			) {
				if (isFirstLogin) {
					Alert.alert(
						'Wecome to Pawsometime!',
						'You can set your greetings and profile picture in Profile tab.',
						[ { text: 'OK', onPress: () => props.navigation.navigate('Main') } ],
						{ cancelable: false }
					);
				} else {
					props.navigation.navigate('Main');
					sleep(1000);
				}
			} else {
				sleep(200);
			}
		}
	};

	checkDataFetched();

	return (
		<ImageBackground
			source={require('../../assets/images/auth-bg.png')}
			style={{ flex: 1, width: '100%', height: '100%' }}
		>
			<ScrollView style={styles.scrollView}>
				<View style={{ paddingHorizontal: 30, flex: 1 }}>
					<View style={{ flex: 1, alignSelf: 'center', paddingTop: 80 }}>
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
							autoCompleteType="email"
							onChangeText={(text) => onInputChange('email', text)}
							containerStyle={{ marginBottom: 15, marginTop: 18 }}
							inputStyle={{ fontSize: 16 }}
						/>
						<Input
							placeholder="Password"
							value={password}
							autoCompleteType="password"
							secureTextEntry
							onChangeText={(text) => onInputChange('password', text)}
							containerStyle={{ marginBottom: 6 }}
							inputStyle={{ fontSize: 16 }}
						/>

						{errors.blankfield && (
							<Text style={{ marginBottom: 10, paddingHorizontal: 10, color: '#f73325' }}>
								Email and Password must be provided
							</Text>
						)}
						{errors.cognito &&
						errors.cognito.message && (
							<Text style={{ marginBottom: 10, paddingHorizontal: 10, color: '#f73325' }}>
								{errors.cognito.message}
							</Text>
						)}
						{isLoggingin && (
							<Text style={{ marginBottom: 10, paddingHorizontal: 10, color: Colors.primaryColor }}>
								First login could take up to 30 seconds...
							</Text>
						)}
						<Button
							title="SIGN IN"
							onPress={handleSubmit}
							disabled={isLoggingin}
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
						<View style={{ flex: 1, top: 8 }}>
							<TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
								<Text
									style={{
										fontWeight: 'bold',
										color: Colors.primaryColor,
										fontSize: 17,
										marginBottom: 6
									}}
								>
									Register
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => props.navigation.navigate('ForgotPassword')}>
								<Text
									style={{
										fontWeight: 'bold',
										color: Colors.primaryColor,
										fontSize: 17,
										marginBottom: 6
									}}
								>
									Forgot Password
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => props.navigation.navigate('ResendVerification')}>
								<Text
									style={{
										fontWeight: 'bold',
										color: Colors.primaryColor,
										fontSize: 17,
										marginBottom: 6
									}}
								>
									Resend Verification
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	);
};

Login.navigationOptions = ({ navigation }) => ({
	headerShown: false
});

const styles = StyleSheet.create({
	scrollView: {
		minHeight: dimensions.window.height
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

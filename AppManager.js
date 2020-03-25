import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Amplify, { Auth } from 'aws-amplify';
import Config from './config';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from './redux/actions/auth.actions';
import { fetchUserInfo } from './Services/users';
import { fetchMeetups, fetchUserMeetups } from './redux/actions/meetups.actions';
import { fetchPosts, fetchUserPosts } from './redux/actions/posts.actions';
import { fetchUserGallery } from './redux/actions/gallery.actions';
import { setCurrentLocation, fetchNews } from './redux/actions/others.actions';

const postTypes = [ 'general', 'qna', 'tips', 'trade' ];

const AppManager = (props) => {
	const [ isSplashOpen, setisSplashOpen ] = useState(true);

	Amplify.configure({
		Auth: {
			mandatorySignId: true,
			region: Config.COGNITO_REGION,
			userPoolId: Config.COGNITO_POOL_ID,
			userPoolWebClientId: Config.COGNITO_APP_CLIENT_ID
		}
	});

	useEffect(() => {
		const persistUserAuth = async () => {
			try {
				// TODO: remove console logs!
				const session = await Auth.currentSession();
				await props.setAuthStatus(true);
				// console.log('Current Session in AppManager.js: ');
				// console.log(session);
				const user = await Auth.currentAuthenticatedUser();
				await props.setCognitoUser(user);
				await props.setAuthStatus(true);
				// console.log('Current Authenticated User in AppManager.js: ');
				// console.log(user);
				const DBUser = await fetchUserInfo(user.attributes.sub);
				await props.setDBUser(DBUser);
				// console.log('Current DB User in AppManager.js: ');
				// console.log(DBUser);
				console.log(await (await Auth.currentSession()).getIdToken().getJwtToken());
				await AsyncStorage.setItem('user_id', user.attributes.sub);
				if (user) {
					let currentLocation;
					await navigator.geolocation.getCurrentPosition(
						async (position) => {
							currentLocation = {
								lat: position.coords.latitude,
								lon: position.coords.longitude
							};
							await props.setCurrentLocation(currentLocation);
							// await props.fetchMeetups({
							// 	lat: currentLocation.lat,
							// 	lon: currentLocation.lon
							// });
							// await props.fetchUserMeetups(user.attributes.sub, {
							// 	lat: currentLocation.lat,
							// 	lon: currentLocation.lon
							// });
						},
						async (error) => {
							// await props.fetchMeetups();
							// await props.fetchUserMeetups(user.attributes.sub);
						},
						{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
					);
					await props.fetchUserGallery(user.attributes.sub, 0);
					// TODO: UNCOMMENT BELOW
					// await props.fetchPosts({ type: 'general' });
					// await props.fetchUserPosts(user.attributes.sub, { type: 'general' });
					await props.fetchNews();
				}
			} catch (err) {
				console.log(err);
			}
		};
		persistUserAuth();
	}, []);

	// TODO: UNCOMMENT AND REPLACE WITH BELOW
	// if (isSplashOpen && props.meetups && props.userMeetups && props.generalPosts && props.userGeneralPosts) {
	if (isSplashOpen) {
		setisSplashOpen(false);
		setTimeout(() => {
			props.hideSplash();
		}, 350);
	}

	return <AppNavigator />;
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ others, meetups, posts }) => ({
	currentLocation: others.currentLocation,
	meetups: meetups.meetups,
	generalPosts: posts.generalPosts,
	userGeneralPosts: posts.userGeneralPosts
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
	fetchNews
};

export default connect(mapStateToProps, mapDispatchToProps)(AppManager);

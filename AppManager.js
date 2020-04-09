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
import { setCurrentLocation, fetchNews, fetchFriendsActivity, fetchDataLogin } from './redux/actions/others.actions';
import { formatUsersIdsParams } from './Utils/FormatParams';

const postTypes = [ 'general', 'qna', 'tips', 'trade' ];

const AppManager = (props) => {
	const [ isSplashOpen, setisSplashOpen ] = useState(true);
	const [ authCheckingStatus, setAuthCheckingStatus ] = useState(0);

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
				const session = await Auth.currentSession();
				await props.setAuthStatus(true);
				const user = await Auth.currentAuthenticatedUser();
				await AsyncStorage.setItem('user_id', user.attributes.sub);
				await props.setCognitoUser(user);
				console.log(await (await Auth.currentSession()).getIdToken().getJwtToken());
				if (user) {
					let currentLocation;
					await navigator.geolocation.getCurrentPosition(
						async (position) => {
							currentLocation = {
								lat: position.coords.latitude,
								lon: position.coords.longitude
							};
							await props.fetchDataLogin(user.attributes.sub, currentLocation.lat, currentLocation.lon);
						},
						async (error) => {
							await props.fetchDataLogin(user.attributes.sub, Config.DEFAULT_LAT, Config.DEFAULT_LON);
						},
						{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
					);
					setAuthCheckingStatus(1);
				}
			} catch (err) {
				console.log(err);
				setAuthCheckingStatus(2);
			}
		};
		// const persistUserAuth = async () => {
		// 	try {
		// 		const session = await Auth.currentSession();
		// 		await props.setAuthStatus(true);
		// 		const user = await Auth.currentAuthenticatedUser();
		// 		await props.setCognitoUser(user);
		// 		await props.setAuthStatus(true);
		// 		const DBUser = await fetchUserInfo(user.attributes.sub);
		// 		await props.setDBUser(DBUser);
		// 		console.log(await (await Auth.currentSession()).getIdToken().getJwtToken());
		// 		await AsyncStorage.setItem('user_id', user.attributes.sub);
		// 		if (user) {
		// 			let currentLocation;
		// 			await navigator.geolocation.getCurrentPosition(
		// 				async (position) => {
		// 					currentLocation = {
		// 						lat: position.coords.latitude,
		// 						lon: position.coords.longitude
		// 					};
		// 					await props.setCurrentLocation(currentLocation);
		// 					await props.fetchMeetups({
		// 						lat: currentLocation.lat,
		// 						lon: currentLocation.lon
		// 					});
		// 					await props.fetchUserMeetups(user.attributes.sub, {
		// 						lat: currentLocation.lat,
		// 						lon: currentLocation.lon
		// 					});
		// 				},
		// 				async (error) => {
		// 					await props.fetchMeetups();
		// 					await props.fetchUserMeetups(user.attributes.sub);
		// 				},
		// 				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
		// 			);
		// 			await props.fetchUserGallery(user.attributes.sub, 0);
		// 			await props.fetchPosts({ type: 'general' });
		// 			await props.fetchUserPosts(user.attributes.sub, { type: 'general' });
		// 			await props.fetchNews();
		// 			await props.fetchFriendsActivity(DBUser.id, {
		// 				friendsActivity: formatUsersIdsParams(DBUser.friends.friends)
		// 			});
		// 			setAuthCheckingStatus(1);
		// 		}
		// 	} catch (err) {
		// 		console.log(err);
		// 		setAuthCheckingStatus(2);
		// 	}
		// };
		persistUserAuth();
	}, []);

	if (
		authCheckingStatus === 1 &&
		isSplashOpen &&
		props.news.dogs.length > 0 &&
		props.friendsActivity &&
		props.meetups &&
		props.userMeetups &&
		props.generalPosts &&
		props.userGeneralPosts &&
		props.gallery
	) {
		setisSplashOpen(false);
		setTimeout(() => {
			props.hideSplash();
		}, 350);
		setAuthCheckingStatus(3);
	} else if (authCheckingStatus === 2) {
		setisSplashOpen(false);
		props.hideSplash();
		setAuthCheckingStatus(3);
	}

	return <AppNavigator />;
};

const mapStateToProps = ({ others, meetups, posts, gallery }) => ({
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
	fetchFriendsActivity,
	fetchDataLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(AppManager);

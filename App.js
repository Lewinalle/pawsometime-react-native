import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppManager from './AppManager';
import { Ionicons } from '@expo/vector-icons';

import { Provider } from 'react-redux';
import store from './redux/store';

import Amplify from 'aws-amplify';
import Config from './config';

export default function App(props) {
	useEffect(() => {
		SplashScreen.preventAutoHide();
	}, []);

	const hideSplash = async () => {
		await SplashScreen.hide();
	};

	return (
		<Provider store={store}>
			<View style={styles.container}>
				{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
				<AppManager hideSplash={hideSplash} />
			</View>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

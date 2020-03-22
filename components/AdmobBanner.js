import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import _ from 'lodash';
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import Config from '../config';

const ID_UNIT = Platform.OS === 'ios' ? Config.ADMOB_UNIT_ID_IOS : Config.ADMOB_UNIT_ID_ANDROID;

class Meetup extends Component {
	async componentDidMount() {
		AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
		await setTestDeviceIDAsync('EMULATOR');
	}

	render() {
		return (
			<View>
				<AdMobBanner
					bannerSize="smartBannerPortrait"
					adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
					servePersonalizedAds // true or false
					onDidFailToReceiveAdWithError={this.bannerError}
				/>
			</View>
		);
	}
}

export default Meetup;

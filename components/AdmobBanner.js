import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import _ from 'lodash';
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import Config from '../config';

const UNIT_ID = Platform.OS === 'ios' ? Config.ADMOB_UNIT_ID_IOS : Config.ADMOB_UNIT_ID_ANDROID;

class AdmobBanner extends Component {
	async componentDidMount() {
		AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/6300978111'); // replace to real one
		await setTestDeviceIDAsync('EMULATOR');
	}

	render() {
		const { bannerSize = 'smartBannerPortrait' } = this.props;

		return (
			<View>
				<AdMobBanner
					bannerSize={bannerSize}
					adUnitID="ca-app-pub-3940256099942544/6300978111" // replace to real one
					servePersonalizedAds // true or false
					onDidFailToReceiveAdWithError={this.bannerError}
				/>
			</View>
		);
	}
}

export default AdmobBanner;

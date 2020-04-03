import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import _ from 'lodash';
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import Config from '../config';

const UNIT_ID = Platform.OS === 'ios' ? Config.ADMOB_UNIT_ID_IOS : Config.ADMOB_UNIT_ID_ANDROID;

class AdmobBanner extends Component {
	async componentDidMount() {
		AdMobInterstitial.setAdUnitID(UNIT_ID); // replace to real one
		await setTestDeviceIDAsync('EMULATOR');
	}

	render() {
		const { bannerSize = 'smartBannerPortrait' } = this.props;

		return (
			<View>
				<AdMobBanner
					bannerSize={bannerSize}
					adUnitID={UNIT_ID} // replace to real one
					servePersonalizedAds // true or false
					onDidFailToReceiveAdWithError={this.bannerError}
				/>
			</View>
		);
	}
}

export default AdmobBanner;

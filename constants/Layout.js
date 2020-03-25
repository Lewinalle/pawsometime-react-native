import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
	window: {
		width,
		height
	},
	isSmallDevice: width < 375,
	platform: {
		ios: Platform.OS === 'ios',
		android: Platform.OS === 'android'
	}
};

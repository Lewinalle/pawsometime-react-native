import React, { Component } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import Constants from '../constants/Layout';
import Colors from '../constants/Colors';

class Activity extends Component {
	render() {
		const { size = 50, style = {} } = this.props;

		let leftPos;
		switch (size) {
			case 'small':
				leftPos = (Constants.window.width - 10) / 2;
				break;
			case 'large':
				leftPos = (Constants.window.width - 24) / 2;
				break;
			default:
				if (typeof size === 'number') {
					leftPos = (Constants.window.width - size) / 2;
					break;
				} else {
					return null;
				}
		}

		return (
			<ActivityIndicator
				size={size}
				style={{ position: 'absolute', left: leftPos, top: Constants.window.height / 3, zIndex: 999, ...style }}
			/>
		);
	}
}

export default Activity;

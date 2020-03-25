import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { test } from '../../redux/actions/test.actions';
import { Auth } from 'aws-amplify';

const BUTTONS = [ 'News', 'Friends Activity' ];

class Home extends Component {
	state = {
		currentMenu: 0
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Home',
		// headerRight: (
		// 	<HeaderRightComponent
		// 		handleRefreshBtn={navigation.getParam('refresh')}
		// 		handleCreateBtn={() => {
		// 			navigation.navigate('CreateMeetup', {
		// 				onCreateBack: navigation.getParam('onCreateBack')
		// 			});
		// 		}}
		// 	/>
		// ),
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	});

	render() {
		const { currentMenu } = this.state;

		return (
			<View>
				<ButtonGroup
					onPress={(i) => this.setState({ currentMenu: i })}
					selectedIndex={currentMenu}
					buttons={BUTTONS}
				/>
				<Button
					title="Click me"
					onPress={() => {
						Linking.openURL('https://github.com/facebook/react-native');
					}}
				/>
			</View>
		);
	}
}

// Mock News
// [
// 	{
// 		"createdAt": 1581287077746,
// 		"description": "ANN ARBOR, MI -- There are times when pet owners have no choice but to give up their furry friends. Whether it’s because of space or rules in a new housing situation, the Humane S ociety of Huron ...",
// 		"id": "59dcb596-f1e6-4144-839c-03f64eafdcbb",
// 		"image": "https://images.gnews.io/3974ebdb013fb85ac2ba7363747e7d12",
// 		"link": "https://www.msn.com/en-us/news/us/humane-society-offers-listing-service-to-facilitate-pet-re-homing-without-shelters/ar-BBZOT0J",
// 		"publishedAt": "2020-02-09 12:41:56 UTC",
// 		"sourceInfo": Object {
// 		  "link": "https://www.msn.com",
// 		  "name": "MLive Ann Arbor on MSN.com",
// 		},
// 		"tag": "pets",
// 		"title": "Humane Society offers listing service to facilitate pet re-homing without shelters",
// 	  }
// ];

const mapStateToProps = ({ others, auth }) => ({
	news: others.news,
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

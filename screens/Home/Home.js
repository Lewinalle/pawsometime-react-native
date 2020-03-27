import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import NewsList from '../../components/NewsList';
import FriendsActivity from '../../components/FriendsActivity';
import AdmobBanner from '../../components/AdmobBanner';

const BUTTONS = [ 'News', 'Friends Activity' ];

class Home extends Component {
	state = {
		currentMenu: 0
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Home',
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	});

	render() {
		const { currentMenu } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<ButtonGroup
					onPress={(i) => this.setState({ currentMenu: i })}
					selectedIndex={currentMenu}
					buttons={BUTTONS}
				/>
				{currentMenu === 0 && <NewsList />}
				{currentMenu === 1 && <FriendsActivity navigation={this.props.navigation} />}
				<AdmobBanner />
			</View>
		);
	}
}

const mapStateToProps = ({ others, auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

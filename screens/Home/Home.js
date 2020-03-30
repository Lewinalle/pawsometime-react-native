import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking } from 'react-native';
import { Input, Button, ButtonGroup, Divider, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import NewsList from '../../components/NewsList';
import FriendsActivity from '../../components/FriendsActivity';
import AdmobBanner from '../../components/AdmobBanner';
import { vectorIcon } from '../../Utils/Icon';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BUTTONS = [ 'News', 'Friends Activity' ];

class Home extends Component {
	state = {
		currentMenu: 0
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		headerShown: false
	});

	render() {
		const { currentMenu } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						marginTop: 50,
						alignItems: 'center',
						paddingHorizontal: 14,
						maxHeight: 50
					}}
				>
					<View style={{ top: 2 }}>
						<Image
							source={require('../../assets/images/home-icon.png')}
							style={{ width: 50, height: 50 }}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity onPress={() => this.setState({ currentMenu: 0 })}>
								<View style={{ marginRight: 25 }}>
									<Text
										style={{
											color: currentMenu === 0 ? 'black' : '#b3bab5',
											fontWeight: currentMenu === 0 ? 'bold' : '500',
											fontSize: 20
										}}
									>
										News
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.setState({ currentMenu: 1 })}>
								<View>
									<Text
										style={{
											color: currentMenu === 1 ? 'black' : '#b3bab5',
											fontWeight: currentMenu === 1 ? 'bold' : '500',
											fontSize: 20
										}}
									>
										Friends Activity
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={{}}>
					<Divider style={{ height: 1.5, backgroundColor: Colors.primaryColor }} />
				</View>
				{currentMenu === 0 && (
					<View style={{ flex: 1 }}>
						<NewsList />
					</View>
				)}
				{currentMenu === 1 && (
					<View style={{ flex: 1 }}>
						<FriendsActivity navigation={this.props.navigation} />
					</View>
				)}
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

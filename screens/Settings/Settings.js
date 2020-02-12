import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { fetchUsers } from '../../Services/users';

import { SettingsListItem } from '../../components/SettingsListItem';
import SettingsDefault from './SettingsDefault';
import SettingsLogin from './SettingsLogin';
import SettingsRegister from './SettingsRegister';
import SettingsForgot from './SettingsForgot';
import SettingsSet from './SettingsSet';

import _ from 'lodash';

const Settings = (props) => {
	const [ pageType, setPageType ] = useState('login');

	useEffect(() => {
		if (props.isAuthenticated) {
			setPageType('default');
		}
	}, []);

	return (
		<View>
			{pageType === 'default' && <SettingsDefault {...props} setPageType={setPageType} />}
			{pageType === 'login' && <SettingsLogin setPageType={setPageType} />}
			{pageType === 'register' && <SettingsRegister setPageType={setPageType} />}
			{pageType === 'forgot' && <SettingsForgot setPageType={setPageType} />}
			{pageType === 'set' && <SettingsSet setPageType={setPageType} />}

			{pageType === 'default' && (
				<View>
					<Button buttonStyle={{ marginTop: 70 }} title="default" onPress={() => setPageType('default')} />
					<Button title="login" onPress={() => setPageType('login')} />
					<Button title="register" onPress={() => setPageType('register')} />
					<Button title="forgot" onPress={() => setPageType('forgot')} />
					<Button title="set" onPress={() => setPageType('set')} />
					<Button
						title="test isAuthenticated and currentCognitoUser and DBUser"
						onPress={async () => {
							console.log('--------------------------------------------isAuthenticated---');
							console.log(props.isAuthenticated);
							console.log('--------------------------------------------currentCognitoUser---');
							console.log(props.currentCognitoUser);
							console.log('--------------------------------------------currentDBUser---');
							console.log(props.currentDBUser);
						}}
					/>
				</View>
			)}
		</View>
	);
};

Settings.navigationOptions = {
	title: 'Profile'
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentCognitoUser: auth.currentCognitoUser,
	currentDBUser: auth.currentDBUser
});

export default connect(mapStateToProps)(Settings);

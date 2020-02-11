import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { setAuthStatus, setAuthUser } from '../../redux/actions/auth.actions';
import { fetchUsers } from '../../Services/users';

import { SettingsListItem } from '../../components/SettingsListItem';
import SettingsDefault from './SettingsDefault';
import SettingsLogn from './SettingsLogin';
import SettingsRegister from './SettingsRegister';
import SettingsForgot from './SettingsForgot';

import _ from 'lodash';

const Settings = (props) => {
	const [ pageType, setPageType ] = useState('login');

	return (
		<View>
			{pageType === 'default' && <SettingsDefault {...props} setPageType={setPageType} />}
			{pageType === 'login' && <SettingsLogn setPageType={setPageType} />}
			{pageType === 'register' && <SettingsRegister setPageType={setPageType} />}
			{pageType === 'forgot' && <SettingsForgot setPageType={setPageType} />}

			<Button buttonStyle={{ marginTop: 70 }} title="default" onPress={() => setPageType('default')} />
			<Button title="login" onPress={() => setPageType('login')} />
			<Button title="register" onPress={() => setPageType('register')} />
			<Button title="forgot" onPress={() => setPageType('forgot')} />
			<Button
				title="test get idtoken and user attributes"
				onPress={async () => {
					// console.log(await fetchUsers());
					let test = {
						lat: 13.123131,
						lon: 41.13123213,
						title: "title one"
					}

					let result = '';

					_.forIn(test, function(value, key) {
						result = `${result}&${key}=${value}`;
					});

					console.log(result);
				}}
			/>
		</View>
	);
};

Settings.navigationOptions = {
	title: 'Profile'
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentUser: auth.currentUser
});

const mapDispatchToProps = {
	setAuthStatus,
	setAuthUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

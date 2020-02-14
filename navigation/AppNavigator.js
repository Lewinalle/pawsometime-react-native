import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Loading from '../screens/Auth/Loading';
import MainTabNavigator from './MainTabNavigator';
import MainAuthNavigator from './MainAuthNavigator';

export default createAppContainer(
	createSwitchNavigator(
		{
			// You could add another route here for authentication.
			// Read more at https://reactnavigation.org/docs/en/auth-flow.html
			Loading: Loading,
			Main: MainTabNavigator,
			Auth: MainAuthNavigator
		},
		{
			initialRouteName: 'Loading'
		}
	)
);

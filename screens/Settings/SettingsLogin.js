import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';

import { connect } from 'react-redux';
import { setAuthStatus, setAuthUser } from '../../redux/actions/auth.actions';

import { validator } from '../../Utils/Validator';

const SettingsLogin = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ password, setPassword ] = useState('');
	const [ errors, setErrors ] = useState({
		cognito: null,
		blankfield: false
	});
	const [ isLoggingin, setIsLoggingin ] = useState(false);

	// // TODO: Comment out below to prevent displaying login while loggedin
	// useEffect(() => {
	// 	if (props.isAuthenticated) {
	// 		props.setPageType('default');
	// 	}
	// }, []);

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false,
			email: '',
			password: ''
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearErrorState();

		if (!email || !password) {
			setErrors({ ...errors, blankfield: true });
			return;
		}

		try {
			setIsLoggingin(true);

			const user = await Auth.signIn({
				username: email,
				password
			});

			setIsLoggingin(false);
			console.log(user);

			props.setAuthStatus(true);
			props.setAuthUser(user);

			props.setPageType('default');
		} catch (error) {
			let err = null;
			!error.message ? (err = { message: error }) : (err = error);
			console.log(err);
			setIsLoggingin(false);
			setErrors({ ...errors, cognito: err });
		}
	};

	const onInputChange = (target, text) => {
		const validated = validator(target, text);

		if (target === 'email') {
			setEmail(text);
			if (!validated) {
				setErrors({
					...errors,
					email: 'Email entered is not valid.'
				});
			} else {
				setErrors({
					...errors,
					email: ''
				});
			}
		}
		if (target === 'password') {
			setPassword(text);
			if (!validated) {
				setErrors({
					...errors,
					password:
						'Password must be at least 8 characters and contain: 1+ upper-case, 1+ lower-case and 1+ number.'
				});
			} else {
				setErrors({
					...errors,
					password: ''
				});
			}
		}
	};

	// // TODO: Comment out below to prevent displaying login while loggedin
	// if (props.isAuthenticated) {
	// 	return null;
	// }

	return (
		<View>
			<Input
				label="EMAIL"
				placeholder="email"
				value={email}
				autoCompleteType="email"
				onChangeText={(text) => onInputChange('email', text)}
			/>
			<Input
				label="PASSWORD"
				placeholder="password"
				value={password}
				autoCompleteType="password"
				secureTextEntry
				onChangeText={(text) => onInputChange('password', text)}
			/>

			<Button title="Sign Up" onPress={handleSubmit} disabled={isLoggingin} />
			<Text>{errors.blankfield ? 'Email and Password must be provided' : ''}</Text>
			<Text>{errors.cognito && errors.cognito.message ? errors.cognito.message : ''}</Text>
		</View>
	);
};

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated
});

const mapDispatchToProps = {
	setAuthStatus,
	setAuthUser
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsLogin);

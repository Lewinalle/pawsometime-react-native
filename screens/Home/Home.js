import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Input, Button } from 'react-native-elements';

import { connect } from 'react-redux';

import { test } from '../../redux/actions/test.actions';

import { Auth } from 'aws-amplify';

const Home = (props) => {
	const [ email, setEmail ] = useState(null);
	const [ username, setUsername ] = useState(null);
	const [ password, setPassword ] = useState(null);
	const [ confirmPassword, setConfirmPassword ] = useState(null);
	const [ errors, setErrors ] = useState({ cognito: null, blankfield: false, passwordmatch: false });
	const [ extraStates, setExtraStates ] = useState({});

	const clearErrorState = () => {
		setErrors({
			cognito: null,
			blankfield: false,
			passwordmatch: false
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Form validation
		clearErrorState();

		// const error = Validate(event, this.state);
		// if (error) {
		// 	this.setState({
		// 		errors: { ...this.state.errors, ...error }
		// 	});
		// }

		// AWS Cognito integration here
		try {
			// Sign-up
			// const signUpResponse = await Auth.signUp({
			// 	username: email,
			// 	password,
			// 	attributes: {
			// 		name: username
			// 	}
			// });
			// console.log(signUpResponse);

			// Sign-in
			const loginResponse = await Auth.signIn({
				username: email,
				password
			});
			console.log(loginResponse);

			// // Refresh Token
			// const cognitoUser = await Auth.currentAuthenticatedUser();
			// console.log(cognitoUser);
			// const currentSession = await Auth.currentSession();
			// console.log(currentSession);
			// cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
			// 	console.log('session', err, session);
			// 	// const { idToken, refreshToken, accessToken } = session;
			// 	// do whatever you want to do now :)
			// });
		} catch (error) {
			let err = null;
			!error.message ? (err = { message: error }) : (err = error);
			console.log(err);
			setErrors({ ...errors, cognito: err });
		}
	};

	const onInputChange = (target, text) => {
		console.log(target, text);

		if (target === 'email') {
			setEmail(text);
		}
		if (target === 'password') {
			setPassword(text);
		}
		if (target === 'username') {
			setUsername(text);
		}
		// document.getElementById(event.target.id).classList.remove('is-danger');
	};

	return (
		<View>
			<Input
				placeholder="email"
				value={email}
				autoCompleteType="email"
				onChangeText={(text) => onInputChange('email', text)}
			/>
			<Input
				placeholder="password"
				value={password}
				autoCompleteType="password"
				secureTextEntry
				onChangeText={(text) => onInputChange('password', text)}
			/>
			<Input placeholder="username" value={username} onChangeText={(text) => onInputChange('username', text)} />
			<Button title="Sign Up" onPress={handleSubmit} />
		</View>
	);

	// return (
	//     <View style={styles.container}>
	//         <ScrollView
	//             style={styles.container}
	//             contentContainerStyle={styles.contentContainer}>
	//             <TouchableHighlight onPress={() => {
	//                 props.test('testing redux!');
	//             }}>
	//                 <View>
	//                     <Text>
	//                         Change this text and your app will automatically reload.
	//                     </Text>
	//                 </View>
	//             </TouchableHighlight>
	//         </ScrollView>
	//     </View>
	// );
};

const mapStateToProps = ({ test }) => ({
	text: test.text
});

const mapDispatchToProps = {
	test
};

Home.navigationOptions = {
	title: 'Home'
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// function handleHelpPress() {
//   WebBrowser.openBrowserAsync(
//     'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
//   );
// }

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	contentContainer: {
		paddingTop: 30,
		paddingHorizontal: 30
	}
});

import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Text, Button, Image, Input } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser } from '../../redux/actions/auth.actions';
import { setDBUser } from '../../redux/actions/auth.actions';
import { fetchUserInfo, updateUser } from '../../Services/users';
import CacheImage from '../../components/CacheImage';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Config from '../../config';
import * as Permissions from 'expo-permissions';

const ChangeProfile = (props) => {
	const [ imageUri, setImageUri ] = useState(null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);
	const [ newDescription, setNewDescription ] = useState(props.currentDBUser ? props.currentDBUser.description : '');
	const [ isUpdating, setIsUpdating ] = useState(false);

	const pickImage = async () => {
		getPermissionAsync();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [ 1, 1 ],
			quality: 0.5
		});

		console.log(result);

		if (!result.cancelled) {
			const nameArr = result.uri.split('/');
			const name = nameArr[nameArr.length - 1];
			const typeArr = name.split('.');
			const type = 'image/' + typeArr[typeArr.length - 1];

			setImageUri(result.uri);
			setImageName(name);
			setImageType(type);
		}
	};

	const getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	const handleSubmit = async () => {
		try {
			setIsUpdating(true);

			console.log(imageUri, newDescription);

			if (imageUri) {
				await uploadToS3(imageUri, imageType, imageName);
			}
			if (newDescription) {
				let body = {
					description: newDescription
				};
				if (imageUri) {
					body.avatar = `${Config.S3_BASE_URL}/${imageName}`;
				}
				const newUser = await updateUser(props.currentDBUser.id, body);

				await props.setDBUser(newUser);
			}

			Alert.alert(
				'Updated!',
				'Your profile has been updated.',
				[
					{
						text: 'OK',
						onPress: async () => {
							setIsUpdating(false);
						}
					}
				],
				{
					cancelable: false
				}
			);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<View
			style={{
				padding: 20,
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				alignItems: 'stretch'
			}}
		>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={Header.HEIGHT + 50}>
				<ScrollView contentContainerStyle={{ padding: 20 }}>
					<View style={{ alignSelf: 'stretch' }}>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							{imageUri ? (
								<Image source={{ uri: imageUri }} style={{ width: 300, height: 300 }} />
							) : props.currentDBUser && props.currentDBUser.avatar ? (
								<CacheImage style={{ width: 300, height: 300 }} uri={props.currentDBUser.avatar} />
							) : (
								<Image
									source={require('../../assets/images/profile-default.png')}
									style={{ width: 300, height: 300 }}
								/>
							)}
						</View>
						<View style={{ marginTop: 20, alignSelf: 'stretch' }}>
							<Input
								placeholder="Greetings!"
								value={newDescription}
								returnKeyType="none"
								multiline={true}
								numberOfLines={3}
								containerStyle={{
									paddingHorizontal: 20,
									paddingVertical: 10,
									borderWidth: 1,
									borderColor: 'grey'
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top' }}
								onChangeText={(text) => setNewDescription(text)}
							/>
						</View>
						<View style={{ marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
							<Button title="Choose New Picture" onPress={pickImage} disabled={isUpdating} />
							<Button title="Update" onPress={() => handleSubmit()} disabled={isUpdating} />
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

ChangeProfile.navigationOptions = {
	title: 'Change Profile'
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentDBUser: auth.currentDBUser,
	currentCognitoUser: auth.currentCognitoUser
});

const mapDispatchToProps = {
	setAuthStatus,
	setCognitoUser,
	setDBUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfile);

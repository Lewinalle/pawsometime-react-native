import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
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
import Colors from '../../constants/Colors';
import Axios from 'axios';
import { sleep } from '../../Utils/Sleep';
import { RefreshControl } from 'react-native';

const ChangeProfile = (props) => {
	const [ imageUri, setImageUri ] = useState(null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);
	const [ newDescription, setNewDescription ] = useState(props.currentDBUser ? props.currentDBUser.description : '');
	const [ isUpdating, setIsUpdating ] = useState(false);
	const [ containerWidth, setContainerWidth ] = useState(340);

	const containerRef = useRef(null);

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
		if (isUpdating) {
			return;
		}

		try {
			setIsUpdating(true);

			console.log(imageUri, newDescription);

			if (imageUri) {
				await uploadToS3(imageUri, imageType, imageName);
			}

			let isUploaded = false;
			let count = 0;
			while (!isUploaded && count < 10) {
				try {
					isUploaded = await Axios({
						method: 'GET',
						url: `${Config.S3_BASE_URL}/${imageName}`
					});
				} catch (err) {
					count = count + 1;
					await sleep(800);
				}
			}

			let body = {
				description: newDescription
			};
			if (imageUri) {
				body.avatar = `${Config.S3_BASE_URL}/${imageName}`;
			}

			const newUser = await updateUser(props.currentDBUser.id, body);

			await props.setDBUser(newUser);

			Alert.alert(
				'Updated!',
				'Your profile has been updated.',
				[
					{
						text: 'OK',
						onPress: async () => {
							setIsUpdating(false);
							props.navigation.navigate('Settings');
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
				padding: 6,
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				alignItems: 'stretch'
			}}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior="height"
				keyboardVerticalOffset={Constants.platform.ios ? Header.HEIGHT : Header.HEIGHT + 50}
			>
				<ScrollView
					contentContainerStyle={{ padding: 20 }}
					refreshControl={<RefreshControl refreshing={isUpdating} onRefresh={() => {}} />}
				>
					<View
						ref={containerRef}
						style={{ alignSelf: 'stretch' }}
						onLayout={() => {
							if (containerRef.current) {
								containerRef.current.measure((x, y, width, height, pageX, pageY) => {
									setContainerWidth(width);
								});
							}
						}}
					>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							{imageUri ? (
								<Image
									source={{ uri: imageUri }}
									style={{ width: containerWidth, height: containerWidth }}
								/>
							) : props.currentDBUser && props.currentDBUser.avatar ? (
								<CacheImage
									style={{ width: containerWidth, height: containerWidth }}
									uri={props.currentDBUser.avatar}
								/>
							) : (
								<Image
									source={require('../../assets/images/profile-default.png')}
									style={{ width: containerWidth, height: containerWidth }}
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
									borderWidth: Constants.platform.ios ? 0.3 : 0.1,
									elevation: 2
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top' }}
								onChangeText={(text) => setNewDescription(text)}
							/>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingHorizontal: 24
							}}
						>
							<TouchableOpacity
								onPress={pickImage}
								disabled={isUpdating}
								style={{ marginTop: 20, marginBottom: 6 }}
							>
								<View
									style={{
										flex: 1,
										alignSelf: 'center'
									}}
								>
									<Image
										source={require('../../assets/images/home-news-loadmore.png')}
										style={{ width: 80, height: 40 }}
									/>
									<Button
										title="Add Image"
										onPress={pickImage}
										buttonStyle={{ padding: 0, backgroundColor: Colors.primaryColor }}
										inputStyle={{ color: 'white' }}
										titleStyle={{ fontSize: 14 }}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleSubmit}
								disabled={isUpdating}
								style={{ marginTop: 20, marginBottom: 6 }}
							>
								<View
									style={{
										flex: 1,
										alignSelf: 'center'
									}}
								>
									<Image
										source={require('../../assets/images/home-news-loadmore.png')}
										style={{ width: 80, height: 40 }}
									/>
									<Button
										title="Submit"
										onPress={handleSubmit}
										buttonStyle={{ padding: 0, backgroundColor: Colors.primaryColor }}
										inputStyle={{ color: 'white' }}
										titleStyle={{ fontSize: 14 }}
									/>
								</View>
							</TouchableOpacity>
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

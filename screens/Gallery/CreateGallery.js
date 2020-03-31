import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { Input, Button, Divider } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CacheImage from '../../components/CacheImage';
import { connect } from 'react-redux';
import { createGallery, updateGallery } from '../../Services/gallery';
import Config from '../../config';
import { vectorIcon } from '../../Utils/Icon';
import Colors from '../../constants/Colors';

class CreateGallery extends Component {
	original = this.props.navigation.getParam('originalGallery');

	state = {
		imageUri: this.original ? this.original.photo : null,
		imageName: null,
		imageType: null,
		description: this.original ? this.original.description : '',
		isSubmitting: false,
		containerWidth: 350
	};
	containerRef = null;

	async componentDidMount() {
		!this.original && (await this.pickImage());
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		// title: navigation.getParam('originalGallery') ? 'Edit' : 'New Photo'
		headerShown: false
	});

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	pickImage = async () => {
		this.getPermissionAsync();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [ 1, 1 ],
			quality: 0.6
		});

		if (!result.cancelled) {
			const nameArr = result.uri.split('/');
			const name = nameArr[nameArr.length - 1];
			const typeArr = name.split('.');
			const type = 'image/' + typeArr[typeArr.length - 1];

			this.setState({ imageUri: result.uri, imageName: name, imageType: type });
		}
	};

	handleSubmit = async () => {
		const { imageUri, imageName, imageType, description, isSubmitting } = this.state;
		const { currentDBUser } = this.props;

		if (!this.original && !imageName) {
			Alert.alert(
				'Warning!',
				`Photo cannot be empty.`,
				[
					{
						text: 'OK',
						onPress: () => {
							return;
						}
					}
				],
				{
					cancelable: false
				}
			);

			return;
		}

		if (isSubmitting) {
			return;
		}

		try {
			this.setState({ isSubmitting: true });
			if (imageName) {
				await uploadToS3(imageUri, imageType, imageName);
			}
			const body = {
				description,
				userId: currentDBUser.id,
				userName: currentDBUser.username,
				photo: imageName ? `${Config.S3_BASE_URL}/${imageName}` : this.original ? this.original.photo : null
			};

			if (this.original) {
				await updateGallery(this.original.id, body);
			} else {
				await createGallery(body);
			}

			Alert.alert(
				'Successful!',
				`Your meetup has been ${this.original ? 'updated' : 'created'}.`,
				[
					{
						text: 'OK',
						onPress: async () => {
							await this.handleAfterSubmit();
							this.setState({ isSubmitting: false });
						}
					}
				],
				{
					cancelable: false
				}
			);
		} catch (error) {
			console.log(error);
			alert('Something went wrong. Please try again.');
		}
	};

	handleAfterSubmit = async () => {
		const { navigation } = this.props;

		const handleBack = navigation.getParam('onCreateBack');
		await handleBack();
		navigation.navigate('Gallery');
	};

	render() {
		const { description, isSubmitting, imageUri, containerWidth } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						marginTop: 52,
						alignItems: 'center',
						paddingHorizontal: 14,
						maxHeight: 40
					}}
				>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<View style={{ top: 2, paddingRight: 34 }}>
							{vectorIcon('Ionicons', 'ios-arrow-back', 40, Colors.primaryColor)}
						</View>
					</TouchableOpacity>
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<View style={{ marginRight: 25 }}>
								<Text
									style={{
										color: 'black',
										fontWeight: 'bold',
										fontSize: 20
									}}
								>
									{this.original ? 'Update my post' : 'Add a photo'}
								</Text>
							</View>
						</View>
					</View>
				</View>
				<View style={{ marginBottom: 10, marginTop: 6 }}>
					<Divider style={{ height: 1.5, backgroundColor: Colors.primaryColor }} />
				</View>
				<View
					style={{
						padding: 20,
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
						<ScrollView contentContainerStyle={{}}>
							<View
								ref={(el) => (this.containerRef = el)}
								onLayout={() => {
									if (this.containerRef) {
										this.containerRef.measure((x, y, width, height, pageX, pageY) => {
											this.setState({ containerWidth: width });
										});
									}
								}}
							>
								{imageUri && (
									<View
										style={{
											marginBottom: 10,
											flex: 1,
											flexDirection: 'row',
											justifyContent: 'center'
										}}
									>
										<Image
											source={{ uri: imageUri }}
											style={{ width: '100%', height: containerWidth }}
										/>
									</View>
								)}
								<View style={{ marginBottom: 14 }}>
									<Input
										placeholder="Description"
										value={description}
										multiline
										numberOfLines={5}
										containerStyle={{
											height: 140,
											padding: 0,
											marginBottom: 0,
											borderWidth: Constants.platform.ios ? 0.3 : 0.1,
											elevation: 2
										}}
										inputContainerStyle={{
											borderBottomColor: 'transparent',
											borderBottomWidth: 0
										}}
										inputStyle={{
											textAlignVertical: 'top',
											paddingVertical: 4,
											fontSize: 14,
											alignSelf: 'center'
										}}
										onChangeText={(text) => this.setState({ description: text })}
									/>
								</View>
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
									onPress={this.pickImage}
									disabled={isSubmitting}
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
											onPress={this.pickImage}
											buttonStyle={{ padding: 0, backgroundColor: Colors.primaryColor }}
											inputStyle={{ color: 'white' }}
											titleStyle={{ fontSize: 14 }}
										/>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={this.handleSubmit}
									disabled={isSubmitting}
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
											onPress={this.handleSubmit}
											buttonStyle={{ padding: 0, backgroundColor: Colors.primaryColor }}
											inputStyle={{ color: 'white' }}
											titleStyle={{ fontSize: 14 }}
										/>
									</View>
								</TouchableOpacity>
							</View>
							{this.props.navigation.getParam('originalGallery') && (
								<View style={{ marginTop: 10 }}>
									<Text style={{ fontSize: 11 }}>
										** Please restart the app after if it is not updated.
									</Text>
								</View>
							)}
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</View>
		);
	}
}

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGallery);

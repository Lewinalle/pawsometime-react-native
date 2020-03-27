import React, { Component, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import CacheImage from '../../components/CacheImage';
import { connect } from 'react-redux';
import { createGallery, updateGallery } from '../../Services/gallery';
import Config from '../../config';

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
		title: navigation.getParam('originalGallery') ? 'Edit' : 'New Photo'
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
		const { imageUri, imageName, imageType, description } = this.state;
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
							<View style={{ borderWidth: 1, marginBottom: 14 }}>
								<Input
									placeholder="Description"
									value={description}
									multiline
									numberOfLines={5}
									containerStyle={{
										padding: 0,
										marginBottom: 0
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
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingHorizontal: 15
								}}
							>
								<Button
									titleStyle={{ marginHorizontal: 25 }}
									title="Change Image"
									onPress={this.pickImage}
									disabled={isSubmitting}
								/>
								<Button
									titleStyle={{ paddingHorizontal: 25 }}
									title="Submit"
									onPress={this.handleSubmit}
									disabled={isSubmitting}
								/>
							</View>
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
		);
	}
}

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGallery);

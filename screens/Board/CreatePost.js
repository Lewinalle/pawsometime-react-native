import React, { useEffect, useState, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	KeyboardAvoidingView,
	TextInput,
	Picker,
	Alert,
	TouchableOpacity,
	Image
} from 'react-native';
import { Input, Button, ButtonGroup, Divider } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { createPost, updatePost } from '../../Services/posts';
import { connect } from 'react-redux';
import Config from '../../config';
import { fetchPosts } from '../../redux/actions/posts.actions';
import Colors from '../../constants/Colors';
import { vectorIcon } from '../../Utils/Icon';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const boardTypeNames = [ 'General', 'Questions', 'Tips', 'Trade' ];

const boardTypes = [ 'general', 'qna', 'tips', 'trade' ];

const CreatePost = (props) => {
	const original = props.navigation.getParam('originalPost');
	const postType = props.navigation.getParam('postType');

	const [ imageUri, setImageUri ] = useState(original ? original.attachment : null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);
	const [ title, setTitle ] = useState(original ? original.title : '');
	const [ description, setDescription ] = useState(original ? original.description : '');
	const [ type, setType ] = useState(postType ? postType : 'general');
	const [ containerWidth, setContainerWidth ] = useState(350);
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const containerRef = useRef(null);

	const getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	const pickType = (i) => {
		setType(boardTypes[i]);
	};

	const pickImage = async () => {
		getPermissionAsync();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [ 1, 1 ],
			quality: 0.5
		});

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

	const handleSubmit = async () => {
		if (!title || !description) {
			Alert.alert(
				'Warning!',
				`Title and Description cannot be empty.`,
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
			setIsSubmitting(true);
			if (imageName) {
				await uploadToS3(imageUri, imageType, imageName);
			}
			const body = {
				title,
				description,
				type,
				userId: props.currentDBUser.id,
				userName: props.currentDBUser.username,
				attachment: imageName ? `${Config.S3_BASE_URL}/${imageName}` : original ? original.attachment : null
			};

			if (original) {
				await updatePost(original.id, body);
			} else {
				await createPost(body);
			}

			Alert.alert(
				'Successful!',
				`Your post has been ${original ? 'updated' : 'created'}.`,
				[
					{
						text: 'OK',
						onPress: async () => {
							await handleAfterSubmit();
							setIsSubmitting(false);
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

	const handleAfterSubmit = async () => {
		const handleBack = props.navigation.getParam('onCreateBack');
		await handleBack(type);
		props.navigation.navigate('Board');
	};

	console.log(imageUri);

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
				<TouchableOpacity onPress={() => props.navigation.goBack()}>
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
								{original ? 'Update my post' : 'Create my post'}
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
				<ScrollView contentContainerStyle={{}}>
					<View
						ref={containerRef}
						onLayout={() => {
							if (containerRef.current) {
								containerRef.current.measure((x, y, width, height, pageX, pageY) => {
									setContainerWidth(width);
								});
							}
						}}
					>
						<View style={{ marginBottom: 14 }}>
							<ButtonGroup
								onPress={pickType}
								selectedIndex={boardTypes.findIndex((i) => i === type)}
								buttons={boardTypeNames}
								containerStyle={{
									height: 40,
									minWidth: 250,
									marginTop: 0,
									marginBottom: 0,
									marginLeft: 0,
									marginRight: 0,
									borderWidth: 0
								}}
								textStyle={{ fontSize: 14 }}
								selectedButtonStyle={{ backgroundColor: Colors.primaryColor }}
							/>
						</View>
						<View style={{ alignSelf: 'stretch' }}>
							<Input
								placeholder="Title"
								value={title}
								label="TITLE"
								labelStyle={{ fontSize: 12, marginBottom: 10 }}
								blurOnSubmit
								multiline
								numberOfLines={2}
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
								onChangeText={(text) => setTitle(text)}
							/>
						</View>
						<View style={{ marginVertical: 10, alignSelf: 'stretch' }}>
							<Input
								placeholder="Description"
								value={description}
								label="DESCRIPTION"
								labelStyle={{ fontSize: 12, marginBottom: 10 }}
								multiline
								returnKeyType="none"
								numberOfLines={10}
								containerStyle={{
									height: 285,
									paddingHorizontal: 20,
									paddingTop: 10,
									paddingBottom: 30,
									borderWidth: Constants.platform.ios ? 0.3 : 0.1,
									elevation: 2
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top' }}
								onChangeText={(text) => setDescription(text)}
							/>
						</View>
						{imageUri && (
							<View
								style={{
									marginBottom: 15,
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'center'
								}}
							>
								<Image source={{ uri: imageUri }} style={{ width: '100%', height: containerWidth }} />
							</View>
						)}
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
										onPress={pickImage}
										buttonStyle={{ padding: 0, backgroundColor: Colors.primaryColor }}
										inputStyle={{ color: 'white' }}
										titleStyle={{ fontSize: 14 }}
									/>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleSubmit}
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
				<KeyboardSpacer topSpacing={-45} />
			</View>
		</View>
	);
};

CreatePost.navigationOptions = (props) => ({
	headerShown: false
});

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {
	fetchPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);

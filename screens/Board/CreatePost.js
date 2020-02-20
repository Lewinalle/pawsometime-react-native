import React, { useEffect, useState, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	KeyboardAvoidingView,
	TextInput,
	Picker,
	Alert
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { createPost } from '../../Services/posts';
import { connect } from 'react-redux';
import Config from '../../config';
import { fetchPosts } from '../../redux/actions/posts.actions';

const boardTypes = [
	{
		label: 'General',
		value: 'general'
	},
	{
		label: 'Questions',
		value: 'qna'
	},
	{
		label: 'Tips',
		value: 'tips'
	},
	{
		label: 'Trade',
		value: 'trade'
	}
];

const CreatePost = (props) => {
	const [ imageUri, setImageUri ] = useState(null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);
	const [ title, setTitle ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ type, setType ] = useState('general');
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

	const pickType = (itemValue, itemIndex) => {
		setType(itemValue);
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
				attachment: imageName ? `${Config.S3_BASE_URL}/${imageName}` : null
			};

			console.log(body);
			await createPost(body);

			Alert.alert(
				'Successful!',
				'Your post has been created.',
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
			console.error(error);
			alert('Something went wrong. Please try again.');
		}
	};

	const handleAfterSubmit = async () => {
		await props.fetchPosts({ type });

		props.navigation.navigate('Board');
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
						<View>
							<Picker selectedValue={type} style={{ height: 50, width: 150 }} onValueChange={pickType}>
								{boardTypes.map((item, index) => (
									<Picker.Item key={index} label={item.label} value={item.value} />
								))}
							</Picker>
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
									borderWidth: 1,
									borderColor: 'grey'
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
								onSubmitEditing={() => console.log('QWEQWEQWEQWE11111')}
								multiline
								returnKeyType="none"
								numberOfLines={10}
								containerStyle={{
									height: 285,
									paddingHorizontal: 20,
									paddingTop: 10,
									paddingBottom: 30,
									borderWidth: 1,
									borderColor: 'grey'
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
							<View style={{ marginBottom: 15, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
								<Image source={{ uri: imageUri }} style={{ width: '100%', height: containerWidth }} />
							</View>
						)}
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
								title="Add Image"
								onPress={pickImage}
								disabled={isSubmitting}
							/>
							<Button
								titleStyle={{ paddingHorizontal: 25 }}
								title="Submit"
								onPress={handleSubmit}
								disabled={isSubmitting}
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

CreatePost.navigationOptions = {
	title: 'Create'
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {
	fetchPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Image } from 'react-native';

import { MonoText } from '../../components/StyledText';
import { uploadToS3 } from '../../helpers/uploadToS3';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

import axios from 'axios';
import CacheImage from '../../components/CacheImage';

export default function Shopping() {
	const [ imageUri, setImageUri ] = useState(null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);

	useEffect(() => {
		// getPermissionAsync();
	}, []);

	const getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

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

	const uploadImage = async () => {
		uploadToS3(imageUri, imageType, imageName);

		// console.log(image);
		// console.log(typeof image);
		// const body = {
		// 	fileName: 'testing11.jpg',
		// 	contentType: 'image/jpeg'
		// };
		// const postOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	data: JSON.stringify(body),
		// 	url: 'https://dvteu7m1y2.execute-api.us-west-2.amazonaws.com/dev/test/post'
		// };
		// console.log(postOptions);
		// const s3Url = await axios(postOptions);
		// console.log(s3Url.data);
		// // try {
		// // 	const putBody = {
		// // 		uri: image,
		// // 		type: 'jpg',
		// // 		name: 'testing6.jpg'
		// // 	};
		// // 	const putOptions = {
		// // 		method: 'PUT',
		// // 		headers: { 'Content-Type': 'image/jpeg' },
		// // 		data: JSON.stringify(putBody),
		// // 		url: s3Url.data
		// // 	};
		// // 	const uploadRes = await axios(putOptions);
		// // 	console.log(uploadRes);
		// // } catch (err) {
		// // 	console.log(err);
		// // }
		// try {
		// 	const xhr = new XMLHttpRequest();
		// 	xhr.onreadystatechange = function() {
		// 		if (xhr.readyState === 4) {
		// 			if (xhr.status === 200) {
		// 				// success
		// 				console.log('success');
		// 			} else {
		// 				// failure
		// 				console.log('failure');
		// 			}
		// 		}
		// 	};
		// 	xhr.open('PUT', s3Url.data);
		// 	xhr.setRequestHeader('Content-Type', 'image/jpeg');
		// 	xhr.send({ uri: image, type: 'image/jpeg', name: 'testing11.jpg' });
		// } catch (err) {
		// 	console.log(err);
		// }

		// const getUrlBody = {
		// 	fileName: 'testing9.jpg'
		// };
		// const getUrlOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	data: JSON.stringify(getUrlBody),
		// 	url: 'https://dvteu7m1y2.execute-api.us-west-2.amazonaws.com/dev/test/geturl'
		// };
		// console.log(getUrlOptions);
		// const downUrl = await axios(getUrlOptions);
		// // console.log(downUrl);
		// console.log(downUrl.data);
	};

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button title="Pick an image from camera roll" onPress={pickImage} />
			{imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
			<Button title="Upload!" onPress={uploadImage} />

			<CacheImage style={{ width: 300, height: 300 }} uri="" />
		</View>
	);

	// return (
	// 	<View style={styles.container}>
	// 		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
	// 			<View>
	// 				<View>
	// 					<MonoText>Shopping Screen</MonoText>
	// 				</View>
	// 				<Text>This is Shopping Screen !!</Text>
	// 			</View>
	// 		</ScrollView>
	// 	</View>
	// );
}

Shopping.navigationOptions = {
	title: 'Shopping'
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	contentContainer: {
		paddingTop: 30
	}
});

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

export default function Gallery() {
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
	};

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button title="Pick an image from camera roll" onPress={pickImage} />
			{imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
			<Button title="Upload!" onPress={uploadImage} />

			<CacheImage style={{ width: 300, height: 300 }} uri="" />
		</View>
	);
}

Gallery.navigationOptions = {
	title: 'Gallery'
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

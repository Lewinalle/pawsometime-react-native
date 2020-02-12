import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Text } from 'react-native-elements';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

export default (CacheImage = (props) => {
	const [ source, setSource ] = useState(null);

	useEffect(() => {
		const fetchImage = async () => {
			let imageSource;
			const name = shorthash.unique(props.uri);
			const path = `${FileSystem.cacheDirectory}${name}`;
			const image = await FileSystem.getInfoAsync(path);
			if (image.exists) {
				console.log('Read image from cache');
				imageSource = { uri: image.uri };
				setSource(imageSource);
			} else {
				console.log('Downloading image from url to cache.');
				const newImage = await FileSystem.downloadAsync(props.uri, path);
				imageSource = { uri: newImage.uri };
				setSource(imageSource);
			}
		};
		fetchImage();
	}, []);

	return (
		<View>
			<Image style={props.style} source={source} />
		</View>
	);
});

const style = StyleSheet.create({});

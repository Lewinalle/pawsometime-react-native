import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

export default (CacheImage = (props) => {
	const [ source, setSource ] = useState(null);

	useEffect(() => {
		const fetchImage = async () => {
			let test;
			const name = shorthash.unique(props.uri);
			const path = `${FileSystem.cacheDirectory}${name}`;
			const image = await FileSystem.getInfoAsync(path);
			if (image.exists) {
				console.log('Read image from cache');
				test = { uri: image.uri };
				setSource(test);
			} else {
				console.log('Downloading image from url to cache.');
				const newImage = await FileSystem.downloadAsync(props.uri, path);
				test = { uri: newImage.uri };
				setSource(test);
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

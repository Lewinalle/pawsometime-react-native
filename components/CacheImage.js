import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Image, Text } from 'react-native-elements';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

export default (CacheImage = (props) => {
	const { uri, style } = props;
	const [ source, setSource ] = useState(null);

	useEffect(() => {
		const fetchImage = async () => {
			let imageSource;
			const name = shorthash.unique(uri);
			const path = `${FileSystem.cacheDirectory}${name}`;
			const image = await FileSystem.getInfoAsync(path);
			if (image.exists) {
				console.log('Read image from cache');
				imageSource = { uri: image.uri };
				setSource(imageSource);
			} else {
				console.log('Downloading image from url to cache.');
				const newImage = await FileSystem.downloadAsync(uri, path);
				imageSource = { uri: newImage.uri };
				setSource(imageSource);
			}
		};
		fetchImage();
	}, []);

	if (props.onPressHandler) {
		return (
			<TouchableHighlight onPress={props.onPressHandler}>
				<View>
					<Image style={style} source={source} />
				</View>
			</TouchableHighlight>
		);
	}

	return (
		<View>
			<Image style={style} source={source} />
		</View>
	);
});

const style = StyleSheet.create({});

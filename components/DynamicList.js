import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Text, Card } from 'react-native-elements';

import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

export default (DynamicList = (props) => {
	const { renderer, items, totalItems = 3, fetchMore, stackSize = 3, isMax } = props;
	const [ currentStack, setCurrentStack ] = useState(1);
	const [ showLoadMore, setShowLoadMore ] = useState(false);

	const Component = `${renderer}`;

	useEffect(() => {
		if (totalItems > stackSize * currentStack || !isMax) {
			setShowLoadMore(true);
		}
	}, []);

	const loadMore = async () => {
		if (totalItems - 1 <= stackSize * currentStack) {
			await fetchMore();
		}

		setCurrentStack();
	};

	const resetStack = () => {
		setCurrentStack(1);
	};

	return (
		<View>
			<Text>asdasdasd</Text>
		</View>
	);
});

const style = StyleSheet.create({});

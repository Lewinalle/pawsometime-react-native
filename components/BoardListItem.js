import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { BoardListItemRenderer } from './BoardListItemRenderer';
import Colors from '../constants/Colors';

export function BoardListItem(props) {
	const { post } = props;

	return (
		<View style={style.itemStyle}>
			<ListItem {...props} Component={BoardListItemRenderer} post={post} />
			<Divider style={{ height: 1.3, backgroundColor: Colors.primaryColor }} />
		</View>
	);
}

const style = StyleSheet.create({
	itemStyle: {
		flex: 1,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 20
	},
	description: {}
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar, ButtonGroup, Button } from 'react-native-elements';
import _ from 'lodash';

export const BoardSearch = (props) => {
	const [ selected, setSelected ] = useState([]);

	const searchBy = [ 'title', 'description', 'user' ];
	const searchByAttr = [ 'title', 'description', 'userName' ];

	const handleSearchBySelect = (index) => {
		setSelected(index);
	};

	const handleSubmit = () => {
		let query = {};
		if (props.value !== '') {
			selected.map((i) => (query[searchByAttr[i]] = props.value));
			console.log(query);
		}

		props.handleSearchSubmit(query);
	};

	return (
		<View style={{ marginBottom: 5 }}>
			<SearchBar
				placeholder="Search Posts"
				onChangeText={props.onValueChange}
				value={props.value}
				containerStyle={{
					padding: 0,
					backgroundColor: '#fff',
					borderRadius: 0,
					borderTopWidth: 0,
					borderBottomWidth: 0
				}}
				inputContainerStyle={{
					borderRadius: 4,
					backgroundColor: '#fff',
					borderWidth: 0.5,
					borderBottomWidth: 0.5
				}}
				lightTheme
				round
			/>
			<View style={{ flex: 1, flexDirection: 'row', padding: 0, margin: 0, width: '100%' }}>
				<ButtonGroup
					onPress={(index) => handleSearchBySelect(index)}
					selectedIndexes={selected}
					selectMultiple
					buttons={searchBy}
					containerStyle={{
						height: 30,
						minWidth: 250,
						width: '60%',
						marginTop: 0,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0
					}}
					textStyle={{ fontSize: 12 }}
					selectedButtonStyle={{ backgroundColor: 'grey' }}
				/>
				<Button
					title="Search"
					type="outline"
					onPress={handleSubmit}
					titleStyle={{ fontSize: 14 }}
					buttonStyle={{ height: 30 }}
					containerStyle={{ marginLeft: 'auto', width: '30%' }}
				/>
			</View>
		</View>
	);
};

// TODO: Refactor all inline stylings into this
const style = StyleSheet.create({
	itemStyle: {
		flex: 1,
		paddingHorizontal: 4,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 20
	},
	description: {}
});

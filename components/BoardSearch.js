import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SearchBar, ButtonGroup, Button } from 'react-native-elements';
import _ from 'lodash';
import Colors from '../constants/Colors';

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
		}

		props.handleSearchSubmit(query);
	};

	return (
		<View style={{ marginBottom: 5 }}>
			{/* <SearchBar
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
			/> */}

			<View>
				<View
					style={{
						alignSelf: 'stretch',
						marginBottom: 8,
						height: 33
					}}
				>
					<View
						style={{
							flex: 1,
							flexDirection: 'row'
						}}
					>
						<SearchBar
							placeholder="Search Posts"
							onChangeText={props.onValueChange}
							value={props.value}
							inputContainerStyle={{ alignSelf: 'stretch' }}
							containerStyle={{
								alignSelf: 'stretch',
								flexGrow: 1,
								backgroundColor: '#f2ead5',
								padding: 0,
								borderRadius: 0,
								borderLeftWidth: 0,
								borderRightWidth: 0,
								borderTopWidth: 0,
								borderBottomWidth: 0,
								elevation: 2,
								height: 40
							}}
							inputStyle={{ fontSize: 14 }}
							inputContainerStyle={{ backgroundColor: 'transparent' }}
						/>
						<Button
							onPress={handleSubmit}
							title="Search"
							buttonStyle={{
								backgroundColor: '#fcb444',
								borderTopWidth: 0,
								borderRightWidth: 0,
								borderBottomWidth: 0,
								borderColor: 'black',
								elevation: 2,
								padding: 16,
								height: 40
							}}
							titleStyle={{ height: 22, fontSize: 14 }}
						/>
					</View>
				</View>
			</View>

			<View style={{ height: 0, flex: 1, flexDirection: 'row' }}>
				<View style={{ marginRight: 8, marginLeft: 6 }}>
					<Text style={{ top: 6, fontSize: 12, color: Colors.primaryColor, height: 50 }}>Search For</Text>
				</View>
				<ButtonGroup
					onPress={(index) => handleSearchBySelect(index)}
					selectedIndexes={selected}
					selectMultiple
					buttons={searchBy}
					containerStyle={{
						height: 30,
						marginTop: 0,
						marginBottom: 0,
						marginLeft: 0,
						marginRight: 0,
						flex: 1
					}}
					textStyle={{ fontSize: 12, color: 'grey' }}
					selectedButtonStyle={{ backgroundColor: Colors.primaryColor }}
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

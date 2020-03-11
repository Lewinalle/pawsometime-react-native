import React, { useState, useEffect } from 'react';
import { Text, Image, ScrollView, View, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Overlay } from 'react-native-elements';
import axios from 'axios';

export const CitySearchModal = (props) => {
	const { showModal, closeModal } = props;
	// useEffect(async () => {
	//     let url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&offset=0&namePrefix=chica';
	//     let options = {
	//                 method: 'GET',
	//                 url: url,
	//                 headers: {
	//                     // 'Accept': 'application/json',
	//                     // 'Content-Type': 'application/json;charset=UTF-8'
	//                     "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
	//                     "x-rapidapi-key": "8b08bd8b49msh966e69d97071211p1283c7jsnceee81261b1d"
	//                 }
	//             };
	//     let response = await axios(options);
	//     let responseOK = response && response.status === 200;
	//     if (responseOK) {
	//         let data = await response.data;
	//         console.log(data);
	//     }
	// }, []);

	return (
		// <Modal
		// 	animationType="fade"
		// 	transparent={true}
		// 	visible={showModal}
		// 	onRequestClose={() => {
		// 		console.log('modal closing!');
		// 	}}
		// >
		// 	<View
		// 		style={{
		// 			flex: 1,
		// 			flexDirection: 'column',
		// 			justifyContent: 'center',
		// 			alignItems: 'center',
		// 			backgroundColor: 'rgba(52, 52, 52, 0.7)'
		// 			// backgroundColor: 'rgba(80, 80, 80, 0.1)'
		// 		}}
		// 	>
		// 		<View
		// 			style={{
		// 				width: 300,
		// 				height: 300,
		// 				backgroundColor: 'white'
		// 			}}
		// 		>
		// 			<Text>Hello World!</Text>

		// 			<TouchableHighlight
		// 				onPress={() => {
		// 					triggerModal(false);
		// 				}}
		// 			>
		// 				<Text>Hide Modal</Text>
		// 			</TouchableHighlight>
		// 		</View>
		// 	</View>
		// </Modal>
		<Overlay
			animationType="fade"
			transparent={true}
			isVisible={showModal}
			onRequestClose={() => {
				closeModal();
			}}
			onBackdropPress={() => {
				closeModal();
			}}
			overlayStyle={{ padding: 0, borderRadius: 4 }}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					alignItems: 'center',
					alignSelf: 'stretch',
					padding: 10
				}}
			>
				<View style={{ marginBottom: 10 }}>
					<Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={2}>
						Testing!!!!!!!!!!!!!!!!!
					</Text>
				</View>
			</View>
		</Overlay>
	);
};

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

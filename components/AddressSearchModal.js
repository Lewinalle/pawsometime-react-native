import React, { useState, useEffect } from 'react';
import { Text, Image, ScrollView, View, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Overlay, Button } from 'react-native-elements';

export const AddressSearchModal = (props) => {
	const { showModal, closeModal, searchResult, handleAddressSelect } = props;

	const handleAddressClick = (item) => {
		handleAddressSelect(item);
	};

	return (
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
					{searchResult.map((item, index) => {
						return (
							<View key={index}>
								<Button title={item.title} type="outline" onPress={() => handleAddressClick(item)} />
							</View>
						);
					})}
				</View>
				<View>
					<Text>Warning: Postal Code could not be accurate.</Text>
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

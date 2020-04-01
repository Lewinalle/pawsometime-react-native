import React, { useState, useEffect } from 'react';
import { Text, Image, ScrollView, View, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import Colors from '../constants/Colors';

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
			<ScrollView>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						alignItems: 'center',
						alignSelf: 'stretch',
						padding: 10
					}}
				>
					<View style={{ marginBottom: 8, paddingVertical: 10 }}>
						<Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={2}>
							Pick address
						</Text>
					</View>
					{searchResult.map((item, index) => {
						return (
							<Button
								key={index}
								title={item.title}
								titleStyle={{ fontSize: 14, color: Colors.primaryColor }}
								containerStyle={{ padding: 0, margin: 6 }}
								buttonStyle={{
									padding: 4,
									borderColor: Colors.primaryColor,
									borderWidth: 1
								}}
								type="outline"
								onPress={() => handleAddressClick(item)}
								raised
							/>
						);
					})}
					<View style={{ marginVertical: 10, padding: 4 }}>
						<Text style={{ textAlign: 'center' }}>Warning: Postal Code could not be accurate.</Text>
					</View>
				</View>
			</ScrollView>
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

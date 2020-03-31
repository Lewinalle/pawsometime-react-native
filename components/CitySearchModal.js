import React, { Component, useState, useEffect } from 'react';
import {
	Text,
	Image,
	ScrollView,
	View,
	StyleSheet,
	Modal,
	TouchableHighlight,
	KeyboardAvoidingView
} from 'react-native';
import { Overlay, Button } from 'react-native-elements';
import Colors from '../constants/Colors';
class CitySearchModal extends Component {
	render() {
		const { showModal, closeModal, searchResult = [], handleCitySelect } = this.props;

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
						<View
							style={{
								marginBottom: 10,
								alignSelf: 'stretch'
							}}
						>
							<View style={{ marginBottom: 6, paddingVertical: 10 }}>
								<Text
									style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}
									numberOfLines={2}
								>
									Search Result for {this.props.searchTerm}
								</Text>
							</View>
							<View>
								{searchResult.map((city, index) => {
									return (
										<Button
											key={index}
											title={`${city.name}, ${city.region}, ${city.country}`}
											titleStyle={{ fontSize: 14, color: Colors.primaryColor }}
											containerStyle={{ padding: 0, margin: 6 }}
											buttonStyle={{
												padding: 4,
												borderColor: Colors.primaryColor,
												borderWidth: 1
											}}
											type="outline"
											onPress={() => handleCitySelect(city)}
											raised
										/>
									);
								})}
							</View>
						</View>
					</View>
				</ScrollView>
			</Overlay>
		);
	}
}

export default CitySearchModal;

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

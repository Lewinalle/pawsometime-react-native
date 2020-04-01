import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking, RefreshControl } from 'react-native';
import { Input, Button, ListItem, Card, Divider, ButtonGroup, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import Constants from '../constants/Layout';

const NoContent = (props) => {
	const { title = 'No Content Found', message, containerStyle = {} } = props;

	return (
		<TouchableOpacity onPress={() => {}}>
			<View
				style={{
					alignContent: 'stretch',
					padding: 50,
					marginHorizontal: 14,
					marginTop: 14,
					borderWidth: Constants.platform.ios ? 0.3 : 0.1,
					elevation: 2,
					...containerStyle
				}}
			>
				<View style={{ alignSelf: 'center' }}>
					<Text style={{ fontSize: 20, color: Colors.primaryColor, textAlign: 'center' }}>{title}</Text>
				</View>
				{message && (
					<View style={{ alignSelf: 'center', marginTop: 20 }}>
						<Text style={{ fontSize: 14, color: 'grey', textAlign: 'center' }}>{message}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
};

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NoContent);

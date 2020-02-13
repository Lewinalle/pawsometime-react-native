import React, { useState, useEffect } from 'react';
import { Text, Image, ScrollView, View, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import axios from 'axios';

export const CitySearch = (props) => {
	const { showModal, triggerModal } = props;
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
		<Modal
			animationType="fade"
			transparent={true}
			visible={showModal}
			onRequestClose={() => {
				console.log('modal closing!');
			}}
		>
			<View
				style={{
					flex: 1,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(52, 52, 52, 0.7)'
					// backgroundColor: 'rgba(80, 80, 80, 0.1)'
				}}
			>
				<View
					style={{
						width: 300,
						height: 300,
						backgroundColor: 'white'
					}}
				>
					<Text>Hello World!</Text>

					<TouchableHighlight
						onPress={() => {
							triggerModal(false);
						}}
					>
						<Text>Hide Modal</Text>
					</TouchableHighlight>
				</View>
			</View>
		</Modal>
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

const mockRes = {
	data: [
		{
			city: 'Chicacao',
			country: 'Guatemala',
			countryCode: 'GT',
			id: 49463,
			latitude: 14.54295,
			longitude: -91.32636,
			name: 'Chicacao',
			region: 'Suchitepéquez Department',
			regionCode: 'SU',
			type: 'CITY',
			wikiDataId: 'Q2608636'
		},
		{
			city: 'Chicamán',
			country: 'Guatemala',
			countryCode: 'GT',
			id: 48934,
			latitude: 15.34786,
			longitude: -90.79968,
			name: 'Chicamán',
			region: 'Quiché Department',
			regionCode: 'QC',
			type: 'CITY',
			wikiDataId: 'Q2402199'
		},
		{
			city: 'Chicalim',
			country: 'India',
			countryCode: 'IN',
			id: 56742,
			latitude: 15.39835,
			longitude: 73.84216,
			name: 'Chicalim',
			region: 'Goa',
			regionCode: 'GA',
			type: 'CITY',
			wikiDataId: 'Q1105928'
		},
		{
			city: 'Chicahua',
			country: 'Mexico',
			countryCode: 'MX',
			id: 75137,
			latitude: 17.63667,
			longitude: -97.19497,
			name: 'Chicahua',
			region: 'Oaxaca',
			regionCode: 'OAX',
			type: 'CITY',
			wikiDataId: 'Q3890564'
		},
		{
			city: 'Chicahuaxtla',
			country: 'Mexico',
			countryCode: 'MX',
			id: 80333,
			latitude: 20.1425,
			longitude: -97.94556,
			name: 'Chicahuaxtla',
			region: 'Puebla',
			regionCode: 'PUE',
			type: 'CITY',
			wikiDataId: 'Q20229267'
		},
		{
			city: 'Chicapa de Castro',
			country: 'Mexico',
			countryCode: 'MX',
			id: 75115,
			latitude: 16.43844,
			longitude: -94.82206,
			name: 'Chicapa de Castro',
			region: 'Oaxaca',
			regionCode: 'OAX',
			type: 'CITY'
		},
		{
			city: 'Chicavasco',
			country: 'Mexico',
			countryCode: 'MX',
			id: 75678,
			latitude: 20.19715,
			longitude: -98.95386,
			name: 'Chicavasco',
			region: 'Hidalgo',
			regionCode: 'HID',
			type: 'CITY',
			wikiDataId: 'Q30279483'
		},
		{
			city: 'Chicama',
			country: 'Peru',
			countryCode: 'PE',
			id: 86128,
			latitude: -7.84472,
			longitude: -79.14694,
			name: 'Chicama',
			region: 'La Libertad',
			regionCode: 'LAL',
			type: 'CITY',
			wikiDataId: 'Q7258550'
		},
		{
			city: 'Chicago',
			country: 'United States of America',
			countryCode: 'US',
			id: 120473,
			latitude: 41.85003,
			longitude: -87.65005,
			name: 'Chicago',
			region: 'Illinois',
			regionCode: 'IL',
			type: 'CITY',
			wikiDataId: 'Q1297'
		},
		{
			city: 'Chicago Heights',
			country: 'United States of America',
			countryCode: 'US',
			id: 120727,
			latitude: 41.50615,
			longitude: -87.6356,
			name: 'Chicago Heights',
			region: 'Illinois',
			regionCode: 'IL',
			type: 'CITY',
			wikiDataId: 'Q578277'
		}
	],
	links: [
		{
			href: '/v1/geo/cities?offset=0&limit=10&namePrefix=chica',
			rel: 'first'
		},
		{
			href: '/v1/geo/cities?offset=10&limit=10&namePrefix=chica',
			rel: 'next'
		},
		{
			href: '/v1/geo/cities?offset=10&limit=10&namePrefix=chica',
			rel: 'last'
		}
	],
	metadata: {
		currentOffset: 0,
		totalCount: 13
	}
};

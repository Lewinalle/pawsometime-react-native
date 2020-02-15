import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import MeetupListCard from '../../components/MeetupListCard';
import MapView, { Marker, Callout } from 'react-native-maps';
import dimensions from '../../constants/Layout';
import { CitySearch } from '../../components/CitySearch';
import { connect } from 'react-redux';

const MAX_TITLE_LENGTH = 30;
const MAP_WIDTH = dimensions.window.width - 32;
const MAP_HEIGHT = 200;
const DEFAULT_SCROLLVIEW_POSITION = 30;
const LAT_DELTA = 0.07;
const LON_DELTA = 0.07;

const Meetup = (props) => {
	const [ selected, setSelected ] = useState();
	const [ scrollPos, setScrollPos ] = useState(0);
	const [ scrollViewPos, setScrollViewPos ] = useState(DEFAULT_SCROLLVIEW_POSITION);
	const scrollviewRef = useRef(null);
	const viewRef = useRef(null);
	const mapRef = useRef(null);
	let markerRefs = {};

	const handleCardSelect = (item) => {
		markerRefs[item.id].showCallout();
		mapRef.current.animateToRegion({
			latitude: item.location.lat,
			longitude: item.location.lon,
			latitudeDelta: LAT_DELTA,
			longitudeDelta: LON_DELTA
		});

		setSelected(item.id);
	};

	const handleMarkerSelect = (item) => {
		setSelected(item.id);
	};

	const scrollToCard = (pageY) => {
		scrollviewRef.current.scrollTo({
			x: 0,
			y: pageY + scrollPos - scrollViewPos,
			animated: true
		});
	};

	const [ showModal, setShowModal ] = useState(false);
	const triggerModal = (bool) => {
		setShowModal(bool);
	};

	return (
		<View style={styles.container}>
			<CitySearch showModal={showModal} triggerModal={triggerModal} />
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: props.currentLocation.lat,
					longitude: props.currentLocation.lon,
					latitudeDelta: LAT_DELTA,
					longitudeDelta: LON_DELTA
				}}
			>
				{meetups.map((item, index) => {
					let titleTruncated =
						item.title.length > MAX_TITLE_LENGTH + 5
							? item.title.substring(0, MAX_TITLE_LENGTH) + '...'
							: item.title;
					return (
						<Marker
							key={index}
							ref={(el) => (markerRefs[item.id] = el)}
							coordinate={{
								latitude: item.location.lat,
								longitude: item.location.lon
							}}
							title={titleTruncated}
							onPress={() => handleMarkerSelect(item)}
						>
							<Callout>
								<Text>{titleTruncated}</Text>
							</Callout>
						</Marker>
					);
				})}
			</MapView>
			<TouchableHighlight onPress={() => triggerModal(true)}>
				<Text>Touch item or marker twice to go to the meetup page</Text>
			</TouchableHighlight>
			<ScrollView
				ref={scrollviewRef}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				onScroll={({ nativeEvent }) => setScrollPos(nativeEvent.contentOffset.y)}
			>
				<View
					ref={viewRef}
					onLayout={() => {
						if (viewRef) {
							viewRef.current.measure((x, y, width, height, pageX, pageY) => {
								setScrollViewPos(pageY);
							});
						}
					}}
				>
					{meetups.map((item, index) => (
						<MeetupListCard
							key={index}
							meetup={item}
							selected={item.id === selected}
							handleCardSelect={handleCardSelect}
							scrollToCard={scrollToCard}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

Meetup.navigationOptions = {
	title: 'Meetup'
};

const mapStateToProps = ({ others }) => ({
	currentLocation: others.currentLocation
});

export default connect(mapStateToProps)(Meetup);

const styles = StyleSheet.create({
	map: {
		position: 'relative',
		left: 16,
		width: MAP_WIDTH,
		height: MAP_HEIGHT
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginVertical: 6
	},
	contentContainer: {}
});

const meetups = [
	{
		id: 1,
		title: '11 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.74061,
			lon: -73.945242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 2,
		title: '22 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.73061,
			lon: -73.945242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 3,
		title: '33 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.74061,
			lon: -73.935242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 4,
		title: '44 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.72061,
			lon: -73.925242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 5,
		title: '55 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.72061,
			lon: -73.935242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 6,
		title: '66Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.73061,
			lon: -73.925242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 7,
		title: '77 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.71061,
			lon: -73.915242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 8,
		title: '88 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.71061,
			lon: -73.935242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 9,
		title: '99 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.71061,
			lon: -73.925242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 10,
		title: '100 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.73061,
			lon: -73.915242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	},
	{
		id: 11,
		title: '111 Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
		description:
			'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
		location: {
			lat: 40.73061,
			lon: -73.925242
		},
		host: {
			id: 1,
			name: 'Lewis',
			description: "Hi I'm Lewis"
		},
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		users: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		]
	}
];

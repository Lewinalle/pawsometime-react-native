import React, { Component, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import MeetupListCard from '../../components/MeetupListCard';
import MapView, { Marker, Callout } from 'react-native-maps';
import dimensions from '../../constants/Layout';
import { CitySearchModal } from '../../components/CitySearchModal';
import { connect } from 'react-redux';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import _ from 'lodash';
import { fetchMeetups } from '../../redux/actions/meetups.actions';

const MAX_TITLE_LENGTH = 30;
const MAP_WIDTH = dimensions.window.width - 32;
const MAP_HEIGHT = 200;
const DEFAULT_SCROLLVIEW_POSITION = 30;
const LAT_DELTA = 0.08;
const LON_DELTA = 0.08;

class Meetup extends Component {
	state = {
		meetups: this.props.meetups,
		selected: null,
		scrollPos: 0,
		scrollViewPos: DEFAULT_SCROLLVIEW_POSITION,
		showModal: false,
		centerLat: this.props.currentLocation.lat,
		centerLon: this.props.currentLocation.lon,
		lat_offset: LAT_DELTA,
		lon_offset: LON_DELTA,
		isFetching: false
	};
	markerRefs = {};
	scrollviewRef = null;
	viewRef = null;

	async componentDidMount() {
		const { navigation } = this.props;

		navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: this.onCreateBack
		});
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Meetup',
		headerRight: (
			<HeaderRightComponent
				handleRefreshBtn={navigation.getParam('refresh')}
				handleCreateBtn={() => {
					navigation.navigate('CreateMeetup', {
						onCreateBack: navigation.getParam('onCreateBack')
					});
				}}
			/>
		),
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	});

	handleRefreshBtn = () => {
		console.log('refreshing!');
	};

	onCreateBack = () => {
		console.log('to Create!');
	};

	handleCardSelect = (item) => {
		this.props.navigation.navigate('MeetupInfo', { meetup: item });
	};

	handleMarkerSelect = (item) => {
		this.setState({ selected: item.id });
	};

	scrollToCard = (pageY) => {
		const { scrollPos, scrollViewPos } = this.state;

		this.scrollviewRef.scrollTo({
			x: 0,
			y: pageY + scrollPos - scrollViewPos,
			animated: true
		});
	};

	closeModal = () => {
		this.setState({ showModal: false });
	};

	render() {
		const { selected, showModal, lat_offset, lon_offset, meetups, isFetching } = this.state;
		// TODO: add meetups to state
		// TODO: clear marker refs when refreshing/searching

		if (!meetups) {
			return null;
		}

		return (
			<View style={styles.container}>
				<CitySearchModal showModal={showModal} closeModal={this.closeModal} />
				<MapView
					style={styles.map}
					initialRegion={{
						latitude: this.props.currentLocation.lat,
						longitude: this.props.currentLocation.lon,
						latitudeDelta: lat_offset,
						longitudeDelta: lon_offset
					}}
					onRegionChange={(region) =>
						this.setState({
							centerLat: region.latitude,
							centerLon: region.longitude,
							lat_offset: region.latitudeDelta,
							lon_offset: region.longitudeDelta
						})}
				>
					{meetups.map((item, index) => {
						let titleTruncated =
							item.title.length > MAX_TITLE_LENGTH + 5
								? item.title.substring(0, MAX_TITLE_LENGTH) + '...'
								: item.title;
						return (
							<Marker
								key={index}
								ref={(el) => (this.markerRefs[item.id] = el)}
								coordinate={{
									latitude: item.latlon.lat,
									longitude: item.latlon.lon
								}}
								title={titleTruncated}
								onPress={() => this.handleMarkerSelect(item)}
							>
								<Callout>
									<Text>{titleTruncated}</Text>
								</Callout>
							</Marker>
						);
					})}
				</MapView>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						paddingHorizontal: 15,
						maxHeight: 35
					}}
				>
					<Button
						onPress={() => this.setState({ showModal: true })}
						title="Search City"
						containerStyle={{
							height: null,
							width: null,
							flex: 1,
							alignSelf: 'center',
							marginRight: 20
						}}
						buttonStyle={{ height: 30, backgroundColor: '#fcb444' }}
					/>
					<Button
						onPress={() => this.setState({ showModal: true })}
						title="Refresh Map"
						containerStyle={{
							height: null,
							width: null,
							flex: 1,
							alignSelf: 'center'
						}}
						buttonStyle={{ height: 30, backgroundColor: '#fcb444' }}
						disabled={isFetching}
						disabledStyle={{ opacity: 0.5, backgroundColor: '#fcb444' }}
					/>
				</View>
				<ScrollView
					ref={(el) => (this.scrollviewRef = el)}
					style={styles.container}
					contentContainerStyle={styles.contentContainer}
					onScroll={({ nativeEvent }) => this.setState({ scrollPos: nativeEvent.contentOffset.y })}
				>
					<View
						ref={(el) => (this.viewRef = el)}
						onLayout={() => {
							if (this.viewRef) {
								this.viewRef.measure((x, y, width, height, pageX, pageY) => {
									this.setState({ scrollViewPos: pageY });
									// setScrollViewPos(pageY);
								});
							}
						}}
					>
						{meetups.map((item, index) => (
							<MeetupListCard
								key={index}
								meetup={item}
								selected={item.id === selected}
								handleCardSelect={this.handleCardSelect}
								scrollToCard={this.scrollToCard}
							/>
						))}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const HeaderRightComponent = (props) => {
	const [ isDisabled, setIsDisabled ] = useState(false);
	return (
		<View style={{ flex: 1, flexDirection: 'row' }}>
			<TouchableOpacity
				onPress={async () => {
					if (!isDisabled) {
						setIsDisabled(true);
						await props.handleRefreshBtn();
					}
					setTimeout(() => {
						setIsDisabled(false);
					}, 3000);
				}}
				disabled={isDisabled}
				style={{ opacity: isDisabled ? 0.2 : 1 }}
			>
				<View style={{ marginRight: 20 }}>{vectorIcon('FrontAwesome', 'refresh', 26)}</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={props.handleCreateBtn}>
				<View style={{ marginRight: 25 }}>{vectorIcon('Feather', 'plus-circle', 26)}</View>
			</TouchableOpacity>
		</View>
	);
};

const mapStateToProps = ({ others, meetups }) => ({
	currentLocation: others.currentLocation,
	meetups: meetups.meetups
});

const mapDispatchToProps = {
	fetchMeetups
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetup);

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
		isPrivate: true,
		userId: 12345,
		userName: 'Lewis Main',
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		joined: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		],
		likes: [ 12345, 54321 ],
		comments: [
			{
				id: 11111,
				description: 'comment one',
				userId: 54321,
				userName: 'Lewis main',
				userAvatar: null,
				createdAt: 154325223
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
			lon: -73.935242
		},
		isPrivate: false,
		userId: 12345,
		userName: 'Lewis Main',
		pending: [
			{
				id: 2,
				name: 'May',
				description: "Hi I'm May"
			}
		],
		joined: [
			{
				id: 3,
				name: 'Lewis Two',
				description: "Hi I'm Lewis Two"
			}
		],
		likes: [ 12345, 54321 ],
		comments: [
			{
				id: 11111,
				description: 'comment one',
				userId: 54321,
				userName: 'Lewis main',
				userAvatar: null,
				createdAt: 154325223
			}
		]
	}
];

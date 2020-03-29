import React, { Component, useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, SearchBar } from 'react-native-elements';
import MeetupListCard from '../../components/MeetupListCard';
import MapView, { Marker, Callout } from 'react-native-maps';
import dimensions from '../../constants/Layout';
import CitySearchModal from '../../components/CitySearchModal';
import { connect } from 'react-redux';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import _ from 'lodash';
import { fetchMeetups, fetchUserMeetups } from '../../redux/actions/meetups.actions';
import AdmobBanner from '../../components/AdmobBanner';
import { searchCity } from '../../helpers/GeoDBHelper';

const MAX_TITLE_LENGTH = 30;
const MAP_WIDTH = dimensions.window.width - 32;
const MAP_HEIGHT = 200;
const DEFAULT_SCROLLVIEW_POSITION = 30;
const LAT_DELTA = 0.13;
const LON_DELTA = 0.13;

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
		isFetching: false,
		citySearchTerm: '',
		citySearchResult: [],
		isCitySearching: false
	};
	markerRefs = {};
	scrollviewRef = null;
	viewRef = null;

	async componentDidMount() {
		const { navigation } = this.props;

		navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: this.onCreateBack,
			myMeetupBtn: this.myMeetupBtn
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
				myMeetupBtn={navigation.getParam('myMeetupBtn')}
			/>
		),
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	});

	myMeetupBtn = () => {
		const { userMeetups } = this.props;
		this.setState({ meetups: userMeetups });
	};

	handleRefreshBtn = async () => {
		const { centerLat, centerLon, lat_offset } = this.state;
		const { fetchMeetups, fetchUserMeetups, currentDBUser } = this.props;

		this.setState({ isFetching: true });

		fetchMeetups({
			lat: centerLat,
			lon: centerLon,
			offset: lat_offset
		})
			.then(() => {
				fetchUserMeetups(currentDBUser.id);
			})
			.then(() => {
				this.setState({ meetups: this.props.meetups, isFetching: false });
			});
	};

	onCreateBack = () => {
		this.handleRefreshBtn();
	};

	handleCitySearch = async () => {
		this.setState({ isCitySearching: true });
		const { citySearchTerm } = this.state;

		const result = await searchCity(citySearchTerm);

		this.setState({ showModal: true, citySearchResult: result });
		this.setState({ isCitySearching: false });
	};

	handleCitySelect = (city) => {
		this.mapRef.animateToRegion({
			latitude: city.latitude,
			longitude: city.longitude,
			latitudeDelta: LAT_DELTA,
			longitudeDelta: LON_DELTA
		});

		this.setState({
			showModal: false,
			centerLat: city.latitude,
			centerLon: city.longitude,
			lat_offset: LAT_DELTA,
			lon_offset: LON_DELTA
		});
	};

	handleMeetupInfoAction = (meetupId, actionType, reference) => {
		// 0: like, 1: cancel like, 2: add comment, 3: remove comment, 4: remove meetup
		// 5: autojoin, 6: join request, 7: accept, 8: reject, 9: cancel/leave
		const { meetups } = this.state;

		if (actionType < 0 || actionType > 9) {
			return;
		}

		let newMeetups = meetups;
		let targetIndex = _.findIndex(newMeetups, { id: meetupId });

		if (targetIndex === -1) {
			return;
		}

		switch (actionType) {
			case 4:
				_.remove(newMeetups, (m) => m.id === meetupId);
				break;
			default:
				newMeetups.splice(targetIndex, 1, reference);
				break;
		}

		this.setState({ meetups: newMeetups });
	};

	handleCardSelect = (item) => {
		this.props.navigation.navigate('MeetupInfo', {
			meetup: item,
			onCreateBack: this.onCreateBack,
			handleMeetupInfoAction: (meetupId, actionType, reference) =>
				this.handleMeetupInfoAction(meetupId, actionType, reference)
		});
	};

	handleMarkerSelect = (item) => {
		this.setState({
			selected: item.id,
			centerLat: item.latlon.lat,
			centerLon: item.latlon.lon
		});
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
		const {
			selected,
			showModal,
			lat_offset,
			lon_offset,
			meetups,
			isFetching,
			citySearchTerm,
			citySearchResult,
			isCitySearching
		} = this.state;

		if (!meetups) {
			return null;
		}

		if (this.props.navigation.getParam('myMeetups')) {
			const items = this.props.navigation.getParam('myMeetups');
			this.props.navigation.setParams({ myMeetups: undefined });
			this.setState({ meetups: items });
		}

		if (this.props.navigation.getParam('toSpecificMeetup')) {
			const item = this.props.navigation.getParam('toSpecificMeetup');
			this.props.navigation.setParams({ toSpecificMeetup: undefined });
			this.handleCardSelect(item);
		}

		return (
			<View style={styles.container}>
				<CitySearchModal
					showModal={showModal}
					closeModal={this.closeModal}
					searchTerm={citySearchTerm}
					searchResult={citySearchResult}
					handleCitySelect={(city) => this.handleCitySelect(city)}
				/>
				<MapView
					ref={(el) => (this.mapRef = el)}
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
					<SearchBar
						placeholder="Search City"
						onChangeText={(text) => this.setState({ citySearchTerm: text })}
						value={citySearchTerm}
						containerStyle={{
							alignSelf: 'stretch',
							flexGrow: 1,
							flex: 1,
							backgroundColor: '#f2ead5',
							padding: 0,
							borderRadius: 1,
							borderLeftWidth: 0,
							borderRightWidth: 0,
							borderBottomWidth: 0,
							borderTopWidth: 0,
							marginRight: 4,
							marginTop: 3,
							marginBottom: 2
						}}
						placeholderStyle={{ fontSize: 10 }}
						inputContainerStyle={{ alignSelf: 'stretch', backgroundColor: 'transparent', height: 20 }}
						inputStyle={{ fontSize: 14 }}
					/>
					<Button
						onPress={this.handleCitySearch}
						title="Search"
						titleStyle={{ fontSize: 12 }}
						containerStyle={{
							height: null,
							width: null,
							alignSelf: 'center',
							marginRight: 4
						}}
						buttonStyle={{ height: 30, backgroundColor: '#fcb444' }}
						disabled={isCitySearching}
					/>
					<Button
						onPress={this.handleRefreshBtn}
						title="Refresh"
						titleStyle={{ fontSize: 12 }}
						containerStyle={{
							height: null,
							width: null,
							alignSelf: 'center'
						}}
						buttonStyle={{ height: 30, backgroundColor: '#fcb444' }}
						disabled={isFetching}
						disabledStyle={{ opacity: 0.5, backgroundColor: '#fcb444' }}
					/>
				</View>
				<ScrollView
					ref={(el) => (this.scrollviewRef = el)}
					style={{
						flex: 1,
						backgroundColor: '#fff'
					}}
					onScroll={({ nativeEvent }) => this.setState({ scrollPos: nativeEvent.contentOffset.y })}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.handleRefreshBtn} />}
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
						style={{ paddingBottom: 2 }}
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
				<AdmobBanner />
			</View>
		);
	}
}

const HeaderRightComponent = (props) => {
	const [ isDisabled, setIsDisabled ] = useState(false);
	return (
		<View style={{ flex: 1, flexDirection: 'row' }}>
			<TouchableOpacity>
				<Button
					title="My Meetups"
					onPress={props.myMeetupBtn}
					type="outline"
					titleStyle={{ fontSize: 14 }}
					buttonStyle={{ paddingHorizontal: 10, paddingVertical: 4 }}
					containerStyle={{ marginRight: 10 }}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={async () => {
					if (!isDisabled) {
						setIsDisabled(true);
						await props.handleRefreshBtn();
					}
					setTimeout(() => {
						setIsDisabled(false);
					}, 1500);
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

const mapStateToProps = ({ others, meetups, auth }) => ({
	currentDBUser: auth.currentDBUser,
	currentLocation: others.currentLocation,
	meetups: meetups.meetups,
	userMeetups: meetups.userMeetups
});

const mapDispatchToProps = {
	fetchMeetups,
	fetchUserMeetups
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
		marginTop: 6
	},
	contentContainer: {}
});

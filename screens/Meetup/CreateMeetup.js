import React, { useEffect, useState, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	TextInput,
	Picker,
	Alert,
	TouchableOpacity
} from 'react-native';
import { Input, Button, Text, Divider, Avatar, SearchBar, CheckBox } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from '../../constants/Layout';
import * as Permissions from 'expo-permissions';
import { createMeetup, updateMeetup } from '../../Services/meetups';
import { connect } from 'react-redux';
import Config from '../../config';
import { fetchMeetups } from '../../redux/actions/meetups.actions';
import { AddressSearchModal } from '../../components/AddressSearchModal';
import MapView, { Marker } from 'react-native-maps';
import { searchAddress } from '../../helpers/HereAPIHelper';

const MAP_HEIGHT = 200;
const DEFAULT_SCROLLVIEW_POSITION = 30;
const LAT_DELTA = 0.07;
const LON_DELTA = 0.07;

const CreateMeetup = (props) => {
	const original = props.navigation.getParam('originalMeetup');

	const [ imageUri, setImageUri ] = useState(original ? original.attachment : null);
	const [ imageName, setImageName ] = useState(null);
	const [ imageType, setImageType ] = useState(null);
	const [ lat, setLat ] = useState(original ? original.latlon.lat : props.currentLocation.lat);
	const [ lon, setLon ] = useState(original ? original.latlon.lon : props.currentLocation.lon);
	const [ latDelta, setLatDelta ] = useState(LAT_DELTA);
	const [ lonDelta, setLonDelta ] = useState(LON_DELTA);
	const [ title, setTitle ] = useState(original ? original.title : '');
	const [ description, setDescription ] = useState(original ? original.description : '');
	const [ containerWidth, setContainerWidth ] = useState(350);
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ showModal, setShowModal ] = useState(false);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ searchResult, setSearchResult ] = useState([]);
	const [ isPrivate, setIsPrivate ] = useState(original ? original.isPrivate : false);

	const mapRef = useRef(null);
	const containerRef = useRef(null);

	const getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	const pickImage = async () => {
		getPermissionAsync();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [ 1, 1 ],
			quality: 0.6
		});

		if (!result.cancelled) {
			const nameArr = result.uri.split('/');
			const name = nameArr[nameArr.length - 1];
			const typeArr = name.split('.');
			const type = 'image/' + typeArr[typeArr.length - 1];

			setImageUri(result.uri);
			setImageName(name);
			setImageType(type);
		}
	};

	const handleSubmit = async () => {
		if (!title || !description) {
			Alert.alert(
				'Warning!',
				`Title and Description cannot be empty.`,
				[
					{
						text: 'OK',
						onPress: () => {
							return;
						}
					}
				],
				{
					cancelable: false
				}
			);

			return;
		}

		try {
			setIsSubmitting(true);
			if (imageName) {
				await uploadToS3(imageUri, imageType, imageName);
			}
			const body = {
				title,
				description,
				userId: props.currentDBUser.id,
				userName: props.currentDBUser.username,
				attachment: imageName ? `${Config.S3_BASE_URL}/${imageName}` : original ? original.attachment : null,
				isPrivate,
				latlon: {
					lat,
					lon
				}
			};

			if (original) {
				await updateMeetup(original.id, body);
			} else {
				await createMeetup(body);
			}

			Alert.alert(
				'Successful!',
				`Your meetup has been ${original ? 'updated' : 'created'}.`,
				[
					{
						text: 'OK',
						onPress: async () => {
							await handleAfterSubmit();
							setIsSubmitting(false);
						}
					}
				],
				{
					cancelable: false
				}
			);
		} catch (error) {
			console.log(error);
			alert('Something went wrong. Please try again.');
		}
	};

	const handleAfterSubmit = async () => {
		const handleBack = props.navigation.getParam('onCreateBack');
		handleBack();
		props.navigation.navigate('Meetup');
	};

	const handleAddressSearch = async () => {
		const res = await searchAddress(searchTerm);
		setSearchResult(res.items);
		setShowModal(true);
	};

	const closeModal = () => {
		setSearchResult([]);
		setShowModal(false);
	};

	const handleAddressSelect = (item) => {
		closeModal();
		setLat(item.position.lat);
		setLon(item.position.lng);
		if (mapRef.current) {
			mapRef.current.animateToRegion({
				latitude: item.position.lat,
				longitude: item.position.lng,
				latitudeDelta: latDelta,
				longitudeDelta: lonDelta
			});
		}
	};

	return (
		<View
			style={{
				padding: 20,
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				alignItems: 'stretch'
			}}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior="height"
				keyboardVerticalOffset={Constants.platform.ios ? Header.HEIGHT : Header.HEIGHT + 50}
			>
				<ScrollView contentContainerStyle={{}}>
					<View
						ref={containerRef}
						onLayout={() => {
							if (containerRef.current) {
								containerRef.current.measure((x, y, width, height, pageX, pageY) => {
									setContainerWidth(width);
								});
							}
						}}
					>
						<AddressSearchModal
							showModal={showModal}
							closeModal={closeModal}
							searchResult={searchResult}
							handleAddressSelect={handleAddressSelect}
						/>
						<View style={{ alignSelf: 'stretch' }}>
							<Input
								placeholder="Title"
								value={title}
								label="TITLE"
								labelStyle={{ fontSize: 12, marginBottom: 10 }}
								blurOnSubmit
								multiline
								numberOfLines={2}
								containerStyle={{
									paddingHorizontal: 20,
									paddingVertical: 10,
									borderWidth: 1,
									borderColor: 'grey'
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top' }}
								onChangeText={(text) => setTitle(text)}
							/>
						</View>
						<View style={{ marginVertical: 10, alignSelf: 'stretch' }}>
							<Input
								placeholder="Description"
								value={description}
								label="DESCRIPTION"
								labelStyle={{ fontSize: 12, marginBottom: 10 }}
								multiline
								returnKeyType="none"
								numberOfLines={5}
								containerStyle={{
									height: 180,
									paddingHorizontal: 20,
									paddingTop: 10,
									paddingBottom: 30,
									borderWidth: 1,
									borderColor: 'grey'
								}}
								inputContainerStyle={{
									borderBottomColor: 'transparent',
									borderBottomWidth: 0
								}}
								inputStyle={{ textAlignVertical: 'top' }}
								onChangeText={(text) => setDescription(text)}
							/>
						</View>
						<View style={{ flex: 1, flexDirection: 'column', alignSelf: 'stretch' }}>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									alignSelf: 'stretch'
								}}
							>
								<SearchBar
									placeholder="Search Address..."
									onChangeText={(text) => setSearchTerm(text)}
									value={searchTerm}
									inputContainerStyle={{ alignSelf: 'stretch' }}
									containerStyle={{
										alignSelf: 'stretch',
										flexGrow: 1,
										backgroundColor: '#f2ead5',
										padding: 0,
										borderRadius: 1,
										borderLeftWidth: 1,
										borderRightWidth: 0
									}}
									inputContainerStyle={{ backgroundColor: 'transparent' }}
								/>
								<Button
									onPress={handleAddressSearch}
									title="Search"
									buttonStyle={{
										backgroundColor: '#fcb444',
										borderTopWidth: 1,
										borderRightWidth: 1,
										borderBottomWidth: 1,
										borderColor: 'black'
									}}
								/>
							</View>
						</View>
						<MapView
							ref={mapRef}
							style={{
								width: containerWidth,
								height: MAP_HEIGHT,
								marginBottom: 10
							}}
							initialRegion={{
								latitude: original ? original.latlon.lat : props.currentLocation.lat,
								longitude: original ? original.latlon.lon : props.currentLocation.lon,
								latitudeDelta: latDelta,
								longitudeDelta: lonDelta
							}}
							onRegionChange={(region) => {
								setLat(region.latitude);
								setLon(region.longitude);
								setLatDelta(region.latitudeDelta);
								setLonDelta(region.longitudeDelta);
							}}
						>
							<Marker
								coordinate={{
									latitude: lat,
									longitude: lon
								}}
							/>
						</MapView>
						{imageUri && (
							<View style={{ marginBottom: 10, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
								<Image source={{ uri: imageUri }} style={{ width: '100%', height: containerWidth }} />
							</View>
						)}
						<View
							style={{
								marginBottom: 10,
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								alignSelf: 'stretch'
							}}
						>
							<CheckBox
								iconLeft
								left
								title="Require host approval to join this meetup"
								textStyle={{ fontSize: 14, fontWeight: 'bold' }}
								containerStyle={{
									flex: 1,
									borderWidth: 0,
									paddingVertical: 4,
									paddingHorizontal: 0,
									margin: 0,
									backgroundColor: 'transparent'
								}}
								checked={isPrivate}
								onPress={() => setIsPrivate(!isPrivate)}
							/>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingHorizontal: 15
							}}
						>
							<Button
								titleStyle={{ marginHorizontal: 25 }}
								title="Add Image"
								onPress={pickImage}
								disabled={isSubmitting}
							/>
							<Button
								titleStyle={{ paddingHorizontal: 25 }}
								title="Submit"
								onPress={handleSubmit}
								disabled={isSubmitting}
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

CreateMeetup.navigationOptions = (props) => {
	return {
		title: props.navigation.getParam('originalMeetup') ? 'Edit' : 'Create',
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	};
};

const mapStateToProps = ({ auth, others }) => ({
	currentDBUser: auth.currentDBUser,
	currentLocation: others.currentLocation
});

const mapDispatchToProps = {
	fetchMeetups
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetup);

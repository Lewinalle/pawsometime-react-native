import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Text, KeyboardAvoidingView } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUserGallery } from '../../redux/actions/gallery.actions';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import GalleryItem from '../../components/GalleryItem';
import AdmobBanner from '../../components/AdmobBanner';
import Colors from '../../constants/Colors';
import Constants from '../../constants/Layout';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const PAGE_SIZE = 2;

class Gallery extends Component {
	state = {
		photos: this.props.gallery,
		currentPage: 1,
		fetchPage: 1,
		isFetching: false,
		isLoadingMore: false,
		refreshToggle: false
	};
	flatListRef = null;

	async componentDidMount() {
		const { navigation, currentDBUser } = this.props;

		navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: this.onCreateBack,
			currentDBUser
		});
	}

	static navigationOptions = ({ navigation, screenProps }) => {
		return {
			headerShown: false
		};
	};

	handleRefreshBtn = async () => {
		const { currentDBUser, fetchUserGallery } = this.props;
		const { refreshToggle } = this.state;

		this.setState({ isFetching: true });

		fetchUserGallery(currentDBUser.id, 0).then(() =>
			this.setState({ photos: this.props.gallery, isFetching: false, refreshToggle: !refreshToggle })
		);

		if (this.flatListRef) {
			this.flatListRef.scrollToOffset({ animated: true, y: 0 });
		}
	};

	onCreateBack = async () => {
		this.handleRefreshBtn();
	};

	toEditPage = (item) => {
		Alert.alert(
			'Edit',
			'Are you sure you want to edit this post?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						this.props.navigation.navigate('CreateGallery', {
							originalGallery: item,
							onCreateBack: this.onCreateBack
						});
					}
				},
				{
					text: 'No'
				}
			],
			{ cancelable: false }
		);
	};

	handleOnEndReached = async () => {
		const { fetchUserGallery, currentDBUser } = this.props;
		const { currentPage, fetchPage } = this.state;

		this.setState({ isLoadingMore: true });

		if (
			currentPage * PAGE_SIZE >= Config.DEFAULT_DATA_SIZE &&
			(currentPage * PAGE_SIZE) % Config.DEFAULT_DATA_SIZE === 0
		) {
			await fetchUserGallery(currentDBUser.id, 0, { page: fetchPage + 1 });

			this.setState({ fetchPage: fetchPage + 1 });
		}

		// this.setState({ currentPage: this.state.currentPage + 1 });

		this.setState({ isLoadingMore: false, currentPage: this.state.currentPage + 1 });
	};

	render() {
		const { photos, isLoadingMore, currentPage, refreshToggle, isFetching } = this.state;
		const { currentDBUser } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						paddingLeft: 14,
						paddingRight: 0,
						marginTop: 49,
						maxHeight: 50,
						minHeight: 50,
						justifyContent: 'space-between'
					}}
				>
					<View style={{ top: 2 }}>{vectorIcon('Ionicons', 'md-photos', 30, Colors.primaryColor)}</View>
					<View style={{}}>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
								{this.props.currentDBUser.username}'s Gallery
							</Text>
						</View>
					</View>
					<View style={{}}>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-end'
							}}
						>
							<TouchableOpacity
								onPress={this.handleRefreshBtn}
								disabled={isFetching}
								style={{ opacity: isFetching ? 0.2 : 1 }}
							>
								<View style={{ marginRight: 20 }}>{vectorIcon('FrontAwesome', 'refresh', 26)}</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this.props.navigation.navigate('CreateGallery', {
										onCreateBack: this.onCreateBack
									});
								}}
							>
								<View style={{ marginRight: 25 }}>{vectorIcon('Feather', 'plus-circle', 26)}</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<Divider style={{ marginBottom: 10, height: 1.5, backgroundColor: Colors.primaryColor }} />
				<FlatList
					ref={(ref) => (this.flatListRef = ref)}
					style={{}}
					bounces={false}
					data={photos.slice(0, currentPage * PAGE_SIZE)}
					extraData={refreshToggle}
					numColumns={1}
					keyExtrator={(item) => {
						return `key-${item.id}`;
					}}
					renderItem={(item) => {
						return (
							<GalleryItem
								item={item.item}
								itemUser={currentDBUser}
								isFirst={item.index === 0}
								refresh={this.handleRefreshBtn}
								navigation={this.props.navigation}
								toEditPage={this.toEditPage}
								refreshToggle={refreshToggle}
							/>
						);
					}}
					onEndReached={({ distanceFromEnd }) => {
						if (photos.length > currentPage * PAGE_SIZE) {
							this.handleOnEndReached();
						}
					}}
					onEndReachedThreshold={0.01}
					scrollEventThrottle={700}
					onRefresh={this.handleRefreshBtn}
					refreshing={isFetching || isLoadingMore}
				/>
				<KeyboardSpacer topSpacing={-45} />
				<AdmobBanner />
			</View>
		);
	}
}

const mapStateToProps = ({ auth, gallery }) => ({
	currentDBUser: auth.currentDBUser,
	gallery: gallery.gallery
});

const mapDispatchToProps = {
	fetchUserGallery
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

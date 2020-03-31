import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Text } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUserGallery } from '../../redux/actions/gallery.actions';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import GalleryItem from '../../components/GalleryItem';
import Colors from '../../constants/Colors';

const PAGE_SIZE = 10;

class UserGallery extends Component {
	state = {
		photos: this.props.userGallery,
		currentPage: 1,
		fetchPage: 1,
		isFetching: false,
		isLoadingMore: false,
		galleryUser: this.props.navigation.getParam('galleryUser')
	};
	flatListRef = null;

	async componentDidMount() {
		const { navigation, currentDBUser } = this.props;

		const galleryUser = navigation.getParam('galleryUser');

		navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: this.onCreateBack,
			currentDBUser,
			galleryUser
		});
	}

	static navigationOptions = ({ navigation, screenProps }) => {
		return {
			headerShown: false
		};
	};

	handleRefreshBtn = async () => {
		const { fetchUserGallery } = this.props;
		const { galleryUser } = this.state;

		this.setState({ isFetching: true });

		await fetchUserGallery(galleryUser.id, 1);

		if (this.flatListRef) {
			this.flatListRef.scrollToOffset({ animated: true, y: 0 });
		}

		this.setState({ photos: this.props.userGallery });

		this.setState({ isFetching: false });
	};

	onCreateBack = async () => {
		this.handleRefreshBtn();
	};

	handleOnEndReached = async () => {
		const { fetchUserGallery } = this.props;
		const { currentPage, fetchPage, galleryUser } = this.state;

		this.setState({ isLoadingMore: true });

		if (
			currentPage * PAGE_SIZE >= Config.DEFAULT_DATA_SIZE &&
			(currentPage * PAGE_SIZE) % Config.DEFAULT_DATA_SIZE === 0
		) {
			await fetchUserGallery(galleryUser.id, 1, { page: fetchPage + 1 });

			this.setState({ fetchPage: fetchPage + 1 });
		}

		// this.setState({ currentPage: this.state.currentPage + 1 });

		this.setState({ isLoadingMore: false, currentPage: this.state.currentPage + 1 });
	};

	render() {
		const { photos, isLoadingMore, currentPage, galleryUser, isFetching } = this.state;

		if (!galleryUser && this.props.navigation.getParam('galleryUser')) {
			this.setState({ galleryUser: navigation.getParam('galleryUser') });
		}

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
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<View style={{ top: 2, paddingRight: 34 }}>
							{vectorIcon('Ionicons', 'ios-arrow-back', 40, Colors.primaryColor)}
						</View>
					</TouchableOpacity>
					<View style={{}}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
								{galleryUser.username}'s Gallery
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
						</View>
					</View>
				</View>
				<Divider style={{ marginBottom: 10, height: 1.5, backgroundColor: Colors.primaryColor }} />
				<FlatList
					ref={(ref) => (this.flatListRef = ref)}
					style={{}}
					data={photos.slice(0, currentPage * PAGE_SIZE)}
					numColumns={1}
					keyExtrator={(item) => {
						return `key-${item.id}`;
					}}
					renderItem={(item) => {
						return (
							<GalleryItem
								item={item.item}
								itemUser={galleryUser}
								isFirst={item.index === 0}
								refresh={this.handleRefreshBtn}
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
			</View>
		);
	}
}

const mapStateToProps = ({ auth, gallery }) => ({
	currentDBUser: auth.currentDBUser,
	userGallery: gallery.userGallery
});

const mapDispatchToProps = {
	fetchUserGallery
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGallery);

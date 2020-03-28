import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserGallery } from '../../redux/actions/gallery.actions';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import GalleryItem from '../../components/GalleryItem';

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
			title: navigation.getParam('galleryUser') ? navigation.getParam('galleryUser').username : '',
			headerRight: (
				<HeaderRightComponent
					handleRefreshBtn={navigation.getParam('refresh')}
					handleCreateBtn={() => {
						navigation.navigate('CreateGallery', {
							onCreateBack: navigation.getParam('onCreateBack')
						});
					}}
				/>
			),
			headerStyle: { backgroundColor: 'brown' },
			headerTitleStyle: { color: 'blue' }
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

		setTimeout(() => {
			this.setState({ isFetching: false });
		}, 1500);
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

		setTimeout(() => {
			this.setState({ isLoadingMore: false, currentPage: this.state.currentPage + 1 });
		}, 1000);
	};

	render() {
		const { photos, isLoadingMore, currentPage, galleryUser, isFetching } = this.state;

		if (!galleryUser && this.props.navigation.getParam('galleryUser')) {
			this.setState({ galleryUser: navigation.getParam('galleryUser') });
		}

		return (
			<View style={{ flex: 1 }}>
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
					}, 1500);
				}}
				disabled={isDisabled}
				style={{ opacity: isDisabled ? 0.2 : 1 }}
			>
				<View style={{ marginRight: 20 }}>{vectorIcon('FrontAwesome', 'refresh', 26)}</View>
			</TouchableOpacity>
		</View>
	);
};
const mapStateToProps = ({ auth, gallery }) => ({
	currentDBUser: auth.currentDBUser,
	userGallery: gallery.userGallery
});

const mapDispatchToProps = {
	fetchUserGallery
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGallery);

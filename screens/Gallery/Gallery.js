import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserGallery } from '../../redux/actions/gallery.actions';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import GalleryItem from '../../components/GalleryItem';

const PAGE_SIZE = 10;

class Gallery extends Component {
	state = {
		photos: this.props.gallery,
		currentPage: 1,
		fetchPage: 1,
		isFetching: false,
		isLoadingMore: false
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
			title: navigation.getParam('currentDBUser') ? navigation.getParam('currentDBUser').username : '',
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
		const { currentDBUser, fetchUserGallery } = this.props;

		this.setState({ isFetching: true });

		await fetchUserGallery(currentDBUser.id, 0);

		if (this.flatListRef) {
			this.flatListRef.scrollToOffset({ animated: true, y: 0 });
		}

		this.setState({ photos: this.props.gallery });

		setTimeout(() => {
			this.setState({ isFetching: false });
		}, 1500);
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

		setTimeout(() => {
			this.setState({ isLoadingMore: false, currentPage: this.state.currentPage + 1 });
		}, 1000);
	};

	render() {
		const { photos, isLoadingMore, currentPage } = this.state;
		const { currentDBUser } = this.props;

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
								itemUser={currentDBUser}
								isFirst={item.index === 0}
								refresh={this.handleRefreshBtn}
								navigation={this.props.navigation}
								toEditPage={this.toEditPage}
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
				/>
				{isLoadingMore && (
					<View style={{ backgroundColor: '#a3a096' }}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				)}
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
			<TouchableOpacity onPress={props.handleCreateBtn}>
				<View style={{ marginRight: 25 }}>{vectorIcon('Feather', 'plus-circle', 26)}</View>
			</TouchableOpacity>
		</View>
	);
};
const mapStateToProps = ({ auth, gallery }) => ({
	currentDBUser: auth.currentDBUser,
	gallery: gallery.gallery
});

const mapDispatchToProps = {
	fetchUserGallery
};

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);

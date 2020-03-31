import React, { Component, useState, useEffect } from 'react';
import {
	ScrollView,
	FlatList,
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
	AsyncStorage
} from 'react-native';
import { SearchBar, ButtonGroup, Button, Text, Divider } from 'react-native-elements';
import { BoardListItem } from '../../components/BoardListItem';
import { BoardSearch } from '../../components/BoardSearch';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPosts, fetchUserPosts } from '../../redux/actions/posts.actions';
import { fetchPostsHelper, fetchUserPostsHelper } from '../../Utils/FetchPostsHelper';
import AdmobBanner from '../../components/AdmobBanner';
import Colors from '../../constants/Colors';

const PAGE_SIZE = 5;
const boardTabs = [ 'General', 'Questions', 'Tips', 'Trade' ];
const boardTypes = [ 'general', 'qna', 'tips', 'trade' ];

class Board extends Component {
	state = { isFetching: false };

	componentDidMount() {
		this.setState({
			currentPage: 1,
			currentTab: 0,
			isFetching: false,
			posts: this.props.generalPosts,
			types: {
				general: 1,
				qna: 1,
				tips: 1,
				trade: 1
			},
			searchTerm: '',
			currentMenu: 0
		});

		this.props.navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: (type) => this.onCreateBack(type),
			myPostsBtn: this.myPostsBtn
		});
	}

	myPostsBtn = () => {
		const { userGeneralPosts = [], userQuestionPosts = [], userTipPosts = [], userTradePosts = [] } = this.props;
		const { currentTab } = this.state;

		switch (currentTab) {
			case 0:
				this.setState({ posts: userGeneralPosts });
				break;
			case 1:
				this.setState({ posts: userQuestionPosts });
				break;
			case 2:
				this.setState({ posts: userTipPosts });
				break;
			case 3:
				this.setState({ posts: userTradePosts });
				break;
		}
	};

	boardBtn = () => {
		const { generalPosts = [], questionPosts = [], tipPosts = [], tradePosts = [] } = this.props;
		const { currentTab } = this.state;

		switch (currentTab) {
			case 0:
				this.setState({ posts: generalPosts });
				break;
			case 1:
				this.setState({ posts: questionPosts });
				break;
			case 2:
				this.setState({ posts: tipPosts });
				break;
			case 3:
				this.setState({ posts: tradePosts });
				break;
		}
	};

	onCreateBack(type) {
		this.handleTabPress(boardTypes.findIndex((val) => val === type));
	}

	toPostInfo(clickedPost) {
		const { navigation } = this.props;
		navigation.navigate('PostInfo', {
			post: clickedPost,
			postType: boardTypes[this.state.currentTab],
			onCreateBack: (type) => this.onCreateBack(type),
			handlePostInfoAction: (postId, actionType, reference) =>
				this.handlePostInfoAction(postId, actionType, reference)
		});
	}

	handlePostInfoAction(postId, actionType, reference) {
		// 0: like, 1: cancel like, 2: add comment, 3: remove comment, 4: remove post
		const { posts } = this.state;

		if (actionType < 0 || actionType > 4) {
			return;
		}

		let newPosts = posts;
		let targetIndex = _.findIndex(newPosts, { id: postId });

		if (targetIndex === -1) {
			return;
		}

		switch (actionType) {
			case 0:
			case 1:
			case 2:
			case 3:
				newPosts.splice(targetIndex, 1, reference);
				break;
			case 4:
				_.remove(newPosts, (p) => p.id === postId);
				break;
		}

		this.setState({ posts: newPosts });
	}

	async handleTabPress(i) {
		const { fetchPosts, fetchUserPosts, currentDBUser } = this.props;

		this.setState({ currentTab: i, currentPage: 1 });

		await fetchPostsHelper(fetchPosts, { type: i });
		await fetchUserPostsHelper(fetchUserPosts, currentDBUser.id, { type: i });

		this.resetList();
	}

	resetList() {
		const { generalPosts = [], questionPosts = [], tipPosts = [], tradePosts = [] } = this.props;
		const { currentTab } = this.state;

		switch (currentTab) {
			case 0:
				this.setState({ posts: generalPosts });
				return;
			case 1:
				this.setState({ posts: questionPosts });
				return;
			case 2:
				this.setState({ posts: tipPosts });
				return;
			case 3:
				this.setState({ posts: tradePosts });
				return;
		}
	}

	onSearchTermChange = (text) => {
		this.setState({ searchTerm: text });
	};

	handleSearchSubmit = (searchObj) => {
		const { generalPosts = [], questionPosts = [], tipPosts = [], tradePosts = [] } = this.props;
		const { currentTab } = this.state;

		if (Object.keys(searchObj).length === 0 && searchObj.constructor === Object) {
			this.resetList();
			return;
		}

		let newList = [];
		switch (currentTab) {
			case 0:
				newList = generalPosts;
				break;
			case 1:
				newList = questionPosts;
				break;
			case 2:
				newList = tipPosts;
				break;
			case 3:
				newList = tradePosts;
				break;
		}

		newList = newList.filter((p) => {
			let found = 0;
			_.forIn(searchObj, function(value, key) {
				if (_.includes(p[key].toLowerCase(), value.toLowerCase())) {
					found |= 1;
				} else {
					found |= 0;
				}
			});
			return found;
		});

		this.setState({ posts: newList });
	};

	async handleOnEndReached(distanceFromEnd) {
		const { fetchPosts } = this.props;
		const { currentTab, currentPage, types } = this.state;

		this.setState({ isFetching: true });

		if (true) {
			await fetchPostsHelper(fetchPosts, { type: currentTab, page: types[boardTypes[currentTab]] + 1 });
			let newTypes = types;
			newTypes[boardTypes[currentTab]]++;

			console.log('current data name and page: ', boardTypes[currentTab], newTypes[boardTypes[currentTab]]);

			this.setState({ types: newTypes });
		}

		this.setState({ currentPage: this.state.currentPage + 1 });

		this.setState({ isFetching: false });
	}

	handleRefreshBtn = async () => {
		const { fetchPosts } = this.props;
		const { currentTab } = this.state;

		this.setState({ isFetching: true, currentMenu: 0 });

		if (this.flatListRef) {
			this.flatListRef.scrollToOffset({ animated: true, y: 0 });
		}

		this.setState({ currentPage: 1, searchTerm: '' });

		await AsyncStorage.removeItem(`getPosts-${boardTypes[currentTab]}`);
		fetchPostsHelper(fetchPosts, { type: currentTab }).then(() => this.setState({ isFetching: false }));

		this.handleSearchSubmit({});
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		headerShown: false
	});

	render() {
		const { currentTab = 0, currentPage = 1, posts = [], searchTerm = '', isFetching, currentMenu } = this.state;

		if (this.props.navigation.getParam('toSpecificPost')) {
			const item = this.props.navigation.getParam('toSpecificPost');
			const type = this.props.navigation.getParam('postType');
			this.props.navigation.setParams({ toSpecificPost: undefined, postType: undefined });
			this.handleTabPress(type);
			this.toPostInfo(item);
		}

		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						marginTop: 49,
						alignItems: 'center',
						paddingLeft: 14,
						paddingRight: 0,
						maxHeight: 50,
						justifyContent: 'space-between'
					}}
				>
					<View style={{ top: 2 }}>{vectorIcon('Entypo', 'blackboard', 28, Colors.primaryColor)}</View>
					<View style={{}}>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
							<TouchableOpacity
								onPress={() => {
									this.boardBtn();
									this.setState({ currentMenu: 0 });
								}}
							>
								<View style={{ marginRight: 25 }}>
									<Text
										style={{
											color: currentMenu === 0 ? 'black' : '#b3bab5',
											fontWeight: currentMenu === 0 ? 'bold' : '500',
											fontSize: 20
										}}
									>
										Board
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this.myPostsBtn();
									this.setState({ currentMenu: 1 });
								}}
							>
								<View>
									<Text
										style={{
											color: currentMenu === 1 ? 'black' : '#b3bab5',
											fontWeight: currentMenu === 1 ? 'bold' : '500',
											fontSize: 20
										}}
									>
										My Posts
									</Text>
								</View>
							</TouchableOpacity>
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
									this.props.navigation.navigate('CreatePost', {
										onCreateBack: this.onCreateBack
									});
								}}
							>
								<View style={{ marginRight: 25 }}>{vectorIcon('Feather', 'plus-circle', 26)}</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<Divider style={{ height: 1.5, backgroundColor: Colors.primaryColor }} />
				<View style={styles.container}>
					<View style={{}}>
						<ButtonGroup
							onPress={(i) => this.handleTabPress(i)}
							selectedIndex={currentTab}
							buttons={boardTabs}
							containerStyle={{
								height: 40,
								minWidth: 250,
								marginTop: 0,
								marginBottom: 0,
								marginLeft: 0,
								marginRight: 0,
								borderWidth: 0
							}}
							textStyle={{ fontSize: 14 }}
							selectedButtonStyle={{ backgroundColor: Colors.primaryColor }}
						/>
					</View>
					<View style={{ marginTop: 10 }}>
						<BoardSearch
							handleSearchSubmit={this.handleSearchSubmit}
							onValueChange={this.onSearchTermChange}
							value={searchTerm}
						/>
					</View>
					<FlatList
						ref={(ref) => (this.flatListRef = ref)}
						style={{ marginTop: 35, marginBottom: 12 }}
						data={posts.slice(0, currentPage * PAGE_SIZE)}
						numColumns={1}
						keyExtrator={(item) => {
							return `key-${item.id}`;
						}}
						renderItem={(item) => {
							return (
								<BoardListItem
									post={item.item}
									isFirst={item.index === 0}
									handlePostClick={(post) => this.toPostInfo(post)}
								/>
							);
						}}
						onEndReached={({ distanceFromEnd }) => {
							if (posts.length > this.state.currentPage * PAGE_SIZE) {
								this.handleOnEndReached(distanceFromEnd);
							}
						}}
						onEndReachedThreshold={0.01}
						scrollEventThrottle={700}
						onRefresh={this.handleRefreshBtn}
						refreshing={isFetching}
					/>
				</View>
				<AdmobBanner />
			</View>
		);
	}
}

const mapStateToProps = ({ auth, posts }) => ({
	currentDBUser: auth.currentDBUser,
	generalPosts: posts.generalPosts,
	questionPosts: posts.questionPosts,
	tipPosts: posts.tipPosts,
	tradePosts: posts.tradePosts,
	userGeneralPosts: posts.userGeneralPosts,
	userQuestionPosts: posts.userQuestionPosts,
	userTipPosts: posts.userTipPosts,
	userTradePosts: posts.userTradePosts
});

const mapDispatchToProps = {
	fetchPosts,
	fetchUserPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 10,
		marginHorizontal: 10,
		marginBottom: 2
	}
});

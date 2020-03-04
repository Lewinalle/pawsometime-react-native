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
import { SearchBar, ButtonGroup, Button, Text } from 'react-native-elements';
import { BoardListItem } from '../../components/BoardListItem';
import { BoardSearch } from '../../components/BoardSearch';
import { vectorIcon } from '../../Utils/Icon';
import Config from '../../config';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPosts } from '../../redux/actions/posts.actions';
import { fetchPostsHelper } from '../../Utils/FetchPostsHelper';
import { test } from '../../redux/actions/test.actions';

const PAGE_SIZE = 10;
const boardTabs = [ 'General', 'Questions', 'Tips', 'Trade' ];
const boardTypes = [ 'general', 'qna', 'tips', 'trade' ];

class Board extends Component {
	state = {};

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
			searchTerm: ''
		});

		this.props.navigation.setParams({
			refresh: this.handleRefreshBtn,
			onCreateBack: (type) => this.onCreateBack(type)
		});
	}

	onCreateBack(type) {
		this.handleTabPress(boardTypes.findIndex((val) => val === type));
	}

	toPostInfo(clickedPost) {
		const { navigation } = this.props;
		navigation.navigate('PostInfo', {
			post: clickedPost,
			postType: boardTypes[this.state.currentTab],
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
		const { fetchPosts } = this.props;

		this.setState({ currentTab: i, currentPage: 1 });

		await fetchPostsHelper(fetchPosts, { type: i });

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
		console.log(text);
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
				console.log('key searching: ' + key, p[key].toLowerCase(), value.toLowerCase());
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

		if (
			currentPage * PAGE_SIZE >= Config.DEFAULT_DATA_SIZE &&
			(currentPage * PAGE_SIZE) % Config.DEFAULT_DATA_SIZE === 0
		) {
			await fetchPostsHelper(fetchPosts, { type: currentTab, page: types[boardTypes[currentTab]] + 1 });
			let newTypes = types;
			newTypes[boardTypes[currentTab]]++;

			console.log('current data name and page: ', boardTypes[currentTab], newTypes[boardTypes[currentTab]]);

			this.setState({ types: newTypes });
		}

		this.setState({ currentPage: this.state.currentPage + 1 });

		setTimeout(() => {
			this.setState({ isFetching: false });
		}, 2500);
	}

	handleRefreshBtn = async () => {
		const { fetchPosts } = this.props;
		const { currentTab } = this.state;

		if (this.flatListRef) {
			this.flatListRef.scrollToOffset({ animated: true, y: 0 });
		}

		this.setState({ currentPage: 1, searchTerm: '' });

		await AsyncStorage.removeItem(`getPosts-${boardTypes[currentTab]}`);
		await fetchPostsHelper(fetchPosts, { type: currentTab });

		this.handleSearchSubmit({});
	};

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'test',
		headerRight: (
			<HeaderRightComponent
				handleRefreshBtn={navigation.getParam('refresh')}
				handleCreateBtn={() => {
					navigation.navigate('CreatePost', { onCreateBack: navigation.getParam('onCreateBack') });
				}}
			/>
		),
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	});

	render() {
		const { currentTab = 0, currentPage = 1, posts = [], searchTerm = '' } = this.state;

		return (
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
						textStyle={{ fontSize: 12 }}
						selectedButtonStyle={{ backgroundColor: 'grey' }}
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
					style={{ marginTop: 35 }}
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
						console.log('end reached! loading more!');
						if (posts.length > this.state.currentPage * PAGE_SIZE) {
							this.handleOnEndReached(distanceFromEnd);
						}
					}}
					onEndReachedThreshold={0.01}
					scrollEventThrottle={700}
				/>
				{this.state.isFetching && (
					<View>
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
					}, 3500);
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

const mapStateToProps = ({ posts, test }) => ({
	generalPosts: posts.generalPosts,
	questionPosts: posts.questionPosts,
	tipPosts: posts.tipPosts,
	tradePosts: posts.tradePosts,
	text: test.text
});

const mapDispatchToProps = {
	fetchPosts,
	test
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 10,
		marginBottom: 5,
		marginHorizontal: 10
	}
});

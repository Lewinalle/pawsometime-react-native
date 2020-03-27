import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking, RefreshControl } from 'react-native';
import { Input, Button, ListItem, Card, Divider, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchNews } from '../redux/actions/others.actions';
import CacheImage from './CacheImage';
import Constants from '../constants/Layout';
import { TouchableOpacity } from 'react-native-gesture-handler';

const STACKSIZE = 6;
const NEWS_TYPES = [ 'dogs', 'cats', 'pets' ];

const NewsList = (props) => {
	const { newsLastFetched } = props;
	const [ news, setNews ] = useState(props.news.dogs);
	const [ currentType, setCurrentType ] = useState(0);
	const [ currentStack, setCurrentStack ] = useState(1);
	const [ showLoadMore, setShowLoadMore ] = useState(true);
	const [ isFetching, setIsFetching ] = useState(false);

	useEffect(
		() => {
			setNews(props.news[NEWS_TYPES[currentType]]);
		},
		[ props.newsLastFetched, props.news.dogs, props.news.cats, props.news.pets ]
	);

	const loadMore = async () => {
		const newCurrentStack = currentStack + 1;
		setCurrentStack(newCurrentStack);
		setShowLoadMore(news.length > newCurrentStack * STACKSIZE);
	};

	const resetStack = () => {
		setCurrentStack(1);
	};

	const handleTypeChange = (i) => {
		resetStack();
		setCurrentType(i);
		setShowLoadMore(true);
		setNews(props.news[NEWS_TYPES[i]]);
	};

	const refresh = async () => {
		setIsFetching(true);

		// actual refresh allowed once per day
		if (new Date() - newsLastFetched >= 1000 * 3600 * 24) {
			await props.fetchNews();
			setNews(props.news[NEWS_TYPES[currentType]]);
		}

		resetStack();
		setShowLoadMore(true);
		setIsFetching(false);
	};

	if (news.length === 0 && props.news.dogs.length > 0) {
		setNews(props.news.dogs);
	}

	return (
		<View style={{ flex: 1 }}>
			<ButtonGroup
				style={{ flex: 1 }}
				containerStyle={{ marginTop: 0 }}
				onPress={handleTypeChange}
				selectedIndex={currentType}
				buttons={NEWS_TYPES}
			/>
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refresh} />}
			>
				<View>
					{news.slice(0, STACKSIZE * currentStack).map((item, index) => {
						const date = item.publishedAt.split(' ')[0];
						return (
							<Card key={index} containerStyle={{ padding: 0, marginTop: 0, marginBottom: 4 }}>
								<TouchableOpacity onPress={() => Linking.openURL(item.link)}>
									<View style={{}}>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<View style={{ alignSelf: 'center' }}>
												<CacheImage uri={item.image} style={{ width: 80, height: 80 }} />
											</View>
											<View style={{ flex: 1, paddingLeft: 6 }}>
												<View
													style={{
														flex: 1,
														flexDirection: 'row',
														justifyContent: 'space-between',
														paddingRight: 5,
														height: 10
													}}
												>
													<Text
														style={{ fontSize: 10, maxWidth: Constants.window.width - 168 }}
														numberOfLines={1}
													>
														{item.sourceInfo.name}
													</Text>
													<Text style={{ fontSize: 10 }}>{date}</Text>
												</View>
												<View style={{ flex: 1 }}>
													<Text
														numberOfLines={3}
														style={{ fontSize: 16, fontWeight: 'bold' }}
													>
														{item.title}
													</Text>
												</View>
											</View>
										</View>
										<Divider />
									</View>
								</TouchableOpacity>
							</Card>
						);
					})}
					{showLoadMore && (
						<TouchableOpacity onPress={loadMore} style={{ marginBottom: 6 }}>
							<View
								style={{
									marginHorizontal: 14,
									padding: 4,
									borderWidth: 0.5,
									borderRadius: 25,
									backgroundColor: '#f7da9c'
								}}
							>
								<Text style={{ fontSize: 14, textAlign: 'center' }}>LOAD MORE</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = ({ auth, others }) => ({
	news: others.news,
	newsLastFetched: others.newsLastFetched,
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = { fetchNews };

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);

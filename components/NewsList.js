import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Linking, RefreshControl } from 'react-native';
import { Input, Button, ListItem, Card, Divider, ButtonGroup, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchNews } from '../redux/actions/others.actions';
import CacheImage from './CacheImage';
import Constants from '../constants/Layout';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

const STACKSIZE = 4;
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
			{/* <View
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					maxHeight: 55,
					paddingHorizontal: 15,
					marginBottom: 10
				}}
			>
				<TouchableOpacity onPress={() => handleTypeChange(0)}>
					<View style={{ marginRight: 14 }}>
						<Text
							style={{
								color: currentType === 0 ? Colors.primaryColor : '#b3bab5',
								fontWeight: currentType === 0 ? 'bold' : '500',
								fontSize: 20,
								marginRight: 14
							}}
						>
							Dog
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handleTypeChange(1)}>
					<View style={{ marginRight: 14 }}>
						<Text
							style={{
								color: currentType === 1 ? Colors.primaryColor : '#b3bab5',
								fontWeight: currentType === 1 ? 'bold' : '500',
								fontSize: 20,
								marginRight: 14
							}}
						>
							Cat
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handleTypeChange(2)}>
					<View style={{ marginRight: 14 }}>
						<Text
							style={{
								color: currentType === 2 ? Colors.primaryColor : '#b3bab5',
								fontWeight: currentType === 2 ? 'bold' : '500',
								fontSize: 20,
								marginRight: 14
							}}
						>
							Pet
						</Text>
					</View>
				</TouchableOpacity>
			</View> */}
			<ButtonGroup
				onPress={handleTypeChange}
				selectedIndex={currentType}
				buttons={NEWS_TYPES}
				containerStyle={{
					height: 40,
					minWidth: 250,
					marginTop: 10,
					marginBottom: 20,
					marginLeft: 10,
					marginRight: 10,
					borderWidth: 0
				}}
				textStyle={{ fontSize: 15 }}
				selectedButtonStyle={{ backgroundColor: Colors.primaryColor }}
			/>
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refresh} />}
			>
				<View>
					{news.slice(0, STACKSIZE * currentStack).map((item, index) => {
						const date = item.publishedAt.split(' ')[0];
						return (
							<View key={index}>
								<Card
									key={index}
									containerStyle={{
										elevation: 0,
										paddingTop: index !== 0 ? 20 : 0,
										paddingBottom: 8,
										paddingHorizontal: 14,
										margin: 0,
										borderWidth: 0
									}}
								>
									<TouchableOpacity onPress={() => Linking.openURL(item.link)}>
										<View style={{}}>
											<View style={{ flex: 1, flexDirection: 'row' }}>
												<View style={{ alignSelf: 'center' }}>
													<CacheImage uri={item.image} style={{ width: 100, height: 100 }} />
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
															style={{
																fontSize: 10,
																maxWidth: Constants.window.width - 168
															}}
															numberOfLines={1}
														>
															{item.sourceInfo.name}
														</Text>
														<Text style={{ fontSize: 10 }}>{date}</Text>
													</View>
													<View style={{ flex: 1 }}>
														<Text
															numberOfLines={3}
															style={{ fontSize: 14, fontWeight: '500' }}
														>
															{item.title}
														</Text>
													</View>
												</View>
											</View>
										</View>
									</TouchableOpacity>
								</Card>
								<Divider style={{ height: 2, backgroundColor: '#f7f7f7' }} />
							</View>
						);
					})}
					{showLoadMore && (
						<TouchableOpacity onPress={loadMore} style={{ marginTop: 20, marginBottom: 6 }}>
							<View
								style={{
									flex: 1,
									alignSelf: 'center'
								}}
							>
								<Image
									source={require('../assets/images/home-news-loadmore.png')}
									style={{ width: 80, height: 40 }}
								/>
								<Text style={{ fontSize: 12, textAlign: 'center', color: '#787a79' }}>Load More</Text>
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

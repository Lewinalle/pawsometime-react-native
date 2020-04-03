import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { SearchBar, Text, Card, Button, Image, Divider } from 'react-native-elements';
import UserInfoModal from '../../components/UserInfoModal';
import { getUsers } from '../../Services/users';
import CacheImage from '../../components/CacheImage';
import Colors from '../../constants/Colors';

const SearchUsers = (props) => {
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ modalOpenId, setModalOpenId ] = useState(null);
	const [ users, setUsers ] = useState([]);
	const [ allUsers, setAllUsers ] = useState([]);
	const [ isFetching, setIsFetching ] = useState(false);

	useEffect(() => {
		const fetchFriends = async () => {
			setIsFetching(true);

			setIsFetching(false);
		};

		fetchFriends();
	}, []);

	const closeModal = () => {
		setModalOpenId(null);
	};

	const handleSearch = (text) => {
		setSearchTerm(text);
	};

	const handleSearchSubmit = async () => {
		if (isFetching) {
			return;
		}

		if (searchTerm.length < 3) {
			Alert.alert(
				'Too Short',
				'Please type at least 3 letters or characters to search users.',
				[ { text: 'OK' } ],
				{
					cancelable: false
				}
			);
			return;
		}

		setIsFetching(true);

		const body = {
			username: searchTerm,
			description: searchTerm
		};

		const usersSearched = await getUsers(body);

		setUsers(usersSearched);

		setIsFetching(false);
	};

	return (
		<View style={{ padding: 10, flex: 1, flexDirection: 'column', alignItems: 'center' }}>
			<View
				style={{
					marginBottom: 14,
					padding: 0,
					alignSelf: 'stretch'
				}}
			>
				<View style={{}}>
					<SearchBar
						containerStyle={{
							backgroundColor: '#f2ead5',
							borderTopWidth: 0,
							borderBottomWidth: 0,
							elevation: 2,
							borderWidth: 0,
							height: 44
						}}
						inputContainerStyle={{ backgroundColor: '#f2ead5', height: 30 }}
						inputStyle={{ fontSize: 16 }}
						placeholder="Search is case-sensitive"
						onChangeText={handleSearch}
						value={searchTerm}
					/>

					<Button
						title="search"
						disabled={isFetching}
						onPress={handleSearchSubmit}
						buttonStyle={{
							paddingVertical: 4,
							width: 150,
							backgroundColor: Colors.primaryColor,
							borderRadius: 6
						}}
						containerStyle={{ alignSelf: 'center', marginTop: 6 }}
					/>
				</View>
			</View>
			<ScrollView style={{ alignSelf: 'stretch', paddingTop: 0 }} contentContainerStyle={{ padding: 0 }}>
				<View style={{}}>
					<View>
						<Card
							title={'Search Result'}
							titleNumberOfLines={1}
							titleStyle={{}}
							dividerStyle={{ paddingTop: 0 }}
							containerStyle={{ margin: 0, padding: 5, borderRadius: 8, borderWidth: 1, elevation: 2 }}
						>
							{users.length === 0 && (
								<TouchableOpacity
									onPress={() => {
										setModalOpenId(user.id);
									}}
								>
									<View style={{ paddingTop: 30, paddingBottom: 40, paddingHorizontal: 40 }}>
										<View>
											<Text
												style={{
													fontSize: 18,
													textAlign: 'center',
													color: Colors.primaryColor
												}}
											>
												Users not found. {'\n'}
											</Text>
										</View>
										<View>
											<Text
												style={{
													fontSize: 18,
													textAlign: 'center',
													color: 'grey'
												}}
											>
												Try searching with username or description.
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							)}
							{users.map((user, i) => {
								return (
									<TouchableOpacity
										key={i}
										onPress={() => {
											setModalOpenId(user.id);
										}}
									>
										<View
											style={[
												{
													flex: 1,
													flexDirection: 'row',
													paddingHorizontal: 6
												},
												i === 0 ? { marginBottom: 10 } : { marginVertical: 10 }
											]}
										>
											{user && user.avatar ? (
												<CacheImage uri={user.avatar} style={{ width: 50, height: 50 }} />
											) : (
												<Image
													source={require('../../assets/images/profile-default.png')}
													style={{ width: 50, height: 50 }}
												/>
											)}
											<View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
												<Text numberOfLines={1} style={{ fontSize: 18 }}>
													{user.username}
												</Text>
												<Text numberOfLines={1} style={{ fontSize: 14 }}>
													{user.description}
												</Text>
											</View>
											<UserInfoModal
												showModal={modalOpenId === user.id}
												user={user}
												closeModal={closeModal}
												toChangeProfile={() => {
													closeModal();
													props.navigation.navigate('ChangeProfile');
												}}
												navigation={props.navigation}
											/>
										</View>
										{i < users.length - 1 && <Divider />}
									</TouchableOpacity>
								);
							})}
						</Card>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

SearchUsers.navigationOptions = {
	title: 'Search Poeple'
};

export default SearchUsers;

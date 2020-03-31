import React, { useState, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Image, Divider, Button } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';
import CacheImage from './CacheImage';
import UserInfoModal from './UserInfoModal';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../redux/actions/auth.actions';
import {
	fetchUserInfo,
	updateUser,
	acceptFriend,
	requestFriend,
	cancelFriend,
	removeFriend,
	rejectFriend
} from '../Services/users';
//TODO DELETE THIS AFTER AND CLEAN UP CODE

const UserCardList = (props) => {
	const { users, title, userType } = props;
	const [ modalOpenId, setModalOpenId ] = useState(null);

	const closeModal = () => {
		setModalOpenId(null);
	};

	const handleBtnAction = async (userId, bool) => {
		const body = {
			userId: props.currentDBUser.id,
			friendId: userId
		};
		// TODO: UNCOMMENT BELOW TO TEST
		if (userType === 'pending') {
			if (bool === true) {
				const res = await acceptFriend(body);
				await props.updateAction(res.friend, 1);
				await props.setDBUser(res.user);
			}
			if (bool === false) {
				const res = await rejectFriend(body);
				await props.updateAction(res.friend, 2);
				await props.setDBUser(res.user);
			}
		} else if (userType === 'sent') {
			const res = await cancelFriend(body);
			await props.updateAction(res.friend, 3);
			await props.setDBUser(res.user);
		} else if (userType === 'friends') {
			const res = await removeFriend(body);
			await props.updateAction(res.friend, 4);
			await props.setDBUser(res.user);
		}
	};

	const renderButton = (userId) => {
		if (userType === 'pending') {
			return (
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								'Accept',
								'Are you sure to accept the invitation?',
								[
									{ text: 'OK', onPress: () => handleBtnAction(userId, true) },
									{
										text: 'Cancel',
										style: 'cancel'
									}
								],
								{ cancelable: false }
							);
						}}
						style={{ marginRight: 10 }}
					>
						{vectorIcon('MaterialIcons', 'check-circle', 30, 'green')}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								'Accept',
								'Are you sure to reject the invitation?',
								[
									{ text: 'OK', onPress: () => handleBtnAction(userId, false) },
									{
										text: 'Cancel',
										style: 'cancel'
									}
								],
								{ cancelable: false }
							);
						}}
					>
						{vectorIcon('MaterialIcons', 'cancel', 30, 'red')}
					</TouchableOpacity>
				</View>
			);
		} else if (userType === 'sent') {
			return (
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								'Accept',
								'Are you sure to cancel the friend request?',
								[
									{ text: 'OK', onPress: () => handleBtnAction(userId) },
									{
										text: 'Cancel',
										style: 'cancel'
									}
								],
								{ cancelable: false }
							);
						}}
					>
						{vectorIcon('MaterialIcons', 'cancel', 30, 'red')}
					</TouchableOpacity>
				</View>
			);
		} else if (userType === 'friends') {
			return (
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								'Accept',
								'Are you sure to remove the friend from list?',
								[
									{ text: 'OK', onPress: () => handleBtnAction(userId) },
									{
										text: 'Cancel',
										style: 'cancel'
									}
								],
								{ cancelable: false }
							);
						}}
					>
						{vectorIcon('MaterialIcons', 'cancel', 30, 'red')}
					</TouchableOpacity>
				</View>
			);
		}
	};

	return (
		<View>
			<Card
				title={title}
				titleNumberOfLines={1}
				titleStyle={{}}
				dividerStyle={{ paddingTop: 0 }}
				containerStyle={{
					margin: 0,
					padding: 5,
					borderRadius: 8,
					elevation: 2,
					borderWidth: 1
				}}
			>
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
										source={require('../assets/images/profile-default.png')}
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
								<View>{renderButton(user.id)}</View>
								<UserInfoModal
									showModal={modalOpenId === user.id}
									user={user}
									closeModal={closeModal}
									updateAction={props.updateAction}
									navigation={props.navigation}
								/>
							</View>
							{i < users.length - 1 && <Divider />}
						</TouchableOpacity>
					);
				})}
			</Card>
		</View>
	);
};

const style = StyleSheet.create({});

const mapStateToProps = ({ auth }) => ({
	isAuthenticated: auth.isAuthenticated,
	currentDBUser: auth.currentDBUser,
	currentCognitoUser: auth.currentCognitoUser
});

const mapDispatchToProps = {
	setAuthStatus,
	setCognitoUser,
	setDBUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCardList);

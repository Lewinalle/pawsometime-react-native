import React, { useState, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Image, Divider, Button } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';
import { CacheImage } from './CacheImage';
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

const UserCardList = memo((props) => {
	const { users, title, userType } = props;

	const [ showModal, setShowModal ] = useState(false);

	const triggerModal = (bool) => {
		setShowModal(bool);
	};

	const handleBtnAction = (userId, bool) => {
		const body = {
			userId: props.currentDBUser.id,
			friendId: userId
		};
		// TODO: UNCOMMENT BELOW TO TEST
		if (userType === 'pending') {
			if (bool === true) {
				// acceptFriend(body);
				console.log('Accpet');
			}
			if (bool === false) {
				// rejectFriend(body);
				console.log('Reject');
			}
		} else if (userType === 'sent') {
			// cancelFriend(body);
			console.log('Cancel');
		} else if (userType === 'friends') {
			// removeFriend(body);
			console.log('Remove');
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
						{vectorIcon('MaterialIcons', 'check-circle', 30, 'green')}
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
				containerStyle={{ margin: 0, padding: 5, borderRadius: 8 }}
			>
				{users.map((user, i) => {
					return (
						<TouchableOpacity
							key={i}
							onPress={() => {
								console.log('Open Modal!');
								setShowModal(true);
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
										source={require('../assets/images/default-profile.jpg')}
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
								<UserInfoModal showModal={showModal} user={user} triggerModal={triggerModal} />
							</View>
							{i < users.length - 1 && <Divider />}
						</TouchableOpacity>
					);
				})}
			</Card>
		</View>
	);
});

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

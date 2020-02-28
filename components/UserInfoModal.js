import React, { useState, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import { Card, Text, Image, Overlay, Tooltip } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';
import CacheImage from './CacheImage';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../redux/actions/auth.actions';
import { fetchUserInfo, updateUser, acceptFriend, requestFriend } from '../Services/users';
//TODO DELETE THIS AFTER AND CLEAN UP CODE

const UserInfoModal = (props) => {
	const { user, showModal, closeModal } = props;
	const modalRef = useRef(null);
	const [ imageWidth, setImageWidth ] = useState(0);
	const [ imageHeight, setimageHeight ] = useState(0);
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const [ globalUser, setGlobalUser ] = useState(props.currentDBUser);

	const getRelationStatus = () => {
		if (globalUser.friends.pending.includes(user.id)) {
			return 'pending';
		} else if (globalUser.friends.sent.includes(user.id)) {
			return 'sent';
		} else if (globalUser.friends.friends.includes(user.id)) {
			return 'friends';
		} else {
			return 'none';
		}
	};

	const handleFriendRequest = async () => {
		if (isSubmitting) {
			console.log('already sending, wait!');
			return;
		}

		setIsSubmitting(true);

		if (getRelationStatus() === 'pending') {
			const res = await acceptFriend({
				userId: globalUser.id,
				friendId: user.id
			});

			await props.setDBUser(res.user);
			await setGlobalUser(res.user);

			if (typeof props.updateAction === 'function') {
				await props.updateAction(user, 1);
			}

			Alert.alert('Accepted!', 'You have accpeted and become friend with the user.', [ { text: 'OK' } ], {
				cancelable: false
			});
		} else if (getRelationStatus() === 'none') {
			const res = await requestFriend({
				userId: globalUser.id,
				friendId: user.id
			});

			await props.setDBUser(res.user);
			await setGlobalUser(res.user);

			if (typeof props.updateAction === 'function') {
				await props.updateAction(user, 0);
			}

			Alert.alert('Sent!', 'You have sent a friend request.', [ { text: 'OK' } ], { cancelable: false });
		}

		setIsSubmitting(false);

		// await closeModal();
	};

	const renderFriendIcon = () => {
		if (getRelationStatus() === 'pending' || getRelationStatus() === 'none') {
			return (
				<TouchableOpacity onPress={handleFriendRequest}>
					{vectorIcon('Ionicons', 'md-person-add', 30)}
				</TouchableOpacity>
			);
		} else if (getRelationStatus() === 'sent') {
			return (
				<TouchableOpacity>
					<Tooltip popover={<Text>Already Sent!</Text>}>
						{vectorIcon('Ionicons', 'md-person-add', 30)}
					</Tooltip>
				</TouchableOpacity>
			);
		} else if (getRelationStatus() === 'friends') {
			return (
				<TouchableOpacity>
					<Tooltip popover={<Text>Already Friend!</Text>}>
						{vectorIcon('FontAwesome', 'handshake-o', 30)}
					</Tooltip>
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	};

	return (
		<Overlay
			animationType="fade"
			transparent={true}
			isVisible={showModal}
			onRequestClose={() => {
				closeModal();
			}}
			onBackdropPress={() => {
				closeModal();
			}}
			overlayStyle={{ padding: 0, borderRadius: 4 }}
		>
			<View
				ref={modalRef}
				style={{
					flex: 1,
					flexDirection: 'column',
					alignItems: 'center',
					alignSelf: 'stretch',
					padding: 10
				}}
				onLayout={() => {
					if (modalRef) {
						modalRef.current.measure((x, y, width, height, pageX, pageY) => {
							setImageWidth(width * 0.8);
							setimageHeight(height * 0.4);
						});
					}
				}}
			>
				<View style={{ marginBottom: 10 }}>
					<Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={2}>
						{user.username}
					</Text>
				</View>
				{user && user.avatar ? (
					<CacheImage uri={user.avatar} style={{ width: imageWidth, height: imageWidth }} />
				) : (
					<Image
						source={require('../assets/images/profile-default.png')}
						style={{ width: imageWidth, height: imageWidth }}
					/>
				)}
				<Card containerStyle={{ width: imageWidth, height: imageWidth / 2 }}>
					<Text numberOfLines={2}>{user.description}</Text>
				</Card>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						width: imageWidth,
						justifyContent: 'space-between',
						marginTop: 25,
						paddingHorizontal: 10
					}}
				>
					{/* <TouchableOpacity onPress={handleMessageUser}>
						{vectorIcon('AntDesign', 'message1', 30)}
					</TouchableOpacity> */}
					{globalUser.id !== user.id ? (
						renderFriendIcon()
					) : (
						<TouchableOpacity
							onPress={() => {
								props.toChangeProfile();
							}}
						>
							{vectorIcon('AntDesign', 'edit', 30)}
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={() => closeModal()}>
						{vectorIcon('MaterialIcons', 'cancel', 30)}
					</TouchableOpacity>
				</View>
			</View>
		</Overlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal);

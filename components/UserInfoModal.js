import React, { useState, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Alert } from 'react-native';
import { Card, Text, Image, Overlay, Tooltip } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';
import { CacheImage } from './CacheImage';
import { connect } from 'react-redux';
import { setAuthStatus, setCognitoUser, setDBUser } from '../redux/actions/auth.actions';
import { fetchUserInfo, updateUser, acceptFriend, requestFriend } from '../Services/users';

const UserInfoModal = memo((props) => {
	const { user, showModal, triggerModal } = props;
	const modalRef = useRef(null);
	const [ imageWidth, setImageWidth ] = useState(0);
	const [ imageHeight, setimageHeight ] = useState(0);
	const [ relationStatus, setRelationStatus ] = useState(null);

	useEffect(() => {
		if (props.currentDBUser.friends.pending.includes(user.id)) {
			setRelationStatus('pending');
		} else if (props.currentDBUser.friends.sent.includes(user.id)) {
			setRelationStatus('sent');
		} else if (props.currentDBUser.friends.friends.includes(user.id)) {
			setRelationStatus('friends');
		} else {
			setRelationStatus('none');
		}
	}, []);

	const handleMessageUser = () => {
		// TODO: handleMessageUser
		console.log('Go To Message!');
	};

	const handleFriendRequest = async () => {
		if (relationStatus === 'pending') {
			const res = await acceptFriend({
				userId: props.currentDBUser.id,
				friendId: user.id
			});

			await setDBUser(res);
		} else if (relationStatus === 'none') {
			const res = await requestFriend({
				userId: props.currentDBUser.id,
				friendId: user.id
			});

			await setDBUser(res);
		}
	};

	const renderFriendIcon = () => {
		if (relationStatus === 'pending' || relationStatus === 'none') {
			return (
				<TouchableOpacity onPress={handleFriendRequest}>
					{vectorIcon('Ionicons', 'md-person-add', 30)}
				</TouchableOpacity>
			);
		} else if (relationStatus === 'sent') {
			return (
				<TouchableOpacity>
					<Tooltip popover={<Text>Already Sent!</Text>}>
						{vectorIcon('Ionicons', 'md-person-add', 30)}
					</Tooltip>
				</TouchableOpacity>
			);
		} else if (relationStatus === 'friends') {
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
				triggerModal(false);
			}}
			onBackdropPress={() => {
				triggerModal(false);
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
					<Text h3 numberOfLines={1}>
						{user.username}
					</Text>
				</View>
				{user && user.avatar ? (
					<CacheImage uri={user.avatar} style={{ width: imageWidth, height: imageWidth }} />
				) : (
					<Image
						source={require('../assets/images/default-profile.jpg')}
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
					<TouchableOpacity onPress={handleMessageUser}>
						{vectorIcon('AntDesign', 'message1', 30)}
					</TouchableOpacity>
					{renderFriendIcon()}
					<TouchableOpacity onPress={() => triggerModal(false)}>
						{vectorIcon('MaterialIcons', 'cancel', 30)}
					</TouchableOpacity>
				</View>
			</View>
		</Overlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal);

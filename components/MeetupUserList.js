import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import { Overlay, Button, Card, Divider } from 'react-native-elements';
import Colors from '../constants/Colors';
import CacheImage from './CacheImage';
import { ScrollView } from 'react-native-gesture-handler';

class MeetupUserList extends Component {
	render() {
		const { showModal, closeModal, joined = [], pending = [] } = this.props;

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
				<ScrollView>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							alignItems: 'center',
							alignSelf: 'stretch',
							padding: 20,
							marginVertical: 10
						}}
					>
						<Card
							title={'Joined'}
							titleNumberOfLines={1}
							titleStyle={{}}
							dividerStyle={{ paddingTop: 0 }}
							containerStyle={{
								margin: 0,
								padding: 5,
								borderRadius: 8,
								elevation: 2,
								borderWidth: 1,
								marginBottom: 20,
								alignSelf: 'stretch'
							}}
						>
							{joined.map((user, i) => {
								return (
									<View key={i}>
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
											{user && user.userAvatar ? (
												<CacheImage uri={user.userAvatar} style={{ width: 35, height: 35 }} />
											) : (
												<Image
													source={require('../assets/images/profile-default.png')}
													style={{ width: 35, height: 35 }}
												/>
											)}
											<View
												style={{
													flex: 1,
													flexDirection: 'column',
													marginLeft: 10,
													alignSelf: 'center'
												}}
											>
												<Text numberOfLines={1} style={{ fontSize: 18 }}>
													{user.userName}
												</Text>
											</View>
										</View>
										{i < joined.length - 1 && <Divider />}
									</View>
								);
							})}
						</Card>
						<Card
							title={'Pending'}
							titleNumberOfLines={1}
							titleStyle={{}}
							dividerStyle={{ paddingTop: 0 }}
							containerStyle={{
								margin: 0,
								padding: 5,
								borderRadius: 8,
								elevation: 2,
								borderWidth: 1,
								alignSelf: 'stretch'
							}}
						>
							{pending.map((user, i) => {
								return (
									<View key={i}>
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
											{user && user.userAvatar ? (
												<CacheImage uri={user.userAvatar} style={{ width: 35, height: 35 }} />
											) : (
												<Image
													source={require('../assets/images/profile-default.png')}
													style={{ width: 35, height: 35 }}
												/>
											)}
											<View
												style={{
													flex: 1,
													flexDirection: 'column',
													marginLeft: 10,
													alignSelf: 'center'
												}}
											>
												<Text numberOfLines={1} style={{ fontSize: 18 }}>
													{user.userName}
												</Text>
											</View>
										</View>
										{i < pending.length - 1 && <Divider />}
									</View>
								);
							})}
						</Card>
					</View>
				</ScrollView>
			</Overlay>
		);
	}
}

export default MeetupUserList;

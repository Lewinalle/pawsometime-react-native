import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MyMeetupInfo = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is MyMeetupInfo Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

MyMeetupInfo.navigationOptions = {
	title: 'My Meetups'
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	contentContainer: {
		paddingTop: 30
	}
});

export default MyMeetupInfo;

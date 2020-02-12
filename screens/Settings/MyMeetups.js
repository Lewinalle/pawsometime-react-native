import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MyMeetups = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is MyMeetups Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

MyMeetups.navigationOptions = {
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

export default MyMeetups;

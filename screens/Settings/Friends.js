import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Friends = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is Friends Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

Friends.navigationOptions = {
	title: 'Friends'
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

export default Friends;

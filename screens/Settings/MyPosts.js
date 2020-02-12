import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MyPosts = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is MyPosts Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

MyPosts.navigationOptions = {
	title: 'My Posts'
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

export default MyPosts;

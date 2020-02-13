import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const SearchUsers = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is SearchUsers Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

SearchUsers.navigationOptions = {
	title: 'Search Poeple'
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

export default SearchUsers;

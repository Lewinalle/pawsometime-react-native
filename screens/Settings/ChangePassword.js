import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ChangePassword = () => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<Text>This is ChangePassword Screen</Text>
				</View>
			</ScrollView>
		</View>
	);
};

ChangePassword.navigationOptions = {
	title: 'Change Password'
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

export default ChangePassword;

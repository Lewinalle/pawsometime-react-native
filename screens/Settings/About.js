import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from '../../constants/Layout';

export default function About() {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View
					style={{
						borderWidth: Constants.platform.ios ? 0.3 : 0.1,
						elevation: 2,
						padding: 20,
						marginHorizontal: 30,
						marginVertical: 0
					}}
				>
					<Text style={{ lineHeight: 24, color: '#696868' }}>
						<Text style={{ fontWeight: 'bold' }}>Pawsometime</Text> application is where people can host and
						join pet meetups, create a post, and add photos to their gallery to share. {'\n'}
						{'\n'} Feel free to enjoy pet-related news on Home screen and you can also add friends to easily
						see their special activities and gallery as well. {'\n'}
						{'\n'} For any questions or inquiries, please email to{' '}
						<Text style={{ fontWeight: 'bold' }}>pawsometime@gmail.com</Text>
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}

About.navigationOptions = {
	title: 'About'
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

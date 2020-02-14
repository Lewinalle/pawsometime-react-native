import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { test } from '../../redux/actions/test.actions';
import { Auth } from 'aws-amplify';

const Home = (props) => {
	return (
		<View>
			<Text>This is Home</Text>
		</View>
	);
};

Home.navigationOptions = {
	title: 'Home'
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ test }) => ({
	text: test.text
});

const mapDispatchToProps = {
	test
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

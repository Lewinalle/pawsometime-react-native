import React, { useEffect, useState, useRef } from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	TextInput,
	Picker,
	Alert,
	TouchableOpacity
} from 'react-native';
import { Input, Button, Text, Divider, Avatar } from 'react-native-elements';
import { Header } from 'react-navigation-stack';
import { uploadToS3 } from '../../helpers/uploadToS3';
import * as ImagePicker from 'expo-image-picker';
import Constants from '../../constants/Layout';
import * as Permissions from 'expo-permissions';
import { createPost } from '../../Services/posts';
import { connect } from 'react-redux';
import Config from '../../config';
import { fetchPosts } from '../../redux/actions/posts.actions';
import CacheImage from '../../components/CacheImage';
import { vectorIcon } from '../../Utils/Icon';

const CreateMeetup = (props) => {
	return (
		<View>
			<Text>This is create meetup</Text>
		</View>
	);
};

CreateMeetup.navigationOptions = (props) => {
	return {
		title: 'Create',
		headerStyle: { backgroundColor: 'brown' },
		headerTitleStyle: { color: 'blue' }
	};
};

const mapStateToProps = ({ auth }) => ({
	currentDBUser: auth.currentDBUser
});

const mapDispatchToProps = {
	fetchPosts
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeetup);

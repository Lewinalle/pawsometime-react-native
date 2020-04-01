import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';

const CACHE_SECONDS = 15;

export const getPosts = async (params) => {
	let query = '';
	_.forIn(params, function(value, key) {
		if (query !== '') {
			query += '&';
		}
		query += `${key}=${value}`;
	});

	const options = {
		method: 'GET',
		url: `${Config.POSTS_API_URL}/posts?${query ? query : ''}`
	};

	const fromCache = await AsyncStorage.getItem(`getPosts-${params.type}`);
	const cacheUpdated = await AsyncStorage.getItem(`getPosts-${params.type}-updated`);
	// if (!fromCache || !cacheUpdated || Number(+new Date()) - Number(cacheUpdated) > CACHE_SECONDS * 1000) {
	try {
		// console.log('fetching new list!');
		const res = await axios(options);

		const timestamp = new Date().getTime();

		await AsyncStorage.setItem(`getPosts-${params.type}`, JSON.stringify(res.data));
		await AsyncStorage.setItem(`getPosts-${params.type}-updated`, timestamp.toString());

		return res.data;
	} catch (error) {
		console.log('Error! ', error, options);
		return null;
	}
	// } else {
	// 	console.log('reading from cache!');
	// 	return JSON.parse(fromCache);
	// }
};

export const fetchPostInfo = async (id, type) => {
	const options = {
		method: 'GET',
		url: `${Config.POSTS_API_URL}/posts/${id}?type=${type}`
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const createPost = async (data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.POSTS_API_URL}/posts`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const updatePost = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'PUT',
		url: `${Config.POSTS_API_URL}/posts/${id}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const deletePost = async (id, type) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'DELETE',
		url: `${Config.POSTS_API_URL}/posts/${type}/${id}`,
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

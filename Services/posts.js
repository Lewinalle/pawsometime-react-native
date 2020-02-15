import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

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

	const res = await axios(options);

	return res.data;
};

export const fetchPostInfo = async (id) => {
	const options = {
		method: 'GET',
		url: `${Config.POSTS_API_URL}/posts/${id}`
	};

	const res = await axios(options);

	return res.data;
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

	const res = await axios(options);

	return res.data;
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

	const res = await axios(options);

	return res.data;
};

export const deletePost = async (id) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'DELETE',
		url: `${Config.POSTS_API_URL}/posts/${id}`,
		headers: {
			Authorization: `Bearer ${token}`
		}
	};

	const res = await axios(options);

	return res.data;
};

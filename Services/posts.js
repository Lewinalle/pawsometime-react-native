import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

const setHeaders = (setContentType) => {
	const token = Auth.currentSession().getIdToken().getJwtToken();

	let headers = {
		Authorization: `Bearer ${token}`
	};

	if (setContentType) {
		headers['Content-Type'] = 'application/json';
	}

	return headers;
};

export const fetchPosts = async (params) => {
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
	const options = {
		method: 'POST',
		url: `${Config.POSTS_API_URL}/posts`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const updatePost = async (id, data) => {
	const options = {
		method: 'PUT',
		url: `${Config.POSTS_API_URL}/posts/${id}`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const deletePost = async (id) => {
	const options = {
		method: 'DELETE',
		url: `${Config.POSTS_API_URL}/posts/${id}`,
		headers: setHeaders(false)
	};

	const res = await axios(options);

	return res.data;
}

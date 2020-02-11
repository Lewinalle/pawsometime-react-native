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

export const fetchUsers = async (params) => {
	let query = '';
	_.forIn(params, function(value, key) {
		if (query !== '') {
			query += '&';
		}
		query += `${key}=${value}`;
	});

	const options = {
		method: 'GET',
		url: `${Config.USERS_API_URL}/users?${query ? query : ''}`
	};

	const res = await axios(options);

	return res.data;
};

export const fetchUserInfo = async (id) => {
	const options = {
		method: 'GET',
		url: `${Config.USERS_API_URL}/users/${id}`
	};

	const res = await axios(options);

	return res.data;
};

export const updateUser = async (id, data) => {
	const options = {
		method: 'PUT',
		url: `${Config.USERS_API_URL}/users/${id}`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const requestFriend = async (data) => {
	const options = {
		method: 'POST',
		url: `${Config.USERS_API_URL}/users/friends/request`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const acceptFriend = async (data) => {
	const options = {
		method: 'POST',
		url: `${Config.USERS_API_URL}/users/friends/accept`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const rejectFriend = async (data) => {
	const options = {
		method: 'POST',
		url: `${Config.USERS_API_URL}/users/friends/reject`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}


export const deleteUser = async (id) => {
	const options = {
		method: 'DELETE',
		url: `${Config.USERS_API_URL}/users/${id}`,
		headers: setHeaders(false)
	};

	const res = await axios(options);

	return res.data;
}

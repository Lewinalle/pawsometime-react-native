import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

export const getUsers = async (params) => {
	try {
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
	} catch (err) {
		console.log(err);
	}
};

export const fetchUserInfo = async (id) => {
	try {
		const options = {
			method: 'GET',
			url: `${Config.USERS_API_URL}/users/${id}`
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const updateUser = async (id, data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'PUT',
			url: `${Config.USERS_API_URL}/users/${id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const requestFriend = async (data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'POST',
			url: `${Config.USERS_API_URL}/users/friends/request`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const acceptFriend = async (data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'POST',
			url: `${Config.USERS_API_URL}/users/friends/accept`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const rejectFriend = async (data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'POST',
			url: `${Config.USERS_API_URL}/users/friends/reject`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const cancelFriend = async (data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'POST',
			url: `${Config.USERS_API_URL}/users/friends/cancel`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const removeFriend = async (data) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'POST',
			url: `${Config.USERS_API_URL}/users/friends/remove`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			data
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

export const deleteUser = async (id) => {
	try {
		const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
		const options = {
			method: 'DELETE',
			url: `${Config.USERS_API_URL}/users/${id}`,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		};

		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

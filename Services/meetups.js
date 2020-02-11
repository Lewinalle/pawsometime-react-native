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

export const fetchMeetups = async (params) => {
	let query = '';
	_.forIn(params, function(value, key) {
		if (query !== '') {
			query += '&';
		}
		query += `${key}=${value}`;
	});

	const options = {
		method: 'GET',
		url: `${Config.MEETUPS_API_URL}/meetups?${query ? query : ''}`
	};

	const res = await axios(options);

	return res.data;
};

export const fetchMeetupInfo = async (id) => {
	const options = {
		method: 'GET',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`
	};

	const res = await axios(options);

	return res.data;
};

export const createMeetup = async (data) => {
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const updateMeetup = async (id, data) => {
	const options = {
		method: 'PUT',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const deleteMeetup = async (id) => {
	const options = {
		method: 'DELETE',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`,
		headers: setHeaders(false)
	};

	const res = await axios(options);

	return res.data;
}

export const autoJoin = async (id, data) => {
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/join`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const requestJoin = async (id, data) => {
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/request`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const acceptJoin = async (id, data) => {
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/accept`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const rejectJoin = async (id, data) => {
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/reject`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}
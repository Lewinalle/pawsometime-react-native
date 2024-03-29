import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

export const getMeetups = async (params) => {
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

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const fetchMeetupInfo = async (id) => {
	const options = {
		method: 'GET',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const createMeetup = async (data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups`,
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

export const updateMeetup = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'PUT',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`,
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

export const deleteMeetup = async (id) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'DELETE',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}`,
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

export const autoJoin = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/join`,
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

export const requestJoin = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/request`,
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

export const acceptJoin = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/accept`,
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

export const rejectJoin = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/reject`,
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

export const cancelJoin = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.MEETUPS_API_URL}/meetups/${id}/cancel`,
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

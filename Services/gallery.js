import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

export const getGalleries = async (params) => {
	let query = '';
	_.forIn(params, function(value, key) {
		if (query !== '') {
			query += '&';
		}
		query += `${key}=${value}`;
	});

	const options = {
		method: 'GET',
		url: `${Config.GALLERY_API_URL}/gallery?${query ? query : ''}`
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const fetchGalleryInfo = async (id) => {
	const options = {
		method: 'GET',
		url: `${Config.GALLERY_API_URL}/gallery/${id}`
	};

	try {
		const res = await axios(options);

		return res.data;
	} catch (err) {
		console.log('Error! ', err, options);
		return null;
	}
};

export const createGallery = async (data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.GALLERY_API_URL}/gallery`,
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

export const updateGallery = async (id, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'PUT',
		url: `${Config.GALLERY_API_URL}/gallery/${id}`,
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

export const deleteGallery = async (id) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'DELETE',
		url: `${Config.GALLERY_API_URL}/gallery/${id}`,
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

import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import _ from 'lodash';

export const getNews = async () => {
	const options = {
		method: 'GET',
		url: `${Config.OTHERS_API_URL}/news`
	};

	const res = await axios(options);

	return res.data;
};

// if already liked, it will revert the like
export const likeResource = async (resourceId, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resource/${resourceId}/like`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	const res = await axios(options);

	return res.data;
};

export const addComment = async (resourceId, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resource/${resourceId}/comment`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	const res = await axios(options);

	return res.data;
};

export const deleteComment = async (resourceId, commentId, data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resource/${resourceId}/comment/${commentId}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	const res = await axios(options);

	return res.data;
};

export const S3UploadUrl = async (data) => {
	const token = await (await Auth.currentSession()).getIdToken().getJwtToken();
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/s3/uploadurl`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		data
	};

	const res = await axios(options);

	return res.data;
};

export const testGet = async () => {
	const options = {
		method: 'GET',
		url: `${Config.OTHERS_API_URL}/test/get`
	};

	const res = await axios(options);

	return res.data;
};

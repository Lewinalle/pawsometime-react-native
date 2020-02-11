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

export const fetchNews = async () => {
	const options = {
		method: 'GET',
		url: `${Config.OTHERS_API_URL}/news`
	};

	const res = await axios(options);

	return res.data;
};

// if already liked, it will revert the like
export const likeResource = async (resourceId, data) => {
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resource/${resourceId}/like`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const addComment = async (resourceId, data) => {
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resource/${resourceId}/comment`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const deleteComment = async (resourceId, commentId, data) => {
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/resourceId/${resourceId}/comment/${commentId}`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}


export const S3UploadUrl = async (data) => {
	const options = {
		method: 'POST',
		url: `${Config.OTHERS_API_URL}/s3/uploadurl`,
		headers: setHeaders(true),
		body: JSON.stringify(data)
	};

	const res = await axios(options);

	return res.data;
}

export const testGet = async () => {
	const options = {
		method: 'GET',
		url: `${Config.OTHERS_API_URL}/test/get`,
	};

	const res = await axios(options);

	return res.data;
}

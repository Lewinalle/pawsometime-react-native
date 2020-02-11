import Config from '../config';
import axios from 'axios';
import { Auth } from 'aws-amplify';

// console.log(await (await Auth.currentSession()).getIdToken().getJwtToken());
// console.log(props.currentUser.attributes);

const postOptions = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	data: JSON.stringify('qweqwe'),
	url: 'https://dvteu7m1y2.execute-api.us-west-2.amazonaws.com/dev/test/post'
};

const setHeader = (setContentType) => {
	const token = Auth.currentSession().getIdToken().getJwtToken();

	let header = {
		Authorization: `Bearer ${token}`
	};

	if (setContentType) {
		header['Content-Type'] = 'application/json';
	}
};

export const fetchUsers = async (query) => {
	const params = {
		method: 'GET',
		url: `${Config.USERS_API_URL}/users?${query ? query : ''}`
	};

	const res = await axios(params);

	return res.data;
};

export const fetchUserInfo = async (id) => {
	const params = {
		method: 'GET',
		url: `${Config.USERS_API_URL}/users/${id}`
	};

	const res = await axios(params);

	return res.data;
};

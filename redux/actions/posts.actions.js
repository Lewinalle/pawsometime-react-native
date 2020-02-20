import {
	FETCH_GENERAL_POSTS,
	FETCH_QUESTION_POSTS,
	FETCH_TIP_POSTS,
	FETCH_TRADE_POSTS,
	FETCH_USER_GENERAL_POSTS,
	FETCH_USER_QUESTION_POSTS,
	FETCH_USER_TIP_POSTS,
	FETCH_USER_TRADE_POSTS
} from './index.actions';
import { getPosts } from '../../Services/posts';
import _ from 'lodash';

const postTypes = [ 'general', 'qna', 'tips', 'trade' ];

export const fetchPosts = (params = {}) => async (dispatch) => {
	let query = params;
	if (!query.type || !_.includes(postTypes, query.type)) {
		// default to general if type not set or if invalid
		query.type = 'general';
	}

	let type;
	switch (query.type) {
		case 'general':
			type = FETCH_GENERAL_POSTS;
			break;
		case 'qna':
			type = FETCH_QUESTION_POSTS;
			break;
		case 'tips':
			type = FETCH_TIP_POSTS;
			break;
		case 'trade':
			type = FETCH_TRADE_POSTS;
			break;
	}

	const data = await getPosts(query);

	dispatch({
		type,
		payload: {
			data
		}
	});
};

export const fetchUserPosts = (userId, params = {}) => async (dispatch) => {
	if (!userId) {
		return;
	}

	let query = params;

	if (!query.type || !_.includes(postTypes, query.type)) {
		// default to general if type not set or if invalid
		query.type = 'general';
	}

	query = {
		...query,
		userId
	};

	let type;
	switch (query.type) {
		case 'general':
			type = FETCH_USER_GENERAL_POSTS;
			break;
		case 'qna':
			type = FETCH_USER_QUESTION_POSTS;
			break;
		case 'tips':
			type = FETCH_USER_TIP_POSTS;
			break;
		case 'trade':
			type = FETCH_USER_TRADE_POSTS;
			break;
	}

	const data = await getPosts(query);

	dispatch({
		type,
		payload: {
			data
		}
	});
};

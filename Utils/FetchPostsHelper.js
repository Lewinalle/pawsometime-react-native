import _ from 'lodash';

const postTypes = [ 'general', 'qna', 'tips', 'trade' ];

export const fetchPostsHelper = async (fetcher, params) => {
	let query = params;
	if (query.type === undefined || query.type === null) {
		query.type = postTypes[0];
	} else if (typeof query.type === 'number' && query.type >= 0 && query.type < 4) {
		query.type = postTypes[query.type];
	} else if (typeof query.type === 'string' && _.includes(postTypes, query.type)) {
	} else {
		console.log('post type is invalid');
		return null;
	}

	await fetcher(query);
};

export const fetchUserPostsHelper = async (fetcher, userId, params) => {
	let query = params;
	if (query.type === undefined || query.type === null) {
		query.type = postTypes[0];
	} else if (typeof query.type === 'number' && query.type >= 0 && query.type < 4) {
		query.type = postTypes[query.type];
	} else if (typeof query.type === 'string' && _.includes(postTypes, query.type)) {
	} else {
		console.log('post type is invalid');
		return null;
	}

	await fetcher(userId, query);
};

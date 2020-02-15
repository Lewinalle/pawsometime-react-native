import { FETCH_POSTS, FETCH_USER_POSTS } from './index.actions';
import { getPosts } from '../../Services/posts';

export const fetchPosts = (params = {}) => async (dispatch) => {
	const data = await getPosts(params);

	dispatch({
		type: FETCH_POSTS,
		payload: {
			data
		}
	});
};

export const fetchUserPosts = (userId, params = {}) => async (dispatch) => {
	const query = {
		...params,
		userId
	};

	const data = await getPosts(query);

	dispatch({
		type: FETCH_USER_POSTS,
		payload: {
			data
		}
	});
};

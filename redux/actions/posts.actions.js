import { FETCH_POSTS } from './index.actions';
import { fetchPosts } from '../../Services/posts';

export const fetchPosts = (params) => (dispatch) => {
	const data = fetchPosts(params);

	dispatch({
		type: FETCH_POSTS,
		payload: {
			data
		}
	});
};

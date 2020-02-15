import { FETCH_POSTS, FETCH_USER_POSTS } from '../actions/index.actions';

const initialState = {
	posts: [],
	userPosts: []
};

const postsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_POSTS:
			return {
				...state,
				posts: action.payload.data
			};
		case FETCH_USER_POSTS:
			return {
				...state,
				userPosts: action.payload.data
			};
		default:
			return state;
	}
};

export default postsReducer;

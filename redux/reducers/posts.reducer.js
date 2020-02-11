import { FETCH_POSTS } from '../actions/index.actions';

const initialState = {
	posts: []
};

const postsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_POSTS:
			return {
				...state,
				posts: action.payload.data
			};
		default:
			return state;
	}
};

export default postsReducer;

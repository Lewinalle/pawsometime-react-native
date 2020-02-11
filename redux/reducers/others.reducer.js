import { FETCH_NEWS } from '../actions/index.actions';

const initialState = {
	news: []
};

const newsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_NEWS:
			return {
				...state,
				posts: action.payload.data
			};
		default:
			return state;
	}
};

export default newsReducer;

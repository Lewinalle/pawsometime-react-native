import { FETCH_MEETUPS } from '../actions/index.actions';

const initialState = {
	meetups: []
};

const meetupsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_MEETUPS:
			return {
				...state,
				posts: action.payload.data
			};
		default:
			return state;
	}
};

export default meetupsReducer;

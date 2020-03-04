import { FETCH_MEETUPS, FETCH_USER_MEETUPS } from '../actions/index.actions';

const initialState = {
	meetups: null,
	userMeetups: null
};

const meetupsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_MEETUPS:
			return {
				...state,
				meetups: action.payload.data
			};
		case FETCH_USER_MEETUPS:
			return {
				...state,
				userMeetups: action.payload.data
			};
		default:
			return state;
	}
};

export default meetupsReducer;

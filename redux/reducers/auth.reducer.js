import { SET_AUTH_STATUS, SET_AUTH_USER } from '../actions/index.actions';

const initialState = {
	isAuthenticated: null,
	currentUser: null
};

const authReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_AUTH_STATUS:
			return {
				...state,
				isAuthenticated: action.payload.data
			};
		case SET_AUTH_USER:
			return {
				...state,
				currentUser: action.payload.data
			};
		default:
			return state;
	}
};

export default authReducer;

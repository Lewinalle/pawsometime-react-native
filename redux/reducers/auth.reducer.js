import { SET_AUTH_STATUS, SET_COGNITO_USER, SET_DB_USER, SIGN_OUT } from '../actions/index.actions';

const initialState = {
	isAuthenticated: false,
	currentCognitoUser: null,
	currentDBUser: null
};

const authReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_AUTH_STATUS:
			return {
				...state,
				isAuthenticated: action.payload.data
			};
		case SET_COGNITO_USER:
			return {
				...state,
				currentCognitoUser: action.payload.data
			};
		case SET_DB_USER:
			return {
				...state,
				currentDBUser: action.payload.data
			};
		case SIGN_OUT:
			return {
				...state,
				isAuthenticated: false,
				currentCognitoUser: null,
				currentDBUser: {}
			};
		default:
			return state;
	}
};

export default authReducer;

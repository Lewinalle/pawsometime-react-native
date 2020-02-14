import { SET_COGNITO_USER, SET_DB_USER, SIGN_OUT, SET_AUTH_STATUS } from './index.actions';

export const setAuthStatus = (data) => (dispatch) => {
	dispatch({
		type: SET_AUTH_STATUS,
		payload: {
			data
		}
	});
};

export const setCognitoUser = (data) => (dispatch) => {
	dispatch({
		type: SET_COGNITO_USER,
		payload: {
			data
		}
	});
};

export const setDBUser = (data) => (dispatch) => {
	dispatch({
		type: SET_DB_USER,
		payload: {
			data
		}
	});
};

export const signOut = () => (dispatch) => {
	dispatch({
		type: SIGN_OUT
	});
};

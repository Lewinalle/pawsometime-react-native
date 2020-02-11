import { SET_AUTH_USER } from './index.actions';
import { SET_AUTH_STATUS } from './index.actions';

export const setAuthStatus = (data) => (dispatch) => {
	dispatch({
		type: SET_AUTH_STATUS,
		payload: {
			data
		}
	});
};

export const setAuthUser = (data) => (dispatch) => {
	dispatch({
		type: SET_AUTH_USER,
		payload: {
			data
		}
	});
};

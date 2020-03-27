import { SET_TEXT } from './index.actions';

export const test = (data) => (dispatch) => {
	dispatch({
		type: SET_TEXT,
		payload: {
			data
		}
	});
};

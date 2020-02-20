import { SET_TEXT } from './index.actions';

export const test = (data) => (dispatch) => {
	console.log('test action called');
	dispatch({
		type: SET_TEXT,
		payload: {
			data
		}
	});
};

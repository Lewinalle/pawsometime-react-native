import { FETCH_MEETUPS } from './index.actions';
import { fetchMeetups } from '../../Services/meetups';

export const fetchMeetups = (params) => (dispatch) => {
	const data = fetchMeetups(params);

	dispatch({
		type: FETCH_MEETUPS,
		payload: {
			data
		}
	});
};

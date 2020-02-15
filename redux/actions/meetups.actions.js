import { FETCH_MEETUPS, FETCH_USER_MEETUPS } from './index.actions';
import { getMeetups } from '../../Services/meetups';
import Config from '../../config';
import _ from 'lodash';

export const fetchMeetups = (params = {}) => async (dispatch) => {
	let query = params;
	if (!_.has(params, 'lat') || !_.has(params, 'lon')) {
		query.lat = Config.DEFAULT_LAT;
		query.lon = Config.DEFAULT_LON;
	}

	const data = await getMeetups(query);

	dispatch({
		type: FETCH_MEETUPS,
		payload: {
			data
		}
	});
};

export const fetchUserMeetups = (userId, params = {}) => async (dispatch) => {
	const query = {
		...params,
		userId
	};

	const data = await getMeetups(query);

	dispatch({
		type: FETCH_USER_MEETUPS,
		payload: {
			data
		}
	});
};

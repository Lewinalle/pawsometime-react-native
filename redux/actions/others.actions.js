import { FETCH_NEWS, SET_CURRENT_LOCATION, FETCH_FIRENDS_RECENT_ACTIVITY } from './index.actions';
import { getNews } from '../../Services/general';
import { getHistory } from '../../Services/general';

export const fetchNews = () => async (dispatch) => {
	const data = await getNews();

	dispatch({
		type: FETCH_NEWS,
		payload: {
			data
		}
	});
};

export const setCurrentLocation = (geolocation) => async (dispatch) => {
	dispatch({
		type: SET_CURRENT_LOCATION,
		payload: {
			data: geolocation
		}
	});
};

export const fetchFriendsActivity = (currentUserId, params = {}) => async (dispatch) => {
	const data = await getHistory(params);

	const filtered = data.filter((item) => {
		if (item.resource === 'user' && item.resourceId !== currentUserId) {
			return false;
		} else {
			return true;
		}
	});

	dispatch({
		type: FETCH_FIRENDS_RECENT_ACTIVITY,
		payload: {
			data: filtered
		}
	});
};

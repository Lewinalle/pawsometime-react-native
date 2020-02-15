import { FETCH_NEWS, SET_CURRENT_LOCATION } from './index.actions';
import { getNews } from '../../Services/general';

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

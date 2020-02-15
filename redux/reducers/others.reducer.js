import { FETCH_NEWS, SET_CURRENT_LOCATION } from '../actions/index.actions';
import Config from '../../config';

const initialState = {
	news: [],
	currentLocation: {
		lat: Config.DEFAULT_LAT,
		lon: Config.DEFAULT_LON
	}
};

const newsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_NEWS:
			return {
				...state,
				news: action.payload.data
			};
		case SET_CURRENT_LOCATION:
			return {
				...state,
				currentLocation: action.payload.data
			};
		default:
			return state;
	}
};

export default newsReducer;

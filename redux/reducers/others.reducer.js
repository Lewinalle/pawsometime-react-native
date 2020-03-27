import { FETCH_NEWS, SET_CURRENT_LOCATION, FETCH_FIRENDS_RECENT_ACTIVITY } from '../actions/index.actions';
import Config from '../../config';

const initialState = {
	news: {
		dogs: [],
		cats: [],
		pets: []
	},
	newsLastFetched: null,
	currentLocation: {
		lat: Config.DEFAULT_LAT,
		lon: Config.DEFAULT_LON
	},
	friendsActivity: null
};

const newsReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_NEWS:
			const now = new Date();
			const dogsNews = action.payload.data.filter((item) => item.tag === 'dogs');
			const catsNews = action.payload.data.filter((item) => item.tag === 'cats');
			const petsNews = action.payload.data.filter((item) => item.tag === 'pets');

			return {
				...state,
				news: {
					dogs: dogsNews,
					cats: catsNews,
					pets: petsNews
				},
				newsLastFetched: now
			};
		case SET_CURRENT_LOCATION:
			return {
				...state,
				currentLocation: action.payload.data
			};
		case FETCH_FIRENDS_RECENT_ACTIVITY:
			return {
				...state,
				friendsActivity: action.payload.data
			};
		default:
			return state;
	}
};

export default newsReducer;

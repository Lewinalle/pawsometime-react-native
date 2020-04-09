import { FETCH_NEWS, SET_CURRENT_LOCATION, FETCH_FIRENDS_RECENT_ACTIVITY, FETCH_LOGIN } from '../actions/index.actions';
import Config from '../../config';

let now;
let dogsNews;
let catsNews;
let petsNews;

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
			now = new Date();
			dogsNews = action.payload.data.filter((item) => item.tag === 'dogs');
			catsNews = action.payload.data.filter((item) => item.tag === 'cats');
			petsNews = action.payload.data.filter((item) => item.tag === 'pets');

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
		case FETCH_LOGIN:
			now = new Date();
			dogsNews = action.payload.news.filter((item) => item.tag === 'dogs');
			catsNews = action.payload.news.filter((item) => item.tag === 'cats');
			petsNews = action.payload.news.filter((item) => item.tag === 'pets');

			return {
				...state,
				news: {
					dogs: dogsNews,
					cats: catsNews,
					pets: petsNews
				},
				newsLastFetched: now,
				currentLocation: action.payload.currentLocation,
				friendsActivity: action.payload.friendsActivity
			};
		default:
			return state;
	}
};

export default newsReducer;

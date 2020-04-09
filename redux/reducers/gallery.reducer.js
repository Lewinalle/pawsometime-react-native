import { FETCH_GALLERY, FETCH_USER_GALLERY, FETCH_LOGIN } from '../actions/index.actions';

const initialState = {
	gallery: null,
	userGallery: null
};

const galleryReducer = (state = initialState, action = {}) => {
	switch (action.type) {
		case FETCH_GALLERY:
			return {
				...state,
				gallery: action.payload.data
			};
		case FETCH_USER_GALLERY:
			return {
				...state,
				userGallery: action.payload.data
			};
		case FETCH_LOGIN:
			return {
				...state,
				gallery: action.payload.userGallery
			};
		default:
			return state;
	}
};

export default galleryReducer;

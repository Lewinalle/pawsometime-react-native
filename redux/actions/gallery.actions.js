import { FETCH_GALLERY, FETCH_USER_GALLERY } from './index.actions';
import { getGalleries } from '../../Services/gallery';
import _ from 'lodash';

export const fetchUserGallery = (userId, type, params = {}) => async (dispatch) => {
	// (type) 0: signed in user, 1: another user
	const fetchType = type === 0 ? FETCH_GALLERY : FETCH_USER_GALLERY;

	let query = params;
	if (userId) {
		query.userId = userId;
	}

	const data = await getGalleries(query);

	dispatch({
		type: fetchType,
		payload: {
			data
		}
	});
};

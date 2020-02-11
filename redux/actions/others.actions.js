import { FETCH_NEWS } from './index.actions';
import { fetchNews } from '../../Services/general';

export const fetchNews = () => (dispatch) => {
	const data = fetchNews();

	dispatch({
		type: FETCH_NEWS,
		payload: {
			data
		}
	});
};

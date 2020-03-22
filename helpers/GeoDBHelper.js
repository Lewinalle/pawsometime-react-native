import Config from '../config';
import axios from 'axios';

export const searchCity = async (city) => {
	let url = `${Config.GEO_DB_API_URL}/geo/cities?limit=10&offset=0&namePrefix=${city}`;
	let options = {
		method: 'GET',
		url: url,
		headers: {
			'x-rapidapi-host': Config.GEO_DB_HOST,
			'x-rapidapi-key': Config.GEO_DB_KEY
		}
	};

	let response = await axios(options);
	let responseOK = response && response.status === 200;

	if (!responseOK) {
		console.log('Failed response: ', response);
		return [];
	}

	let data = await response.data;
	console.log(data.data);

	return data.data;
};

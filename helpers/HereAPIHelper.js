import Config from '../config';
import axios from 'axios';

export const searchAddress = async (address) => {
	const query = `q=${address}&apiKey=${Config.HERE_GEO_API_KEY}`;
	const url = `${Config.HERE_GEO_API_URL}/geocode?${query}`;

	const options = {
		method: 'GET',
		url
	};

	const res = await axios(options);

	return res.data;
};

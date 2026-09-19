import { config } from '../config.js'
import { CityNotFoundError } from '../errors.js'
import { fetchJson } from './http.js'

export async function getCoordinates(city) {
	const data = await fetchJson(config.geocodingApiUrl, {
		name: city,
		count: 1,
		language: 'ru',
		format: 'json',
	});
	const result = data?.results?.[0];
	if (!result) {
		throw new CityNotFoundError(city);
	}
	return {
		name: result.name,
		country: result.country,
		latitude: result.latitude,
		longitude: result.longitude,
	};
}

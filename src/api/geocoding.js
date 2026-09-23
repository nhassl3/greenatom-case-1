import { config } from '../config.js';
import { CityNotFoundError } from '../errors.js';
import { fetchJson } from './http.js';

export function parseGeocodingResponse(data, city) {
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

export async function getCoordinates(city) {
	const data = await fetchJson(config.geocodingApiUrl, {
		name: city,
		count: 1,
		language: 'ru',
		format: 'json',
	});
	return parseGeocodingResponse(data, city);
}

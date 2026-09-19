import { config } from '../config.js';
import { fetchJson } from './http.js';

export function parseForecastResponse(data) {
	const daily = data?.daily;
	const dates = daily?.time ?? [];
	return dates.map((date, i) => ({
		date,
		tempMax: daily.temperature_2m_max[i],
		tempMin: daily.temperature_2m_min[i],
		precipitation: daily.precipitation_sum[i],
	}));
}

export async function getForecast({ latitude, longitude, days }) {
	const data = await fetchJson(config.weatherApiUrl, {
		latitude,
		longitude,
		daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
		forecast_days: days,
		timezone: 'auto',
		temperature_unit: config.temperatureUnit,
		precipitation_unit: config.precipitationUnit,
	});
	return parseForecastResponse(data);
}

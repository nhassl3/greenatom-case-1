import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseGeocodingResponse } from '../src/api/geocoding.js';
import { parseForecastResponse } from '../src/api/forecast.js';
import { CityNotFoundError } from '../src/errors.js';

describe('parseGeocodingResponse', () => {
	it('извлекает координаты из первого результата', () => {
		const data = {
			results: [
				{ name: 'Казань', country: 'Россия', latitude: 55.78874, longitude: 49.12214 },
				{ name: 'Другой Казань', country: 'Где-то ещё', latitude: 0, longitude: 0 },
			],
		};
		assert.deepEqual(parseGeocodingResponse(data, 'Казань'), {
			name: 'Казань',
			country: 'Россия',
			latitude: 55.78874,
			longitude: 49.12214,
		});
	});

	it('бросает CityNotFoundError на пустой results', () => {
		assert.throws(
			() => parseGeocodingResponse({ results: [] }, 'Несуществующий'),
			CityNotFoundError,
		);
	});

	it('бросает CityNotFoundError, если поля results нет вообще', () => {
		assert.throws(() => parseGeocodingResponse({}, 'Несуществующий'), CityNotFoundError);
	});
});

describe('parseForecastResponse', () => {
	it('сводит параллельные массивы daily.* в массив дней', () => {
		const data = {
			daily: {
				time: ['2026-09-19', '2026-09-20'],
				temperature_2m_max: [18.8, 19.9],
				temperature_2m_min: [11.6, 8.9],
				precipitation_sum: [0, 1.2],
			},
		};
		assert.deepEqual(parseForecastResponse(data), [
			{ date: '2026-09-19', tempMax: 18.8, tempMin: 11.6, precipitation: 0 },
			{ date: '2026-09-20', tempMax: 19.9, tempMin: 8.9, precipitation: 1.2 },
		]);
	});

	it('возвращает пустой массив, если daily отсутствует', () => {
		assert.deepEqual(parseForecastResponse({}), []);
	});
});

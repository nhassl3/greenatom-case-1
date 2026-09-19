import { getForecast } from '../api/forecast.js'
import { getCoordinates } from '../api/geocoding.js'
import { config } from '../config.js'
import { readReport, writeReport } from '../storage/reports.js'

function today() {
	return new Date().toISOString().slice(0, 10);
}

export async function getCityDigest(city, { days, noCache }) {
	if (!noCache) {
		const cached = await readReport(city, today());
		if (cached && cached.days === days) {
			return { ...cached, source: 'cache' };
		}
	}

	const coordinates = await getCoordinates(city);
	const forecast = await getForecast({
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
		days,
	});

	const digest = {
		city: coordinates.name,
		country: coordinates.country,
		coordinates: { latitude: coordinates.latitude, longitude: coordinates.longitude },
		days,
		units: { temperature: config.temperatureUnit, precipitation: config.precipitationUnit },
		generatedAt: new Date().toISOString(),
		forecast,
		source: 'network',
	};

	await writeReport(digest);
	return digest;
}

export async function getDigests(cities, options) {
	const results = await Promise.allSettled(
		cities.map((city) => getCityDigest(city, options)),
	); // без прерывания остальных городов, если какой-то из них упадет

	const digests = [];
	const failures = [];

	results.forEach((result, i) => {
		if (result.status === 'fulfilled') {
			digests.push(result.value);
		} else {
			failures.push({ city: cities[i], error: result.reason });
		}
	});

	return { digests, failures };
}

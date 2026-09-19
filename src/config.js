try {
	process.loadEnvFile();
} catch {
}

function readInt(name, fallback) {
	const raw = process.env[name];
	if (raw === undefined || raw === '') return fallback;
	const value = Number.parseInt(raw, 10);
	return Number.isNaN(value) ? fallback : value;
}

function readString(name, fallback) {
	const raw = process.env[name];
	return raw === undefined || raw === '' ? fallback : raw;
}

export const config = {
	geocodingApiUrl: readString(
		'GEOCODING_API_URL',
		'https://geocoding-api.open-meteo.com/v1/search',
	),
	weatherApiUrl: readString('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast'),
	requestTimeoutMs: readInt('REQUEST_TIMEOUT_MS', 5000),
	reportsDir: readString('REPORTS_DIR', 'reports'),
	defaultForecastDays: readInt('DEFAULT_FORECAST_DAYS', 3),
	temperatureUnit: readString('TEMPERATURE_UNIT', 'celsius'),
	precipitationUnit: readString('PRECIPITATION_UNIT', 'mm'),
};

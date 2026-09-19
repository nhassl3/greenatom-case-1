const SOURCE_LABEL = {
	cache: 'кэш',
	network: 'сеть',
};

export function printDigest(digest) {
	console.log(
		`\n${digest.city}, ${digest.country} ` +
			`(${digest.coordinates.latitude}, ${digest.coordinates.longitude}) ` +
			`— источник: ${SOURCE_LABEL[digest.source] ?? digest.source}`,
	);

	const rows = {};
	for (const day of digest.forecast) {
		rows[day.date] = {
			'Мин, °C': day.tempMin,
			'Макс, °C': day.tempMax,
			[`Осадки, ${digest.units.precipitation}`]: day.precipitation,
		};
	}
	console.table(rows);
}

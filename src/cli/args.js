import { parseArgs } from 'node:util'
import { config } from '../config.js'
import { ValidationError } from '../errors.js'

export function buildHelp() {
	return `Прогноз погоды

Использование:
  node src/index.js --city "Нижний Новгород" [--days 3] [--no-cache]
  node src/index.js --city "Казань,Москва" --days 5

Параметры:
  --city <город[,город...]>  Обязателен. Один или несколько городов через запятую.
  --days <1-7>                Необязателен. По умолчанию ${config.defaultForecastDays}.
  --no-cache                  Игнорировать кэш и всегда обращаться к сети.
  -h, --help                  Показать эту справку.

Коды завершения: 0 - успех, 1 - ошибка.`;
}

function parseCities(rawValues) {
	const cities = rawValues
		.flatMap((value) => value.split(','))
		.map((value) => value.trim())
		.filter((value) => value.length > 0);

	return Array.from(new Set(cities)); // авто-ремув повторяющихся городов
}

function parseDays(rawDays) {
	if (rawDays === undefined) {
		return config.defaultForecastDays;
	}
	const days = Number.parseInt(rawDays, 10);
	if (Number.isNaN(days) || days < 1 || days > 7) {
		throw new ValidationError(
			`Параметр --days должен быть целым числом от ${MIN_DAYS} до ${MAX_DAYS}, получено: «${rawDays}»`,
		);
	}
	return days;
}

export function parseCliArgs(argv) {
	let values;
	try {
		({ values } = parseArgs({
			args: argv,
			options: {
				city: { type: 'string', multiple: true },
				days: { type: 'string' },
				'no-cache': { type: 'boolean', default: false },
				help: { type: 'boolean', short: 'h', default: false },
			},
			strict: true,
		}));
	} catch (err) {
		throw new ValidationError(`Некорректные аргументы командной строки: ${err.message}`);
	}

	if (values.help) {
		return { help: true };
	}

	if (!values.city || values.city.length === 0) {
		throw new ValidationError(
			'Параметр --city обязателен, укажите один или несколько городов через запятую',
		);
	}

	const cities = parseCities(values.city);
	if (cities.length === 0) {
		throw new ValidationError('Параметр --city не содержит ни одного названия города');
	}

	return {
		help: false,
		cities,
		days: parseDays(values.days),
		noCache: values['no-cache'],
	};
}

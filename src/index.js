import { buildHelp, parseCliArgs } from './cli/args.js';
import { AppError } from './errors.js';
import { printDigest } from './format/output.js';
import { getDigests } from './services/weather.js';

function reportUnexpectedError(err) {
	const message = err instanceof Error ? err.message : String(err);
	console.error(`Непредвиденная ошибка: ${message}`);
	process.exitCode = 1;
}

process.on('unhandledRejection', reportUnexpectedError);
process.on('uncaughtException', reportUnexpectedError);

async function main() {
	const argv = process.argv.slice(2);

	let args;
	try {
		args = parseCliArgs(argv);
	} catch (err) {
		if (err instanceof AppError) {
			console.error(err.message);
			process.exitCode = 1;
			return;
		}
		throw err;
	}

	if (args.help) {
		console.log(buildHelp());
		return;
	}

	const { digests, failures } = await getDigests(args.cities, {
		days: args.days,
		noCache: args.noCache,
	});

	for (const digest of digests) {
		printDigest(digest);
	}
	for (const { city, error } of failures) {
		console.error(`${city}: ${error.message}`);
	}

	process.exitCode = failures.length > 0 ? 1 : 0;
}

main();

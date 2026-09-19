import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { config } from '../config.js'

function slug(city) {
	return city.trim().replace(/\s+/g, '_').replace(/[/\\]/g, '_');
}

export function reportPath(city, date) {
	return path.join(config.reportsDir, `${slug(city)}-${date}.json`);
}

export async function readReport(city, date) {
	try {
		const raw = await readFile(reportPath(city, date), 'utf8');
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export async function writeReport(report) {
	const date = report.generatedAt.slice(0, 10);
	const filePath = reportPath(report.city, date);
	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
}

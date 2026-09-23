import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseCliArgs } from '../src/cli/args.js';
import { ValidationError } from '../src/errors.js';

describe('parseCliArgs', () => {
	it('разбирает один город и явный --days', () => {
		const args = parseCliArgs(['--city', 'Казань', '--days', '5']);
		assert.deepEqual(args, {
			help: false,
			cities: ['Казань'],
			days: 5,
			noCache: false,
		});
	});

	it('разбивает --city по запятой, обрезает пробелы и убирает дубликаты', () => {
		const args = parseCliArgs(['--city', ' Казань, Москва ,Казань']);
		assert.deepEqual(args.cities, ['Казань', 'Москва']);
	});

	it('подставляет 3 дня по умолчанию, если --days не указан', () => {
		const args = parseCliArgs(['--city', 'Казань']);
		assert.equal(args.days, 3);
	});

	it('включает noCache по флагу --no-cache', () => {
		const args = parseCliArgs(['--city', 'Казань', '--no-cache']);
		assert.equal(args.noCache, true);
	});

	it('возвращает { help: true } на --help, не требуя --city', () => {
		const args = parseCliArgs(['--help']);
		assert.deepEqual(args, { help: true });
	});

	it('бросает ValidationError, если --city не указан', () => {
		assert.throws(() => parseCliArgs(['--days', '3']), ValidationError);
	});

	it('бросает ValidationError, если --days вне диапазона 1–7', () => {
		assert.throws(() => parseCliArgs(['--city', 'Казань', '--days', '99']), ValidationError);
	});

	it('бросает ValidationError, если --days не число', () => {
		assert.throws(() => parseCliArgs(['--city', 'Казань', '--days', 'абв']), ValidationError);
	});

	it('бросает ValidationError на неизвестный флаг', () => {
		assert.throws(() => parseCliArgs(['--city', 'Казань', '--unknown']), ValidationError);
	});
});

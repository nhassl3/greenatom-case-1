import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	prettierConfig,
	{
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: {
				process: 'readonly',
				console: 'readonly',
				fetch: 'readonly',
				AbortController: 'readonly',
				URL: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-console': 'off',
		},
	},
	{
		ignores: ['node_modules/', 'reports/'],
	},
];

export default {
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: true,
	quoteProps: 'consistent',
	trailingComma: 'es5',
	bracketSpacing: true,
	arrowParens: 'always',
	proseWrap: 'always',
	requirePragma: false,
	insertPragma: false,
	endOfLine: 'auto',
	plugins: ['@ianvs/prettier-plugin-sort-imports'],
	importOrder: [
	  '^@[a-zA-Z0-9]',
	  '^[a-zA-Z0-9]',
	  '',
	  '^[~/]',
	  '^[./]',
	],
	importOrderParserPlugins: ['typescript'],
	importOrderTypeScriptVersion: '5.0.0',
	importOrderCaseSensitive: true,
  };
  
import path from 'node:path'

const buildEslintCommand = (filenames) =>
  `next lint --no-cache --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const buildPrettierCommand = (filenames) =>
  `yarn prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

const buildTestCommand = () => 'yarn test';

const buildCheckTypesCommand = () => 'yarn check-types';

export default {
  '*.{js,jsx,ts,tsx}': [
    buildCheckTypesCommand,
    buildEslintCommand,
    buildPrettierCommand,
    buildTestCommand,
  ],
};
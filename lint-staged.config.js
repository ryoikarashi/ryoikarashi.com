import path from 'node:path';

/** @type {import("lint-staged").Config} */
export default {
  '*.{js,jsx,ts,tsx}': [
    () => 'yarn check-types',
    // https://github.com/lint-staged/lint-staged#use-environment-variables-with-linting-commands
    (filenames) =>
      `yarn eslint --max-warnings=0 --no-warn-ignored --no-cache --fix ${filenames
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .map((f) => path.relative(process.cwd(), f))
        .join(' ')}`,
    (filenames) =>
      `yarn prettier --write ${filenames
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .map((f) => path.relative(process.cwd(), f))
        .join(' ')}`,
    'yarn test',
  ],
};

# eslint-config-paazmaya

> Shared ESLint configuration between my projects since it is possible

[![Build Status](https://app.travis-ci.com/paazmaya/eslint-config-paazmaya.svg?branch=master)](https://app.travis-ci.com/paazmaya/eslint-config-paazmaya)
[![Node.js v14 CI](https://github.com/paazmaya/eslint-config-paazmaya/actions/workflows/linting-and-unit-testing.yml/badge.svg)](https://github.com/paazmaya/eslint-config-paazmaya/actions/workflows/linting-and-unit-testing.yml)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=paazmaya_eslint-config-paazmaya&metric=code_smells)](https://sonarcloud.io/dashboard?id=paazmaya_eslint-config-paazmaya)

## Usage

Install via `npm` command line tool, along with [ESLint](http://eslint.org/):

```sh
npm install --save-dev eslint eslint-config-paazmaya
```

Note that the minimum ESLint version supported is `7.15.0` due to the rule configuration, but the latest usually works best.

Change the `.eslintrc.json` to contain the configuration for the shared configuration:

```json
{
  "extends": "paazmaya"
}
```

For further details see [ESLint documentation for Shareable Configs](http://eslint.org/docs/developer-guide/shareable-configs).

For example, when [`@babel/eslint-parser` parser](https://github.com/babel/babel) would be needed:

```json
{
  "extends": "paazmaya",
  "parser": "@babel/eslint-parser",
  "plugins": [
    "@babel"
  ]
}
```

The default configuration specifies [global variable environments](https://eslint.org/docs/user-guide/configuring#specifying-environments) as:

```js
env: {
  node: true,
  es6: true
}
```

The global variables themselves are [defined at `sindresorhus/globals`](https://github.com/sindresorhus/globals/blob/master/globals.json).

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `14.15.0`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

## Contributing

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://www.erikaheidi.com/blog/a-beginners-guide-to-open-source-the-best-advice-for-making-your-first-contribution/)

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm test`.
There should be no errors appearing after any JavaScript file changes.

## Version history

[Changes happening across different versions and upcoming changes are tracked in the `CHANGELOG.md` file.](CHANGELOG.md)

## License

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

Licensed under [the MIT license](./LICENSE).

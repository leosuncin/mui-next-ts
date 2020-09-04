// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const wp = require('@cypress/webpack-preprocessor');
const path = require('path');

import jwtTask from './jwt-task';

const options = {
  webpackOptions: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        components: path.resolve(__dirname, '../../components'),
        services: path.resolve(__dirname, '../../services'),
        libs: path.resolve(__dirname, '../../libs'),
        machines: path.resolve(__dirname, '../../machines'),
        middlewares: path.resolve(__dirname, '../../middlewares'),
        hooks: path.resolve(__dirname, '../../hooks'),
        pages: path.resolve(__dirname, '../../pages'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
    },
  },
};

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', wp(options));
  require('@cypress/code-coverage/task')(on, config);
  require('cypress-terminal-report/src/installLogsPrinter')(on);
  on(
    'task',
    jwtTask(process.env.APP_SECRET, { expiresIn: '1 min', algorithm: 'HS384' }),
  );

  return config;
};

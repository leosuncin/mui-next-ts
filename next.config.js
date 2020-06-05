const withFonts = require('next-fonts');

module.exports = withFonts({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    return config;
  },
  env: {
    APP_SECRET:
      process.env.APP_SECRET || 'MOdfbiPLnR5JjH9L3gTJXUmwm8tRhU8znowuOIQj',
  },
});

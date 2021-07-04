const withFonts = require('next-fonts');

module.exports = withFonts({
  env: {
    APP_SECRET:
      process.env.APP_SECRET || 'MOdfbiPLnR5JjH9L3gTJXUmwm8tRhU8znowuOIQj',
  },
});

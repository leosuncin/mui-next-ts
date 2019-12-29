module.exports = {
  presets: ['next/babel'],
  plugins: process.env.CODE_COVERAGE ? ['istanbul'] : [],
};

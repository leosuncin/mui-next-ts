module.exports = {
  presets: ['next/babel'],
  plugins: process.env.CODE_COVERAGE
    ? ['typescript-to-proptypes', 'istanbul']
    : [['typescript-to-proptypes', { comments: true }]],
};

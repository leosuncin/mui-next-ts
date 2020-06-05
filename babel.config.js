const plugins = [['typescript-to-proptypes', { comments: true }]];

module.exports = {
  presets: ['next/babel'],
  plugins:
    process.env.CODE_COVERAGE === 'true' ? plugins.concat('istanbul') : plugins,
};

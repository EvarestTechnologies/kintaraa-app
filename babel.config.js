module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Strip console statements in production
      ...(__DEV__ ? [] : [
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'], // Keep console.error and console.warn
          },
        ],
      ]),
    ],
  };
};

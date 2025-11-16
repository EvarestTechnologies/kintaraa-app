module.exports = function (api) {
  api.cache(true);

  // Use NODE_ENV instead of __DEV__ in babel config
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Strip console statements in production
      ...(isProduction ? [
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'], // Keep console.error and console.warn
          },
        ],
      ] : []),
    ],
  };
};

const { override, addWebpackAlias, addWebpackResolve } = require('customize-cra');

module.exports = override(
    addWebpackResolve({
        fallback: {
          "events": require.resolve("events/"),
          "node:events": require.resolve("events/"),
          "url": require.resolve("url/"),
          "querystring": require.resolve("querystring-es3"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "zlib": require.resolve("browserify-zlib"),
          "fs": false,
          "net": false,
          "tls": false
        }
      })
);
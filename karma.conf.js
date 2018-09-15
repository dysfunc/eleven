const path = require('path');

module.exports = (karma) => {
  const config = {
    browsers: ['Chrome'],
    coverageReporter: {
      reporters: [
        { type: 'html',     dir: 'test/unit/coverage', subdir: 'html' },
        { type: 'lcovonly', dir: 'test/unit/coverage', subdir: '.' },
        { type: 'text' }
      ]
    },
    files: [
      'test/unit/tests.webpack.js'
    ],
    frameworks: [
      'jasmine'
    ],
    preprocessors: {
      'test/unit/tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'coverage'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    webpack: {
      mode: 'development',
      cache: true,
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            include: /test\/unit\/spec/,
            exclude: /node_modules/,
            enforce: 'pre',
            use: [{
              loader: 'babel-loader'
            }]
          },
          {
            test: /\.js$/,
            exclude: [/node_modules/, /test/, /.spec\.js$/],
            enforce: 'pre',
            use: [{
              loader: 'istanbul-instrumenter-loader',
              query: {
                esModules: true
              }
            }]
          },
          {
            test: /\.js$/,
            include: /src/,
            exclude: [/node_modules/, /test/],
            use: [{
              loader: 'babel-loader'
            }]
          }
        ]
      }
    }
  };

  if(process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
    config.reporters.push('coveralls');
  }

  karma.set(config);
};

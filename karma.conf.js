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
      cache: true,
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            include: /test\/unit\/spec/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            }
          },
          {
            test: /\.js?$/,
            include: /src/,
            loader: 'babel-istanbul',
            query: {
              cacheDirectory: true,
            }
          }
        ],
        loaders: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, '/src'),
            loader: 'babel',
            query: {
              cacheDirectory: true
            }
          }
        ]
      }
    }
  };

  if(process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
  }

  karma.set(config);
};

# CONTRIBUTING

Contributions are always welcome (and needed), no matter how big or small the contribution. Before contributing, please read the [code of conduct](COC.md).

## Setup

1. Install Eleven on your system: https://github.com/dysfunc/eleven
1. Fork the repo: https://github.com/dysfunc/eleven
1. Run the following commands:

```sh
$ git clone YOUR_ELEVEN_REPO_URL
$ cd eleven
$ yarn install
```

If you do not have yarn installed, run: `$ npm install --global yarn`

## Development

```sh
$ gulp serve
```

## Bundling

```sh
$ gulp build
```

## Linting

```sh
$ gulp lint
```

## Testing

```sh
$ gulp test
```

## Pull Requests

We actively welcome your pull requests.

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.

## API Documentation

Use our [API documentation](API.md) to understand how to write plugins or extend Eleven's core functionality.

## License

By contributing to Eleven, you agree that your contributions will be licensed
under its [BSD license](LICENSE).

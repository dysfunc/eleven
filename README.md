<p align="center">
  <a href="https://dysfunc.github.io/eleven/">
    <img alt="Eleven" src="https://github.com/dysfunc/eleven/blob/master/app/img/logo.png?raw=true" width="400" />
  </a>
</p>

<p align="center">
  A web experiment of AI voice agents and visual interactions.
</p>

<p align="center">
  <a href='https://travis-ci.com/dysfunc/eleven/jobs/77966365'>
    <img src="https://travis-ci.com/dysfunc/eleven.svg?token=4SK3g33gtmzfiqqsvG76&branch=master" />
  </a>
  <a href='https://coveralls.io/github/dysfunc/eleven?branch=master'>
    <img src='https://coveralls.io/repos/github/dysfunc/eleven/badge.svg?branch=master&t=pgIC2r' alt='Coverage Status' />
  </a>
</p>

---

Eleven was started as an exploratory hacking project after some development in the voice space. The project has evolved into something that others showed interest in so we've decided to open it up for everyone. If you'd like to see this evolve even further we'd love the help! Please contribute!

**NOTE**
This uses experimental APIs which means you will need to use the latest version of Chrome. When viewing the demo you need to enable the microphone and speak clearly when issuing voice commands.

## Features
* **Pluggable** Easy interface to quickly build plugins for any Eleven agent.
* **Rules** Supports explicit rule-based command matching and AI engines (api.ai, wit.ai, ... etc).
* **Flexible** APIs are highly configurable, extensible and customizable.
* **Speech APIs** Powered by [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) interface of the Web Speech APIs.
* **Query Language** A light-weight jQuery-like solution but with a smaller footprint, faster performance, and designed for modern browsers. Provides a larger jQuery-compatible API which supports the majority of existing plugins out-of-the-box. If you know how to use jQuery then you already know how to use this query library.

## TODO

- [ ] Write a ton of tests
- [ ] Write a ton of useful documentation and provide examples

## Development Tools

We current use the following:

* Babel
* ESLint
* Gulp
* Jasmine
* Karma
* Nightwatch
* NPM
* SASS + SCSS Lint
* Webpack
* Yarn

## Development

Read the [Contribution Guide](CONTRIBUTING.md) for detailed instructions on how to setup your Eleven development environment.

## API Documentation

Use our [API documentation](API.md) to understand how to write plugins or extend Eleven's core functionality.

## Contributing

Contributions are always welcome (and needed), no matter how big or small the contribution. Before contributing, please read the [code of conduct](COC.md).

## Acknowledgements

Eleven was inspired by [annyang](https://github.com/TalAter/annyang) by [TalAter](https://github.com/TalAter).

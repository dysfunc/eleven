<p align="center">
  <a href="https://dysfunc.github.io/eleven/">
    <img alt="Yarn" src="https://github.com/dysfunc/eleven/blob/master/app/img/logo.png?raw=true" width="546">
  </a>
</p>

<p align="center">
  A web experiment of AI voice agents and visual interactions.
</p>

---

Eleven is something I started hacking on after doing a bunch of development in the voice space. This side project evolved to something that others showed interest in -- so I've decided to throw it out there for everyone.

## Features
* **Pluggable** API provides an easy way to build plugins for any Eleven agent.
* **Rules** Supports explicit rule-based command matching and AI engines (api.ai, wit.ai, ... etc).
* **Flexible** Eleven + API are highly configurable, extensible and completely customizable.
* **Speech APIs** Is powered by [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) interface of the Web Speech APIs.

## Install
Install yarn and dependencies
```sh
npm install --global yarn

yarn install
```

Install the scss-lint gem
```sh
gem install scss_lint
```

## Development
To build, lint and start the local development server:
```sh
gulp serve
```

To build and lint
```sh
gulp build
```

To lint JS and CSS
```sh
gulp lint
```

### Acknowledgements
This concept was originally spawned from [annyang](https://github.com/TalAter/annyang) by TalAter.

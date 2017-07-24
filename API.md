# API Documentation
Below you'll find basic instructions on how to extend Eleven or create your own plugins that can be used by others.

## Configure

To initialize Eleven you need to provide a CSS selector of an existing DOM element and your config (optional)

```js
Eleven('#container', {
  // options
});
```

```html
<div id="container"></div>
```

### Options

The default configuration

```js
const defaultConfig = {
  debug: false,
  language: 'en',
  commands: [],
  autoRestart: true,
  continuous: true,
  interimResults: true,
  maxAlternatives: 5,
  requiresWakeWord: true,
  wakeCommands: ['eleven', '11'],
  wakeSound: 'https://s3-us-west-1.amazonaws.com/chime.mp3',
  wakeCommandWait: 10000,
  template: [
    '<div class="eleven-container">',
      '<div class="eleven-container-inner">',
        '<div class="eleven-off">',
          '<span>ELEVEN</span>',
        '</div>',
        '<div class="eleven-on">',
          '<div class="bg"></div>',
          '<div class="waves"></div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('')
};
```

| Property         | Type    | Default   | Description
|------------------|---------|-----------|------------------------------------------------------------------------|
| debug            | Boolean | false     | If true, will dump logs into console for debugging |
| language         | String  | 'en-US'   | Returns and sets the language of the current SpeechRecognition |
| commands         | Array   | []        | Array of user defined commands |
| autoRestart      | Boolean | true      | Restart audio listener when audio end has been triggered |
| continuous       | Boolean | true      | Controls whether continuous results are returned for each recognition, or only a single result |
| interimResults   | Boolean | true      | Controls whether interim results should be returned or not. Interim results are results that are not yet final |
| maxAlternatives  | Integer | 5         | Sets the maximum number of SpeechRecognitionAlternatives provided per result. |
| requiresWakeWord | Boolean | true      | If true, the user is required to say a given word before issuing commands |
| wakeCommands     | Array   | ['eleven', '11'] | A collection of wake words the user must say before issuing commands
| wakeSound        | String  | ../chime.mp3     | Link to a hosted audio file that will be played when the wake word has been invoked
| wakeCommandWait  | Integer | 10000            | The amount of time to wait for commands before going back to sleep mode
| template         | String  | See Above        | HTML string containing the agent markup |

## Extending

Eleven allows for extension of its core using `Eleven.fn`, the same pattern jQuery utilizes for extending its prototype. This provides developers the flexibility to expand on the frameworks core functionality. You can easily add methods by doing the following:

```js
Eleven.fn.magic = function(){
  // do something
};

```

Once created, `Eleven('#eleven').magic` will be available to any Eleven instance.

## Plugins

The basic structure required for any plugin is to use the `Eleven.plugin` method to register the plugin for use by Eleven. You can write a plugin simply by defining the plugin namespace and callback function, as follows:

```js
Eleven.plugin('awesomeness', function(options){
  return new awesomeness(options);
});

function awesomeness(options){
  // do something with init when the plugin  has been initialized (just an example)
  this.init(options);
}

news.prototype = {
  init: function(options){
    console.log(options);
    // this method does something when invoked
  }
}
```

This originally followed jQuery's pattern for plugins which would've used `Eleven.fn` (see above), however, it felt cleaner to isolated plugins vs polluting `Eleven.fn` with the plugin registry.

## Development

It's recommended that you incapsulate plugins and/or new Eleven methods in a closure ([IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)) to prevent pollution of the global namespace, and prevents anything from outside the scope affecting its execution.

```js
(function(Eleven){
  Eleven.plugin('awesomeness', function(options){
    return new awesomeness(options);
  });

  ...
})(Eleven);
```

import $ from '../core';

$.fn.extend({
  parser(results){
    var scoped = false;

    if($.isFunction(this.options.onResult)){
      this.options.onResult.call(this, results);
    }

    setTimeout(() => {
      if(this.running && this.visualizer){
        this.running = false;
        this.visualizer.stop();
      }

      this.container.classList.remove('ready');
      this.activated = false;
    }, 750);

    for(var i = 0, k = results.length; i < k; i++){
      const recognizedSpeech = results[i].trim();

      if(this.options.debug){
        console.debug(`[Eleven] Speech recognized: ${recognizedSpeech}`);
      }

      if(this.context){
        scoped = this.lookup(this.context, this.commands[this.context], recognizedSpeech);
      }

      if(!scoped){
        this.context = null;

        for(const context in this.commands){
          const result = this.lookup(context, this.commands[context], recognizedSpeech);

          if(result === true){
            break;
          }
        }
      }
    }

    if($.isFunction(this.options.onResultNoMatch)){
      options.onResultNoMatch.call(this, results);
    }

    return this;
  },

  lookup(name, context, speech) {
    var match = false;

    for(const item in context){
      const command = context[item];
      const plugin = name === 'eleven' ? this : this.getPlugin(name);
      const phrase = command.phrase;
      const result = command.regexp.exec(speech);

      if(result){
        this.context = name;

        var parameters = result.slice(1);

        if(this.options.debug){
          console.debug(`[Eleven] Command match: ${name} - ${phrase}`);

          if(parameters.length){
            console.debug(`[Eleven] Command results contain parameters: ${JSON.stringify(parameters, null, 2)}`);
          }
        }

        command.callback.call(this, parameters, speech, phrase, plugin);

        if($.isFunction(this.options.onResultMatch)){
          this.options.onResultMatch.call(this, parameters, speech, phrase, results);
        }

        this.container.classList.remove('ready');

        this.activated = false;

        match = true;

        break;
      }
    }

    return match;
  },

  result(event){
    const result = event.results[event.resultIndex];
    const results = [];

    if(this.options.wakeCommands.indexOf(result[0].transcript.trim()) !== -1){
      if(!this.activated){
        this.activated = true;
        this.container.classList.add('ready');
        this.wakeSound.play();

        this.commandTimer = setTimeout(() => {
          this.activated = false;
          this.container.classList.remove('ready');
        }, this.options.wakeCommandWait);
      }
    }else {
      if(this.activated){
        if(!this.running && this.visualizer){
          this.running = true;
          this.visualizer.start();
          clearTimeout(this.commandTimer);
        }

        for(var i = 0, k = result.length; i < k; i++){
          if(result.isFinal){
            results[i] = result[i].transcript.trim();
          }
        }

        if(results.length){
          this.parser(results);
        }
      }
    }

    return this;
  }
});

export default $;

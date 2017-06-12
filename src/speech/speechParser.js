import Eleven from '../core';
import { each, indexOf } from '../common/helpers';

Eleven.fn.extend({
  parser(results){
    var match = false;

    if(Eleven.isFunction(this.options.onResult)){
      this.options.onResult.call(this, results);
    }

    setTimeout(() => this.stop(true), 750);

    each(results, (result) => {
      const speech = result.replace(Eleven.regexp.wakeCommands, '').trim();

      if(this.options.debug){
        console.debug(`[Eleven] Recognized speech: ${speech}`);
      }

      if(this.context){
        match = this.evaluate(this.context, this.commands[this.context], speech);
      }

      if(!match){
        this.context = null;

        Eleven.each(this.commands, (context) => {
          match = this.evaluate(context, this.commands[context], speech);

          return !match;
        });
      }
    });

    if(!match){
      if(Eleven.isFunction(this.options.onResultNoMatch)){
        options.onResultNoMatch.call(this, results);
      }
    }

    if(Eleven.device.isMobile){
      this.start();
    }

    return this;
  },

  evaluate(name, context, speech){
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
            console.debug(`[Eleven] Command results contain parameters: ${Eleven.stringify(parameters, null, 2)}`);
          }
        }

        command.callback.call(this, parameters, speech, phrase, plugin);

        if(Eleven.isFunction(this.options.onResultMatch)){
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
    this.recognition.onend = null;

    const result = event.results[event.resultIndex];
    const first = result[0].transcript.trim();
    const results = [];

    if(first.toLowerCase() === 'stop'){
      this.parser(results['stop']);
    }

    if(indexOf(this.options.wakeCommands, first) > -1){
      if(!this.activated){
        this.activated = true;
        this.container.classList.add('ready');

        if(Eleven.device.isDesktop){
          this.wakeSound.play();
        }else{
          this.start();
        }

        this.commandTimer = setTimeout(() => this.stop(true), this.options.wakeCommandWait);
      }
    }else{
      clearTimeout(this.commandTimer);

      if(this.activated){
        if(!this.running && this.visualizer){
          this.running = true;
          this.visualizer.start();
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

export default Eleven;

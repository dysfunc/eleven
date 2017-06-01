import $ from './core';
import SpeechRecognition from './speech/speechRecognition';
import { document } from './common/document';

$.fn.extend({
  /**
   * Iterates over a collection of objects
   * @param {Mixed}    collection Collection to iterate over
   * @param {Function} fn         Callback function
   */
  error(event){
    const { error } = event;

    if(error === 'no-speech' || error === 'aborted'){
      this.start();
    }else{
      if(this.options.debug){
        console.warn(`[Eleven] SpeechRecognition event error: ${error}`);
      }
    }
  },
  /**
   * Initializes the SpeechRecognition API, adds commands and binds event
   * listeners. To avoid overlap with other tabs listening we used the
   * `pagevisibility` API to abort the inactive tab instance.
   * @return {Object} Eleven instance
   */
  enable(){
    const options = this.options;
    // reference to SpeechRecognition instance
    this.recognition = new SpeechRecognition();
    // set language
    this.recognition.lang = options.language;
    // set max alternative results
    this.recognition.maxAlternatives = options.maxAlternatives;
    // set continuous listening
    this.recognition.continuous = options.continuous;
    // return results immediately so we can emulate audio waves
    this.recognition.interimResults = options.interimResults;
    // if true, this will pass all speech back to the onCommand callback
    if(options.useEngine){
      this.addCommands({
        '*msg': options.onCommand
      });
    }
    // add commands
    this.addCommands('eleven', {
      'stop': () => {
        if(this.listening){
          this.stop();

          setTimeout(() => {
            $.resetView(() => {
              document.body.classList.remove('interactive');
            });
          }, 500);
        }

        if($.isFunction(options.onStop)){
          this.context = null;
          options.onStop.call(this);
        }
      }
    });
    // load user defined commands
    if(options.commands){
      this.addCommands('eleven', options.commands);
    }
    // check if wake commands exist. if so, create regexp to strip from speech matches
    if(options.wakeCommands.length){
      $.regexp.wakeCommands = new RegExp(`^(${options.wakeCommands.join('|')})\\s+`, 'i');
    }
    // setup all SpeechRecognition event listeners
    this.listen();
    // fire activation event
    if($.isFunction(options.onActivate)){
      options.onActivate.call(this);
    }

    try {
      this.recognition.start();
    }catch(e){
      if(this.options.debug){
        console.warn(`[Eleven] Error trying to start SpeechRecognition: ${e.message}`);
      }
    }

    this.start();

    return this;
  },
  /**
   * Binds callback functions to `onstart`, `onerror`, `onresult`,
   * `onend` and `onaudioend` of SpeechRecognition API.
   */
  listen(){
    this.recognition.onend = $.proxy(this.stop, this);
    this.recognition.onerror = $.proxy(this.error, this);
    this.recognition.onresult = $.proxy(this.result, this);
    this.recognition.onstart = $.proxy(this.start, this);
    this.recognition.onaudioend = $.proxy(this.stop, this);
    this.recognition.onaudiostart = () => {
      if($.isFunction(this.options.onStart)){
        this.options.onStart.call(this);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        if(this.recognition && this.recognition.abort && this.listening){
          if(this.debug){
            console.debug('[Eleven] User switched to another tab. Disabling listeners.');
          }

          this.stop();
          this.recognition.abort();
        }
      }else{
        this.recognition.start();
        this.stop();
        this.start();
      }
    });

  },

  start(){
    if(!this.listening){
      this.listening = true;
    }

    return this;
  },

  stop(){
    if(this.visualizer){
      this.running = false;
      this.visualizer.stop();
      this.container.classList.remove('ready');
    }

    if($.isFunction(this.options.onEnd)){
      this.options.onEnd.call(this);
    }

    return this;
  }
});

export default $;

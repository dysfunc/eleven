import Eleven from '../core';
import SpeechRecognition from '../speech/speechRecognition';
import { document } from '../common/document';
import { each } from '../common/helpers';

Eleven.fn.extend({
  /**
   * Fired when a speech recognition error occurs
   *
   * Error codes:
   * -----------
   * "no-speech": No speech was detected.
   * "aborted": Speech input was aborted somehow.
   * "audio-capture": Audio capture failed.
   * "network": Network communication required to complete the recognition failed.
   * "not-allowed": The user agent is not allowing any speech input to occur for reasons of security, privacy or user preference.
   * "service-not-allowed": The user agent is not allowing the requested speech service to be used either because the user agent doesn't support the selected one or because of reasons of security, privacy or user preference.
   * "bad-grammar": There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.
   * "language-not-supported": The language was not supported.
   *
   * @param {Mixed}    collection Collection to iterate over
   * @param {Function} fn         Callback function
   */
  error(event){
    const { error } = event;

    if(Eleven.isFunction(this.options.onError)){
      this.options.onError(error, event);
    }

    if(error === 'network' || error === 'not allowed' || error === 'service-not-allowed'){
      this.options.autoRestart = false;
    }

    if(this.options.debug){
      console.warn(`[Eleven] SpeechRecognition event error: ${error} \n ${JSON.stringify(event, null, 2)}`);
    }

    return this;
  },
  /**
   * Initializes the SpeechRecognition API, adds commands and binds event
   * listeners. To avoid overlap with other tabs listening we used the
   * `pagevisibility` API to abort the inactive tab instance.
   * @return {Object} Eleven instance
   */
  enable(){
    const options = this.options;
    // if true, this will pass all speech back to the onCommand callback
    if(options.useEngine){
      this.addCommands('eleven', {
        '*msg': options.onCommand
      });
    }
    // add commands
    this.addCommands('eleven', {
      'stop': () => {
        this.stop();

        setTimeout(() => Eleven.resetView(() => document.body.classList.remove('interactive')), 500);

        if(Eleven.isFunction(options.onStop)){
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
      Eleven.regexp.wakeCommands = new RegExp(`^(${options.wakeCommands.join('|')})\\s+`, 'i');
    }
    // fire activation event
    if(Eleven.isFunction(options.onActivate)){
      options.onActivate.call(this);
    }
    // prevent multi-tab issues running SpeechRecognition/SpeechSynthesis
    document.addEventListener('visibilitychange', () => {
      if(document.hidden){
        if(this.recognition && this.recognition.abort){
          if(this.debug){
            console.debug('[Eleven] User switched to another tab - disabling recognition.');
          }

          if(this.recognition){
            this.recognition.stop();
            this.recognition = null;
            this.stop();
          }
        }
      }else{
        if(!this.recognition && this.options.autoRestart){
          this.start();
        }
      }
    });

    this.start();

    return this;
  },

  start(){
    // reference to SpeechRecognition instance
    this.recognition = new SpeechRecognition();
    // set language
    this.recognition.lang = this.options.language;
    // set max alternative results
    this.recognition.maxAlternatives = this.options.maxAlternatives;
    // set continuous listening
    this.recognition.continuous = this.options.continuous;
    // return results immediately so we can emulate audio waves
    this.recognition.interimResults = Eleven.device.isDesktop ? this.options.interimResults : false;
    /**
     * runs when the voice recognition ends. this should be set to null in recognition.onresult
     * to prevent it running if you have a successful result. if recognition.onend runs, you know
     * the voice recognition API hasn’t understood the user.
     * @return {Object} Eleven
     */
    this.recognition.onend = () => this.stop(true);
    /**
     * Fired when a speech recognition error occurs
     * @param  {Object} error SpeechRecognition error object { error, message }
     * @return {Object}       Eleven
     */
    this.recognition.onerror = (error) => this.error(error);
    /**
     * Fires when you have a result from the voice recognition
     * @param  {Object} event Event that contains the interim or final results
     * @return {Object}        Eleven
     */
    this.recognition.onresult = (event) => this.result(event);
    // this.recognition.onstart = () => this.start();
    // this.recognition.onaudioend = () => this.start();
    this.recognition.onaudiostart = () => {
      if(Eleven.isFunction(this.options.onStart)){
        this.options.onStart.call(this);
      }
    };

    this.recognition.start();

    return this;
  },

  stop(restart){
    if(this.visualizer){
      this.running = false;
      this.visualizer.stop();
      this.container.classList.remove('ready');
    }

    if(Eleven.isFunction(this.options.onEnd)){
      this.options.onEnd.call(this);
    }

    if(restart && this.options.autoRestart){
      this.start();
    }

    return this;
  }
});

Eleven.extend(Eleven, {
  /**
   * Removes all rendered elements from the viewport and executes a callback
   * @param  {Function} fn Function to execute once the view has been cleared
   */
  resetView(selector = '.results', fn){
    if(Eleven.isFunction(selector)){
      fn = selector;
      selector = '.results';
    }

    const results = document.querySelectorAll(selector);

    if(results && results.length){
      results.forEach((element) => element.parentNode && element.parentNode.removeChild(element));
    }

    if(Eleven.isFunction(fn)){
      fn();
    }

    return this;
  }
});

export default Eleven;

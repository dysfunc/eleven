import Eleven from '../core';
import SpeechRecognition from '../speech/speechRecognition';
import { document } from '../common/document';
import { slice } from '../common/arrays';
import { each } from '../common/helpers';

var lastStartTime = 0, elapsedTimer = null;

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

        setTimeout(() => Eleven.clearStage(() => document.body.classList.remove('interactive')), 500);

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
      if(document.hidden && this.recognition.abort){
        if(this.debug){
          console.debug('[Eleven] User switched to another tab - disabling recognition.');
        }

        this.recognition.abort();
        this.stop();
      }else{
        if(!this.recognition && this.options.autoRestart){
          this.start();
        }
      }
    });

    this.start();

    return this;
  },
  /**
   * This creates a new SpeechRecognition object instance, binds to its event handlers,
   * and starts our timer to ensure/mitigate speech loss.
   * @return {Object} Eleven
   */
  start(){
    lastStartTime = new Date().getTime();
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

    this.watch();

    return this;
  },
  /**
   * Stops all visual interactions, removes interactive classes from the stage, and
   * executes a callback (optional)
   * @param  {Boolean} restart If true, start will be invoked to continue listening
   * @return {Object}          Eleven
   */
  stop(restart){
    if(this.visualizer){
      this.activated = false;
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
  },
  /**
   * SpeechRecognition will die after 60 secs. This will continuously restart the agent
   * so things are not missed when the user speaks
   * @return {Object} Eleven
   */
  watch(){
    // control SpeechRecognition restarts
    const timeSinceLastStart = new Date().getTime() - lastStartTime;

    if(timeSinceLastStart < 1000){
      elapsedTimer = setTimeout(() => {
        lastStartTime = new Date().getTime();

        try {
          this.recognition.start();
        }catch(error){
          if(this.options.debug){
            console.warn(`[Eleven] Error trying to start SpeechRecognition: ${error.message}`);
          }
        }
      }, 1000 - timeSinceLastStart);
    }else{
      lastStartTime = new Date().getTime();
    }

    return this;
  }
});

Eleven.extend({
  /**
   * Removes all rendered elements from the viewport and executes a callback
   * @param  {Function} fn Function to execute once the view has been cleared
   */
  clearStage(fn){
    const elements = [...Eleven.stage.childNodes];

    each(elements, (element) => Eleven.stage.removeChild(element));

    if(Eleven.isFunction(fn)){
      fn();
    }

    return this;
  }
});

export default Eleven;

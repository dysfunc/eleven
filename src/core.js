import window from './common/window';
import { document } from './common/document';

var initialized = null;

/**
 * Eleven
 * @constructor
 * @param  {Object} options Object containing Eleven's configuration
 * @return {Object}         Eleven instance
 */
const Eleven = (options) => initialized || new Eleven.fn.init(options);

Eleven.fn = Eleven.prototype = {
  constructor: Eleven,
  version: '1.0.0',
  init(options){
    const defaultConfig = {
      autoRestart: true,
      container: '#eleven',
      debug: false,
      language: 'en-US',
      commands: [],
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      requiresWakeWord: true,
      speechAgent: 'Google UK English Female',
      stage: '#stage',
      useEngine: false,
      wakeCommands: ['eleven', '11'],
      wakeSound: 'audio/chime.mp3',
      wakeCommandWait: 10000,
      template: `
        <div class="eleven-container">
          <div class="eleven-container-inner">
            <div class="eleven-off">
              <span>ELEVEN</span>
            </div>
            <div class="eleven-on">
              <div class="bg"></div>
              <div class="waves"></div>
            </div>
          </div>
        </div>
      `
    };
    // store options
    this.options = Eleven.extend({}, defaultConfig, options || {});
    // create ref to stage element
    Eleven.stage = document.querySelector(this.options.stage);
    // add stage class
    Eleven.stage.className += ' stage';
    // create a ref to the container element
    Eleven.container = this.container = document.querySelector(this.options.container);
    // assign eleven class to container
    this.container.className += ' eleven';
    // create markup
    this.container.innerHTML = this.options.template;
    // reference to all of our commands
    this.commands = {};
    // reference hash for installed plugins
    this.plugins = {};
    // create audio sound
    this.wakeSound = new Audio(this.options.wakeSound);
    // create interactive audio wave orb (aka Eleven)
    this.visualize();
    // prevent initialize until called
    if(!this.options.delayStart){
      // enable all the things!
      this.enable();
    }
    // print the instance config
    if(this.options.debug){
      Eleven.debug = true;
      console.debug(this);
    }
    // configure speechSynthesis voices
    if(Eleven.device.isDesktop){
      this.voices();
    }

    Eleven.container.addEventListener('click', () => {
      if(!this.activated){
        this.result({ results: [[{ transcript: 'eleven' }]], resultIndex: 0 });
      }
    });
    // allow single instance (Speech API does not support multiple instances yet)
    initialized = this;
    // always return this for chaining
    return this;
  }
};

Eleven.fn.init.prototype = Eleven.fn;

export default Eleven;

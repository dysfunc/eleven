import Eleven from '../core';
import Parser from './commandsParser';

Eleven.fn.extend({
  /**
   * Add one or more commands to Eleven's registry
   *
   * Example:
   *
   * var agent = Eleven();
   *
   * // add multiple commands
   * agent.addCommands({
   *   'hello :name': fn,
   *   'hey (there)': fn,
   *   'hi': fn
   * });
   *
   * Add plugin scoped commands when registering them after initializing Eleven
   *
   * agent.plugin('news', {
   *   commands: {
   *     'show me the (top) stories': function(){
   *       // do something when matched
   *     }
   *   }
   * });
   *
   * @param  {Object} context  String containing the commands execution context
   * @param  {Object} commands Object containing commands and their callbacks
   * @return {Object}          Eleven instance
   */
  addCommands(context, commands){
    const command = {};

    if(!Eleven.isString(context)){
      commands = context;
      context = 'eleven';
    }

    for(const phrase in commands){
      command[context] = commands[phrase];

      if(command[context]){
        if(Eleven.isFunction(command[context])){
          this.registerCommands(context, phrase, Parser(phrase), command[context]);
        }
        else if(Eleven.isObject(command[context]) && Eleven.isRegExp(command[context].regexp)){
          this.registerCommands(context, phrase, new RegExp(command[context].regexp.source, 'i'), command[context].callback);
        }
        else{
          if(this.options.debug){
            console.debug(`[Eleven] Command registration failed: ${phrase}`);
          }
        }
      }
    }

    return this;
  },
  /**
   * Adds the passed command to the command list
   * @param {String}   context   String containing the commands plugin namespace
   * @param {String}   phrase    String continaing the command to listen for
   * @param {String}   command   String representing the RegExp for the command
   * @param {Function} callback  Function to execute when command has been invoked
   */
  registerCommands(context, phrase, command, callback){
    if(!this.commands[context]){
      this.commands[context] = {};
    }

    this.commands[context][phrase] = { callback, phrase, regexp: command };

    if(this.options.debug){
      console.debug(`[Eleven] Command registered: ${phrase}`);
    }
  },
  /**
   * Removes one or more commands from the command registry
   *
   * // remove a single command from Eleven
   * agent.removeCommands('hi');
   *
   * // remove a single command from a plugin
   * agent.removeCommands('news', 'hi');
   *
   * // remove multiple commands from Eleven
   * agent.removeCommands(['hello :name', 'hi']);
   *
   * // remove multiple commands from a plugin
   * agent.removeCommands('news', ['get news', 'todays headlines']);
   *
   * //remove all commands
   * agent.removeCommands();
   *
   * @param  {String} context  String containing the plugin namespace to remove commands from
   * @param  {Mixed}  commands String or Array containing commands to remove from the command list
   * @return {Object}         Eleven instance
   */
  removeCommands(context, commands){
    if(!arguments.length){
      return (this.commands = []) && this;
    }

    if(arguments.length === 1){
      commands = context;
      context = 'eleven';
    }

    const currentCommmands = this.commands[context];

    if(Eleven.isString(commands)){
      commands = [commands];
    }

    Eleven.each(commands, (command) => {
      if(currentCommmands[command]){
        delete currentCommmands[command];
      }
    });

    return this;
  }
});

export default Eleven;

import $ from './core';
import parser from './commandParser';

$.fn.extend({
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
   * // or you can add a single command
   * agent.addCommands('hi', fn);
   *
   * @param  {Object} commands Object containing commands and their callbacks
   * @return {Object}          Eleven instance
   */
  addCommands(commands){
    var command = {};

    if(typeof(commands) === 'string' && arguments[1]){
      command[commands] = arguments[1];
      commands = command;
    }

    for(var phrase in commands){
      command = commands[phrase];

      if(command){
        if($.isFunction(command)){
          this.registerCommands(phrase, parser(phrase), command);
        }
        else if($.isObject(command) && $.isRegExp(command.regexp)){
          this.registerCommands(phrase, new RegExp(command.regexp.source, 'i'), command.callback);
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
   * @param {String}   phrase   String continaing the command to listen for
   * @param {String}   command  String representing the RegExp for the command
   * @param {Function} callback Function to execute when command has been invoked
   */
  registerCommands(phrase, command, callback){
    this.commands[phrase] = { callback, phrase, regexp: command };

    if(this.options.debug){
      console.debug(`[Eleven] Command registered: ${phrase}`);
    }
  },
  /**
   * Remove one or more commands from Eleven's registry
   *
   * Example:
   *
   * var agent = Eleven();
   *
   * agent.addCommands({
   *   'hello :name': fn,
   *   'hey (there)': fn,
   *   'hi': fn
   * });
   *
   * // remove a single command
   * agent.removeCommands('hi');
   *
   * // remove multiple commands
   * agent.removeCommands(['hello :name', 'hi']);
   *
   * //remove all commands
   * agent.removeCommands();
   *
   * @param  {Mixed} commands String or Array containing commands to remove from the command list
   * @return {Object}         Eleven instance
   */
  removeCommands(commands){
    var currentCommmands = this.commands;

    if(commands === undefined){
      return (this.commands = []) && this;
    }

    if(typeof(command) === 'string'){
      commands = [commands];
    }

    $.each(commands, (command) => {
      if(currentCommmands[command]){
        delete currentCommmands[command];
      }
    });

    return this;
  }
});

export default $;

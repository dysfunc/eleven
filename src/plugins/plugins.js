import Eleven from '../core';

// plugin registry cache
const plugins = {};

/**
 * Adds plugin to the plugin registry for any Eleven instance to bind to
 * @param {String}  name String containing the plugins unique name
 * @param {Functio} fn   Constructor function of plugin
 */
Eleven.plugin = (name, fn) => {
  if(!plugins[name]){
    if(!Eleven.isFunction(fn)){
      throw `"${name}" does not have a constructor.`;
    }else{
      plugins[name] = fn;
    }
  }

  return this;
};

Eleven.fn.extend({
  /**
   * Plugin cache
   * @type {Object}
   */
  plugins: {},
  /**
   * Returns the specified plugin
   * @param  {String} name String containing the plugins unique name
   * @return {Object}      The plugin instance
   */
  getPlugin(name){
    if(!this.plugins[name]){
      throw `"${name}" plugin does not exist!`;
    }

    return this.plugins[name];
  },
  /**
   * Registers a plugin with a given Eleven instance
   * @param {String} name    String containing the plugins unique name
   * @param {Object} options Object containing the options for that plugin
   * @type {Object}          Eleven
   */
  plugin(name, options = {}){
    if(!this.plugins[name] && plugins[name]){

      if(options.commands){
        this.addCommands(name, options.commands);
      }

      this.plugins[name] = new plugins[name](options);
    }else if(this.plugins[name] && plugins[name]){
      console.warn(`"${name}" plugin has already been loaded!`);
    }else{
      throw `"${name}" plugin does not exist!`;
    }

    return this;
  }
});

export default Eleven;

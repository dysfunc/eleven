import document from '../document';

const cookies = {
  /**
   * Determines whether a specific cookie exists
   * @param  {String} key String containing the cookie key/name to for
   * @return {Boolean}    The true/false result
   */
  contains: function(key){
    if(!key){
      return false;
    }

    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
  },
  /**
   * Returns a cookie from document.cookies
   * @param  {String} key String containing the cookie name/key to lookup
   * @return {String}     The value of the passed cookie key
   */
  get: function(key){
    if(!key){
      return null;
    }

    return decodeURIComponent(
      document.cookie.replace(
        new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1'
      )
    );
  },
  /**
   * Returns all cookies keys found inside document.cookies
   * @return {Array} Collection of cookie key values
   */
  keys: function(){
    var keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);

    for(var i = 0, k = keys.length; i < k; i++){
      keys[i] = decodeURIComponent(keys[i]);
    }

    return keys;
  },
  /**
   * Removes a cookie from document.cookies
   * @param  {String} key    String containing the cookie key/name to lookup
   * @param  {String} path   String containing the path defined during cookie creation
   * @param  {String} domain String containing the defined during cookie creation
   * @return {Object}        Cookie singleton
   */
  remove: function(key, path, domain){
    if(!this.contains(key)){
      return this;
    }

    document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');

    return this;
  },
  /**
   * Creates a new cookie from the passed arguments
   * @param  {String} key     String containing the cookie key/name to lookup
   * @param  {String} value   String containing the value you want to set inside the cookie
   * @param  {Mixed} age      Value of expiration
   * @param  {String} path    String containing the path in which the cookie will be available
   * @param  {String} domain  String containing the domains/subdomains the cookie will be available
   * @param  {Boolean} secure True, if secure
   * @return {Object}         Cookie singleton
   */
  set: function(key, value, age, path, domain, secure){
    if(!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)){
      return false;
    }

    var expires = '';

    if(age){
      switch(age.constructor){
        case Number:
          expires = age === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + age;
          break;
        case String:
          expires = '; expires=' + age;
          break;
        case Date:
          expires = '; expires=' + age.toUTCString();
          break;
      }
    }

    document.cookie = [
      encodeURIComponent(key) + '=' + encodeURIComponent(value),
      expires,
      (domain ? '; domain=' + domain : ''),
      (path ? '; path=' + path : ''),
      (secure ? '; secure' : '')
    ].join('')

    return this;
  }
};

export default cookies;

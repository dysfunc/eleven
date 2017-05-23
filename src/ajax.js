import $ from './core';

  var activeXHR = 0,
      jsonPUID = 0,
      emptyFn = function(){};

  $.extend({
    /**
     * Default XHR configuration
     * @type {Object}
     */
    ajaxSettings: {
      accepts: {
        html   : 'text/html',
        json   : 'application/json',
        script : 'text/javascript, application/javascript',
        text   : 'text/plain',
        xml    : 'application/xml, text/xml'
      },
      async       : true,
      beforeSend  : emptyFn,
      complete    : emptyFn,
      context     : document,
      crossDomain : false,
      error       : emptyFn,
      global      : true,
      headers     : {},
      callback    : {
        fn        : 'jsonCallback',
        param     : 'callback'
      },
      success     : emptyFn,
      timeout     : 0,
      type        : 'GET'
    },
    /**
     * Creates an asynchronous XHR request
     * @param  {Object} config  Object containing the request configuration
     * @return {Object}         XHR request object
     */
    ajax(config){
      var callback = $.regexp.callback.test(config.url),
          config = $.extend(true, {}, $.ajaxSettings, config || {}),
          data = config.data && $.isObject(config.data) && (config.data = $.params(config.data)) || null,
          context = config.context,
          contentType = config.contentType || 'application/x-www-form-urlencoded',
          headers = config.headers,
          method = config.type.toUpperCase(),
          mimeType = config.accepts[config.dataType],
          protocol = (/^((http|ftp|file)(s?)\:)?/).test(config.url) ? RegExp.$1 : window.location.protocol,
          type = config.dataType,
          url = config.url || !config.url && (config.url = window.location.toString()),
          xhr = config.xhr = new window.XMLHttpRequest();

      if(method === 'GET' && data){
        config.url += (config.url.indexOf('?') < 0 ? '?' : '&') + data;
      }

      if(config.dataType === 'jsonp'){
        return $.jsonP(config);
      }

      xhr.onreadystatechange = function readyStateChange(){
        var error = false,
            requestTimeout,
            result = '';

        activeXHR++;

        if(xhr.readyState === 4){
          clearTimeout(requestTimeout);

          if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol === 'file:')){
            result = xhr.responseText;

            try {
              if(type === 'json' && !(/^\s*$/g).test(result)){
                result = $.parseJSON(result);
              }
              else if(type === 'xml'){
                result = $.parseXML(xhr.responseXML);
              }
              else if(type === 'script'){
                (1, eval)(result);
              }
            }catch(e){
              error = e;
            }

            if(error){
              config.error.call(context, xhr, 'parsererror', error);
            }else{
              config.success.call(context, result, 'success', xhr);
            }
          }else{
            config.error.call(context, xhr, 'error', error);
          }

          config.complete.call(context, xhr, error ? 'error' : 'success');

          activeXHR--;
        }
      }

      if(config.beforeSend.call(context, xhr, config) === false){
        xhr.abort();
        activeXHR--;
        return false;
      }

      if(mimeType){
        headers['Accept'] = mimeType;
        xhr.overrideMimeType && xhr.overrideMimeType(mimeType.split(',')[1] || mimeType.split(',')[0]);
      }

      if(contentType || (data && method !== 'GET')){
        headers['Content-Type'] = contentType;
      }

      xhr.open(method, config.url, config.async);

      for(var header in headers){
        xhr.setRequestHeader(header, config.headers[header]);
      }

      if(config.timeout > 0){
        requestTimeout = setTimeout(function(){
          xhr.onreadystatechange = emptyFn;
          config.error.call(context, xhr, 'timeout');
          xhr.abort();
          activeXHR--;
        }, config.timeout);
      }

      xhr.send(data);

      return xhr;
    },
    /**
     * Shortcut JSONP method
     * @param  {Object}   config  The JSONP config, including data (e.g. url: '...', data: { param: 'value' } )
     * @param  {Function} success The callback function to execute upon success
     * @param  {Function} error   The callback function to execute upon failure
     */
    jsonp(config, success, error){
      if(typeof(config) !== 'object' || config && !config.url){
        return undefined;
      }

      return $.ajax(
        $.extend(true, {
          dataType: 'jsonp',
          success: (success || emptyFn),
          error: (error || emptyFn)
        }, config)
      );
    },
    /**
     * Fetch JSON data cross-domain with JSONP
     * @param  {Object} config The request configuration
     * @return {Object}
     */
    jsonP(config){
      var script = document.createElement('script'),
          fn = config.jsonp || 'jsonpCallback' + (jsonPUID++),
          context = config.context,
          data,
          timeout;

      script.src = config.url.replace($.regexp.callback, '?$1=' + fn);

      script.onerror = function(){
        config.xhr.abort();
        config.error.call(context, null, 'error');
      };

      script.onload = function(){
        if($.isFunction(config.success)){
          config.success.call(context, data[0]);
        }

        script.parentNode.removeChild(script);

        timeout && clearTimeout(timeout) && (timeout = null);

        try {
          delete window[fn];
        }catch(e){
          window[fn] = null;
        }

        data = null;
      }

      document.head.appendChild(script);

      window[fn] = function(){
        data = arguments;
      }

      if(config.timeout > 0){
        timeout = setTimeout(function(){
          script.parentNode.removeChild(script);

          if(fn in window){
            window[fn] = emptyFn;
          }

          config.error.call(context, null, 'timeout');
          config.xhr.abort();
        }, config.timeout);
      }

      return {};
    },
    /**
     * Append additonal params to a URL query string
     * @param  {String} url     The URL to append the new items to
     * @param  {String} query   The additional query params
     * @return {String}         The new query string
     */
    appendQuery(url, query) {
      return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    },
    /**
     * Convert query string to key/value pairing
     * @param  {String} query The URL containing the params
     * @return {Object}       The new object containing the key value pairs from the query string
     */
    deparam(query){
      var result = {};

      if(!query){
        return result;
      }

      $.each(query.split('&'), function(index, value){
        if(value){
          var param = value.split('=');
          result[param[0]] = param[1];
        }
      });

      return result;
    },
    /**
     * Helper function to convert our data object to a valid URL query string
     * @param  {Object} data    The object containing all our query data
     * @return {String}         The query string
     */
    params(data){
      return $.serialize([], data).join('&');//.replace('%20', '+');
    },
    /**
     * Build query string from passed data arguments
     * @param  {Array}  params  The array to store our key = value pairs in
     * @param  {Object} data    The object containing the query data
     * @param  {String} scope   The scope of the params
     * @return {Array}          The updated params array
     */
    serialize(params, data, scope){
      var array = $.isArray(data),
          escape = encodeURIComponent;

      $.each(data, function(key, value){
        if(scope){
          key = scope + '[' + (array ? '' : key) + ']';
        }

        if($.isPlainObject(value)){
          $.serialize(params, value, key)
        }else{
          params.push(escape(key) + '=' + escape(value));
        }
      });

      return params;
    }
  });

  /**
   * Shortcut GET request methods
   * @param  {String}   url     The request URL
   * @param  {Object}   data    The hash map of key/value pairs that will be sent with the request (optional)
   * @param  {Function} success The success callback function
   * @param  {Function} error   The failure callback function
   */
  ['get', 'getJSON'].forEach(function(method, index){
    $[method] = function(url, data, success, error){
      $.isFunction(data) && (error = success) && (success = data) && (data = {});

      return $.ajax({
        url: url,
        data: data,
        dataType: (index === 0 ? 'html' : 'json'),
        success: (success || emptyFn),
        error: (error || emptyFn)
      });
    }
  });

  export default $;

;(function(window, Eleven, $, oauthSignature){
  Eleven.plugin('yelp', function(options){
    return new yelp(options);
  });

  var yelp = function(options){
    const defaultOptions = {
      params: {
        hello: 'world'
      }
    };

    this.options = $.extend(true, defaultOptions, options || {});

    return this;
  };

  $.extend(yelp.prototype, {
    createList: function(data, speech){
      // clear any results from previous commands
      Eleven.clearStage();

      var container = document.createElement('div'),
          ul = document.createElement('ul'),
          h1 = document.createElement('h1');

      h1.innerHTML = speech;

      container.append(h1);

      container.id = 'yelp-results';
      container.className = 'results';

      data.forEach(function(item){
        var li = document.createElement('li');

        li.innerHTML = [
          '<div class="picture"><img src="' + item.image_url + '"></div>',
          '<div class="details">',
            '<h1>' + item.name + '</h1>',
            '<small>' + (item.location.neighborhoods[0] || '') + '</small>',
            '<div class="rating"><img src="' + item.rating_img_url_large + '"></div>',
            // '<p>' + item.snippet_text + '</p>',
          '</div>'
        ].join('');

        ul.appendChild(li);
      });

      container.appendChild(ul);

      Eleven.stage.appendChild(container);

      setTimeout(function(){
        container.classList.add('show');
      }, 600);
    },
    getConfig: function(){
      var randomString = function(length){
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            result = '';

        for(var i = length; i > 0; --i){
          result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
      };

      return $.extend({}, {
        callback: 'jsonpCallback1',
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: new Date().getTime(),
        oauth_nonce: randomString(32)
      }, this.options.params);
    },
    generateSignature: function(method, url, params, consumerSecret, tokenSecret, options){
      return oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, options)
    },
    search: function(params, speech, callback){
      var self = this,
          url = 'https://api.yelp.com/v2/search',
          params = $.extend({}, this.getConfig(), params);

      document.body.classList.add('interactive');

      // add our signature
      params.oauth_signature = this.generateSignature('GET', url, params, params.consumerSecret, params.tokenSecret, { encodeSignature: false });

      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'jsonpCallback1',
        data: params,
        success: function(data){
          self.createList(data.businesses, speech);

          if($.isFunction(callback)){
            callback(data);
          }

          console.log(data);
        },
        error: function(data){
          console.log(data);
          document.body.classList.remove('interactive');
        }
      });
    }
  });

})(window, Eleven, Eleven.query, oauthSignature);

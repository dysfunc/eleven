;(function(window, Eleven, $){

  Eleven.plugin('webSearch', function(options){
    return new webSearch(options);
  });

  var webSearch = function(options){
    this.options = $.extend(true, {}, options || {});
    return this;
  };

  $.extend(webSearch.prototype, {
    createList: function(data, total){
      var articles = data.items.slice(0, 1)

      Eleven.clearStage();

      var container = document.createElement('div'),
          ul = document.createElement('ul');

      articles.forEach(function(article){
        var imgURL = article.pagemap.cse_image[0].src;

        var li = document.createElement('li');

        li.innerHTML = [
          '<div class="news-article">',
            '<div class="picture">',
              '<div class="img" style="background: url(' + imgURL + ') no-repeat center center;"></div>',
            '</div>',
            '<div class="details">',
              '<h1>' + article.htmlTitle + '<h1>',
              '<p>' + article.htmlSnippet + '</p>',
            '</div>',
          '</div>'
        ].join('');

        ul.appendChild(li);
      });


      setTimeout(function(){
        container.id = 'news-results';
        container.className = 'results';
        container.appendChild(ul);
        document.body.appendChild(container);
        container.classList.add('show');

        Eleven.speak(articles[0].snippet, 'UK English Female');
      }, 500);
    },

    fetch: function(query, callback){
      var self = this;
      $.ajax({
        url: 'https://www.googleapis.com/customsearch/v1',
        dataType: 'json',
        data: {
          key: 'AIzaSyAQhQWznuNxKF-9ebQaNRJ1r21HdAyWrrg',
          cx: '004653977863792706120:6duqgkxpyzk',
          q: query
        },
        success: function(data){
          console.log(data, '--- WEB SEARCH');
          self.createList(data);

          if($.isFunction(callback)){
            callback(data);
          }
        },
        error: function(data){
          console.log(data);
        }
      });
    },

    search: function(query, callback){
      document.body.classList.add('interactive');
      this.fetch(query, callback);
    }
  });
})(window, Eleven, Eleven.query);

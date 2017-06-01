;(function(window, Eleven, $){

  Eleven.plugin('news', function(options){
    return new news(options);
  });

  var news = function(options){
    this.options = $.extend(true, {}, options || {});
  };

  $.extend(news.prototype, {
    createList: function(data, total){
      var articles = data.articles.slice(2);
      var data = [];

      Eleven.resetView();

      articles.forEach(function(article){
        var description = article.description || '';

        if(description && description.length > 120){
          description = article.description.substr(0, 300).split(' ').slice(0, -1).join(' ') + ' ...';
        }

        if(article.urlToImage){
          const img = new Image();
          img.src = article.urlToImage;
        }

        data.push({
          image: article.urlToImage,
          title: article.title,
          description: description
        });
      });

      setTimeout(function(){
        var container = $('<div id="news-results"><ul></ul></div>'),
            wrapper = $('<div id="carousel" class="results"></div>');

        wrapper.append(container);

        $(document.body).append(wrapper);

        wrapper.addClass('show');

        $('#carousel').carousel({
          template: [
            '<div class="carousel">',
              '<div class="carousel-nav carousel-prev">&lt;</div>',
              '<div class="carousel-viewport">',
                '<ul class="carousel-content">{items}</ul>',
              '</div>',
              '<div class="carousel-nav carousel-next">&gt;</div>',
            '</div>'
          ].join(''),
          itemTemplate: [
            '<li>',
              '<div class="news-article">',
                '<div class="picture">',
                  '<div class="img" style="background: url({image}) no-repeat center center;"></div>',
                '</div>',
                '<div class="details">',
                  '<h1>{title}<h1>',
                  '<p>{description}</p>',
                '</div>',
              '</div>',
            '</li>'
          ].join(''),
          data: data
        });

        $(document).on('gest', function(gesture){
          console.log(gesture);
          if(gesture.direction === 'Left'){
            $('.carousel-next').click();
          }

          if(gesture.direction === 'Right'){
            $('.carousel-prev').click();
          }
        });
      }, 500);
    },

    fetch: function(source, callback){
      var self = this;

      $.ajax({
        url: 'https://newsapi.org/v1/articles',
        dataType: 'json',
        data: {
          apiKey: 'e80471c0aa344ef3aa5cc466eb5375c4',
          sortBy: 'top',
          source: 'cnn'
        },
        success: function(data){
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

    headlines: function(source, callback){
      document.body.classList.add('interactive');
      this.fetch(source, callback);
    }
  });

})(window, Eleven, $);

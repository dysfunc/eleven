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

      Eleven.clearStage();

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
          description: description,
          originalDescription: article.description,
          url: article.url
        });
      });

      this.cache = data;

      this.article = $('<div id="news-article"></div>');
      this.frame = this.article.find('#news-frame');

      setTimeout(() => {
        var container = $('<div id="news-results"></div>'),
            wrapper = $('<div id="carousel"></div>');

        this.wrapper = wrapper.append(container);

        $(Eleven.stage).append(wrapper).append(this.article);

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
      }, 500);
    },

    fetch: function(source, callback){
      var self = this;

      console.log(source);

      $.ajax({
        url: 'https://newsapi.org/v1/articles',
        dataType: 'json',
        data: {
          apiKey: 'e80471c0aa344ef3aa5cc466eb5375c4',
          sortBy: 'top',
          source: source ? source.toLowerCase() : 'bbc-news'
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
    },

    stop: function(){
      this.article.removeClass('show');
      this.wrapper.removeClass('backset');
    },

    nextPage: function(){
      $('.carousel-next').click();
    },

    previousPage: function(){
      $('.carousel-prev').click();
    },

    launch: function(index){
      var item = this.cache[Number(index)-1];
      // this.frame.attr('src', this.cache[index-1].url);
      //
      // this.frame.on('load', () => {
        this.article
          .empty()
          .html(
            $.format(
              [
                '<div class="news-article large">',
                  '<div class="picture">',
                    '<div class="img" style="background: url({image}) no-repeat center center;"></div>',
                  '</div>',
                  '<div class="details">',
                    '<h1>{title}<h1>',
                    '<p>{description}</p>',
                  '</div>',
                '</div>'
              ].join(''), {
                image: item.image,
                title: item.title,
                description: item.originalDescription
              })
            );

        this.article.addClass('show');
        this.wrapper.addClass('backset');
      // });
        // console.log(this.wrapper.find('li').eq(index));
    }
  });

})(window, Eleven, $);

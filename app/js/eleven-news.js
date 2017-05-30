;(function(window, Eleven, $){

  Eleven.plugin('news', function(options){
    return new news(options);
  });

  var news = function(options){
    this.options = Eleven.extend(true, {}, options || {});
  };

  Eleven.extend(news.prototype, {
    createList: function(data, total){
      var articles = data.articles.slice(2);
      var data = [];

      Eleven.resetView();

      var container = document.createElement('div'),
          ul = document.createElement('ul');

      articles.forEach(function(article){
        var description = article.description || '';

        if(description && description.length > 120){
          description = article.description.substr(0, 300).split(' ').slice(0, -1).join(' ') + ' ...';
        }

        data.push({
          image: article.urlToImage,
          title: article.title,
          description: description
        });
      });

      setTimeout(function(){
        var wrapper = document.createElement('div');

        wrapper.id = 'carousel';
        wrapper.className = 'results';

        container.id = 'news-results';
        container.appendChild(ul);
        wrapper.appendChild(container);

        document.body.appendChild(wrapper);
        wrapper.classList.add('show');
console.log($('#carousel'));

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

      Eleven.ajax({
        url: 'https://newsapi.org/v1/articles',
        dataType: 'json',
        data: {
          apiKey: 'e80471c0aa344ef3aa5cc466eb5375c4',
          sortBy: 'top',
          source: 'cnn'
        },
        success: function(data){
          if(Eleven.debug){
            console.log(data, '--- FETCHING NEWS');
          }

          self.createList(data);

          if(Eleven.isFunction(callback)){
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

})(window, Eleven, Eleven.query);

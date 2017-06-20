;(function(window, Eleven, $){
  const body = $(document.body);

  const weekdays = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  };

  const iconMap = {
    32: 'chanceflurries',
    32: 'chancerain',
    32: 'chancesleet',
    32: 'chancesnow',
    32: 'chancetstorms',
    32: 'clear',
    26: 'cloudy',
    32: 'cloudy',
    32: 'flurries',
    32: 'fog',
    32: 'hazy',
    28: 'mostlycloudy',
    30: 'partlycloudy',
    34: 'mostlysunny',
    32: 'partlysunny',
    11: 'rain',
    12: 'rain',
    39: 'rain',
    32: 'sleet',
    32: 'snow',
    32: 'sunny',
    4: 'tstorms',
    47: 'tstorms',
    32: 'unknown'
  };

  Eleven.plugin('weather', function(options){
    return new weather(options);
  });

  const weather = function(options){
    this.options = $.extend(true, {}, options || {});
    return this;
  }

  $.extend(weather.prototype, {
    createList: function(data, total){
      const query = data.query.results;
      const forecast = query.channel.item.forecast;
      const city = query.channel.location.city;
      const region = query.channel.location.region;
      const days = forecast.slice(0, total);
      const queryCity = city.toLowerCase().replace(/\s/g, '+')

      Eleven.clearStage();

      $.ajax({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=418dfbcc398ff8a2f6e697a7aca93d44&tags=' + queryCity + '&content_type=1&group_id=1463451@N25&format=json&nojsoncallback=1',
        dataType: 'json',
        success: (data) => {
          const photo = data.photos.photo[Math.round(Math.random() * 3)];
          const farm = photo.farm;
          const id = photo.id;
          const secret = photo.secret;
          const server = photo.server;
          const size = 'h';
          const backgroungImage = 'https://farm'+ farm +'.staticflickr.com/'+ server +'/'+ id +'_' + secret +'_' + size + '.jpg'

          const img = document.createElement('img');
          img.src = backgroungImage;

          const wrapper = $('<div id="weather-results" style="background: url(' + backgroungImage + ') no-repeat center center; background-size: cover;"></div>');
          const container = $('<div id="weather-container"></div>');
          const ul = $('<ul>');

          days.forEach(function(day, i){
            var icon = 'wi wi-wu-' + iconMap[day.code] || 'wi-day-cloudy';
            var high = day.high;
            var low = day.low;

            var li = $('<li>')
              .html(
                '<div class="dow">' + (i === 0 ? 'Now' : weekdays[day.day])  + '</div>' +
                '<div class="picture"><i class="' + icon + '"></i></div>' +
                '<div class="details">' +
                  '<h1>' + high + '<span>/ ' + low + '</span><small>' + day.text + '</small></h1>' +
                '</div>'
              );

              if(i === 0){
                li.addClass('today');
              }

              li.appendTo(ul);
          });


          $('<div class="location"></div>')
            .html('<span>' + city + ', ' + region + '</span>')
            .appendTo(wrapper);

          setTimeout(function(){
            container.append(ul);

            wrapper
              .append(container)
              .appendTo(Eleven.stage)
              .addClass('show');
          }, 500);

        }
      });
    },

    fetch: function(city, callback, total){
      $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+ city + '")&format=json',
        dataType: 'json',
        success: (data) => {

          this.createList(data, total);

          if($.isFunction(callback)){
            callback(data);
          }
        },
        error: function(data){
          console.log(data);
        }
      });
    },

    forecast: function(city, callback){
      body.addClass('interactive');
      this.fetch(city, callback, 5);
    },

    temperature: function(city, callback){
      body.addClass('interactive');
      this.fetch(city, callback, 1);
    }
  });

})(window, Eleven, Eleven.query);

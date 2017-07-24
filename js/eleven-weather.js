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
    32: 'wi-wu-chanceflurries',
    32: 'wi-wu-chancerain',
    32: 'wi-wu-chancesleet',
    32: 'wi-wu-chancesnow',
    32: 'wi-wu-chancetstorms',
    32: 'wi-wu-clear',
    26: 'wi-wu-cloudy',
    32: 'wi-wu-cloudy',
    23: 'wi-day-windy',
    32: 'wi-wu-flurries',
    32: 'wi-wu-fog',
    32: 'wi-wu-hazy',
    28: 'wi-wu-mostlycloudy',
    30: 'wi-wu-partlycloudy',
    34: 'wi-wu-mostlysunny',
    32: 'wi-wu-partlysunny',
    11: 'wi-wu-rain',
    12: 'wi-wu-rain',
    39: 'wi-wu-rain',
    32: 'wi-wu-sleet',
    32: 'wi-wu-snow',
    32: 'wi-wu-sunny',
    4: 'wi-wu-tstorms',
    47: 'wi-wu-tstorms',
    32: 'wi-wu-unknown'
  };

  Eleven.plugin('weather', function(options){
    return new weather(options);
  });

  const weather = function(options){
    this.options = $.extend(true, {}, options || {});
    return this;
  }

  $.extend(weather.prototype, {
    createList: function(weatherData, total){
      const query = weatherData.query.results;
      const forecast = query.channel.item.forecast;
      const city = query.channel.location.city;
      const region = query.channel.location.region;
      const days = forecast.slice(0, total);
      const queryCity = city.toLowerCase().replace(/\s/g, '+');

      Eleven.clearStage();

      $.ajax({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=418dfbcc398ff8a2f6e697a7aca93d44&tags=' + queryCity + '&content_type=1&group_id=1463451@N25&format=json&nojsoncallback=1',
        dataType: 'json',
        success: (data) => {
          const photo = data.photos.photo[Math.round(Math.random() * 4)];//data.photos.photo.length)];
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
            var icon = 'wi ' + iconMap[day.code] || 'wi-day-cloudy';
            var high = day.high;
            var low = day.low;
            var unit = weatherData.query.results.channel.units.temperature.toLowerCase();

            var li = $('<li>')
              .html(
                '<div class="dow">' + (i === 0 ? 'Now' : weekdays[day.day])  + '</div>' +
                '<div class="picture"><i class="' + icon + '"></i></div>' +
                '<div class="details unit-' + unit + '">' +
                  '<h1><span>' + high + '</span>' +
                  '<span>/ ' + low + '</span>' +
                  '<small>' + day.text + '</small></h1>' +
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

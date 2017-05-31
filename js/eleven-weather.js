;(function(window, Eleven, $){

  Eleven.plugin('weather', function(options){
    return new weather(options);
  });

  var weather = function(options){
    this.options = $.extend(true, {}, options || {});
    return this;
  }

  $.extend(weather.prototype, {
    createList: function(data, total){
      var query = data.query.results;
      var forecast = query.channel.item.forecast;
      var city = query.channel.location.city;
      var region = query.channel.location.region;
      var days = forecast.slice(0, total);

      var others = document.querySelectorAll('.results');

      if(others && others.length){
        others.forEach(function(element){
          if(element.parentNode){
            element.parentNode.removeChild(element);
          }
        });
      }
      var weekdays = {
        Mon: 'Monday',
        Tue: 'Tuesday',
        Wed: 'Wednesday',
        Thu: 'Thursday',
        Fri: 'Friday',
        Sat: 'Saturday',
        Sun: 'Sunday'
      };

      var iconMap = {
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

      var container = document.createElement('div'),
          ul = document.createElement('ul');

      days.forEach(function(day){
        var icon = 'wi wi-wu-' + iconMap[day.code] || 'wi-day-cloudy';
        var high = day.high;
        var low = day.low;

        var li = document.createElement('li');

        li.innerHTML = [
          '<div class="dow">' + weekdays[day.day]  + '</div>',
          '<div class="picture"><i class="' + icon + '"></i></div>',
          '<div class="details">',
            '<h1>' + high + '<small>' + day.text + '</small></h1>',
          '</div>'
        ].join('');

        ul.appendChild(li);
      });


      var location = document.createElement('div');

      location.className = 'location';

      location.innerHTML = city + ', ' + region;

      container.appendChild(location);

      setTimeout(function(){
        container.id = 'weather-results';
        container.className = 'results';
        container.appendChild(ul);
        document.body.appendChild(container);
        container.classList.add('show');
      }, 500);
    },

    fetch: function(city, callback, total){
      var self = this;

      // clear any results from previous commands
      Eleven.resetView();

      $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+ city + '")&format=json',
        dataType: 'json',
        success: function(data){

          self.createList(data, total);

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
      console.log(city, '-----FORECAST');
      document.body.classList.add('interactive');
      this.fetch(city, callback, 5);
    },

    temperature: function(city, callback){
      console.log(city, '-----temperature');
      document.body.classList.add('interactive');
      this.fetch(city, callback, 1);
    }
  });
})(window, Eleven, Eleven.query);

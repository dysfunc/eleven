Eleven.ready(function(){

  document.getElementById('toggleCommands').addEventListener('click', function(){
    var element = document.getElementById('supported');

    if(element.classList.contains('show')){
      this.textContent = 'Show Commands';
      element.classList.remove('show');
    }else{
      this.textContent = 'Hide Commands';
      element.classList.add('show');
    }
  });

  if(Eleven){
    var count = 0,
        sessionId = Eleven.uuid(),
        running = false;

    // initialize Eleven
    var E11 = Eleven({
      debug: true,
      onCommand: function(params, speech, command){
        Eleven.ajax({
          url: 'https://api.api.ai/api/query?v=20150910&lang=en',
          data: {
            sessionId: sessionId,
            query: speech,
            access_token: 'a0a87a32cec4454aa6bbd3909ecbca14'
          },
          headers: {
            Authorization: 'Bearer 7e11b6f7694f4444b0df75b77cc0a457'
          },
          dataType: 'json',
          success: function(response){
            $(document).off('gest');
            var news = E11.getPlugin('news'),
                weather = E11.getPlugin('weather'),
                yelp = E11.getPlugin('yelp');

            if(response.status.code > 199 && response.status.code < 400){
              var result = response.result,
                  output = result.fulfillment.speech;

              if(result.action === 'weather' || result.action === 'forecast'){
                E11.context = 'weather';

                var parameters = result.parameters,
                    city = parameters.address.city;

                weather.forecast(city);
              }

              if(result.action === 'weather.temperature'){
                var parameters = result.parameters,
                    city = parameters.address.city;

                weather.temperature(city);
              }

              if(result.action === 'food.search'){
                var parameters = result.parameters;

                yelp.search({
                  term: parameters.food,
                  location: parameters['geo-city']
                }, output);
              }

              if(result.action === 'news.search'){
                var parameters = result.parameters;
                news.headlines();
              }

              if(output){
                Eleven.speak(output, 'UK English Female', {
                  onStart: function(){
                    if(!running){
                      E11.getVisualizer('container').classList.add('ready');
                      E11.getVisualizer().start();
                      running = true;
                    }
                  },
                  onEnd: function(){
                    if(running){
                      E11.getVisualizer().stop();
                      E11.getVisualizer('container').classList.remove('ready');
                      running = false;
                    }
                  }
                });
              }
            }
          }
        });
      }
    });

    // initialize plugins
    E11
      .plugin('news')
      .plugin('weather')
      .plugin('webSearch')
      .plugin('yelp', {
        params: {
          consumerSecret: 'WoFonmd-gRsQ0LX1KX_7AMs8mgA',
          tokenSecret: 'qsrlMjQGoucx9D8OM0B0XCL2VJA',
          oauth_consumer_key: 'lqhazuTbcv2eTGCpamZedA',
          oauth_token: 'VBlTansWmoTVcmX87GpUlhHNht5i4dpt'
        }
      });

    // E11.getPlugin('weather').forecast('Los angeles');

    //
    // setTimeout(function(){
    //   E11.getPlugin('news').headlines();
    //
    //   setTimeout(function(){
    //     E11.getPlugin('yelp').search({
    //       term: 'Mexican',
    //       location: 'San Francisco'
    //     });
    //   }, 3000);
    // }, 3000);
  }
});

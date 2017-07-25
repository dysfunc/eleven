(function(Eleven, $){
  $(function(){
    // $('#toggleCommands').on('click', function(){
    //   var element = $('#supported');
    //
    //   if(element.hasClass('show')){
    //     this.textContent = 'Show Commands';
    //     element.removeClass('show');
    //   }else{
    //     this.textContent = 'Hide Commands';
    //     element.addClass('show');
    //   }
    // });

    var onCommand = function(params, speech, command, fn){
      $.ajax({
        url: 'https://api.api.ai/api/query?v=20150910&lang=en',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
          Authorization: 'Bearer 7e11b6f7694f4444b0df75b77cc0a457'
        },
        data: {
          sessionId: sessionId,
          query: speech,
          access_token: 'a0a87a32cec4454aa6bbd3909ecbca14'
        },
        success: function(response){
          var news = Eleven().getPlugin('news'),
              weather = Eleven().getPlugin('weather'),
              yelp = Eleven().getPlugin('yelp');

          if(response.status.code > 199 && response.status.code < 400){
            var result = response.result,
                output = result.fulfillment.speech;

            console.log(result, result.action);

            if(result.action === 'weather' || result.action === 'forecast'){

              var parameters = result.parameters,
                  city = parameters.address.city;

                console.log(city, parameters);

              weather.forecast(city);
            }

            if(result.action === 'weather.temperature'){
              var parameters = result.parameters,
                  city = parameters.address.city;

              console.log(city, parameters);

              weather.temperature(city);
            }

            if(result.action === 'food.search'){
              var parameters = result.parameters;

              yelp.search({
                term: parameters.food,
                location: parameters['geo-city']
              }, output);
            }

            var parameters = result.parameters;

            if(result.action === 'news.search'){
              if(parameters.source.trim() !== 'done reading'){
                if(parameters.position){
                  news.launch(parameters.position);
                }else{
                  news.headlines(parameters.source);
                }
              }else{
                news.stop();
              }
            }

            if(result.action === 'newssearch.newssearch-position'){
              news.launch(parameters.position);
            }

            if(result.action === 'news.search.next'){
              news.nextPage();
            }

            if(result.action === 'news.search.previous'){
              news.previousPage();
            }

            if(output){
              Eleven.speak(output);
            }

            if(fn && typeof(fn) === 'function'){
              fn();
            }
          }
        }
      });
    };

    if(Eleven){
      var sessionId = Eleven.uuid();
      // init
      Eleven({
        container: '#eleven',
        debug: false,
        stage: '#stage',
        useEngine: true,
        onCommand: onCommand
      });

       var fn = function(params, speech, command, plugin){
         console.log(params, speech, command, plugin);
       }

      // instance will always be returned after init
      Eleven()
        // .plugin('news', {
        //   commands: {
        //     'hello :name': function(params, speech, command, plugin){
        //       document.body.style.border='10px solid pink';
        //     },
        //     'hey (there)': fn,
        //     'hi': function(params, speech, command, plugin){
        //       document.body.style.boxShadow ='inset 0 0 0 10px yellow';
        //     },
        //     'hello': function(params, speech, command, plugin){
        //       document.body.style.border='10px solid pink';
        //     },
        //     'news now': function(params, speech, command, plugin){
        //       document.body.style.boxShadow ='inset 0 0 0 10px yellow';
        //     }
        //   }
        // })
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
        })

      //   .addCommands({
      //     'hello :name': function(){
      //       document.body.style.border = 0;
      //       document.body.style.boxShadow = 'none';
      //
      //       console.log('asdoksaodk');
      //     }
      //   });
      //
      //
      // Eleven().parser(['hi']);
      //
      // setTimeout(function(){
      //   Eleven().parser(['hello kieran']);
      // }, 2000);
      // //
      // setTimeout(function(){
      //   Eleven().parser(['stop'])
      // }, 10000);
      //
      //
      // setTimeout(function(){
      //   Eleven().parser(['hello Kieran'])
      // }, 11000);
      //
      // setTimeout(function(){
      //   Eleven.speak('hello world! how are you doing?');
      // }, 12000);

      // setTimeout(function(){
      //   Eleven().removeCommands(['hello :name', 'stop']);
      //   console.log(Eleven());
      // }, 2000);

      // Eleven().getPlugin('yelp').search({
      //   term: 'Chinese food',
      //   location: 'San Francisco, CA'
      // }, 'Finding you chinese food near san francisco');

      // onCommand({}, 'show me todays news');
      //
      // setTimeout(function(){
      //   onCommand({}, 'now CNBC');
      //   // onCommand({}, 'I\'m finished reading');
      //
      //   setTimeout(function(){
      //     onCommand({}, 'show me the third article');
      //
      //     // onCommand({}, 'now CNBC');
      //     // onCommand({}, 'done reading');
      //     // onCommand({}, 'I\'m finished reading');
      //     setTimeout(function(){
      //       onCommand({}, 'done reading');
      //     }, 3000);
      //   }, 3000);
      //
      // }, 3000);
      // Eleven().getPlugin('news').headlines()
      // Eleven().getPlugin('weather').forecast('San Francisco');
      // Eleven().getPlugin('weather').forecast('New York');
    }

    $('#run').on('click', function(){
      const E = Eleven();
      const speech = $('#speech');

      const startSpeechSimulation = function(){
        speech.addClass('show');
        E.getVisualizer('container').classList.add('ready');
        E.getVisualizer().start();
      };

      const stopSpeechSimulation = function(){
        setTimeout(function(){
          speech.removeClass('show');
          E.getVisualizer('container').classList.remove('ready');
          E.getVisualizer().stop();
        }, 3000);
      };

      const scenario = function(command){
        startSpeechSimulation();
        onCommand({}, command);
        stopSpeechSimulation();
        speech.html('<p>Eleven &lt;pause&gt; ' + command + '</p>');
      };

      // YES I KNOW THIS HORRIBLE :| I'LL BE CHANGING THIS
      // NEWS
      scenario('show me todays news');

      setTimeout(function(){
        scenario('now from CNN');
        setTimeout(function(){

          scenario('show me the third article');

          setTimeout(function(){
            scenario('done reading');
          }, 7000);
        }, 7000);
      }, 7000);

      // WEATHER
      setTimeout(function(){
        scenario('What\'s the weather like in San Francisco?');

        setTimeout(function(){
          scenario('What about Los Angeles?');
        }, 7000);
      }, 27000);

      // Food
      setTimeout(function(){
        scenario('find me chinese food near San Francisco');
      }, 44000);
    });
  })
})(Eleven, Eleven.query);

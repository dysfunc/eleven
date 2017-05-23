import $ from './core';
import window from './window';
import voiceConfigs from './common/voiceConfigs';

const speechSynthesis = window.speechSynthesis;

const Speech = {
  init: function(options){
    this.voiceTypes = voiceConfigs.defaultTypes;
    this.voiceTypesCollection = voiceConfigs.allTypes;
    this.deviceSupportedVoices = null;
    this.messageConfig = null;

    this.CHARACTER_LIMIT = 100;
    this.WORDS_PER_MINUTE = 140;

    // wait until system voices are ready and trigger the event OnVoiceReady
    if(speechSynthesis){
      speechSynthesis.onvoiceschanged = () => {
        this.deviceSupportedVoices = speechSynthesis.getVoices();
      };
    }

    this.defaultVoiceSelection = this.voiceTypes[0];

    // wait a 100ms before calling getVoices() to correct issues with Chrome
    setTimeout(() => {
      var voices = speechSynthesis.getVoices();

      if(voices.length){
        console.debug('[Eleven] Voice support is ready');
        this.deviceVoicesReady(voices);
      }else{
        console.warn('[Eleven] Voice synthesis is not supported.');
      }
    }, 100);

    return this.speak;
  },
  /**
   * [function description]
   * @param  {[type]} voices [description]
   * @return {[type]}        [description]
   */
  deviceVoicesReady: function(voices){
    this.deviceSupportedVoices = voices;

    this.mapSupportedVoices();
  },
  /**
   * Maps the system voices to our default voices settings
   * @return {[type]} [description]
   */
  mapSupportedVoices: function(){
    var self = this;

    $.each(this.voiceTypes, function(voiceOption){
      $.each(voiceOption.ids, function(id){
        var voiceInCollection = self.voiceTypesCollection[id],
            systemVoice = !voiceInCollection.fallbackvoice ? self.getDeviceSupportedVoice(voiceInCollection.name) : {};

        voiceOption.mappedProfile = {
          deviceVoice: systemVoice,
          collectionVoice: voiceInCollection
        };

        return false;
      });
    });
  },

  getDeviceSupportedVoice: function(name){
    var result = null;

    if(!this.deviceSupportedVoices){
      return null;
    }

    $.each(this.deviceSupportedVoices, function(voice){
      if(voice.name === name){
        result = voice;
        return false;
      }
    });

    return result;
  },

  cancel: function(){
    this.cancelled = true;
    speechSynthesis.cancel();
  },

  getMatchedVoice: function(voice){
    var self = this,
        result = null;

    $.each(voice.ids, function(id){
      var find = self.getDeviceSupportedVoice(self.voiceTypesCollection[id].name);

      if(find){
        result = find;
        return false;
      }
    });

    return result;
  },

  getResponsiveVoice: function(name){
    var result = null;

    $.each(this.voiceTypes, function(voice){
      if(voice.name === name){
        result = voice;
        return false;
      };
    });

    return result;
  },

  speak: function(text, voicename, parameters){
    if(speechSynthesis.speaking){
      this.cancelled = true;
      speechSynthesis.cancel();
    }

    text = text.replace(/[\"\`]/gm, '\'');

    this.messageConfig = parameters ||  {};
    this.msgtext = text;
    this.msgvoicename = voicename;

    // Support for multipart text (there is a limit on characters)
    var multipartText = [];

    if(text.length > this.CHARACTER_LIMIT){
      var tmptxt = text;

      while(tmptxt.length > this.CHARACTER_LIMIT){
        // split by common phrase delimiters
        var phrase = tmptxt.search(/[:!?.;]+/),
            part = '';

        // coludn't split by priority characters, try commas
        if(phrase == -1 || phrase >= this.CHARACTER_LIMIT){
          phrase = tmptxt.search(/[,]+/);
        }

        // couldn't split by normal characters, then we use spaces
        if(phrase == -1 || phrase >= this.CHARACTER_LIMIT){
          var words = tmptxt.split(' ');

          for(var i = 0; i < words.length; i++){

            if(part.length + words[i].length + 1 > this.CHARACTER_LIMIT){
              break;
            }

            part += (i != 0 ? ' ' : '') + words[i];
          }
        }else{
          part = tmptxt.substr(0, phrase + 1);
        }

        tmptxt = tmptxt.substr(part.length, tmptxt.length - part.length);

        multipartText.push(part);
      }

      // add the remaining text
      if(tmptxt.length){
        multipartText.push(tmptxt);
      }
    }else{
      // small text
      multipartText.push(text);
    }

    // find system voice that matches voice name
    var rv = !voicename ? this.defaultVoiceSelection : this.getResponsiveVoice(voicename),
        profile = {};

    // Map was done so no need to look for the mapped voice
    if(rv.mappedProfile){
      profile = rv.mappedProfile;
    }else{
      profile.deviceVoice = this.getMatchedVoice(rv);
      profile.collectionVoice = {};

      if(!profile.deviceVoice){
        console.log('[Eleven] ERROR: No voice found for: ' + voicename);
        return;
      }
    }

    this.msgprofile = profile;

    for(var i = 0; i < multipartText.length; i++){
      // Create msg object
      var msg = new SpeechSynthesisUtterance();

      $.extend(msg, {
        voice: profile.deviceVoice,
        voiceURI: profile.deviceVoice.voiceURI,
        volume: this.preferred([profile.collectionVoice.volume, profile.deviceVoice.volume, 1]), // 0 to 1
        rate: this.preferred([profile.collectionVoice.rate, profile.deviceVoice.rate, 1]),       // 0.1 to 10
        pitch: this.preferred([profile.collectionVoice.pitch, profile.deviceVoice.pitch, 1]),    // 0 to 2
        text: multipartText[i],
        lang: this.preferred([profile.collectionVoice.lang, profile.deviceVoice.lang]),
        rvIndex: i,
        rvTotal: multipartText.length
      });

      if(i == 0){
        msg.onstart = $.proxy(this.start, this);
      }

      this.messageConfig.onendcalled = false;

      if(parameters){
        if(i < multipartText.length - 1 && multipartText.length > 1){
          msg.onend = parameters.onchunkend;
          msg.addEventListener('end', parameters.onchuckend);
        }else{
          msg.onend = this.stop;
          msg.addEventListener('end', $.proxy(this.stop, this));
        }

        msg.onerror = parameters.onerror || function(e){
          console.log('[Eleven] Unknow Error');
          console.log(e);
        };

        msg.onpause = parameters.onpause;
        msg.onresume = parameters.onresume;
        msg.onmark = parameters.onmark;
        msg.onboundary = parameters.onboundary;
        msg.pitch = parameters.pitch ? parameters.pitch : msg.pitch;
        msg.rate = (parameters.rate ? parameters.rate : 1) * msg.rate;
        msg.volume = parameters.volume ? parameters.volume : msg.volume;
      }else{

        msg.onend = $.proxy(this.end, this);

        msg.onerror = function (e) {
          console.log('[Eleven] Unknow Error');
          console.log(e);
        };
      }

      speechSynthesis.speak(msg);
    }
  },

  start: function(){
    this.messageConfig.onendcalled = false;

    if(this.messageConfig && $.isFunction(this.messageConfig.onStart)){
      this.messageConfig.onStart();
    }
  },

  stop: function(){
    // avoid this being automatically called just after calling speechSynthesis.cancel
    if(this.cancelled === true){
      this.cancelled = false;
      return;
    }

    //console.log("on end fired");
    if(this.messageConfig && this.messageConfig.onendcalled !== true && $.isFunction(this.messageConfig.onEnd)){
      //console.log("Speech on end called  -" + this.msgtext);
      this.messageConfig.onendcalled = true;
      this.messageConfig.onEnd();
    }
  },

  preferred: function(a){
    for(var i = 0, k = a.length; i < k; i++){
      if(a[i]){
        return a[i];
      }
    }

    return null;
  }
};

// init SpeechSynthesis
Speech.init();
// export speak
$.speak = $.proxy(Speech.speak, Speech);

export default $;

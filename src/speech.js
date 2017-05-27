import $ from './core';
import SpeechSynthesis from './speechSynthesis';

$.speak = function(text, config = {}){
  var cancelled = false;
  // clean up text
  text = text.replace(/[\"\`]/gm, '\'');
  // split our phrases into 120 character chunks
  const chunks = text.match(/.{1,140}\s+/g);
  // find voice profile
  const agent = $.synthesisAgent;

  if(!SpeechSynthesis){
    throw '[Eleven] Speech Synthesis is not supported on this device.';
  }

  if(speechSynthesis.speaking){
    cancelled = true;
    speechSynthesis.cancel();
  }

  chunks.forEach((text, index) => {
    // create new utterance
    const speechUtterance = new SpeechSynthesisUtterance();

    $.extend(speechUtterance, {
      voice: agent.suppportedVoice,
      voiceURI: agent.voiceURI,
      volume: agent.volume || 1,
      rate: agent.rate || 1,
      pitch: agent.pitch || 1,
      text: text,
      lang: agent.lang,
      rvIndex: index,
      rvTotal: chunks.length
    });

    if(index == 0){
      speechUtterance.onstart = () => {
        if($.isFunction(config.onStart)){
          config.onStart();
        }
      };
    }

    if(index == chunks.length - 1){
      speechUtterance.onend = () => {
        // prevent this from being triggered when invoking speechSynthesis.cancel
        if(cancelled === true){
          cancelled = false;
          return;
        }

        if($.isFunction(config.onEnd)){
          config.onEnd();
        }
      };
    }

    speechUtterance.onerror = (e) => {
      console.log(`[Eleven] Unknow Error: ${e}`);
    };

    speechSynthesis.speak(speechUtterance);
  });
};

export default $;

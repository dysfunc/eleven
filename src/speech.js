import $ from './core';
import SpeechSynthesis from './speechSynthesis';

$.speak = function(text, config = {}){
  var cancelled = false;
  // clean up text
  text = text.replace(/[\"\`]/gm, '\'');
  // split text into 140 character chunks
  const chunks = text.match($.regexp.textChunks);
  // find voice profile
  const agent = $.speechAgent;

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

    speechUtterance.onerror = (error) => {
      if($.debug){
        console.error(`[Eleven] Unknow Error: ${error}`);
      }
    };

    speechSynthesis.speak(speechUtterance);
  });
};

export default $;

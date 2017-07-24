import Eleven from '../core';
import SpeechSynthesis from './speechSynthesis';

Eleven.speak = function(text, config = {}){
  var cancelled = false;
  // get instance
  const eleven = Eleven();
  // clean up text
  text = text.replace(/[\"\`]/gm, '\'');
  // split text into 140 character chunks
  const chunks = text.match(Eleven.regexp.textChunks);
  // find voice profile
  const agent = Eleven.speechAgent;

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

    Eleven.extend(speechUtterance, {
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
        eleven.getVisualizer('container').classList.add('ready');
        eleven.getVisualizer().start();

        if(Eleven.isFunction(config.onStart)){
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

        eleven.stop();

        if(Eleven.isFunction(config.onEnd)){
          config.onEnd();
        }
      };
    }

    speechUtterance.onerror = (error) => {
      if(Eleven.debug){
        console.error(`[Eleven] Unknow Error: ${error}`);
      }
    };

    speechSynthesis.speak(speechUtterance);
  });
};

export default Eleven;

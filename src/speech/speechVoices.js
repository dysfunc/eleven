import Eleven from '../core';
import SpeechSynthesis from './speechSynthesis';
import SpeechSynthesisOverrides from './speechSynthesisOverrides';

Eleven.fn.extend({
  voices(){
    // setup speech synthesis
    SpeechSynthesis.onvoiceschanged = () => {
      Eleven.supportedVoices = SpeechSynthesis.getVoices();
    };
    // hack to fix issues with Chrome
    setTimeout(() => {
      if(!SpeechSynthesis){
        console.warn('[Eleven] Voice synthesis is not supported.');
      }else{
        Eleven.supportedVoices = SpeechSynthesis.getVoices();

        if(Eleven.supportedVoices.length > 0){
          Eleven.mappedSupportedVoices = Eleven.supportedVoices.slice().reduce((obj, item) => {
            const overrides = SpeechSynthesisOverrides[item.name] || {};

            obj[item.name] = Eleven.extend({}, item, overrides, { suppportedVoice: item });

            return obj;
          }, {});

          Eleven.speechAgent = Eleven.mappedSupportedVoices[this.options.speechAgent] || Eleven.mappedSupportedVoices['Alex'];
        }
      }
    }, 500);

    return SpeechSynthesis;
  }
});

export default Eleven;

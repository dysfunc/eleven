import $ from '../core';
import SpeechSynthesis from './speechSynthesis';
import SpeechSynthesisOverrides from './speechSynthesisOverrides';

$.fn.extend({
  voices(){
    // setup speech synthesis
    SpeechSynthesis.onvoiceschanged = () => {
      $.supportedVoices = SpeechSynthesis.getVoices();
    };
    // hack to fix issues with Chrome
    setTimeout(() => {
      if(!SpeechSynthesis){
        console.warn('[Eleven] Voice synthesis is not supported.');
      }else{
        $.supportedVoices = SpeechSynthesis.getVoices();

        if($.supportedVoices.length > 0){
          $.mappedSupportedVoices = $.supportedVoices.slice().reduce((obj, item) => {
            const overrides = SpeechSynthesisOverrides[item.name] || {};

            obj[item.name] = $.extend({}, item, overrides, { suppportedVoice: item });

            return obj;
          }, {});

          $.speechAgent = $.mappedSupportedVoices[this.options.speechAgent] || $.mappedSupportedVoices['Alex'];
        }
      }
    }, 500);

    return SpeechSynthesis;
  }
});

export default $;

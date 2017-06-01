import $ from './core';
import './agent';
import './ajax/ajax';
import './commands/commands';
import './common/regexp';
import './detection/browser';
import './detection/device';
import './detection/feature';
import './detection/os';
import './query/query';
import './plugins';
import './speech/speak';
import './speech/speechParser';
import './speech/speechVoices';
import './visualizer';

((root) => (root.Eleven = $))(window);

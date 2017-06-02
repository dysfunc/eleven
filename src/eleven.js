import Eleven from './core';
import './query/query';
import './extend';
import './agent/agent';
import './commands/commands';
import './plugins/plugins';
import './speech/speak';
import './speech/speechParser';
import './speech/speechVoices';
import './visualizer/visualizer';

((root) => (root.Eleven = Eleven) && ('$' in window ? (window.Q = Eleven.query) : (window.$ = Eleven.query)))(window);

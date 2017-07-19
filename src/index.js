import Eleven from './eleven';

((root) => (root.Eleven = Eleven) && ('$' in window && (window.Q = Eleven.query) || (window.$ = Eleven.query)))(window);

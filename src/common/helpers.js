import window from '../common/window';
import { defaultView }  from '../common/document';

const indexOf = (collection, item) => {
  const k = collection.length;
  var i = 0;

  for(; i < k; i++){
    if(collection[i] === item){
      return i;
    }
  }

  return -1;
};

const each = (collection, fn) => {
  const k = collection.length;
  var i = 0;

  for(; i < k; i++){
    const result = fn.call(collection[i], collection[i], i);

    if(result === false){
      break;
    }
  }
};

const noop = () => {};

const getComputedStyle = window.getComputedStyle || defaultView && defaultView.getComputedStyle;

const addScript = (node) => {
  var src = node.src && node.src.length > 0;

  try{
    if(!src){
      (1, eval)(node.innerHTML);
      return node;
    }

    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = node.src;

    return script;
  }catch(error){
    console.log('There was an error with the script:' + error);
  }
};

/**
 * Use document fragments for faster DOM manipulation
 * @param {Array}   elements  The elements to append to the fragement
 * @param {Object}  container The container element to append the fragment to
 * @param {Boolean} insert    A flag to determine insertion
 */
const documentFragments = (elements, container, insert) => {
  var fragment = document.createDocumentFragment(),
      l = elements.length,
      i = l - 1,
      k = 0;

  if(insert){
    for(; i >= 0; i--){
      var element = elements[i];

      if(element.nodeName.toLowerCase() === 'script'){
        element = addScript(element);
      }

      fragment.insertBefore(element, fragment.firstChild);
    }

    container.insertBefore(fragment, container.firstChild);
  }else{
    for(; k < l; k++){
      var element = elements[k];

      if(element.nodeName.toLowerCase() === 'script'){
        element = addScript(element);
      }

      fragment.appendChild(element);
    }

    container.appendChild(fragment);
  }

  fragment = null;
};


export { addScript, documentFragments, each, getComputedStyle, indexOf, noop };

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
const { slice } = [];
const { toString } = {};
const { trim } = String.prototype;

export { indexOf, each, noop, slice, toString, trim };

!function(e,t){if("function"==typeof define&&define.amd)define(t);else if("object"==typeof exports)module.exports=t();else{var n=t();"$"in e||(e.$=n),e.Y=n}}(this,function(){var e,t,n;return function(r){function i(e,t){return b.call(e,t)}function o(e,t){var n,r,i,o,s,a,u,c,l,f,p,h=t&&t.split("/"),d=y.map,m=d&&d["*"]||{};if(e&&"."===e.charAt(0))if(t){for(h=h.slice(0,h.length-1),e=e.split("/"),s=e.length-1,y.nodeIdCompat&&C.test(e[s])&&(e[s]=e[s].replace(C,"")),e=h.concat(e),l=0;l<e.length;l+=1)if(p=e[l],"."===p)e.splice(l,1),l-=1;else if(".."===p){if(1===l&&(".."===e[2]||".."===e[0]))break;l>0&&(e.splice(l-1,2),l-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((h||m)&&d){for(n=e.split("/"),l=n.length;l>0;l-=1){if(r=n.slice(0,l).join("/"),h)for(f=h.length;f>0;f-=1)if(i=d[h.slice(0,f).join("/")],i&&(i=i[r])){o=i,a=l;break}if(o)break;!u&&m&&m[r]&&(u=m[r],c=l)}!o&&u&&(o=u,a=c),o&&(n.splice(0,a,o),e=n.join("/"))}return e}function s(e,t){return function(){return h.apply(r,w.call(arguments,0).concat([e,t]))}}function a(e){return function(t){return o(t,e)}}function u(e){return function(t){g[e]=t}}function c(e){if(i(v,e)){var t=v[e];delete v[e],x[e]=!0,p.apply(r,t)}if(!i(g,e)&&!i(x,e))throw new Error("No "+e);return g[e]}function l(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function f(e){return function(){return y&&y.config&&y.config[e]||{}}}var p,h,d,m,g={},v={},y={},x={},b=Object.prototype.hasOwnProperty,w=[].slice,C=/\.js$/;d=function(e,t){var n,r=l(e),i=r[0];return e=r[1],i&&(i=o(i,t),n=c(i)),i?e=n&&n.normalize?n.normalize(e,a(t)):o(e,t):(e=o(e,t),r=l(e),i=r[0],e=r[1],i&&(n=c(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},m={require:function(e){return s(e)},exports:function(e){var t=g[e];return"undefined"!=typeof t?t:g[e]={}},module:function(e){return{id:e,uri:"",exports:g[e],config:f(e)}}},p=function(e,t,n,o){var a,l,f,p,h,y,b=[],w=typeof n;if(o=o||e,"undefined"===w||"function"===w){for(t=!t.length&&n.length?["require","exports","module"]:t,h=0;h<t.length;h+=1)if(p=d(t[h],o),l=p.f,"require"===l)b[h]=m.require(e);else if("exports"===l)b[h]=m.exports(e),y=!0;else if("module"===l)a=b[h]=m.module(e);else if(i(g,l)||i(v,l)||i(x,l))b[h]=c(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,s(o,!0),u(l),{}),b[h]=g[l]}f=n?n.apply(g[e],b):void 0,e&&(a&&a.exports!==r&&a.exports!==g[e]?g[e]=a.exports:f===r&&y||(g[e]=f))}else e&&(g[e]=n)},e=t=h=function(e,t,n,i,o){if("string"==typeof e)return m[e]?m[e](t):c(d(e,t).f);if(!e.splice){if(y=e,y.deps&&h(y.deps,y.callback),!t)return;t.splice?(e=t,t=n,n=null):e=r}return t=t||function(){},"function"==typeof n&&(n=i,i=o),i?p(r,e,t,n):setTimeout(function(){p(r,e,t,n)},4),h},h.config=function(e){return h(e)},e._defined=g,n=function(e,t,n){t.splice||(n=t,t=[]),i(g,e)||i(v,e)||(v[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("almond",function(){}),n("window",[],function(){return window}),n("document",["./window"],function(e){return e.document}),n("guid",[],function(){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"==e?t:3&t|8;return n.toString(16)})}}),n("getComputedStyle",["./window"],function(e){var t=e.document,n=t.defaultView;return e.getComputedStyle||n&&n.getComputedStyle}),n("core",["./window","./document","./guid","./getComputedStyle"],function(e,t,n,r){var i=e,t=i.document,o=t.documentElement,s=i.navigator,a=s.userAgent,u=s.vendor,c=[],l={},f=String.prototype,p=l.toString,h=(l.hasOwnProperty,c.concat),d=c.filter,m=(c.forEach,c.reduce),g=c.slice,v=c.splice,y=(c.pop,c.push,c.reverse,c.shift,c.unshift,c.forEach),x=c.indexOf,b=f.trim,w=function(e,t){for(var n=0,r=e.length;r>n;n++){var i=t.call(e[n],e[n],n);if(i===!1)break}},C=function(e,t){for(var n=0,r=e.length;r>n;n++)if(e[n]===t)return n;return-1},T={},j={},N={},S=-1;_fragmentContainer={},_eventsCache={},classRE=function(e){return e in T?T[e]:T[e]=new RegExp("(^|\\s)"+e+"(\\s|$)")};var O=function(){var e=function(t,n){return new e.fn.init(t,n)};e.fn=e.prototype={constructor:e,version:"1.0.0",init:function(n,r){if(this.length=0,!n)return this;if(n.constructor===e)return n;var o=typeof n;if("function"===o)return e(t).ready(n);if(this.selector=n,this.context=r,"body"===n||n===t.body)return this[this.length++]=this.context=t.body,this;if(n===i||n.nodeType||"body"===n)return this[this.length++]=this.context=n,this;if("string"===o&&(n=e.trim(n),"<"===n[0]&&">"===n[n.length-1]&&e.regex.fragments.test(n)&&(n=e.fragment(t.createElement(_fragmentContainer[RegExp.$1]||"div"),n),this.selector=n)),void 0!==n.length&&"[object Array]"===p.call(n)){for(var s=0,a=n.length;a>s;s++)this[this.length++]=n[s]instanceof e?n[s][0]:n[s];return this}return r=this.context||this.context===t?e(this.context)[0]:this.context=t,e.merge(this,e.query(n,r))}},w(["tbody","thead","tfoot","tr","th","td"],function(e){_fragmentContainer[e]="th"===e||"td"===e?"tr":"table"}),e.fragment=function(e,t){e.innerHTML=""+t;var n=g.call(e.childNodes);return w(n,function(t){e.removeChild(t)}),n},e.query=function(n,r){var i=[],o=n.length&&n.indexOf(" ")<0,s=n.charAt(0);if("#"===s&&r===t&&o){var a=r.getElementById(n.slice(1));a&&(i=[a])}else(1===r.nodeType||9===r.nodeType)&&(i="."===s&&o?r.getElementsByClassName(n.slice(1)):e.regex.tags.test(n)?r.getElementsByTagName(n):r.querySelectorAll(n));return g.call(i)},e.apply=function(t,n,r){if(r&&e.apply(t,r),t&&n&&"object"==typeof n)for(var i in n)t[i]=n[i];return t},e.apply(e,{camelCase:function(t){return e.trim(t).replace(e.regex.camel,function(e,t){return t?t.toUpperCase():""})},contains:function(t,n){return t&&n?!!((t=e(t)[0])&&(n=e(n)[0])&&t.contains(n)):!1},contents:function(t){var n=function(e,t){return e.nodeName&&e.nodeName.toUpperCase()===t.toUpperCase()};return e(n(t,"iframe")?t.contentDocument||t.contentWindow.document:g.call(t.childNodes))},dasherize:function(t){return e.trim(t).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},debounce:function(e,t,n,r){var i=null,o=arguments;return"number"==typeof t&&(r=n,n=t,t=null),function(){var s,a,u=t||this;s=function(){i=null,!a&&e.apply(u,o)},a=r&&!i,clearTimeout(i),i=setTimeout(s,n||200),a&&e.apply(u,o)}},each:function(e,t){if("function"==typeof e&&(t=e,e=this),"number"==typeof e.length)w(e,function(e,n){return t.call(e,e,n)});else if("object"==typeof e)for(var n in e){var r=t.call(e[n],n,e[n]);if(r===!1)break}return this},extend:function(){var t=1,n=!1,r=!1,i=arguments[0]||{},o=arguments.length;return"boolean"==typeof i&&(n=i,i=arguments[1]||{},t++,"boolean"==typeof i&&(r=i,i=arguments[2]||{},t++)),t===o&&(i=this,t--),g.call(arguments,t).forEach(function(t){var o,s,a,u;if(t!==i)if(n&&e.isArray(t))i=r?e.unique(i.concat(t)):i.concat(t);else for(var c in t)o=i[c],s=t[c],i!==s&&o!==s&&(n&&s&&(e.isPlainObject(s)||(a=e.isArray(s)))?(a?(a=!1,u=o&&e.isArray(o)?o:[]):u=o&&e.isPlainObject(o)?o:{},r?i[c]=e.extend(n,r,u,s):i[c]=e.extend(n,u,s)):void 0!==s&&(i[c]=s))}),i},flatten:function(e){return h.apply([],e)},format:function(t,n){if(n&&(e.isObject(n)||e.isArray(n))){var r=e.isObject(n)?"keys":"indexed";return t.replace(e.regex.templates[r],function(e,t){return n[t]||""})}},inArray:function(t,n,r){var i;return e.isArray(n)?(i=C(n,t))&&(r?i:-1!==i):-1},isArrayLike:function(t){var n=e.type(t),r=t.length;return"function"===n||t===i||"string"===n?!1:1===t.nodeType&&r?!0:"array"===n||0===r||"number"==typeof r&&r>0&&r-1 in t},isEmptyObject:function(e){for(var t in e)return!1;return!0},isNumber:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},isNumeric:function(t){return!e.isArray(t)&&t-parseFloat(t)>=0},isPlainObject:function(t){return e.isObject(t)&&!e.isWindow(t)&&!t.nodeType&&Object.getPrototypeOf(t)===Object.prototype},isWindow:function(e){return null!==e&&e===i},map:function(t,n){var r,i,o=t.length,s=[],a=0;if(t.length)for(;o>a;a++)i=n(t[a],a),null!=i&&s.push(i);else for(r in t)i=n(t[r],r),null!=i&&s.push(i);return e.flatten(s)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else for(;void 0!==t[i];)e[r++]=t[i++];return e.length=r,e},match:function(t,n){if(t&&1===t.nodeType){var r=function(t,n){var r=t[e.browser.nativeSelector];return t&&r&&r.call(t,n)};return r(t,n||"*")}},parseJSON:function(e,t){return JSON.parse(""+e,t)},parseXML:function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new DOMParser).parseFromString(e,"text/xml")}catch(n){t=null}if(!t||t.getElementsByTagName("parsererror").length)throw Error("Invalid XML: "+e);return t},proxy:function(t,n){var r=g.call(arguments,2);return e.isFunction(t)?function(){return t.apply(n||this,r.concat(g.call(arguments)))}:void 0},siblings:function(e,t){var n=[];if(void 0==e)return n;for(;e;e=e.nextSibling)1==e.nodeType&&e!==t&&n.push(e);return n},stringify:function(e,t,n){return JSON.stringify(e,t,n)},toArray:function(t,n,r){var i=[];if(!t||!t.length)return i;e.isString(t)&&(t=t.split("")),r=r&&0>r&&t.length+r||r||t.length;for(var o=n||0;r>o;o++)i.push(t[o]);return i},trim:function(t){return null===t?"":b&&b.call(t)||(""+t).replace(e.regex.trim,"")},type:function(e){return null===e?String(e):j[p.call(e)]||"object"},unique:function(e){for(var t=0;t<e.length;t++)C(e,e[t])!==t&&(e.splice(t,1),t--);return e}}),w(["Array","Boolean","Date","Error","Function","Object","RegExp","String"],function(t){j["[object "+t+"]"]=t.toLowerCase(),e["is"+t]=function(n){return e.type(n)===t.toLowerCase()}}),e.fn.init.prototype=e.fn,e.apply(e.fn,{concat:h,forEach:y,indexOf:x,reduce:m,splice:v,each:e.each,extend:e.extend,add:function(t,n){return this.chain(e.unique(e.merge(this,e(t,n))))},chain:function(t){return!!t&&(t.prevObject=this)&&e(t)||e()},children:function(t){var n=[];if(void 0!==this[0]){var r=0,i=this.length;if(1===this.length)n=e.siblings(this[0].firstChild);else for(;i>r;r++)n=n.concat(e.siblings(this[r].firstChild));return this.chain(e(n).filter(t))}},clone:function(t){var n=this.map(function(){return this.cloneNode(!!t)});return e(n)},closest:function(n,r){if(this.length){var i=this[0],o=e(n,r);if(!o.length)return e();for(;i&&o.indexOf(i)<0;)i=i!==r&&i!==t&&i.parentNode;return this.chain(e(i||[]))}},contains:function(t){return e.contains(this,t)},contents:function(){return void 0!==this[0]&&e.contents(this[0])},empty:function(){if(void 0!==this[0]){for(var t=0,n=this.length;n>t;t++){for(var r=this[t];r.firstChild;)"uid"in r.firstChild&&e.data(r.firstChild,"destroy"),r.removeChild(r.firstChild);r=null}return this}},end:function(){return this.prevObject||e()},eq:function(t){return e(0>t?this[t+=this.length-1]:this[t])},find:function(t){var n;return t&&"string"==typeof t?(n=e(1===this.length?e.query(t,this[0]):e.map(this,function(n){return e.query(t,n)})),this.chain(n)):[]},first:function(){return e(this[0])},filter:function(t){return t?e(d.call(this,function(n){return e.match(n,t)})):this},get:function(e){return void 0!==e?0>e?this[this.length+e]:this[e]:g.call(this)},hasClass:function(e){return classRE(e).test(this[0].className)},hide:function(){if(void 0===this[0])return this;for(var e=0,t=this.length;t>e;e++){var n=this[e],i=r(n,null).display;1===n.nodeType&&"none"!==i&&(n.displayRef=i,n.style.display="none"),n=i=null}return this},html:function(t){return this.length&&void 0!==this[0]?t?this.empty().each(function(){e(this).append(t)}):this[0].innerHTML:void 0},index:function(t){return this.length?t?C(this,e(t)[0]):C(this[0].parentNode.children,this[0]):void 0},last:function(){return e(this[this.length-1])},map:function(t){return e(e.map(this,function(e,n){return t.call(e,n,e)}))},offset:function(e){if(this.length&&void 0!==this[0]){var t=this[0].getBoundingClientRect();return{bottom:t.top+t.height+i.pageYOffset,height:t.height,left:t.left+i.pageXOffset,right:t.left+t.width+i.pageXOffset,top:t.top+i.pageYOffset,width:t.width}}},offsetParent:function(){return this.map(function(){for(var n=this.offsetParent||t.body;n&&!e.regex.root.test(n.nodeName)&&"static"===e(n).css("position");)n=n.offsetParent;return n})},outerHTML:function(){return void 0!==this[0]&&this[0].outerHTML||void 0},parent:function(t){var n;return this[0].parentNode?(n=t?e(this[0].parentNode).filter(t):e(this[0].parentNode||[]),this.chain(n)):this},position:function(){if(this.length){var t=e(this[0]),n=e(this.offsetParent()),r=this.offset(),i=n.eq(0),o=e.regex.root.test(n[0].nodeName)?{top:0,left:0}:n.offset();return r.top-=parseFloat(t.css("marginTop"))||0,r.left-=parseFloat(t.css("marginLeft"))||0,o.top+=parseFloat(i.css("borderTopWidth"))||0,o.left+=parseFloat(i.css("borderLeftWidth"))||0,{top:r.top-o.top,left:r.left-o.left}}},ready:function(n){return e.regex.ready.test(t.readyState)?n.call():t.addEventListener("DOMContentLoaded",n,!1),this},show:function(){if(!this.length||void 0===this[0])return this;for(var e=0,t=this.length;t>e;e++){var n=this[e];if(1===n.nodeType&&"none"===r(n,null).display){n.style.display=n.displayRef||"block";try{delete n.displayRef}catch(i){n.displayRef=null}}n=null}return this},siblings:function(t){var n=[];if(this.length){var r=0,i=this.length;if(1===this.length)1==this[0].nodeType&&this[0].parentNode&&(n=e.siblings(this[0].parentNode.firstChild,this[0]));else for(;i>r;r++)1==this[r].nodeType&&this[r].parentNode&&(n=n.concat(e.siblings(this[r].parentNode.firstChild,this[r])));return this.chain(e(n).filter(t))}},slice:function(){return e(g.apply(this,arguments))},swapClass:function(e,t){return this.length?this.removeClass(e).addClass(t):void 0},text:function(t){if(void 0!==!this[0]){if(!t)return this[0].textContent;for(var n=0,r=this.length;r>n;n++){var i=this[n];i.nodeType&&(e(i).empty(),"function"==typeof t?i.textContent=t.call(i,n,i.textContent):i.textContent=t),i=null}return this}},toArray:function(t,n){return e.toArray(this,t,n)},toggleClass:function(e,t){return this.length?this[this.hasClass(e)?"removeClass":"addClass"](t&&t(e)||e):void 0},val:function(e){if(void 0!==this[0]){if(void 0===e)return this[0].value;for(var t=0,n=this.length;n>t;t++)this[t].value=e;return this}},wrap:function(t){if(void 0!==this[0]){for(var t=e(t),n=0,r=this.length,i=null;r>n;n++)i=e(this[n]),i.before(t)&&t.append(i);return this}}}),w(["addClass","removeClass"],function(t,n){e.fn[t]=function(e){if(void 0!==this[0]){for(var n=0,r=this.length,i=typeof e,o="string"===i?e.split(" "):[],s=o.length,a="removeClass"===t;r>n;n++)if(!a||void 0!==e&&0!==e.length){var u=this[n],c=u.className,l=(""+c).split(" "),f=0;if("function"===i)e.call(u,c,n);else{for(;s>f;f++){var p=C(l,o[f]);a&&-1!==p?u.className=u.className.replace(classRE(o[f]),""):0>p&&(u.className=u.className+" "+o[f])}u.className=u.className.trim()}}else this[n].className="";return this}}}),w(["detach","remove"],function(t,n){e.fn[t]=function(t){if(this.length&&void 0!==this[0]){for(var r=0,i=this.length;i>r;r++){var o=this[r];1===o.nodeType&&(1===n&&"uid"in o&&e.data(o,"destroy"),o.parentNode&&o.parentNode.removeChild(o)),o=null}return this}}}),e.each({parents:"parentNode",next:"nextElementSibling",prev:"previousElementSibling"},function(t,n){e.fn[t]=function(r){if(this.length){for(var i=[],o=this;o.length>0;)o=e.map(o,function(e){return e=e[n],e&&1===e.nodeType&&C(i,e)<0?i.push(e)&&e:void 0});return i=r?e(i).filter(r):e(i),"parents"!==t?i.first():i}}}),w(["nextAll","prevAll"],function(t){e.fn[t]=function(n){if(!this.length||void 0===this[0]||!this[0].parentNode)return this;var r=this.index(),i=e(this[0].parentNode).children(n),o=[];return w(i,function(e,n){("nextAll"===t?n>r:r>n)&&o.push(this)}),e(o)}}),w(["width","height","outerWidth","outerHeight"],function(t){e.fn[t]=function(n){var r=this[0],i=t.replace("outer","").toLowerCase(),s=i.charAt(0).toUpperCase()+i.slice(1),a="scroll"+s,u="client"+s,c="offset"+s,l=0,f=0,p=0;if(r){if(e.isWindow(r))return r["inner"+s];if(9===r.nodeType){var h=o;return Math.max(r.body[a],r.body[c],h[a],h[c],h[u])}return void 0===n&&t.indexOf("outer")<0?this.css(t):-1!==t.indexOf("outer")?(l="width"===i?this.css("paddingLeft")+this.css("paddingRight"):this.css("paddingTop")+this.css("paddingBottom"),f=n===!0?"width"===i?this.css("marginLeft")+this.css("marginRight"):this.css("marginTop")+this.css("marginBottom"):"width"===i?this.css("borderLeftWidth")+this.css("borderRightWidth"):this.css("borderTopWidth")+this.css("borderBottomWidth"),this.css(i)+l+f+p):this.css(t,n)}}}),w(["scrollLeft","scrollTop"],function(t,n){var r=1===n,i=r?"pageYOffset":"pageXOffset";e.fn[t]=function(n){if(void 0!==this[0]){var s=this[0],a=e.isWindow(s)?s:9===s.nodeType?s.defaultView||s.parentWindow:!1;return void 0===n?a?i in a?a[i]:o[t]:s[t]:a?a.scrollTo(r?e(a).scrollLeft():n,r?n:e(a).scrollTop()):s[t]=n}}}),w(["blur","change","click","dblclick","enter","error","focus","focusin","focusout","hashchange","keydown","keypress","keyup","leave","load","mousedown","mousemove","mouseout","mouseover","mouseenter","mouseleave","mouseup","resize","scroll","select","submit","unload"],function(t){e.fn[t]=function(e,n){return"function"==typeof e&&(n=e,e=null),n?this.on(t,e,n):this.trigger(t)}}),w(["on","off","bind","unbind"],function(t,n){e.fn[t]=function(t,r,i,o){return void 0!==this[0]?(null==i&&(i=r,r=null),this.each(function(){e.events[n%2===0?"add":"remove"](this,t,r,i,o)})):void 0}}),e.apply(e.fn,{hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},one:function(t,n,r){var i=this,o=function(e){"function"==typeof n&&(n.call(this,e,e.data),i.off(t,r,o))};return this.each(function(i,s){var i=e(this);"object"==typeof t?("function"!=typeof n&&(r=n,n=null),e.each(t,function(e,t){i.one(e,t,r)})):i.on(t,r,o)})},trigger:function(t,n){return"string"==typeof t?this.each(function(){var r=this;w(e.events.find(this,t),function(e){e.fn&&"function"==typeof e.fn&&("object"==typeof n&&(e.data=n),e.fn({currentTarget:r,data:e.data,handleObj:e,namespace:e.namespace,timeStamp:(new Date).getTime(),type:e.type},e.data))})}):void 0}});var c=function(t){var n={blur:e.supports.focusin?"focusout":"blur",focus:e.supports.focusin?"focusin":"focus",mouseenter:"mouseover",mouseleave:"mouseout",turn:"orientationchange"};return n[t]||t};e.events={find:function(t,n,r){var i=e.events.namespace(n);return(_eventsCache[t.uid]||[]).filter(function(e){return e&&(!i.type||e.type===i.type)&&(!i.namespace||e.namespace===i.namespace)&&(!r||e.fn===r)})},add:function(t,r,i,o,s){var a=t.uid||(t.uid=n()),u=_eventsCache[a]||(_eventsCache[a]=[]);w((""+r).split(e.regex.space),function(n){var r=e.events.namespace(n),s=(c[r.type],e.events.proxy(t,n,i,o)),a=e.supports.focusin&&/focusin|focusout/i.test(n)||a;u.push({data:i,fn:o,index:u.length,namespace:r.namespace,proxy:s,type:r.type}),"addEventListener"in t&&t.addEventListener(r.type,s,!!a)})},remove:function(t,n,r,i){w((""+n).split(e.regex.space),function(n){w(e.events.find(t,n,i),function(e){try{delete _eventsCache[t.uid][e.index]}catch(n){_eventsCache[t.uid][e.index]=null}"removeEventListener"in t&&t.removeEventListener(e.type,e.proxy,!1)})})},namespace:function(e){var t=e.split(".");return{type:t[0],namespace:t.slice(1).sort().join(" ")}},proxy:function(e,t,n,r){return function(t){var i;return"function"==typeof r&&(t.data=n||{},i=r.call(e,t,t.data)),i===!1&&t.preventDefault(),i}}},e.extend({subscribe:function(e,t){N[e]||(N[e]=[]);var n=(++S).toString();return N[e].push({token:n,fn:t}),n},publish:function(){var e=arguments,t=arguments[0];return N[t]?(setTimeout(function(){for(var n=N[t],r=n?n.length:0;r--;)n[r].fn.apply(this,e)},0),!0):!1},unsubscribe:function(e){var t;for(t in N)if(N[t])for(var n=0,r=N[t].length;r>n;n++)if(N[t][n].token===e)return N[t].splice(n,1),e;return!1}}),e.regex={alpha:/[A-Za-z]/,browser:/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i,callback:/\?(.+)=\?/,camel:/-([\da-z])/gi,cssNumbers:/^((margin|padding|border)(top|right|bottom|left)(width|height)?|height|width|zindex?)$/i,device:/((ip)(hone|ad|od)|playbook|hp-tablet)/i,escape:/('|\\)/g,fragments:/^\s*<(\w+|!)[^>]*>/,jsonString:/^(\{|\[)/i,manipulation:/insert|to/i,mixed:/^(?:\s*<[\w!]+>|body|head|#\w(?:[\w-]*)|\.\w(?:[\w-]*))$/,mobile:/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,ms:/^-ms-/,nodes:/^(?:1|3|8|9|11)$/,numbers:/^(0|[1-9][0-9]*)$/i,os:/(android|blackberry|bb10|macintosh|webos|windows)/i,protocol:/^((http|ftp|file)(s?)\:)?/,queries:/[&?]{1,2}/,quotes:/^["']|["']$/g,ready:/^(?:complete|loaded|interactive)$/i,relative:/^([-+=])/,responseOK:/^(20[0-6]|304)$/g,root:/^(?:body|html)$/i,space:/\s+/g,tags:/^[\w-]+$/,templates:{keys:/\{(\w+)\}/g,indexed:/\{(\d+)\}/g},trim:/^\s+|\s+$/g,whitespaces:/^\s*$/g},e.browser=function(){var t=a.match(e.regex.browser),n=RegExp.$1.toLowerCase(),r={chrome:"webkit",firefox:"moz",msie:"ms",opera:"o",safari:"webkit",trident:"ms"},o=r[n]||"",u=o+"MatchesSelector",c=s.language;return{chrome:"chrome"===n&&!("doNotTrack"in i),cssPrefix:"-"+o+"-",firefox:"firefox"===n,language:c&&c.toLowerCase(),msie:"msie"===n||"trident"===n,nativeSelector:o.length>0?u:u[0].toLowerCase(),opera:"opera"===n,prefix:o,safari:"safari"===n&&"doNotTrack"in i,version:null!==a.match(/version\/([\.\d]+)/i)?RegExp.$1:t[2],webkit:"webkit"===o}}(),e.device=function(){var t=(a.match(e.regex.device),RegExp.$1.toLowerCase()),n=function(){var t=a||u||i.opera;return e.regex.mobile.test(t)}();return{idevice:/((ip)(hone|ad|od))/i.test(t),ipad:"ipad"===t,iphone:"iphone"===t,ipod:"ipod"===t,isDesktop:!n,isMobile:n,orientation:function(){return i.innerHeight>i.innerWidth?"portrait":"landscape"},playbook:"playbook"===t,touchpad:"hp-tablet"===t}}(),e.os=function(){var t=(a.match(e.regex.os),/mobile/i.test(a)),n=RegExp.$1.toLowerCase(),r=(""+(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(a)||[0,""])[1]).replace("undefined","3_2").replace(/_/gi,".").replace(/_/gi,"")||!1;return{android:"android"===n,blackberry:"blackberry"===n,bbmobile:"blackberry"===n&&t,bb10:"bb10"===n&&t,iOS:e.device.idevice,iOS4:r>=4&&5>r,iOS5:r>=5&&6>r,iOS6:r>=6&&7>r,iOS7:r>=7,iOSVersion:r,osx:"macintosh"===n,webOS:"webos"===n,windows:"windows"===n}}();var l=function(t){return e.camelCase(e.browser.prefix.replace(e.regex.ms,"ms-"))+t};return e.supports={cssAnimationEvents:l("AnimationName")in o.style,cssTransform:l("Transform")in o.style,cssTransitionEnd:l("TransitionEnd")in o.style,cssTransition:l("Transition")in o.style,cssTransform3d:"WebKitCSSMatrix"in i&&"m11"in new WebKitCSSMatrix,focusin:"onfocusin"in i,homescreen:"standalone"in s,localStorage:void 0!==typeof i.localStorage,pushState:"pushState"in i.history&&"replaceState"in i.history,retina:"devicePixelRatio"in i&&i.devicePixelRatio>1,touch:"ontouchstart"in i},e}();return O}),n("ajax",["./core"],function(e){var t=0,n=0,r=function(){};return e.extend({ajaxSettings:{accepts:{html:"text/html",json:"application/json",script:"text/javascript, application/javascript",text:"text/plain",xml:"application/xml, text/xml"},async:!0,beforeSend:r,complete:r,context:e(document),crossDomain:!1,error:r,global:!0,headers:{},callback:{fn:"",param:"jsoncallback"},success:r,timeout:0,type:"GET"},ajax:function(n){var i=e.regex.callback.test(n.url),n=e.extend(!0,{},e.ajaxSettings,n||{}),o=n.data&&e.isObject(n.data)&&(n.data=e.params(n.data))||null,s=e(n.context),a=n.contentType||"application/x-www-form-urlencoded",u=n.headers,c=n.type.toUpperCase(),l=n.accepts[n.dataType],f=/^((http|ftp|file)(s?)\:)?/.test(n.url)?RegExp.$1:window.location.protocol,p=n.dataType,h=n.url||!n.url&&(n.url=window.location.toString()),d=n.xhr=new window.XMLHttpRequest;if("GET"===c&&o&&(h+=(h.indexOf("?")<0?"?":"&")+o),n.crossDomain||(n.crossDomain=f!==window.location.host,u["X-Requested-With"]="XMLHttpRequest"),"jsonp"===p||i)return(n.url=e.appendQuery(h,n.callback.param+"=?"))&&e.jsonP(n);if(d.onreadystatechange=function(){var r,i=!1,o="";if(t++,4===d.readyState){if(clearTimeout(r),d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"===f){o=d.responseText;try{"json"!==p||e.regex.whitespaces.test(o)?"xml"===p?o=e.parseXML(d.responseXML):"script"===p&&(1,eval)(o):o=e.parseJSON(o)}catch(a){i=a}i?n.error.call(s,d,"parsererror",i):n.success.call(s,o,"success",d)}else n.error.call(s,d,"error",i);n.complete.call(s,d,i?"error":"success"),t--}},n.beforeSend.call(s,d,n)===!1)return d.abort(),t--,!1;l&&(u.Accept=l,d.overrideMimeType&&d.overrideMimeType(l.split(",")[1]||l.split(",")[0])),(a||o&&"GET"!==c)&&(u["Content-Type"]=a),d.open(c,n.url,n.async);for(var m in u)d.setRequestHeader(m,n.headers[m]);return n.timeout>0&&(requestTimeout=setTimeout(function(){d.onreadystatechange=r,n.error.call(s,d,"timeout"),d.abort(),t--},n.timeout)),d.send(o),d},appendQuery:function(t,n){return(t+"&"+n).replace(e.regex.queries,"?")},deparam:function(t){var n={};return t?(e.each(t.split("&"),function(e,t){if(t){var r=t.split("=");n[r[0]]=r[1]}}),n):n},jsonp:function(t,n,i){return"object"!=typeof t||t&&!t.url?void 0:e.ajax(e.extend(!0,{dataType:"jsonp",success:n||r,error:i||r},t))},jsonP:function(t){var i,o=document.createElement("script"),s=t.callback.fn||"jsonpCallback"+n++,a=t.context;return window[s]=function(e){try{delete window[s]}catch(n){window[s]=null}o.parentNode.removeChild(o),t.success.call(a,e),i&&clearTimeout(i)&&(i=null)},o.src=t.url.replace(e.regex.callback,"?$1="+s),o.onerror=function(){t.xhr.abort(),t.error.call(a,null,"error")},document.getElementsByTagName("head")[0].appendChild(o),t.timeout>0&&(i=setTimeout(function(){o.parentNode.removeChild(o),s in window&&(window[s]=r),t.error.call(a,null,"timeout"),t.xhr.abort()},t.timeout)),{}},params:function(t){return e.serialize([],t).join("&").replace("%20","+")},serialize:function(t,n,r){var i=e.isArray(n),o=encodeURIComponent;return e.each(n,function(n,s){r&&(n=r+"["+(i?"":n)+"]"),e.isObject(s)?e.serialize(t,s,n):t.push(o(n)+"="+o(s))}),t}}),["get","getJSON"].forEach(function(t,n){e[t]=function(t,i,o,s){return e.isFunction(i)&&(s=o)&&(o=i)&&(i={}),e.ajax({url:t,data:i,dataType:0===n?"html":"json",success:o||r,error:s||r})}}),e}),n("data",["./core","./guid"],function(e,t){var n={},r=function(e){var t=e.uid;return n[t]&&delete n[t],!0};return e.extend({data:function(i,o,s){var a=i instanceof e,u=a?i:[i];if(!(void 0===u[0]||u[0]&&1!==u[0].nodeType)){var c=u[0].uid,l=u.length,f=0;if(void 0===o&&void 0===s)return n[c]||void 0;if("string"==typeof o&&"destroy"!==o&&void 0===s)return n[c]&&n[c][o]||void 0;for(;l>f;f++)if(1===u[f].nodeType)if("destroy"===o&&"uid"in u[f])r(u[f]);else if(c=u[f].uid||(u[f].uid=t()),n[c]||(n[c]={}),"object"==typeof o)for(var f in o)n[c][f]=o[f];else n[c][o]=s;return i}}}),e.fn.extend({data:function(t,n){return e.data(this,t,n)}}),e}),n("attributes/attr",["../core"],function(e){e.fn.extend({attr:function(e,t){var n=this[0];if(n&&(!n||1===n.nodeType)){if("string"==typeof e&&void 0===t&&"null"!=t){if("string"==typeof e)return n.getAttribute(e)}else for(var r=0,i=this.length,o=function(e,t,n){null==n?e.removeAttribute(t):e.setAttribute(t,n)};i>r;r++){if(n=this[r],!n||n&&1!==n.nodeType)return;if("string"==typeof e&&o(n,e,t),"object"==typeof e)for(var s in e)o(n,s,e[s])}return this}},removeAttr:function(e){if(void 0!==this[0]){for(var t=0,n=this.length;n>t;t++){var r=this[t];if(1===r.nodeType){if("string"==typeof e)r.removeAttribute(e);else if("array"==typeof e)for(var i=0,o=e.length;o>i;i++){var s=e[i];r[s]&&r.removeAttribute(s)}r=null}}return this}}})}),n("attributes/css",["../core","../getComputedStyle"],function(e,t){var n={columns:1,columnCount:1,fillOpacity:1,flexGrow:1,flexShrink:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,widows:1,zIndex:1,zoom:1},r=function(e,t){return"number"==typeof t&&!n[e]&&parseFloat(t)+"px"||t};e.fn.extend({css:function(n,i){var o=this[0],s="string"==typeof n,a={width:1,height:1},u=function(n,i,o,s){if(!(null==o||o!==o&&s)){var u=e.camelCase(i);return s&&(o=n.style[u]||t(n,null)[u]),parseFloat(o)<0&&a[u]&&(o=0),""===o&&("opacity"===u&&(o=1),a[u])?"0px":s?e.regex.cssNumbers.test(u)?parseFloat(o):o:void(n.style[u]=r(u,o))}};if(o&&3!==o.nodeType&&8!==o.nodeType&&o.style){if(s&&void 0===i)return u(o,n,"1",!0);for(var c=0,l=this.length;l>c;c++){if(o=this[c],!o||3===o.nodeType||8===o.nodeType||!o.style)return;if(s)u(o,n,i);else for(var f in n)u(o,f,n[f])}return this}}})}),n("scripts",[],function(){return function(e){var t=e.src&&e.src.length>0;try{if(!t)return(1,eval)(e.innerHTML),e;var n=document.createElement("script");return n.type="text/javascript",n.src=e.src,n}catch(r){console.log("There was an error with the script:"+r)}}}),n("manipulation/append",["../core","../scripts"],function(e,t){return documentFragments=function(e,n,r){var i=document.createDocumentFragment(),o=e.length,s=o-1,a=0;if(r){for(;s>=0;s--){var u=e[s];"script"===u.nodeName.toLowerCase()&&(u=t(u)),i.insertBefore(u,i.firstChild)}n.insertBefore(i,n.firstChild)}else{for(;o>a;a++){var u=e[a];"script"===u.nodeName.toLowerCase()&&(u=t(u)),i.appendChild(u)}n.appendChild(i)}i=null},e.fn.extend({append:function(t,n){if(t&&void 0!=t.length&&!t.length)return this;(!t.constructor===Array||"object"==typeof t)&&(t=e(t));for(var r=0,i=this.length;i>r;r++)if(t.length&&"string"==typeof t){var o=e.regex.fragments.test(t)?e(t):void 0;if(void 0!=o&&o.length||(o=document.createTextNode(t)),o.constructor===e)for(var s=0,a=o.length;a>s;s++)documentFragments(e(o[s]),this[r],n);else void 0!=n?this[r].insertBefore(o,this[r].firstChild):this[r].appendChild(o)}else documentFragments(e(t),this[r],n);return this}}),e}),n("manipulation/beforeAfter",["../core","../scripts"],function(e,t){return e.each(["before","after"],function(n,r){e.fn[n]=function(r){if(r=e(r)[0],!this.length||!r)return this;for(var i=0,o=this.length;o>i;i++){var s=this[i];"script"===r.nodeName.toLowerCase()&&(r=t(r)),s.parentNode&&s.parentNode.insertBefore(r,"before"===n?s:s.nextSibling)}return this}}),e}),n("manipulation/prepend",["../core"],function(e){return e.each(["appendTo","prependTo","prepend"],function(t,n){e.fn[t]=function(t){var r=this,t=e(t);return 2!==n&&(r=e(t),t=this),r.append(t,0!==n),t}}),e}),n("pixels",["./core","./ajax","./data","./attributes/attr","./attributes/css","./manipulation/append","./manipulation/beforeAfter","./manipulation/prepend"],function(e){return e}),t("pixels")});
//# sourceMappingURL=pixels.js.map

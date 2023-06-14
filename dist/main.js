/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/disable-devtool/disable-devtool.min.js":
/*!*************************************************************!*\
  !*** ./node_modules/disable-devtool/disable-devtool.min.js ***!
  \*************************************************************/
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,function(){"use strict";function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t,n){t&&r(e.prototype,t),n&&r(e,n),Object.defineProperty(e,"prototype",{writable:!1})}function e(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&a(e,t)}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function a(e,t){return(a=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function q(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");t=e;if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(n){var o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var e,t=c(n);return q(this,o?(e=c(this).constructor,Reflect.construct(t,arguments,e)):t.apply(this,arguments))}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function s(e,t){var n,o="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!o){if(Array.isArray(e)||(o=function(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length)return o&&(e=o),n=0,{s:t=function(){},n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,r=!0,u=!1;return{s:function(){o=o.call(e)},n:function(){var e=o.next();return r=e.done,e},e:function(e){u=!0,i=e},f:function(){try{r||null==o.return||o.return()}finally{if(u)throw i}}}}var d=!1,t={};function v(e){t[e]=!1}function z(){for(var e in t)if(t[e])return d=!0;return d=!1}function h(){return(new Date).getTime()}function B(e){var t=h();return e(),h()-t}function W(n,o){function e(t){return function(){n&&n();var e=t.apply(void 0,arguments);return o&&o(),e}}var t=window.alert,i=window.confirm,r=window.prompt;try{window.alert=e(t),window.confirm=e(i),window.prompt=e(r)}catch(e){}}var p={iframe:!1,pc:!1,qqBrowser:!1,firefox:!1,macos:!1,edge:!1,oldEdge:!1,ie:!1,iosChrome:!1,iosEdge:!1,chrome:!1,seoBot:!1};function U(){function e(e){return-1!==t.indexOf(e)}var t=navigator.userAgent.toLowerCase(),n=!!window.top&&window!==window.top,o=!/(iphone|ipad|ipod|ios|android)/i.test(t),i=e("qqbrowser"),r=e("firefox"),u=e("macintosh"),c=e("edge"),a=c&&!e("chrome"),l=a||e("trident")||e("msie"),f=e("crios"),s=e("edgios"),d=e("chrome")||f,v=/(googlebot|baiduspider|bingbot|applebot|petalbot|yandexbot|bytespider|chrome\-lighthouse)/i.test(t);Object.assign(p,{iframe:n,pc:o,qqBrowser:i,firefox:r,macos:u,edge:c,oldEdge:a,ie:l,iosChrome:f,iosEdge:s,chrome:d,seoBot:v})}function H(){for(var e=function(){for(var e={},t=0;t<500;t++)e["".concat(t)]="".concat(t);return e}(),t=[],n=0;n<50;n++)t.push(e);return t}var K="",V=!1;function F(){var e=b.ignore;if(e){if("function"==typeof e)return e();if(0!==e.length){var t=location.href;if(K===t)return V;K=t;var n,o=!1,i=s(e);try{for(i.s();!(n=i.n()).done;){var r=n.value;if("string"==typeof r){if(-1!==t.indexOf(r)){o=!0;break}}else if(r.test(t)){o=!0;break}}}catch(e){i.e(e)}finally{i.f()}return V=o}}}var M=0,X=0,N=[],$=0;function G(i){function e(){l=!0}function t(){l=!1}var n,o,r,u,c,a,l=!1;function f(){(a[u]===r?o:n)()}W(e,t),n=t,o=e,void 0!==(a=document).hidden?(r="hidden",c="visibilitychange",u="visibilityState"):void 0!==a.mozHidden?(r="mozHidden",c="mozvisibilitychange",u="mozVisibilityState"):void 0!==a.msHidden?(r="msHidden",c="msvisibilitychange",u="msVisibilityState"):void 0!==a.webkitHidden&&(r="webkitHidden",c="webkitvisibilitychange",u="webkitVisibilityState"),a.removeEventListener(c,f,!1),a.addEventListener(c,f,!1),M=window.setInterval(function(){if(!(i.isSuspend||l||F())){var e,t,n=s(N);try{for(n.s();!(e=n.n()).done;){var o=e.value;v(o.type),o.detect($++)}}catch(e){n.e(e)}finally{n.f()}T(),"function"==typeof b.ondevtoolclose&&(t=d,!z()&&t&&b.ondevtoolclose())}},b.interval),X=setTimeout(function(){p.pc||y()},b.stopIntervalTime)}function y(){window.clearInterval(M)}function Y(){if(y(),b.url)window.location.href=b.url;else{try{window.opener=null,window.open("","_self"),window.close(),window.history.back()}catch(e){console.log(e)}setTimeout(function(){window.location.href="https://theajack.github.io/disable-devtool/404.html?h=".concat(encodeURIComponent(location.host))},500)}}var b={md5:"",ondevtoolopen:Y,ondevtoolclose:null,url:"",tkName:"ddtk",interval:200,disableMenu:!0,stopIntervalTime:5e3,clearIntervalWhenDevOpenTrigger:!1,detectors:"all",clearLog:!0,disableSelect:!1,disableCopy:!1,disableCut:!1,disablePaste:!1,ignore:null,disableIframeParents:!0,seo:!0},J=["detectors","ondevtoolclose","ignore"];function Q(e){var t,n=0<arguments.length&&void 0!==e?e:{};for(t in b){var o=t;void 0===n[o]||i(b[o])!==i(n[o])&&-1===J.indexOf(o)||(b[o]=n[o])}"function"==typeof b.ondevtoolclose&&!0===b.clearIntervalWhenDevOpenTrigger&&(b.clearIntervalWhenDevOpenTrigger=!1,console.warn("【DISABLE-DEVTOOL】clearIntervalWhenDevOpenTrigger 在使用 ondevtoolclose 时无效"))}var w,g,Z,m=window.console||{log:function(){},table:function(){},clear:function(){}};function T(){b.clearLog&&Z()}var ee=function(){return!1};function O(n){var e,o=74,i=73,r=85,u=83,c=123,a=p.macos?function(e,t){return e.metaKey&&e.altKey&&(t===i||t===o)}:function(e,t){return e.ctrlKey&&e.shiftKey&&(t===i||t===o)},l=p.macos?function(e,t){return e.metaKey&&e.altKey&&t===r||e.metaKey&&t===u}:function(e,t){return e.ctrlKey&&(t===u||t===r)};n.addEventListener("keydown",function(e){var t=(e=e||n.event).keyCode||e.which;if(t===c||a(e,t)||l(e,t))return te(n,e)},!0),e=n,b.disableMenu&&D(e,"contextmenu"),e=n,b.disableSelect&&D(e,"selectstart"),e=n,b.disableCopy&&D(e,"copy"),e=n,b.disableCut&&D(e,"cut"),e=n,b.disablePaste&&D(e,"paste")}function D(t,e){t.addEventListener(e,function(e){return te(t,e)})}function te(e,t){if(!F()&&!ee())return(t=t||e.event).returnValue=!1,t.preventDefault(),!1}var S=8;function ne(e){for(var t=function(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,o=-271733879,i=-1732584194,r=271733878,u=0;u<e.length;u+=16){var c=n,a=o,l=i,f=r;n=P(n,o,i,r,e[u+0],7,-680876936),r=P(r,n,o,i,e[u+1],12,-389564586),i=P(i,r,n,o,e[u+2],17,606105819),o=P(o,i,r,n,e[u+3],22,-1044525330),n=P(n,o,i,r,e[u+4],7,-176418897),r=P(r,n,o,i,e[u+5],12,1200080426),i=P(i,r,n,o,e[u+6],17,-1473231341),o=P(o,i,r,n,e[u+7],22,-45705983),n=P(n,o,i,r,e[u+8],7,1770035416),r=P(r,n,o,i,e[u+9],12,-1958414417),i=P(i,r,n,o,e[u+10],17,-42063),o=P(o,i,r,n,e[u+11],22,-1990404162),n=P(n,o,i,r,e[u+12],7,1804603682),r=P(r,n,o,i,e[u+13],12,-40341101),i=P(i,r,n,o,e[u+14],17,-1502002290),o=P(o,i,r,n,e[u+15],22,1236535329),n=x(n,o,i,r,e[u+1],5,-165796510),r=x(r,n,o,i,e[u+6],9,-1069501632),i=x(i,r,n,o,e[u+11],14,643717713),o=x(o,i,r,n,e[u+0],20,-373897302),n=x(n,o,i,r,e[u+5],5,-701558691),r=x(r,n,o,i,e[u+10],9,38016083),i=x(i,r,n,o,e[u+15],14,-660478335),o=x(o,i,r,n,e[u+4],20,-405537848),n=x(n,o,i,r,e[u+9],5,568446438),r=x(r,n,o,i,e[u+14],9,-1019803690),i=x(i,r,n,o,e[u+3],14,-187363961),o=x(o,i,r,n,e[u+8],20,1163531501),n=x(n,o,i,r,e[u+13],5,-1444681467),r=x(r,n,o,i,e[u+2],9,-51403784),i=x(i,r,n,o,e[u+7],14,1735328473),o=x(o,i,r,n,e[u+12],20,-1926607734),n=j(n,o,i,r,e[u+5],4,-378558),r=j(r,n,o,i,e[u+8],11,-2022574463),i=j(i,r,n,o,e[u+11],16,1839030562),o=j(o,i,r,n,e[u+14],23,-35309556),n=j(n,o,i,r,e[u+1],4,-1530992060),r=j(r,n,o,i,e[u+4],11,1272893353),i=j(i,r,n,o,e[u+7],16,-155497632),o=j(o,i,r,n,e[u+10],23,-1094730640),n=j(n,o,i,r,e[u+13],4,681279174),r=j(r,n,o,i,e[u+0],11,-358537222),i=j(i,r,n,o,e[u+3],16,-722521979),o=j(o,i,r,n,e[u+6],23,76029189),n=j(n,o,i,r,e[u+9],4,-640364487),r=j(r,n,o,i,e[u+12],11,-421815835),i=j(i,r,n,o,e[u+15],16,530742520),o=j(o,i,r,n,e[u+2],23,-995338651),n=I(n,o,i,r,e[u+0],6,-198630844),r=I(r,n,o,i,e[u+7],10,1126891415),i=I(i,r,n,o,e[u+14],15,-1416354905),o=I(o,i,r,n,e[u+5],21,-57434055),n=I(n,o,i,r,e[u+12],6,1700485571),r=I(r,n,o,i,e[u+3],10,-1894986606),i=I(i,r,n,o,e[u+10],15,-1051523),o=I(o,i,r,n,e[u+1],21,-2054922799),n=I(n,o,i,r,e[u+8],6,1873313359),r=I(r,n,o,i,e[u+15],10,-30611744),i=I(i,r,n,o,e[u+6],15,-1560198380),o=I(o,i,r,n,e[u+13],21,1309151649),n=I(n,o,i,r,e[u+4],6,-145523070),r=I(r,n,o,i,e[u+11],10,-1120210379),i=I(i,r,n,o,e[u+2],15,718787259),o=I(o,i,r,n,e[u+9],21,-343485551),n=E(n,c),o=E(o,a),i=E(i,l),r=E(r,f)}return Array(n,o,i,r)}(function(e){for(var t=Array(),n=(1<<S)-1,o=0;o<e.length*S;o+=S)t[o>>5]|=(e.charCodeAt(o/S)&n)<<o%32;return t}(e),e.length*S),n="0123456789abcdef",o="",i=0;i<4*t.length;i++)o+=n.charAt(t[i>>2]>>i%4*8+4&15)+n.charAt(t[i>>2]>>i%4*8&15);return o}function k(e,t,n,o,i,r){return E((t=E(E(t,e),E(o,r)))<<i|t>>>32-i,n)}function P(e,t,n,o,i,r,u){return k(t&n|~t&o,e,t,i,r,u)}function x(e,t,n,o,i,r,u){return k(t&o|n&~o,e,t,i,r,u)}function j(e,t,n,o,i,r,u){return k(t^n^o,e,t,i,r,u)}function I(e,t,n,o,i,r,u){return k(n^(t|~o),e,t,i,r,u)}function E(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}(C=_=_||{})[C.Unknown=-1]="Unknown",C[C.RegToString=0]="RegToString",C[C.DefineId=1]="DefineId",C[C.Size=2]="Size",C[C.DateToString=3]="DateToString",C[C.FuncToString=4]="FuncToString",C[C.Debugger=5]="Debugger",C[C.Performance=6]="Performance",C[C.DebugLib=7]="DebugLib";var _,A=function(){function n(e){var t=e.type,e=e.enabled,e=void 0===e||e;o(this,n),this.type=_.Unknown,this.enabled=!0,this.type=t,this.enabled=e,this.enabled&&(t=this,N.push(t),this.init())}return u(n,[{key:"onDevToolOpen",value:function(){var e;console.warn("You ar not allow to use DEVTOOL! 【type = ".concat(this.type,"】")),b.clearIntervalWhenDevOpenTrigger&&y(),window.clearTimeout(X),b.ondevtoolopen(this.type,Y),e=this.type,t[e]=!0}},{key:"init",value:function(){}}]),n}(),C=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.RegToString,enabled:p.qqBrowser||p.firefox})}return u(t,[{key:"init",value:function(){var t=this;this.lastTime=0,this.reg=/./,w(this.reg),this.reg.toString=function(){var e;return p.qqBrowser?(e=(new Date).getTime(),t.lastTime&&e-t.lastTime<100?t.onDevToolOpen():t.lastTime=e):p.firefox&&t.onDevToolOpen(),""}}},{key:"detect",value:function(){w(this.reg)}}]),t}(),oe=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.DefineId})}return u(t,[{key:"init",value:function(){var e=this;this.div=document.createElement("div"),this.div.__defineGetter__("id",function(){e.onDevToolOpen()}),Object.defineProperty(this.div,"id",{get:function(){e.onDevToolOpen()}})}},{key:"detect",value:function(){w(this.div)}}]),t}(),ie=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.Size,enabled:!p.iframe&&!p.edge})}return u(t,[{key:"init",value:function(){var e=this;this.checkWindowSizeUneven(),window.addEventListener("resize",function(){setTimeout(function(){e.checkWindowSizeUneven()},100)},!0)}},{key:"detect",value:function(){}},{key:"checkWindowSizeUneven",value:function(){var e=function(){if(re(window.devicePixelRatio))return window.devicePixelRatio;var e=window.screen;return!(re(e)||!e.deviceXDPI||!e.logicalXDPI)&&e.deviceXDPI/e.logicalXDPI}();if(!1!==e){var t=200<window.outerWidth-window.innerWidth*e,e=300<window.outerHeight-window.innerHeight*e;if(t||e)return this.onDevToolOpen(),!1;v(this.type)}return!0}}]),t}();function re(e){return null!=e}var R,ue=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.DateToString,enabled:!p.iosChrome&&!p.iosEdge})}return u(t,[{key:"init",value:function(){var e=this;this.count=0,this.date=new Date,this.date.toString=function(){return e.count++,""}}},{key:"detect",value:function(){this.count=0,w(this.date),T(),2<=this.count&&this.onDevToolOpen()}}]),t}(),ce=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.FuncToString,enabled:!p.iosChrome&&!p.iosEdge})}return u(t,[{key:"init",value:function(){var e=this;this.count=0,this.func=function(){},this.func.toString=function(){return e.count++,""}}},{key:"detect",value:function(){this.count=0,w(this.func),T(),2<=this.count&&this.onDevToolOpen()}}]),t}(),ae=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.Debugger,enabled:p.iosChrome||p.iosEdge})}return u(t,[{key:"detect",value:function(){var e=h();100<h()-e&&this.onDevToolOpen()}}]),t}(),le=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.Performance,enabled:p.chrome})}return u(t,[{key:"init",value:function(){this.maxPrintTime=0,this.largeObjectArray=H()}},{key:"detect",value:function(){var e=this,t=B(function(){g(e.largeObjectArray)}),n=B(function(){w(e.largeObjectArray)});if(this.maxPrintTime=Math.max(this.maxPrintTime,n),T(),0===t||0===this.maxPrintTime)return!1;t>10*this.maxPrintTime&&this.onDevToolOpen()}}]),t}(),fe=function(){n(t,A);var e=l(t);function t(){return o(this,t),e.call(this,{type:_.DebugLib})}return u(t,[{key:"init",value:function(){}},{key:"detect",value:function(){var e;(!0===(null==(e=null==(e=window.eruda)?void 0:e._devTools)?void 0:e._isShow)||window._vcOrigConsole&&window.document.querySelector("#__vconsole.vc-toggle"))&&this.onDevToolOpen()}}]),t}(),se=(e(R={},_.RegToString,C),e(R,_.DefineId,oe),e(R,_.Size,ie),e(R,_.DateToString,ue),e(R,_.FuncToString,ce),e(R,_.Debugger,ae),e(R,_.Performance,le),e(R,_.DebugLib,fe),R);var L=Object.assign(function(e){if(U(),Z=p.ie?(w=function(){return m.log.apply(m,arguments)},g=function(){return m.table.apply(m,arguments)},function(){return m.clear()}):(w=m.log,g=m.table,m.clear),Q(e),!(b.md5&&ne(function(e){var t=window.location.search,n=window.location.hash;if(""!==(t=""===t&&""!==n?"?".concat(n.split("?")[1]):t)&&void 0!==t){n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),e=t.substr(1).match(n);if(null!=e)return unescape(e[2])}return""}(b.tkName))===b.md5||b.seo&&p.seoBot)){L.isRunning=!0,G(L);var t=L,n=(ee=function(){return t.isSuspend},window.top),o=window.parent;if(O(window),b.disableIframeParents&&n&&o&&n!==window){for(;o!==n;)O(o),o=o.parent;O(n)}("all"===b.detectors?Object.keys(se):b.detectors).forEach(function(e){new se[e]})}},{isRunning:!1,isSuspend:!1,md5:ne,version:"0.3.4",DetectorType:_,isDevToolOpened:z});C=function(){if(!window||!window.document)return null;var n=document.querySelector("[disable-devtool-auto]");if(!n)return null;var o=["disable-menu","disable-select","disable-copy","disable-cut","disable-paste","clear-log"],i=["interval"],r={};return["md5","url","tk-name","detectors"].concat(o,i).forEach(function(e){var t=n.getAttribute(e);null!==t&&(-1!==i.indexOf(e)?t=parseInt(t):-1!==o.indexOf(e)?t="false"!==t:"detector"===e&&"all"!==t&&(t=t.split(" ")),r[function(e){if(-1===e.indexOf("-"))return e;var t=!1;return e.split("").map(function(e){return"-"===e?(t=!0,""):t?(t=!1,e.toUpperCase()):e}).join("")}(e)]=t)}),r}();return C&&L(C),L});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var disable_devtool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! disable-devtool */ "./node_modules/disable-devtool/disable-devtool.min.js");
/* harmony import */ var disable_devtool__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(disable_devtool__WEBPACK_IMPORTED_MODULE_0__);

disable_devtool__WEBPACK_IMPORTED_MODULE_0___default()();

const singlePlayerButton = document.getElementById("single-player-button");
const multiplayerButton = document.getElementById("multiplayer-button");
const startButton = document.getElementById("start-button");
const infoDisplay = document.getElementById("info-display");
const shipSelectContainer = document.getElementById("ships");
const connectionInfo = document.getElementById("connection-info");
const gameControlButtons = document.getElementById("game-control-buttons");
const turnDisplay = document.getElementById("turn-display");
const gameInfo = document.getElementById("game-info");
const flipButton = document.getElementById("flip-button");
const shipContainer = document.querySelector(".ship-select-container");
const reloadButton = document.createElement("button");
reloadButton.innerHTML = "Tekrar oyna";

let user = "player";
let currentPlayer = user;
let gameMode = "";
let playerNum = 0;
let turnNum = 0;
let ready = false;
let gameOver = false;
let enemyReady = false;
let allShipsPlaced = false;
let shotFired = -1;
let notDropped;
let singlePlayerStarted;
let multiPlayerStarted;
let playerHits = [];
let computerHits = [];

const playerSunkShips = [];
const computerSunkShips = [];

// CREATING SHIPS
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

function startMultiplayer() {
  if (multiPlayerStarted) return;
  if (singlePlayerStarted) return;
  multiPlayerStarted = true;
  gameMode = "multiplayer";

  connectionInfo.classList.remove("hidden");
  infoDisplay.innerHTML =
    "Çok oyunculu mod başladı! Lütfen gemilerini yerleştir.";

  const socket = io();

  // get player number
  socket.on("player-number", (num) => {
    if (num === -1) {
      infoDisplay.innerHTML = "Sunucu dolu. Lütfen daha sonra tekrar dene.";
      socket.disconnect();
      setTimeout(() => location.reload(), 2500);
    } else {
      playerNum = parseInt(num);
      if (playerNum === 1) currentPlayer = "enemy";

      socket.emit("check-players");
    }
  });
  // player connection control
  socket.on("player-connection", (num) => {
    // console.log(`player ${num} has connected`);
    controlPlayerConnection(num);
  });

  // enemy ready
  socket.on("enemy-ready", (num) => {
    enemyReady = true;
    playerReady(num);
    if (ready) startGameMulti(socket);
  });

  // check player status
  socket.on("check-players", (players) => {
    players.forEach((player, index) => {
      if (player.connected) controlPlayerConnection(index);
      if (player.ready) {
        playerReady(index);
        if (index !== playerNum) enemyReady = true;
      }
    });
  });

  startButton.addEventListener("click", () => {
    if (!allShipsPlaced) return;
    if (allShipsPlaced) startGameMulti(socket);
    else infoDisplay.innerHTML = "Lütfen önce gemilerini yerleştir!";
  });

  // event listener for firing
  const boardBlocks = document.querySelectorAll("#computer div");
  socket.on("turn-change", (turn) => {
    turnNum = turn;
    if (turnNum === playerNum) turnDisplay.innerHTML = "Senin sıran";
    else turnDisplay.innerHTML = "Rakibin sırası";
  });
  socket.on("gameover", (status) => {
    gameOver = status;
    if (gameOver) {
      turnDisplay.textContent = "Oyun bitti!";
      gameInfo.append(reloadButton);
      reloadButton.onclick = () => location.reload();
      if (playerSunkShips.length !== 5)
        infoDisplay.innerHTML = "Rakibin bütün gemilerini yok etti. Kaybettin!";
    }
  });

  boardBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      if (turnNum === playerNum) {
        if (gameOver) return;
        if (!allShipsPlaced) {
          infoDisplay.innerHTML = "Lütfen önce gemilerini yerleştir!";
          return;
        }
        if (!enemyReady) {
          infoDisplay.innerHTML = "Lütfen rakibini bekle!";
          return;
        }
        shotFired = handleClick(e);
        console.log(enemyReady);

        turnNum = (turnNum + 1) % 2;

        socket.emit("turn-change", turnNum);
        socket.emit("fire", shotFired, turnNum);
        socket.emit("gameover", gameOver);
      } else turnDisplay.innerHTML = "Rakibin sırası";
    });
  });

  let playerBoardData;
  socket.on("fire", (id) => {
    const block = document.querySelector(`#player div[id='${id}']`);
    const isHit = Array.from(playerBoardData).some((node) => node.id === id);
    if (isHit) block.classList.add("hit");
    else block.classList.add("miss");

    console.log(`the enemy shot your ${id} block!`);
  });

  socket.on("start-game", (player1BoardData, player2BoardData) => {
    const opponentBoardBlocks = document.querySelectorAll("#computer div");
    playerBoardData = document.querySelectorAll("#player div.filled");
    console.log(playerBoardData);

    for (let i = 0; i < opponentBoardBlocks.length; i += 1) {
      const dataIndex = i;
      opponentBoardBlocks[i].className =
        playerNum === 0
          ? player2BoardData[dataIndex]
          : player1BoardData[dataIndex];
    }
  });

  function controlPlayerConnection(num) {
    const player = `.p${parseInt(num) + 1}`; // +1 because indexes starts from zero
    document
      .querySelector(`${player} .connected span`)
      .classList.toggle("green");
    if (parseInt(num) === playerNum)
      document.querySelector(player).style.fontWeight = "bold";
  }
}

multiplayerButton.addEventListener("click", startMultiplayer);

// start multiplayer game
function startGameMulti(socket) {
  if (gameOver) return;
  console.log(currentPlayer);
  if (!ready) {
    socket.emit("player-ready");
    ready = true;
    playerReady(playerNum);
  }

  if (enemyReady) {
    if (currentPlayer === "player") {
      turnDisplay.innerHTML = "Senin sıran";
    }
    if (currentPlayer === "enemy") {
      turnDisplay.innerHTML = "Rakibin sırası";
    }

    const playerBoardData = Array.from(
      document.querySelectorAll("#player div")
    ).map((block) => block.className);
    socket.emit("board-data", playerBoardData);
  }

  gameControlButtons.classList.add("hidden");
}

function playerReady(num) {
  const player = `.p${parseInt(num) + 1}`;
  document.querySelector(`${player} .ready span`).classList.toggle("green");
}

// start single player game mode
function startSinglePlayer() {
  if (gameOver) return;
  if (singlePlayerStarted) return;
  if (multiPlayerStarted) return;
  singlePlayerStarted = true;
  gameMode = "singleplayer";
  user = "computer";
  ships.forEach((ship) => addShip("computer", ship));
  infoDisplay.innerHTML =
    "Tek oyunculu oyun başladı! Lütfen gemilerini yerleştir.";
  startButton.addEventListener("click", startGameSingle);
}
singlePlayerButton.addEventListener("click", startSinglePlayer);

let angle = 0;
function flipShips() {
  const ships = Array.from(shipContainer.children);
  angle = angle === 0 ? 90 : 0;
  ships.forEach((ship) => {
    // eslint-disable-next-line no-param-reassign
    ship.style.transform = `rotate(${angle}deg)`;
  });
}
flipButton.addEventListener("click", flipShips);

// creating gameboards
function createBoard(color, user) {
  const gameBoardContainer = document.getElementById("gameboard-container");

  const gameBoard = document.createElement("div");
  gameBoard.setAttribute("id", user);
  gameBoard.classList.add("gameboard");
  gameBoard.style.backgroundColor = color;

  for (let i = 0; i < 100; i += 1) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoard.append(block);
  }

  gameBoardContainer.appendChild(gameBoard);
}

createBoard("white", user);
createBoard("gainsboro", "computer");

function checkValidity(boardBlocks, isHorizontal, startIndex, ship) {
  // to prevent placing ships off board
  // eslint-disable-next-line no-nested-ternary
  const validStart = isHorizontal
    ? startIndex <= 10 * 10 - ship.length
      ? startIndex
      : 10 * 10 - ship.length
    : startIndex <= 10 * 10 - 10 * ship.length
    ? startIndex
    : startIndex - ship.length * 10 + 10;

  const shipBlocks = [];
  // save the indexes of ships to an array
  for (let i = 0; i < ship.length; i += 1) {
    if (isHorizontal) shipBlocks.push(boardBlocks[Number(validStart) + i]);
    else shipBlocks.push(boardBlocks[Number(validStart) + i * 10]);
  }

  // validate place to prevent ships from splitting
  let isValid;
  if (isHorizontal) {
    shipBlocks.every(
      // eslint-disable-next-line no-return-assign
      (_block, index) =>
        (isValid =
          shipBlocks[0].id % 10 !== 10 - (shipBlocks.length - (index + 1)))
    );
  } else {
    shipBlocks.every(
      // eslint-disable-next-line no-return-assign
      (_block, index) => (isValid = shipBlocks[0].id < 90 + (10 * index + 1))
    );
  }
  const notTaken = shipBlocks.every(
    (block) =>
      !block.classList.contains("filled") &&
      !block.classList.contains("unavailable")
  );

  return { shipBlocks, isValid, notTaken };
}

function addShip(user, ship, startId) {
  const boardBlocks = document.querySelectorAll(`#${user} div`);
  const bool = Math.random() < 0.5; // returned number either will be bigger than 0.5 or not hence the random bool
  const isHorizontal = user === "player" ? angle === 0 : bool;
  const randomStartIndex = Math.floor(Math.random() * 10 * 10); // ten times ten is the width of the board

  const startIndex = startId || randomStartIndex;

  const { shipBlocks, isValid, notTaken } = checkValidity(
    boardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (!isValid || !notTaken)
    infoDisplay.innerHTML = "Gemini buraya yerleştiremezsin!";

  if (isValid && notTaken) {
    infoDisplay.innerHTML = "";
    shipBlocks.forEach((block) => {
      block.classList.add(ship.name);
      block.classList.add("filled");
    });
    // add unavailable class to adjacent blocks to prevent placing ships side to side
    const adjacentIndexes = getAdjacentIndexes(
      boardBlocks,
      isHorizontal,
      shipBlocks
    );
    adjacentIndexes.forEach((adjacentIndex) => {
      const adjacentBlock = boardBlocks[adjacentIndex];
      adjacentBlock.classList.add("unavailable");
    });
  } else {
    if (user === "computer") addShip(user, ship, startId);
    if (user === "player") notDropped = true;
  }
}

// helper function to get adjacent indexes
function getAdjacentIndexes(boardBlocks, isHorizontal, shipBlocks) {
  const boardBlocksArray = [...boardBlocks];
  const adjacentIndexes = [];

  shipBlocks.forEach((block, index) => {
    const blockIndex = boardBlocksArray.indexOf(block);
    const row = Math.floor(blockIndex / 10);
    const col = blockIndex % 10;

    if (isHorizontal) {
      if (col > 0) adjacentIndexes.push(blockIndex - 1); // left block
      if (col < 9) adjacentIndexes.push(blockIndex + 1); // right block
      if (row > 0) adjacentIndexes.push(blockIndex - 10); // top block
      if (row < 9) adjacentIndexes.push(blockIndex + 10); // bottom block
      if (col > 0 && row > 0) adjacentIndexes.push(blockIndex - 11); // top-left block
      if (col > 0 && row < 9) adjacentIndexes.push(blockIndex + 9); // bottom-left block
      if (col < 9 && row > 0) adjacentIndexes.push(blockIndex - 9); // top-right block
      if (col < 9 && row < 9) adjacentIndexes.push(blockIndex + 11); // bottom-right block
    } else {
      if (row > 0) adjacentIndexes.push(blockIndex - 10); // top block
      if (row < 9) adjacentIndexes.push(blockIndex + 10); // bottom block
      if (col > 0) adjacentIndexes.push(blockIndex - 1); // left block
      if (col < 9) adjacentIndexes.push(blockIndex + 1); // right block
      if (row > 0 && col > 0) adjacentIndexes.push(blockIndex - 11); // top-left block
      if (row > 0 && col < 9) adjacentIndexes.push(blockIndex - 9); // top-right block
      if (row < 9 && col > 0) adjacentIndexes.push(blockIndex + 9); // bottom-left block
      if (row < 9 && col < 9) adjacentIndexes.push(blockIndex + 11); // bottom-right block
    }
  });
  const uniqueAdjacentIndexes = Array.from(new Set(adjacentIndexes));
  return uniqueAdjacentIndexes;
}

// drag&drop ships
let draggedShip;
const shipOptions = Array.from(shipContainer.children);
shipOptions.forEach((ship) => ship.addEventListener("dragstart", dragStart));

const playerBoard = document.querySelectorAll("#player div");
playerBoard.forEach((block) => {
  block.addEventListener("dragover", dragOver);
  block.addEventListener("drop", dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  if (!draggedShip) return;
  const ship = ships[draggedShip.id];

  highlightShipArea(e.target.id, ship);
}

function dropShip(e) {
  if (!multiPlayerStarted && !singlePlayerStarted) {
    infoDisplay.innerHTML = "Lütfen oyun modu seçiniz!";
    return;
  }
  const startId = e.target.id;
  if (draggedShip === undefined || draggedShip === null) return;
  const ship = ships[draggedShip.id];

  addShip("player", ship, startId);
  if (!notDropped) draggedShip.remove();
  if (!shipContainer.querySelector(".ship")) {
    allShipsPlaced = true;
    shipSelectContainer.style.display = "none";
  }
  draggedShip = null;
}

function highlightShipArea(startIndex, ship) {
  const isHorizontal = angle === 0;

  const { shipBlocks, isValid, notTaken } = checkValidity(
    playerBoard,
    isHorizontal,
    startIndex,
    ship
  );

  if (isValid && notTaken) {
    shipBlocks.forEach((block) => {
      block.classList.add("hover");
      setTimeout(() => block.classList.remove("hover"), 500);
    });
  }
}

let playerTurn;
// starting singe player game
function startGameSingle() {
  if (playerTurn === undefined) {
    if (shipContainer.children.length !== 0) {
      infoDisplay.textContent = "Lütfen önce gemilerini yerleştir!";
    } else {
      const boardBlocks = document.querySelectorAll("#computer div");
      boardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Senin sıran";
      infoDisplay.textContent = "Oyun başladı!";
      gameControlButtons.classList.add("hidden");
    }
  }
}

function handleClick(e) {
  if (gameMode === "singleplayer" && !playerTurn) return;
  if (!gameOver && allShipsPlaced) {
    if (e.target.classList.contains("hit")) return;
    if (e.target.classList.contains("filled")) {
      e.target.classList.add("hit");
      infoDisplay.textContent = "Bir gemiyi vurdun!";
      const classes = Array.from(e.target.classList).filter(
        (name) => !["block", "hit", "filled", "unavailable"].includes(name)
      );

      if (
        currentPlayer === "player" ||
        currentPlayer === "enemy" ||
        gameMode === "singleplayer"
      ) {
        playerHits.push(...classes);
        checkScore(currentPlayer, playerHits, playerSunkShips);
      }
    }
    if (!e.target.classList.contains("filled")) {
      infoDisplay.textContent = "Iskaladın!";
      e.target.classList.add("miss");
    }

    if (gameMode === "singleplayer" && !gameOver) {
      playerTurn = false;

      setTimeout(computersTurn, 750);
    }
  }
  return e.target.id;
}

// computers turn
function computersTurn() {
  if (!gameOver) {
    turnDisplay.textContent = "Bilgisayarın sırası";
    infoDisplay.textContent = "Hesaplamalar yapılıyor..";

    setTimeout(() => {
      const randomShot = Math.floor(Math.random() * 10 * 10);
      if (
        playerBoard[randomShot].classList.contains("filled") &&
        playerBoard[randomShot].classList.contains("hit") &&
        playerBoard[randomShot].classList.contains("miss")
      ) {
        computersTurn();
      } else if (
        playerBoard[randomShot].classList.contains("filled") &&
        !playerBoard[randomShot].classList.contains("hit")
      ) {
        playerBoard[randomShot].classList.add("hit");
        infoDisplay.textContent = "Hedef vuruldu!";
        const classes = Array.from(playerBoard[randomShot].classList).filter(
          (name) => !["block", "hit", "filled"].includes(name)
        );
        computerHits.push(...classes);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = "Iska!";
        playerBoard[randomShot].classList.add("miss");
      }
    }, 750);
    const boardBlocks = document.querySelectorAll("#computer div");
    boardBlocks.forEach(
      (block) => block.replaceWith(block.cloneNode(true)) // to remove event listeners
    );
    handleEventListeners();
    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Senin sıran";
      infoDisplay.textContent = "Atışını yap!";
    }, 750);
  }
}
function handleEventListeners() {
  const boardBlocks = document.querySelectorAll("#computer div");
  boardBlocks.forEach((block) => block.addEventListener("click", handleClick)); // re-adding event listeners
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((hitShip) => hitShip === shipName).length === shipLength
    ) {
      if (
        user === "player" ||
        user === "enemy" ||
        gameMode === "singleplayer"
      ) {
        infoDisplay.textContent = `Rakibin ${shipName} gemisini batırdın!`;

        playerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
      if (user === "computer") {
        infoDisplay.textContent = `Rakip ${shipName} gemini batırdı!`;
        computerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
      userSunkShips.push(shipName);
    }
  }
  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruiser", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);
  console.log("playerSunkShips", playerSunkShips);

  if (playerSunkShips.length === 5) {
    infoDisplay.textContent = "Rakibin bütün gemilerini yok ettin. Kazandın!"; // game over player 1 won
    gameOver = true;
    if (gameMode === "singleplayer") {
      startButton.removeEventListener("click", startGameSingle);
      gameInfo.append(reloadButton);
      reloadButton.onclick = () => location.reload();
    }
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "Bütün gemilerin yok edildi. İyi savaştı amiral.";
    gameOver = true;
    startButton.removeEventListener("click", startGameSingle);
  }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRUFBK0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLXByb2plY3QvLi9ub2RlX21vZHVsZXMvZGlzYWJsZS1kZXZ0b29sL2Rpc2FibGUtZGV2dG9vbC5taW4uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz10KCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZSh0KTooZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsVGhpcz9nbG9iYWxUaGlzOmV8fHNlbGYpLkRpc2FibGVEZXZ0b29sPXQoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkoZSl7cmV0dXJuKGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgZX06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmZS5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmZSE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgZX0pKGUpfWZ1bmN0aW9uIG8oZSx0KXtpZighKGUgaW5zdGFuY2VvZiB0KSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIHIoZSx0KXtmb3IodmFyIG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIG89dFtuXTtvLmVudW1lcmFibGU9by5lbnVtZXJhYmxlfHwhMSxvLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBvJiYoby53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsby5rZXksbyl9fWZ1bmN0aW9uIHUoZSx0LG4pe3QmJnIoZS5wcm90b3R5cGUsdCksbiYmcihlLG4pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwicHJvdG90eXBlXCIse3dyaXRhYmxlOiExfSl9ZnVuY3Rpb24gZShlLHQsbil7dCBpbiBlP09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHQse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTplW3RdPW59ZnVuY3Rpb24gbihlLHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQmJm51bGwhPT10KXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJwcm90b3R5cGVcIix7d3JpdGFibGU6ITF9KSx0JiZhKGUsdCl9ZnVuY3Rpb24gYyhlKXtyZXR1cm4oYz1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LmdldFByb3RvdHlwZU9mLmJpbmQoKTpmdW5jdGlvbihlKXtyZXR1cm4gZS5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZihlKX0pKGUpfWZ1bmN0aW9uIGEoZSx0KXtyZXR1cm4oYT1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LnNldFByb3RvdHlwZU9mLmJpbmQoKTpmdW5jdGlvbihlLHQpe3JldHVybiBlLl9fcHJvdG9fXz10LGV9KShlLHQpfWZ1bmN0aW9uIHEoZSx0KXtpZih0JiYoXCJvYmplY3RcIj09dHlwZW9mIHR8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpKXJldHVybiB0O2lmKHZvaWQgMCE9PXQpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRlcml2ZWQgY29uc3RydWN0b3JzIG1heSBvbmx5IHJldHVybiBvYmplY3Qgb3IgdW5kZWZpbmVkXCIpO3Q9ZTtpZih2b2lkIDA9PT10KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4gdH1mdW5jdGlvbiBsKG4pe3ZhciBvPWZ1bmN0aW9uKCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFJlZmxlY3R8fCFSZWZsZWN0LmNvbnN0cnVjdClyZXR1cm4hMTtpZihSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKXJldHVybiExO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIFByb3h5KXJldHVybiEwO3RyeXtyZXR1cm4gQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sW10sZnVuY3Rpb24oKXt9KSksITB9Y2F0Y2goZSl7cmV0dXJuITF9fSgpO3JldHVybiBmdW5jdGlvbigpe3ZhciBlLHQ9YyhuKTtyZXR1cm4gcSh0aGlzLG8/KGU9Yyh0aGlzKS5jb25zdHJ1Y3RvcixSZWZsZWN0LmNvbnN0cnVjdCh0LGFyZ3VtZW50cyxlKSk6dC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfX1mdW5jdGlvbiBmKGUsdCl7KG51bGw9PXR8fHQ+ZS5sZW5ndGgpJiYodD1lLmxlbmd0aCk7Zm9yKHZhciBuPTAsbz1uZXcgQXJyYXkodCk7bjx0O24rKylvW25dPWVbbl07cmV0dXJuIG99ZnVuY3Rpb24gcyhlLHQpe3ZhciBuLG89XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmZVtTeW1ib2wuaXRlcmF0b3JdfHxlW1wiQEBpdGVyYXRvclwiXTtpZighbyl7aWYoQXJyYXkuaXNBcnJheShlKXx8KG89ZnVuY3Rpb24oZSx0KXtpZihlKXtpZihcInN0cmluZ1wiPT10eXBlb2YgZSlyZXR1cm4gZihlLHQpO3ZhciBuPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKS5zbGljZSg4LC0xKTtyZXR1cm5cIk1hcFwiPT09KG49XCJPYmplY3RcIj09PW4mJmUuY29uc3RydWN0b3I/ZS5jb25zdHJ1Y3Rvci5uYW1lOm4pfHxcIlNldFwiPT09bj9BcnJheS5mcm9tKGUpOlwiQXJndW1lbnRzXCI9PT1ufHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKT9mKGUsdCk6dm9pZCAwfX0oZSkpfHx0JiZlJiZcIm51bWJlclwiPT10eXBlb2YgZS5sZW5ndGgpcmV0dXJuIG8mJihlPW8pLG49MCx7czp0PWZ1bmN0aW9uKCl7fSxuOmZ1bmN0aW9uKCl7cmV0dXJuIG4+PWUubGVuZ3RoP3tkb25lOiEwfTp7ZG9uZTohMSx2YWx1ZTplW24rK119fSxlOmZ1bmN0aW9uKGUpe3Rocm93IGV9LGY6dH07dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpfXZhciBpLHI9ITAsdT0hMTtyZXR1cm57czpmdW5jdGlvbigpe289by5jYWxsKGUpfSxuOmZ1bmN0aW9uKCl7dmFyIGU9by5uZXh0KCk7cmV0dXJuIHI9ZS5kb25lLGV9LGU6ZnVuY3Rpb24oZSl7dT0hMCxpPWV9LGY6ZnVuY3Rpb24oKXt0cnl7cnx8bnVsbD09by5yZXR1cm58fG8ucmV0dXJuKCl9ZmluYWxseXtpZih1KXRocm93IGl9fX19dmFyIGQ9ITEsdD17fTtmdW5jdGlvbiB2KGUpe3RbZV09ITF9ZnVuY3Rpb24geigpe2Zvcih2YXIgZSBpbiB0KWlmKHRbZV0pcmV0dXJuIGQ9ITA7cmV0dXJuIGQ9ITF9ZnVuY3Rpb24gaCgpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpfWZ1bmN0aW9uIEIoZSl7dmFyIHQ9aCgpO3JldHVybiBlKCksaCgpLXR9ZnVuY3Rpb24gVyhuLG8pe2Z1bmN0aW9uIGUodCl7cmV0dXJuIGZ1bmN0aW9uKCl7biYmbigpO3ZhciBlPXQuYXBwbHkodm9pZCAwLGFyZ3VtZW50cyk7cmV0dXJuIG8mJm8oKSxlfX12YXIgdD13aW5kb3cuYWxlcnQsaT13aW5kb3cuY29uZmlybSxyPXdpbmRvdy5wcm9tcHQ7dHJ5e3dpbmRvdy5hbGVydD1lKHQpLHdpbmRvdy5jb25maXJtPWUoaSksd2luZG93LnByb21wdD1lKHIpfWNhdGNoKGUpe319dmFyIHA9e2lmcmFtZTohMSxwYzohMSxxcUJyb3dzZXI6ITEsZmlyZWZveDohMSxtYWNvczohMSxlZGdlOiExLG9sZEVkZ2U6ITEsaWU6ITEsaW9zQ2hyb21lOiExLGlvc0VkZ2U6ITEsY2hyb21lOiExLHNlb0JvdDohMX07ZnVuY3Rpb24gVSgpe2Z1bmN0aW9uIGUoZSl7cmV0dXJuLTEhPT10LmluZGV4T2YoZSl9dmFyIHQ9bmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLG49ISF3aW5kb3cudG9wJiZ3aW5kb3chPT13aW5kb3cudG9wLG89IS8oaXBob25lfGlwYWR8aXBvZHxpb3N8YW5kcm9pZCkvaS50ZXN0KHQpLGk9ZShcInFxYnJvd3NlclwiKSxyPWUoXCJmaXJlZm94XCIpLHU9ZShcIm1hY2ludG9zaFwiKSxjPWUoXCJlZGdlXCIpLGE9YyYmIWUoXCJjaHJvbWVcIiksbD1hfHxlKFwidHJpZGVudFwiKXx8ZShcIm1zaWVcIiksZj1lKFwiY3Jpb3NcIikscz1lKFwiZWRnaW9zXCIpLGQ9ZShcImNocm9tZVwiKXx8Zix2PS8oZ29vZ2xlYm90fGJhaWR1c3BpZGVyfGJpbmdib3R8YXBwbGVib3R8cGV0YWxib3R8eWFuZGV4Ym90fGJ5dGVzcGlkZXJ8Y2hyb21lXFwtbGlnaHRob3VzZSkvaS50ZXN0KHQpO09iamVjdC5hc3NpZ24ocCx7aWZyYW1lOm4scGM6byxxcUJyb3dzZXI6aSxmaXJlZm94OnIsbWFjb3M6dSxlZGdlOmMsb2xkRWRnZTphLGllOmwsaW9zQ2hyb21lOmYsaW9zRWRnZTpzLGNocm9tZTpkLHNlb0JvdDp2fSl9ZnVuY3Rpb24gSCgpe2Zvcih2YXIgZT1mdW5jdGlvbigpe2Zvcih2YXIgZT17fSx0PTA7dDw1MDA7dCsrKWVbXCJcIi5jb25jYXQodCldPVwiXCIuY29uY2F0KHQpO3JldHVybiBlfSgpLHQ9W10sbj0wO248NTA7bisrKXQucHVzaChlKTtyZXR1cm4gdH12YXIgSz1cIlwiLFY9ITE7ZnVuY3Rpb24gRigpe3ZhciBlPWIuaWdub3JlO2lmKGUpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUpcmV0dXJuIGUoKTtpZigwIT09ZS5sZW5ndGgpe3ZhciB0PWxvY2F0aW9uLmhyZWY7aWYoSz09PXQpcmV0dXJuIFY7Sz10O3ZhciBuLG89ITEsaT1zKGUpO3RyeXtmb3IoaS5zKCk7IShuPWkubigpKS5kb25lOyl7dmFyIHI9bi52YWx1ZTtpZihcInN0cmluZ1wiPT10eXBlb2Ygcil7aWYoLTEhPT10LmluZGV4T2Yocikpe289ITA7YnJlYWt9fWVsc2UgaWYoci50ZXN0KHQpKXtvPSEwO2JyZWFrfX19Y2F0Y2goZSl7aS5lKGUpfWZpbmFsbHl7aS5mKCl9cmV0dXJuIFY9b319fXZhciBNPTAsWD0wLE49W10sJD0wO2Z1bmN0aW9uIEcoaSl7ZnVuY3Rpb24gZSgpe2w9ITB9ZnVuY3Rpb24gdCgpe2w9ITF9dmFyIG4sbyxyLHUsYyxhLGw9ITE7ZnVuY3Rpb24gZigpeyhhW3VdPT09cj9vOm4pKCl9VyhlLHQpLG49dCxvPWUsdm9pZCAwIT09KGE9ZG9jdW1lbnQpLmhpZGRlbj8ocj1cImhpZGRlblwiLGM9XCJ2aXNpYmlsaXR5Y2hhbmdlXCIsdT1cInZpc2liaWxpdHlTdGF0ZVwiKTp2b2lkIDAhPT1hLm1vekhpZGRlbj8ocj1cIm1vekhpZGRlblwiLGM9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsdT1cIm1velZpc2liaWxpdHlTdGF0ZVwiKTp2b2lkIDAhPT1hLm1zSGlkZGVuPyhyPVwibXNIaWRkZW5cIixjPVwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsdT1cIm1zVmlzaWJpbGl0eVN0YXRlXCIpOnZvaWQgMCE9PWEud2Via2l0SGlkZGVuJiYocj1cIndlYmtpdEhpZGRlblwiLGM9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsdT1cIndlYmtpdFZpc2liaWxpdHlTdGF0ZVwiKSxhLnJlbW92ZUV2ZW50TGlzdGVuZXIoYyxmLCExKSxhLmFkZEV2ZW50TGlzdGVuZXIoYyxmLCExKSxNPXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe2lmKCEoaS5pc1N1c3BlbmR8fGx8fEYoKSkpe3ZhciBlLHQsbj1zKE4pO3RyeXtmb3Iobi5zKCk7IShlPW4ubigpKS5kb25lOyl7dmFyIG89ZS52YWx1ZTt2KG8udHlwZSksby5kZXRlY3QoJCsrKX19Y2F0Y2goZSl7bi5lKGUpfWZpbmFsbHl7bi5mKCl9VCgpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGIub25kZXZ0b29sY2xvc2UmJih0PWQsIXooKSYmdCYmYi5vbmRldnRvb2xjbG9zZSgpKX19LGIuaW50ZXJ2YWwpLFg9c2V0VGltZW91dChmdW5jdGlvbigpe3AucGN8fHkoKX0sYi5zdG9wSW50ZXJ2YWxUaW1lKX1mdW5jdGlvbiB5KCl7d2luZG93LmNsZWFySW50ZXJ2YWwoTSl9ZnVuY3Rpb24gWSgpe2lmKHkoKSxiLnVybCl3aW5kb3cubG9jYXRpb24uaHJlZj1iLnVybDtlbHNle3RyeXt3aW5kb3cub3BlbmVyPW51bGwsd2luZG93Lm9wZW4oXCJcIixcIl9zZWxmXCIpLHdpbmRvdy5jbG9zZSgpLHdpbmRvdy5oaXN0b3J5LmJhY2soKX1jYXRjaChlKXtjb25zb2xlLmxvZyhlKX1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93LmxvY2F0aW9uLmhyZWY9XCJodHRwczovL3RoZWFqYWNrLmdpdGh1Yi5pby9kaXNhYmxlLWRldnRvb2wvNDA0Lmh0bWw/aD1cIi5jb25jYXQoZW5jb2RlVVJJQ29tcG9uZW50KGxvY2F0aW9uLmhvc3QpKX0sNTAwKX19dmFyIGI9e21kNTpcIlwiLG9uZGV2dG9vbG9wZW46WSxvbmRldnRvb2xjbG9zZTpudWxsLHVybDpcIlwiLHRrTmFtZTpcImRkdGtcIixpbnRlcnZhbDoyMDAsZGlzYWJsZU1lbnU6ITAsc3RvcEludGVydmFsVGltZTo1ZTMsY2xlYXJJbnRlcnZhbFdoZW5EZXZPcGVuVHJpZ2dlcjohMSxkZXRlY3RvcnM6XCJhbGxcIixjbGVhckxvZzohMCxkaXNhYmxlU2VsZWN0OiExLGRpc2FibGVDb3B5OiExLGRpc2FibGVDdXQ6ITEsZGlzYWJsZVBhc3RlOiExLGlnbm9yZTpudWxsLGRpc2FibGVJZnJhbWVQYXJlbnRzOiEwLHNlbzohMH0sSj1bXCJkZXRlY3RvcnNcIixcIm9uZGV2dG9vbGNsb3NlXCIsXCJpZ25vcmVcIl07ZnVuY3Rpb24gUShlKXt2YXIgdCxuPTA8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09ZT9lOnt9O2Zvcih0IGluIGIpe3ZhciBvPXQ7dm9pZCAwPT09bltvXXx8aShiW29dKSE9PWkobltvXSkmJi0xPT09Si5pbmRleE9mKG8pfHwoYltvXT1uW29dKX1cImZ1bmN0aW9uXCI9PXR5cGVvZiBiLm9uZGV2dG9vbGNsb3NlJiYhMD09PWIuY2xlYXJJbnRlcnZhbFdoZW5EZXZPcGVuVHJpZ2dlciYmKGIuY2xlYXJJbnRlcnZhbFdoZW5EZXZPcGVuVHJpZ2dlcj0hMSxjb25zb2xlLndhcm4oXCLjgJBESVNBQkxFLURFVlRPT0zjgJFjbGVhckludGVydmFsV2hlbkRldk9wZW5UcmlnZ2VyIOWcqOS9v+eUqCBvbmRldnRvb2xjbG9zZSDml7bml6DmlYhcIikpfXZhciB3LGcsWixtPXdpbmRvdy5jb25zb2xlfHx7bG9nOmZ1bmN0aW9uKCl7fSx0YWJsZTpmdW5jdGlvbigpe30sY2xlYXI6ZnVuY3Rpb24oKXt9fTtmdW5jdGlvbiBUKCl7Yi5jbGVhckxvZyYmWigpfXZhciBlZT1mdW5jdGlvbigpe3JldHVybiExfTtmdW5jdGlvbiBPKG4pe3ZhciBlLG89NzQsaT03MyxyPTg1LHU9ODMsYz0xMjMsYT1wLm1hY29zP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUubWV0YUtleSYmZS5hbHRLZXkmJih0PT09aXx8dD09PW8pfTpmdW5jdGlvbihlLHQpe3JldHVybiBlLmN0cmxLZXkmJmUuc2hpZnRLZXkmJih0PT09aXx8dD09PW8pfSxsPXAubWFjb3M/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5tZXRhS2V5JiZlLmFsdEtleSYmdD09PXJ8fGUubWV0YUtleSYmdD09PXV9OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUuY3RybEtleSYmKHQ9PT11fHx0PT09cil9O24uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIixmdW5jdGlvbihlKXt2YXIgdD0oZT1lfHxuLmV2ZW50KS5rZXlDb2RlfHxlLndoaWNoO2lmKHQ9PT1jfHxhKGUsdCl8fGwoZSx0KSlyZXR1cm4gdGUobixlKX0sITApLGU9bixiLmRpc2FibGVNZW51JiZEKGUsXCJjb250ZXh0bWVudVwiKSxlPW4sYi5kaXNhYmxlU2VsZWN0JiZEKGUsXCJzZWxlY3RzdGFydFwiKSxlPW4sYi5kaXNhYmxlQ29weSYmRChlLFwiY29weVwiKSxlPW4sYi5kaXNhYmxlQ3V0JiZEKGUsXCJjdXRcIiksZT1uLGIuZGlzYWJsZVBhc3RlJiZEKGUsXCJwYXN0ZVwiKX1mdW5jdGlvbiBEKHQsZSl7dC5hZGRFdmVudExpc3RlbmVyKGUsZnVuY3Rpb24oZSl7cmV0dXJuIHRlKHQsZSl9KX1mdW5jdGlvbiB0ZShlLHQpe2lmKCFGKCkmJiFlZSgpKXJldHVybih0PXR8fGUuZXZlbnQpLnJldHVyblZhbHVlPSExLHQucHJldmVudERlZmF1bHQoKSwhMX12YXIgUz04O2Z1bmN0aW9uIG5lKGUpe2Zvcih2YXIgdD1mdW5jdGlvbihlLHQpe2VbdD4+NV18PTEyODw8dCUzMixlWzE0Kyh0KzY0Pj4+OTw8NCldPXQ7Zm9yKHZhciBuPTE3MzI1ODQxOTMsbz0tMjcxNzMzODc5LGk9LTE3MzI1ODQxOTQscj0yNzE3MzM4NzgsdT0wO3U8ZS5sZW5ndGg7dSs9MTYpe3ZhciBjPW4sYT1vLGw9aSxmPXI7bj1QKG4sbyxpLHIsZVt1KzBdLDcsLTY4MDg3NjkzNikscj1QKHIsbixvLGksZVt1KzFdLDEyLC0zODk1NjQ1ODYpLGk9UChpLHIsbixvLGVbdSsyXSwxNyw2MDYxMDU4MTkpLG89UChvLGkscixuLGVbdSszXSwyMiwtMTA0NDUyNTMzMCksbj1QKG4sbyxpLHIsZVt1KzRdLDcsLTE3NjQxODg5Nykscj1QKHIsbixvLGksZVt1KzVdLDEyLDEyMDAwODA0MjYpLGk9UChpLHIsbixvLGVbdSs2XSwxNywtMTQ3MzIzMTM0MSksbz1QKG8saSxyLG4sZVt1KzddLDIyLC00NTcwNTk4Myksbj1QKG4sbyxpLHIsZVt1KzhdLDcsMTc3MDAzNTQxNikscj1QKHIsbixvLGksZVt1KzldLDEyLC0xOTU4NDE0NDE3KSxpPVAoaSxyLG4sbyxlW3UrMTBdLDE3LC00MjA2Myksbz1QKG8saSxyLG4sZVt1KzExXSwyMiwtMTk5MDQwNDE2Miksbj1QKG4sbyxpLHIsZVt1KzEyXSw3LDE4MDQ2MDM2ODIpLHI9UChyLG4sbyxpLGVbdSsxM10sMTIsLTQwMzQxMTAxKSxpPVAoaSxyLG4sbyxlW3UrMTRdLDE3LC0xNTAyMDAyMjkwKSxvPVAobyxpLHIsbixlW3UrMTVdLDIyLDEyMzY1MzUzMjkpLG49eChuLG8saSxyLGVbdSsxXSw1LC0xNjU3OTY1MTApLHI9eChyLG4sbyxpLGVbdSs2XSw5LC0xMDY5NTAxNjMyKSxpPXgoaSxyLG4sbyxlW3UrMTFdLDE0LDY0MzcxNzcxMyksbz14KG8saSxyLG4sZVt1KzBdLDIwLC0zNzM4OTczMDIpLG49eChuLG8saSxyLGVbdSs1XSw1LC03MDE1NTg2OTEpLHI9eChyLG4sbyxpLGVbdSsxMF0sOSwzODAxNjA4MyksaT14KGkscixuLG8sZVt1KzE1XSwxNCwtNjYwNDc4MzM1KSxvPXgobyxpLHIsbixlW3UrNF0sMjAsLTQwNTUzNzg0OCksbj14KG4sbyxpLHIsZVt1KzldLDUsNTY4NDQ2NDM4KSxyPXgocixuLG8saSxlW3UrMTRdLDksLTEwMTk4MDM2OTApLGk9eChpLHIsbixvLGVbdSszXSwxNCwtMTg3MzYzOTYxKSxvPXgobyxpLHIsbixlW3UrOF0sMjAsMTE2MzUzMTUwMSksbj14KG4sbyxpLHIsZVt1KzEzXSw1LC0xNDQ0NjgxNDY3KSxyPXgocixuLG8saSxlW3UrMl0sOSwtNTE0MDM3ODQpLGk9eChpLHIsbixvLGVbdSs3XSwxNCwxNzM1MzI4NDczKSxvPXgobyxpLHIsbixlW3UrMTJdLDIwLC0xOTI2NjA3NzM0KSxuPWoobixvLGkscixlW3UrNV0sNCwtMzc4NTU4KSxyPWoocixuLG8saSxlW3UrOF0sMTEsLTIwMjI1NzQ0NjMpLGk9aihpLHIsbixvLGVbdSsxMV0sMTYsMTgzOTAzMDU2Miksbz1qKG8saSxyLG4sZVt1KzE0XSwyMywtMzUzMDk1NTYpLG49aihuLG8saSxyLGVbdSsxXSw0LC0xNTMwOTkyMDYwKSxyPWoocixuLG8saSxlW3UrNF0sMTEsMTI3Mjg5MzM1MyksaT1qKGkscixuLG8sZVt1KzddLDE2LC0xNTU0OTc2MzIpLG89aihvLGkscixuLGVbdSsxMF0sMjMsLTEwOTQ3MzA2NDApLG49aihuLG8saSxyLGVbdSsxM10sNCw2ODEyNzkxNzQpLHI9aihyLG4sbyxpLGVbdSswXSwxMSwtMzU4NTM3MjIyKSxpPWooaSxyLG4sbyxlW3UrM10sMTYsLTcyMjUyMTk3OSksbz1qKG8saSxyLG4sZVt1KzZdLDIzLDc2MDI5MTg5KSxuPWoobixvLGkscixlW3UrOV0sNCwtNjQwMzY0NDg3KSxyPWoocixuLG8saSxlW3UrMTJdLDExLC00MjE4MTU4MzUpLGk9aihpLHIsbixvLGVbdSsxNV0sMTYsNTMwNzQyNTIwKSxvPWoobyxpLHIsbixlW3UrMl0sMjMsLTk5NTMzODY1MSksbj1JKG4sbyxpLHIsZVt1KzBdLDYsLTE5ODYzMDg0NCkscj1JKHIsbixvLGksZVt1KzddLDEwLDExMjY4OTE0MTUpLGk9SShpLHIsbixvLGVbdSsxNF0sMTUsLTE0MTYzNTQ5MDUpLG89SShvLGkscixuLGVbdSs1XSwyMSwtNTc0MzQwNTUpLG49SShuLG8saSxyLGVbdSsxMl0sNiwxNzAwNDg1NTcxKSxyPUkocixuLG8saSxlW3UrM10sMTAsLTE4OTQ5ODY2MDYpLGk9SShpLHIsbixvLGVbdSsxMF0sMTUsLTEwNTE1MjMpLG89SShvLGkscixuLGVbdSsxXSwyMSwtMjA1NDkyMjc5OSksbj1JKG4sbyxpLHIsZVt1KzhdLDYsMTg3MzMxMzM1OSkscj1JKHIsbixvLGksZVt1KzE1XSwxMCwtMzA2MTE3NDQpLGk9SShpLHIsbixvLGVbdSs2XSwxNSwtMTU2MDE5ODM4MCksbz1JKG8saSxyLG4sZVt1KzEzXSwyMSwxMzA5MTUxNjQ5KSxuPUkobixvLGkscixlW3UrNF0sNiwtMTQ1NTIzMDcwKSxyPUkocixuLG8saSxlW3UrMTFdLDEwLC0xMTIwMjEwMzc5KSxpPUkoaSxyLG4sbyxlW3UrMl0sMTUsNzE4Nzg3MjU5KSxvPUkobyxpLHIsbixlW3UrOV0sMjEsLTM0MzQ4NTU1MSksbj1FKG4sYyksbz1FKG8sYSksaT1FKGksbCkscj1FKHIsZil9cmV0dXJuIEFycmF5KG4sbyxpLHIpfShmdW5jdGlvbihlKXtmb3IodmFyIHQ9QXJyYXkoKSxuPSgxPDxTKS0xLG89MDtvPGUubGVuZ3RoKlM7bys9Uyl0W28+PjVdfD0oZS5jaGFyQ29kZUF0KG8vUykmbik8PG8lMzI7cmV0dXJuIHR9KGUpLGUubGVuZ3RoKlMpLG49XCIwMTIzNDU2Nzg5YWJjZGVmXCIsbz1cIlwiLGk9MDtpPDQqdC5sZW5ndGg7aSsrKW8rPW4uY2hhckF0KHRbaT4+Ml0+PmklNCo4KzQmMTUpK24uY2hhckF0KHRbaT4+Ml0+PmklNCo4JjE1KTtyZXR1cm4gb31mdW5jdGlvbiBrKGUsdCxuLG8saSxyKXtyZXR1cm4gRSgodD1FKEUodCxlKSxFKG8scikpKTw8aXx0Pj4+MzItaSxuKX1mdW5jdGlvbiBQKGUsdCxuLG8saSxyLHUpe3JldHVybiBrKHQmbnx+dCZvLGUsdCxpLHIsdSl9ZnVuY3Rpb24geChlLHQsbixvLGkscix1KXtyZXR1cm4gayh0Jm98biZ+byxlLHQsaSxyLHUpfWZ1bmN0aW9uIGooZSx0LG4sbyxpLHIsdSl7cmV0dXJuIGsodF5uXm8sZSx0LGkscix1KX1mdW5jdGlvbiBJKGUsdCxuLG8saSxyLHUpe3JldHVybiBrKG5eKHR8fm8pLGUsdCxpLHIsdSl9ZnVuY3Rpb24gRShlLHQpe3ZhciBuPSg2NTUzNSZlKSsoNjU1MzUmdCk7cmV0dXJuKGU+PjE2KSsodD4+MTYpKyhuPj4xNik8PDE2fDY1NTM1Jm59KEM9Xz1ffHx7fSlbQy5Vbmtub3duPS0xXT1cIlVua25vd25cIixDW0MuUmVnVG9TdHJpbmc9MF09XCJSZWdUb1N0cmluZ1wiLENbQy5EZWZpbmVJZD0xXT1cIkRlZmluZUlkXCIsQ1tDLlNpemU9Ml09XCJTaXplXCIsQ1tDLkRhdGVUb1N0cmluZz0zXT1cIkRhdGVUb1N0cmluZ1wiLENbQy5GdW5jVG9TdHJpbmc9NF09XCJGdW5jVG9TdHJpbmdcIixDW0MuRGVidWdnZXI9NV09XCJEZWJ1Z2dlclwiLENbQy5QZXJmb3JtYW5jZT02XT1cIlBlcmZvcm1hbmNlXCIsQ1tDLkRlYnVnTGliPTddPVwiRGVidWdMaWJcIjt2YXIgXyxBPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbihlKXt2YXIgdD1lLnR5cGUsZT1lLmVuYWJsZWQsZT12b2lkIDA9PT1lfHxlO28odGhpcyxuKSx0aGlzLnR5cGU9Xy5Vbmtub3duLHRoaXMuZW5hYmxlZD0hMCx0aGlzLnR5cGU9dCx0aGlzLmVuYWJsZWQ9ZSx0aGlzLmVuYWJsZWQmJih0PXRoaXMsTi5wdXNoKHQpLHRoaXMuaW5pdCgpKX1yZXR1cm4gdShuLFt7a2V5Olwib25EZXZUb29sT3BlblwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU7Y29uc29sZS53YXJuKFwiWW91IGFyIG5vdCBhbGxvdyB0byB1c2UgREVWVE9PTCEg44CQdHlwZSA9IFwiLmNvbmNhdCh0aGlzLnR5cGUsXCLjgJFcIikpLGIuY2xlYXJJbnRlcnZhbFdoZW5EZXZPcGVuVHJpZ2dlciYmeSgpLHdpbmRvdy5jbGVhclRpbWVvdXQoWCksYi5vbmRldnRvb2xvcGVuKHRoaXMudHlwZSxZKSxlPXRoaXMudHlwZSx0W2VdPSEwfX0se2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbigpe319XSksbn0oKSxDPWZ1bmN0aW9uKCl7bih0LEEpO3ZhciBlPWwodCk7ZnVuY3Rpb24gdCgpe3JldHVybiBvKHRoaXMsdCksZS5jYWxsKHRoaXMse3R5cGU6Xy5SZWdUb1N0cmluZyxlbmFibGVkOnAucXFCcm93c2VyfHxwLmZpcmVmb3h9KX1yZXR1cm4gdSh0LFt7a2V5OlwiaW5pdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLmxhc3RUaW1lPTAsdGhpcy5yZWc9Ly4vLHcodGhpcy5yZWcpLHRoaXMucmVnLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGU7cmV0dXJuIHAucXFCcm93c2VyPyhlPShuZXcgRGF0ZSkuZ2V0VGltZSgpLHQubGFzdFRpbWUmJmUtdC5sYXN0VGltZTwxMDA/dC5vbkRldlRvb2xPcGVuKCk6dC5sYXN0VGltZT1lKTpwLmZpcmVmb3gmJnQub25EZXZUb29sT3BlbigpLFwiXCJ9fX0se2tleTpcImRldGVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dyh0aGlzLnJlZyl9fV0pLHR9KCksb2U9ZnVuY3Rpb24oKXtuKHQsQSk7dmFyIGU9bCh0KTtmdW5jdGlvbiB0KCl7cmV0dXJuIG8odGhpcyx0KSxlLmNhbGwodGhpcyx7dHlwZTpfLkRlZmluZUlkfSl9cmV0dXJuIHUodCxbe2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5kaXY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLmRpdi5fX2RlZmluZUdldHRlcl9fKFwiaWRcIixmdW5jdGlvbigpe2Uub25EZXZUb29sT3BlbigpfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZGl2LFwiaWRcIix7Z2V0OmZ1bmN0aW9uKCl7ZS5vbkRldlRvb2xPcGVuKCl9fSl9fSx7a2V5OlwiZGV0ZWN0XCIsdmFsdWU6ZnVuY3Rpb24oKXt3KHRoaXMuZGl2KX19XSksdH0oKSxpZT1mdW5jdGlvbigpe24odCxBKTt2YXIgZT1sKHQpO2Z1bmN0aW9uIHQoKXtyZXR1cm4gbyh0aGlzLHQpLGUuY2FsbCh0aGlzLHt0eXBlOl8uU2l6ZSxlbmFibGVkOiFwLmlmcmFtZSYmIXAuZWRnZX0pfXJldHVybiB1KHQsW3trZXk6XCJpbml0XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuY2hlY2tXaW5kb3dTaXplVW5ldmVuKCksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIixmdW5jdGlvbigpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmNoZWNrV2luZG93U2l6ZVVuZXZlbigpfSwxMDApfSwhMCl9fSx7a2V5OlwiZGV0ZWN0XCIsdmFsdWU6ZnVuY3Rpb24oKXt9fSx7a2V5OlwiY2hlY2tXaW5kb3dTaXplVW5ldmVuXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1mdW5jdGlvbigpe2lmKHJlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSlyZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87dmFyIGU9d2luZG93LnNjcmVlbjtyZXR1cm4hKHJlKGUpfHwhZS5kZXZpY2VYRFBJfHwhZS5sb2dpY2FsWERQSSkmJmUuZGV2aWNlWERQSS9lLmxvZ2ljYWxYRFBJfSgpO2lmKCExIT09ZSl7dmFyIHQ9MjAwPHdpbmRvdy5vdXRlcldpZHRoLXdpbmRvdy5pbm5lcldpZHRoKmUsZT0zMDA8d2luZG93Lm91dGVySGVpZ2h0LXdpbmRvdy5pbm5lckhlaWdodCplO2lmKHR8fGUpcmV0dXJuIHRoaXMub25EZXZUb29sT3BlbigpLCExO3YodGhpcy50eXBlKX1yZXR1cm4hMH19XSksdH0oKTtmdW5jdGlvbiByZShlKXtyZXR1cm4gbnVsbCE9ZX12YXIgUix1ZT1mdW5jdGlvbigpe24odCxBKTt2YXIgZT1sKHQpO2Z1bmN0aW9uIHQoKXtyZXR1cm4gbyh0aGlzLHQpLGUuY2FsbCh0aGlzLHt0eXBlOl8uRGF0ZVRvU3RyaW5nLGVuYWJsZWQ6IXAuaW9zQ2hyb21lJiYhcC5pb3NFZGdlfSl9cmV0dXJuIHUodCxbe2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy5jb3VudD0wLHRoaXMuZGF0ZT1uZXcgRGF0ZSx0aGlzLmRhdGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gZS5jb3VudCsrLFwiXCJ9fX0se2tleTpcImRldGVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5jb3VudD0wLHcodGhpcy5kYXRlKSxUKCksMjw9dGhpcy5jb3VudCYmdGhpcy5vbkRldlRvb2xPcGVuKCl9fV0pLHR9KCksY2U9ZnVuY3Rpb24oKXtuKHQsQSk7dmFyIGU9bCh0KTtmdW5jdGlvbiB0KCl7cmV0dXJuIG8odGhpcyx0KSxlLmNhbGwodGhpcyx7dHlwZTpfLkZ1bmNUb1N0cmluZyxlbmFibGVkOiFwLmlvc0Nocm9tZSYmIXAuaW9zRWRnZX0pfXJldHVybiB1KHQsW3trZXk6XCJpbml0XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMuY291bnQ9MCx0aGlzLmZ1bmM9ZnVuY3Rpb24oKXt9LHRoaXMuZnVuYy50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBlLmNvdW50KyssXCJcIn19fSx7a2V5OlwiZGV0ZWN0XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmNvdW50PTAsdyh0aGlzLmZ1bmMpLFQoKSwyPD10aGlzLmNvdW50JiZ0aGlzLm9uRGV2VG9vbE9wZW4oKX19XSksdH0oKSxhZT1mdW5jdGlvbigpe24odCxBKTt2YXIgZT1sKHQpO2Z1bmN0aW9uIHQoKXtyZXR1cm4gbyh0aGlzLHQpLGUuY2FsbCh0aGlzLHt0eXBlOl8uRGVidWdnZXIsZW5hYmxlZDpwLmlvc0Nocm9tZXx8cC5pb3NFZGdlfSl9cmV0dXJuIHUodCxbe2tleTpcImRldGVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9aCgpOzEwMDxoKCktZSYmdGhpcy5vbkRldlRvb2xPcGVuKCl9fV0pLHR9KCksbGU9ZnVuY3Rpb24oKXtuKHQsQSk7dmFyIGU9bCh0KTtmdW5jdGlvbiB0KCl7cmV0dXJuIG8odGhpcyx0KSxlLmNhbGwodGhpcyx7dHlwZTpfLlBlcmZvcm1hbmNlLGVuYWJsZWQ6cC5jaHJvbWV9KX1yZXR1cm4gdSh0LFt7a2V5OlwiaW5pdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5tYXhQcmludFRpbWU9MCx0aGlzLmxhcmdlT2JqZWN0QXJyYXk9SCgpfX0se2tleTpcImRldGVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PUIoZnVuY3Rpb24oKXtnKGUubGFyZ2VPYmplY3RBcnJheSl9KSxuPUIoZnVuY3Rpb24oKXt3KGUubGFyZ2VPYmplY3RBcnJheSl9KTtpZih0aGlzLm1heFByaW50VGltZT1NYXRoLm1heCh0aGlzLm1heFByaW50VGltZSxuKSxUKCksMD09PXR8fDA9PT10aGlzLm1heFByaW50VGltZSlyZXR1cm4hMTt0PjEwKnRoaXMubWF4UHJpbnRUaW1lJiZ0aGlzLm9uRGV2VG9vbE9wZW4oKX19XSksdH0oKSxmZT1mdW5jdGlvbigpe24odCxBKTt2YXIgZT1sKHQpO2Z1bmN0aW9uIHQoKXtyZXR1cm4gbyh0aGlzLHQpLGUuY2FsbCh0aGlzLHt0eXBlOl8uRGVidWdMaWJ9KX1yZXR1cm4gdSh0LFt7a2V5OlwiaW5pdFwiLHZhbHVlOmZ1bmN0aW9uKCl7fX0se2tleTpcImRldGVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU7KCEwPT09KG51bGw9PShlPW51bGw9PShlPXdpbmRvdy5lcnVkYSk/dm9pZCAwOmUuX2RldlRvb2xzKT92b2lkIDA6ZS5faXNTaG93KXx8d2luZG93Ll92Y09yaWdDb25zb2xlJiZ3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNfX3Zjb25zb2xlLnZjLXRvZ2dsZVwiKSkmJnRoaXMub25EZXZUb29sT3BlbigpfX1dKSx0fSgpLHNlPShlKFI9e30sXy5SZWdUb1N0cmluZyxDKSxlKFIsXy5EZWZpbmVJZCxvZSksZShSLF8uU2l6ZSxpZSksZShSLF8uRGF0ZVRvU3RyaW5nLHVlKSxlKFIsXy5GdW5jVG9TdHJpbmcsY2UpLGUoUixfLkRlYnVnZ2VyLGFlKSxlKFIsXy5QZXJmb3JtYW5jZSxsZSksZShSLF8uRGVidWdMaWIsZmUpLFIpO3ZhciBMPU9iamVjdC5hc3NpZ24oZnVuY3Rpb24oZSl7aWYoVSgpLFo9cC5pZT8odz1mdW5jdGlvbigpe3JldHVybiBtLmxvZy5hcHBseShtLGFyZ3VtZW50cyl9LGc9ZnVuY3Rpb24oKXtyZXR1cm4gbS50YWJsZS5hcHBseShtLGFyZ3VtZW50cyl9LGZ1bmN0aW9uKCl7cmV0dXJuIG0uY2xlYXIoKX0pOih3PW0ubG9nLGc9bS50YWJsZSxtLmNsZWFyKSxRKGUpLCEoYi5tZDUmJm5lKGZ1bmN0aW9uKGUpe3ZhciB0PXdpbmRvdy5sb2NhdGlvbi5zZWFyY2gsbj13aW5kb3cubG9jYXRpb24uaGFzaDtpZihcIlwiIT09KHQ9XCJcIj09PXQmJlwiXCIhPT1uP1wiP1wiLmNvbmNhdChuLnNwbGl0KFwiP1wiKVsxXSk6dCkmJnZvaWQgMCE9PXQpe249bmV3IFJlZ0V4cChcIihefCYpXCIrZStcIj0oW14mXSopKCZ8JClcIixcImlcIiksZT10LnN1YnN0cigxKS5tYXRjaChuKTtpZihudWxsIT1lKXJldHVybiB1bmVzY2FwZShlWzJdKX1yZXR1cm5cIlwifShiLnRrTmFtZSkpPT09Yi5tZDV8fGIuc2VvJiZwLnNlb0JvdCkpe0wuaXNSdW5uaW5nPSEwLEcoTCk7dmFyIHQ9TCxuPShlZT1mdW5jdGlvbigpe3JldHVybiB0LmlzU3VzcGVuZH0sd2luZG93LnRvcCksbz13aW5kb3cucGFyZW50O2lmKE8od2luZG93KSxiLmRpc2FibGVJZnJhbWVQYXJlbnRzJiZuJiZvJiZuIT09d2luZG93KXtmb3IoO28hPT1uOylPKG8pLG89by5wYXJlbnQ7TyhuKX0oXCJhbGxcIj09PWIuZGV0ZWN0b3JzP09iamVjdC5rZXlzKHNlKTpiLmRldGVjdG9ycykuZm9yRWFjaChmdW5jdGlvbihlKXtuZXcgc2VbZV19KX19LHtpc1J1bm5pbmc6ITEsaXNTdXNwZW5kOiExLG1kNTpuZSx2ZXJzaW9uOlwiMC4zLjRcIixEZXRlY3RvclR5cGU6Xyxpc0RldlRvb2xPcGVuZWQ6en0pO0M9ZnVuY3Rpb24oKXtpZighd2luZG93fHwhd2luZG93LmRvY3VtZW50KXJldHVybiBudWxsO3ZhciBuPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGlzYWJsZS1kZXZ0b29sLWF1dG9dXCIpO2lmKCFuKXJldHVybiBudWxsO3ZhciBvPVtcImRpc2FibGUtbWVudVwiLFwiZGlzYWJsZS1zZWxlY3RcIixcImRpc2FibGUtY29weVwiLFwiZGlzYWJsZS1jdXRcIixcImRpc2FibGUtcGFzdGVcIixcImNsZWFyLWxvZ1wiXSxpPVtcImludGVydmFsXCJdLHI9e307cmV0dXJuW1wibWQ1XCIsXCJ1cmxcIixcInRrLW5hbWVcIixcImRldGVjdG9yc1wiXS5jb25jYXQobyxpKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PW4uZ2V0QXR0cmlidXRlKGUpO251bGwhPT10JiYoLTEhPT1pLmluZGV4T2YoZSk/dD1wYXJzZUludCh0KTotMSE9PW8uaW5kZXhPZihlKT90PVwiZmFsc2VcIiE9PXQ6XCJkZXRlY3RvclwiPT09ZSYmXCJhbGxcIiE9PXQmJih0PXQuc3BsaXQoXCIgXCIpKSxyW2Z1bmN0aW9uKGUpe2lmKC0xPT09ZS5pbmRleE9mKFwiLVwiKSlyZXR1cm4gZTt2YXIgdD0hMTtyZXR1cm4gZS5zcGxpdChcIlwiKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuXCItXCI9PT1lPyh0PSEwLFwiXCIpOnQ/KHQ9ITEsZS50b1VwcGVyQ2FzZSgpKTplfSkuam9pbihcIlwiKX0oZSldPXQpfSkscn0oKTtyZXR1cm4gQyYmTChDKSxMfSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IERpc2FibGVEZXZ0b29sIGZyb20gXCJkaXNhYmxlLWRldnRvb2xcIjtcclxuRGlzYWJsZURldnRvb2woKTtcclxuXHJcbmNvbnN0IHNpbmdsZVBsYXllckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2luZ2xlLXBsYXllci1idXR0b25cIik7XHJcbmNvbnN0IG11bHRpcGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllci1idXR0b25cIik7XHJcbmNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1idXR0b25cIik7XHJcbmNvbnN0IGluZm9EaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWRpc3BsYXlcIik7XHJcbmNvbnN0IHNoaXBTZWxlY3RDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBzXCIpO1xyXG5jb25zdCBjb25uZWN0aW9uSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubmVjdGlvbi1pbmZvXCIpO1xyXG5jb25zdCBnYW1lQ29udHJvbEJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udHJvbC1idXR0b25zXCIpO1xyXG5jb25zdCB0dXJuRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybi1kaXNwbGF5XCIpO1xyXG5jb25zdCBnYW1lSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpO1xyXG5jb25zdCBmbGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGlwLWJ1dHRvblwiKTtcclxuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1zZWxlY3QtY29udGFpbmVyXCIpO1xyXG5jb25zdCByZWxvYWRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG5yZWxvYWRCdXR0b24uaW5uZXJIVE1MID0gXCJUZWtyYXIgb3luYVwiO1xyXG5cclxubGV0IHVzZXIgPSBcInBsYXllclwiO1xyXG5sZXQgY3VycmVudFBsYXllciA9IHVzZXI7XHJcbmxldCBnYW1lTW9kZSA9IFwiXCI7XHJcbmxldCBwbGF5ZXJOdW0gPSAwO1xyXG5sZXQgdHVybk51bSA9IDA7XHJcbmxldCByZWFkeSA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IGVuZW15UmVhZHkgPSBmYWxzZTtcclxubGV0IGFsbFNoaXBzUGxhY2VkID0gZmFsc2U7XHJcbmxldCBzaG90RmlyZWQgPSAtMTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbmxldCBzaW5nbGVQbGF5ZXJTdGFydGVkO1xyXG5sZXQgbXVsdGlQbGF5ZXJTdGFydGVkO1xyXG5sZXQgcGxheWVySGl0cyA9IFtdO1xyXG5sZXQgY29tcHV0ZXJIaXRzID0gW107XHJcblxyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRNdWx0aXBsYXllcigpIHtcclxuICBpZiAobXVsdGlQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgaWYgKHNpbmdsZVBsYXllclN0YXJ0ZWQpIHJldHVybjtcclxuICBtdWx0aVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJtdWx0aXBsYXllclwiO1xyXG5cclxuICBjb25uZWN0aW9uSW5mby5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIGluZm9EaXNwbGF5LmlubmVySFRNTCA9XHJcbiAgICBcIsOHb2sgb3l1bmN1bHUgbW9kIGJhxZ9sYWTEsSEgTMO8dGZlbiBnZW1pbGVyaW5pIHllcmxlxZ90aXIuXCI7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLW51bWJlclwiLCAobnVtKSA9PiB7XHJcbiAgICBpZiAobnVtID09PSAtMSkge1xyXG4gICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlN1bnVjdSBkb2x1LiBMw7x0ZmVuIGRhaGEgc29ucmEgdGVrcmFyIGRlbmUuXCI7XHJcbiAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gbG9jYXRpb24ucmVsb2FkKCksIDI1MDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGxheWVyTnVtID0gcGFyc2VJbnQobnVtKTtcclxuICAgICAgaWYgKHBsYXllck51bSA9PT0gMSkgY3VycmVudFBsYXllciA9IFwiZW5lbXlcIjtcclxuXHJcbiAgICAgIHNvY2tldC5lbWl0KFwiY2hlY2stcGxheWVyc1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyBwbGF5ZXIgY29ubmVjdGlvbiBjb250cm9sXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLWNvbm5lY3Rpb25cIiwgKG51bSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coYHBsYXllciAke251bX0gaGFzIGNvbm5lY3RlZGApO1xyXG4gICAgY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZW5lbXkgcmVhZHlcclxuICBzb2NrZXQub24oXCJlbmVteS1yZWFkeVwiLCAobnVtKSA9PiB7XHJcbiAgICBlbmVteVJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KG51bSk7XHJcbiAgICBpZiAocmVhZHkpIHN0YXJ0R2FtZU11bHRpKHNvY2tldCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNoZWNrIHBsYXllciBzdGF0dXNcclxuICBzb2NrZXQub24oXCJjaGVjay1wbGF5ZXJzXCIsIChwbGF5ZXJzKSA9PiB7XHJcbiAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaW5kZXgpID0+IHtcclxuICAgICAgaWYgKHBsYXllci5jb25uZWN0ZWQpIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKGluZGV4KTtcclxuICAgICAgaWYgKHBsYXllci5yZWFkeSkge1xyXG4gICAgICAgIHBsYXllclJlYWR5KGluZGV4KTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IHBsYXllck51bSkgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkgcmV0dXJuO1xyXG4gICAgaWYgKGFsbFNoaXBzUGxhY2VkKSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gICAgZWxzZSBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gw7ZuY2UgZ2VtaWxlcmluaSB5ZXJsZcWfdGlyIVwiO1xyXG4gIH0pO1xyXG5cclxuICAvLyBldmVudCBsaXN0ZW5lciBmb3IgZmlyaW5nXHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBzb2NrZXQub24oXCJ0dXJuLWNoYW5nZVwiLCAodHVybikgPT4ge1xyXG4gICAgdHVybk51bSA9IHR1cm47XHJcbiAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICB9KTtcclxuICBzb2NrZXQub24oXCJnYW1lb3ZlclwiLCAoc3RhdHVzKSA9PiB7XHJcbiAgICBnYW1lT3ZlciA9IHN0YXR1cztcclxuICAgIGlmIChnYW1lT3Zlcikge1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiT3l1biBiaXR0aSFcIjtcclxuICAgICAgZ2FtZUluZm8uYXBwZW5kKHJlbG9hZEJ1dHRvbik7XHJcbiAgICAgIHJlbG9hZEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoICE9PSA1KVxyXG4gICAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwiUmFraWJpbiBiw7x0w7xuIGdlbWlsZXJpbmkgeW9rIGV0dGkuIEtheWJldHRpbiFcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB7XHJcbiAgICAgICAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkge1xyXG4gICAgICAgICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJMw7x0ZmVuIMO2bmNlIGdlbWlsZXJpbmkgeWVybGXFn3RpciFcIjtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbmVteVJlYWR5KSB7XHJcbiAgICAgICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gcmFraWJpbmkgYmVrbGUhXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVuZW15UmVhZHkpO1xyXG5cclxuICAgICAgICB0dXJuTnVtID0gKHR1cm5OdW0gKyAxKSAlIDI7XHJcblxyXG4gICAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJnYW1lb3ZlclwiLCBnYW1lT3Zlcik7XHJcbiAgICAgIH0gZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgcGxheWVyQm9hcmREYXRhO1xyXG4gIHNvY2tldC5vbihcImZpcmVcIiwgKGlkKSA9PiB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXIgZGl2W2lkPScke2lkfSddYCk7XHJcbiAgICBjb25zdCBpc0hpdCA9IEFycmF5LmZyb20ocGxheWVyQm9hcmREYXRhKS5zb21lKChub2RlKSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICBpZiAoaXNIaXQpIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICBlbHNlIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGB0aGUgZW5lbXkgc2hvdCB5b3VyICR7aWR9IGJsb2NrIWApO1xyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQub24oXCJzdGFydC1nYW1lXCIsIChwbGF5ZXIxQm9hcmREYXRhLCBwbGF5ZXIyQm9hcmREYXRhKSA9PiB7XHJcbiAgICBjb25zdCBvcHBvbmVudEJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICBwbGF5ZXJCb2FyZERhdGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXYuZmlsbGVkXCIpO1xyXG4gICAgY29uc29sZS5sb2cocGxheWVyQm9hcmREYXRhKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wcG9uZW50Qm9hcmRCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgZGF0YUluZGV4ID0gaTtcclxuICAgICAgb3Bwb25lbnRCb2FyZEJsb2Nrc1tpXS5jbGFzc05hbWUgPVxyXG4gICAgICAgIHBsYXllck51bSA9PT0gMFxyXG4gICAgICAgICAgPyBwbGF5ZXIyQm9hcmREYXRhW2RhdGFJbmRleF1cclxuICAgICAgICAgIDogcGxheWVyMUJvYXJkRGF0YVtkYXRhSW5kZXhdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pIHtcclxuICAgIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDsgLy8gKzEgYmVjYXVzZSBpbmRleGVzIHN0YXJ0cyBmcm9tIHplcm9cclxuICAgIGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLmNvbm5lY3RlZCBzcGFuYClcclxuICAgICAgLmNsYXNzTGlzdC50b2dnbGUoXCJncmVlblwiKTtcclxuICAgIGlmIChwYXJzZUludChudW0pID09PSBwbGF5ZXJOdW0pXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGxheWVyKS5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgfVxyXG59XHJcblxyXG5tdWx0aXBsYXllckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRNdWx0aXBsYXllcik7XHJcblxyXG4vLyBzdGFydCBtdWx0aXBsYXllciBnYW1lXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZU11bHRpKHNvY2tldCkge1xyXG4gIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gIGNvbnNvbGUubG9nKGN1cnJlbnRQbGF5ZXIpO1xyXG4gIGlmICghcmVhZHkpIHtcclxuICAgIHNvY2tldC5lbWl0KFwicGxheWVyLXJlYWR5XCIpO1xyXG4gICAgcmVhZHkgPSB0cnVlO1xyXG4gICAgcGxheWVyUmVhZHkocGxheWVyTnVtKTtcclxuICB9XHJcblxyXG4gIGlmIChlbmVteVJlYWR5KSB7XHJcbiAgICBpZiAoY3VycmVudFBsYXllciA9PT0gXCJwbGF5ZXJcIikge1xyXG4gICAgICB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIikge1xyXG4gICAgICB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgICkubWFwKChibG9jaykgPT4gYmxvY2suY2xhc3NOYW1lKTtcclxuICAgIHNvY2tldC5lbWl0KFwiYm9hcmQtZGF0YVwiLCBwbGF5ZXJCb2FyZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUNvbnRyb2xCdXR0b25zLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXllclJlYWR5KG51bSkge1xyXG4gIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLnJlYWR5IHNwYW5gKS5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbn1cclxuXHJcbi8vIHN0YXJ0IHNpbmdsZSBwbGF5ZXIgZ2FtZSBtb2RlXHJcbmZ1bmN0aW9uIHN0YXJ0U2luZ2xlUGxheWVyKCkge1xyXG4gIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gIGlmIChzaW5nbGVQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgaWYgKG11bHRpUGxheWVyU3RhcnRlZCkgcmV0dXJuO1xyXG4gIHNpbmdsZVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJzaW5nbGVwbGF5ZXJcIjtcclxuICB1c2VyID0gXCJjb21wdXRlclwiO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoXCJjb21wdXRlclwiLCBzaGlwKSk7XHJcbiAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID1cclxuICAgIFwiVGVrIG95dW5jdWx1IG95dW4gYmHFn2xhZMSxISBMw7x0ZmVuIGdlbWlsZXJpbmkgeWVybGXFn3Rpci5cIjtcclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxufVxyXG5zaW5nbGVQbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0U2luZ2xlUGxheWVyKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gIH0pO1xyXG59XHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG4vLyBjcmVhdGluZyBnYW1lYm9hcmRzXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKGNvbG9yLCB1c2VyKSB7XHJcbiAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGdhbWVCb2FyZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB1c2VyKTtcclxuICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgIGJsb2NrLmlkID0gaTtcclxuICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgdXNlcik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwiY29tcHV0ZXJcIik7XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbGlkaXR5KGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XHJcbiAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgPyBzdGFydEluZGV4IDw9IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgOiAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgPyBzdGFydEluZGV4XHJcbiAgICA6IHN0YXJ0SW5kZXggLSBzaGlwLmxlbmd0aCAqIDEwICsgMTA7XHJcblxyXG4gIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgfVxyXG5cclxuICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgbGV0IGlzVmFsaWQ7XHJcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PSAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PiAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICApO1xyXG4gIH1cclxuICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAoYmxvY2spID0+XHJcbiAgICAgICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcInVuYXZhaWxhYmxlXCIpXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt1c2VyfSBkaXZgKTtcclxuICBjb25zdCBib29sID0gTWF0aC5yYW5kb20oKSA8IDAuNTsgLy8gcmV0dXJuZWQgbnVtYmVyIGVpdGhlciB3aWxsIGJlIGJpZ2dlciB0aGFuIDAuNSBvciBub3QgaGVuY2UgdGhlIHJhbmRvbSBib29sXHJcbiAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICBjb25zdCByYW5kb21TdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG5cclxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgYm9hcmRCbG9ja3MsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmICghaXNWYWxpZCB8fCAhbm90VGFrZW4pXHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkdlbWluaSBidXJheWEgeWVybGXFn3RpcmVtZXpzaW4hXCI7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKHNoaXAubmFtZSk7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJmaWxsZWRcIik7XHJcbiAgICB9KTtcclxuICAgIC8vIGFkZCB1bmF2YWlsYWJsZSBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJ1bmF2YWlsYWJsZVwiKTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKHVzZXIgPT09IFwicGxheWVyXCIpIG5vdERyb3BwZWQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhZGphY2VudCBpbmRleGVzXHJcbmZ1bmN0aW9uIGdldEFkamFjZW50SW5kZXhlcyhib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzaGlwQmxvY2tzKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3NBcnJheSA9IFsuLi5ib2FyZEJsb2Nrc107XHJcbiAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gW107XHJcblxyXG4gIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBibG9ja0luZGV4ID0gYm9hcmRCbG9ja3NBcnJheS5pbmRleE9mKGJsb2NrKTtcclxuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoYmxvY2tJbmRleCAvIDEwKTtcclxuICAgIGNvbnN0IGNvbCA9IGJsb2NrSW5kZXggJSAxMDtcclxuXHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGNvbnN0IHVuaXF1ZUFkamFjZW50SW5kZXhlcyA9IEFycmF5LmZyb20obmV3IFNldChhZGphY2VudEluZGV4ZXMpKTtcclxuICByZXR1cm4gdW5pcXVlQWRqYWNlbnRJbmRleGVzO1xyXG59XHJcblxyXG4vLyBkcmFnJmRyb3Agc2hpcHNcclxubGV0IGRyYWdnZWRTaGlwO1xyXG5jb25zdCBzaGlwT3B0aW9ucyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbnNoaXBPcHRpb25zLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnU3RhcnQpKTtcclxuXHJcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpO1xyXG5wbGF5ZXJCb2FyZC5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcFNoaXApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XHJcbiAgbm90RHJvcHBlZCA9IGZhbHNlO1xyXG4gIGRyYWdnZWRTaGlwID0gZS50YXJnZXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgaWYgKCFkcmFnZ2VkU2hpcCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcblxyXG4gIGhpZ2hsaWdodFNoaXBBcmVhKGUudGFyZ2V0LmlkLCBzaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcFNoaXAoZSkge1xyXG4gIGlmICghbXVsdGlQbGF5ZXJTdGFydGVkICYmICFzaW5nbGVQbGF5ZXJTdGFydGVkKSB7XHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gb3l1biBtb2R1IHNlw6dpbml6IVwiO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcbiAgaWYgKCFzaGlwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkge1xyXG4gICAgYWxsU2hpcHNQbGFjZWQgPSB0cnVlO1xyXG4gICAgc2hpcFNlbGVjdENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgcGxheWVyQm9hcmQsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBwbGF5ZXJUdXJuO1xyXG4vLyBzdGFydGluZyBzaW5nZSBwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVTaW5nbGUoKSB7XHJcbiAgaWYgKHBsYXllclR1cm4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHNoaXBDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJMw7x0ZmVuIMO2bmNlIGdlbWlsZXJpbmkgeWVybGXFn3RpciFcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaylcclxuICAgICAgKTtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJTZW5pbiBzxLFyYW5cIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk95dW4gYmHFn2xhZMSxIVwiO1xyXG4gICAgICBnYW1lQ29udHJvbEJ1dHRvbnMuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIXBsYXllclR1cm4pIHJldHVybjtcclxuICBpZiAoIWdhbWVPdmVyICYmIGFsbFNoaXBzUGxhY2VkKSB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSByZXR1cm47XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCaXIgZ2VtaXlpIHZ1cmR1biFcIjtcclxuICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20oZS50YXJnZXQuY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiLCBcInVuYXZhaWxhYmxlXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY3VycmVudFBsYXllciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKGN1cnJlbnRQbGF5ZXIsIHBsYXllckhpdHMsIHBsYXllclN1bmtTaGlwcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJJc2thbGFkxLFuIVwiO1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIWdhbWVPdmVyKSB7XHJcbiAgICAgIHBsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgNzUwKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGUudGFyZ2V0LmlkO1xyXG59XHJcblxyXG4vLyBjb21wdXRlcnMgdHVyblxyXG5mdW5jdGlvbiBjb21wdXRlcnNUdXJuKCkge1xyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCaWxnaXNheWFyxLFuIHPEsXJhc8SxXCI7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiSGVzYXBsYW1hbGFyIHlhcMSxbMSxeW9yLi5cIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgcmFuZG9tU2hvdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb21wdXRlcnNUdXJuKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgIXBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIZWRlZiB2dXJ1bGR1IVwiO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29tcHV0ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShcImNvbXB1dGVyXCIsIGNvbXB1dGVySGl0cywgY29tcHV0ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJJc2thIVwiO1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LCA3NTApO1xyXG4gICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICApO1xyXG4gICAgaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQXTEscWfxLFuxLEgeWFwIVwiO1xyXG4gICAgfSwgNzUwKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKSk7IC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tTY29yZSh1c2VyLCB1c2VySGl0cywgdXNlclN1bmtTaGlwcykge1xyXG4gIGZ1bmN0aW9uIGNoZWNrU2hpcChzaGlwTmFtZSwgc2hpcExlbmd0aCkge1xyXG4gICAgaWYgKFxyXG4gICAgICB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgPT09IHNoaXBOYW1lKS5sZW5ndGggPT09IHNoaXBMZW5ndGhcclxuICAgICkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdXNlciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIHVzZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFJha2liaW4gJHtzaGlwTmFtZX0gZ2VtaXNpbmkgYmF0xLFyZMSxbiFgO1xyXG5cclxuICAgICAgICBwbGF5ZXJIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFJha2lwICR7c2hpcE5hbWV9IGdlbWluaSBiYXTEsXJkxLEhYDtcclxuICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICB1c2VyU3Vua1NoaXBzLnB1c2goc2hpcE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVyU3Vua1NoaXBzXCIsIHBsYXllclN1bmtTaGlwcyk7XHJcblxyXG4gIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUmFraWJpbiBiw7x0w7xuIGdlbWlsZXJpbmkgeW9rIGV0dGluLiBLYXphbmTEsW4hXCI7IC8vIGdhbWUgb3ZlciBwbGF5ZXIgMSB3b25cclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIGlmIChnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIikge1xyXG4gICAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICAgICAgZ2FtZUluZm8uYXBwZW5kKHJlbG9hZEJ1dHRvbik7XHJcbiAgICAgIHJlbG9hZEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChjb21wdXRlclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIHtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCw7x0w7xuIGdlbWlsZXJpbiB5b2sgZWRpbGRpLiDEsHlpIHNhdmHFn3TEsSBhbWlyYWwuXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
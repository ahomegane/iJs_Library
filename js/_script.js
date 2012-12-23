/*
 * imjs selector engine
 * 使用するグローバル空間は、[Imjs, imjs]
 */
(function(){

  /*
   * ie6 support 'forEach'
   * https://developer.mozilla.org/ja/docs/JavaScript/Reference/Global_Objects/Array/forEach
   */

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if ( !Array.prototype.forEach ) {
    Array.prototype.forEach = function( callback, thisArg ) {
   
      var T, k;
   
      if ( this == null ) {
        throw new TypeError( " this is null or not defined" );
      }
   
      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);
   
      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0; // Hack to convert O.length to a UInt32
   
      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ( {}.toString.call(callback) != "[object Function]" ) {
        throw new TypeError( callback + " is not a function" );
      }
   
      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if ( thisArg ) {
        T = thisArg;
      }
   
      // 6. Let k be 0
      k = 0;
   
      // 7. Repeat, while k < len
      while( k < len ) {
   
        var kValue;
   
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
   
        if ( k in O ) {
   
          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[ k ];
   
          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call( T, kValue, k, O );
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }


  /*
   * imjs base
   */
  var doc = document, dom;

  window.Imjs = window.Imjs || {};
  window.imjs = window.imjs || {};

  // get selector
  window.Imjs = function (selector){
    this.selector = selector;
    this.initialize();
    return dom;
  }

  Imjs.prototype = {

    initialize: function(){
      ( doc.querySelectorAll )? dom = doc.querySelectorAll(this.selector): dom = this.legacy(this.selector);
    },

    legacy: function(selector){

      if( /^#/.test(selector) ) {

        selector = selector.replace(/^./, '');
        return [doc.getElementById(selector)];
        
      } else if( /^\./.test(selector) ) {

        var all = doc.getElementsByTagName('*'),
            array = [];
        selector = selector.replace(/^\./, '');
        for (var i = 0, j = 0, l = all.length; i < l; i++) {
          if (all[i].className === selector) {
            array[j] = all[i];
            j++;
          }
        }
        return array;

      } else {

        return doc.getElementsByTagName(selector);

      }// /</ />/

    }

  }

  window.imjs = function (selector){
    return new Imjs(selector);
  }

  imjs.filter = function(selector, target){

    var _selector = selector,
        _target = target,
        _array = [],
        _nodes = [];

    for(var i = 0, l = _selector.length; i < l; i++) _array[i] = _selector[i].getElementsByTagName('*');

    _array.forEach(function(i){
      for(var j = 0, l = i.length; j < l; j++){
        var _node = i[j].nodeName;
        if(_node === target.toUpperCase()){
          _nodes.push(i[j]);
        } 
      }
    });

    return _nodes;

  }

  // user agent :: www.aoi-pro.com/asset/js/settings.js
  imjs.ua = (function() {
    return {
      lteIE6:  typeof window.addEventListener == 'undefined' && typeof document.documentElement.style.maxHeight == 'undefined',
      lteIE7:  typeof window.addEventListener == 'undefined' && typeof document.querySelectorAll == 'undefined',
      lteIE8:  typeof window.addEventListener == 'undefined' && typeof document.getElementsByClassName == 'undefined',
      IE:      document.uniqueID,
      Firefox: window.sidebar,
      Opera:   window.opera,
      Webkit:  !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation == 'undefined',
      Mobile:  typeof window.orientation != 'undefined'
    }
  })();

}());


(function(){

  if(!window.console){

    window.console = {};
    window.console.log = function(c){
        return c;
    };

  }

  console.log('#hoge:', imjs('#hoge'));
  console.log('.hoge:', imjs('.hoge'));
  console.log('span:', imjs('span'));
  console.log('lteIE6:', imjs.ua.lteIE6);
  console.log('lteIE7:', imjs.ua.lteIE7);
  console.log('lteIE8:', imjs.ua.lteIE8);
  console.log('IE:', imjs.ua.IE);
  console.log('Firefox:', imjs.ua.Firefox);
  console.log('Opera:', imjs.ua.Opera);
  console.log('Webkit:', imjs.ua.Webkit);
  console.log('Mobile:', imjs.ua.Mobile);

  /*
   * selector
   */
  // for id
  var _id_selector = imjs('#hoge')[0];
  _id_selector.style.color = '#00f';

  // for class
  var _class_selector = imjs('.hoge');
  for(var i = 0, l = _class_selector.length; i < l; i++) _class_selector[i].style.color = '#f00';

  // for elemnt
  var _element_selector = imjs('span');
  for(var i = 0, l = _element_selector.length; i < l; i++) _element_selector[i].style.color = '#390';

  // filter
  //var _ul_selector
  var _imjs_filter = imjs('#filter');
  var _imjs_fiter_strong = imjs.filter(_imjs_filter, 'strong');
  for(var i = 0, l = _imjs_fiter_strong.length; i < l; i++) _imjs_fiter_strong[i].style.fontSize = '24px';

  /*
   * user agent
   */

}());
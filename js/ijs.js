if(!window.console){
  window.console = {};
  window.console.log = function(c){
    return c;
    //alert(c);
  };
}

/**
* @fileOverview ijs JavaScript Library
* @name ijs.js
* @version 1.0.0 2012.12.23 Creating New File
* @namespace global namespace [ijs, ij]
*/
(function(){

  var doc = document;

  /**
  * ijファンクション ex.ij('selector');
  * window.ij = ij としてijオブジェクトの外部インターフェースとする
  */
  var ij = function(selector, context){
    if(selector) {
      return new Ijs.Selectors(selector, context);      
    }  else {
      return null;
    }
  }
  
  /**
  * Ijsオブジェクト
  * window.ijs = new Ijs(); として外部インターフェースとする
  */
  var Ijs = function() {
    return this.initialize();
  }

  /**
  * ユーザー環境データの取得
  * Ijs.initialize時に実行
  */
  Ijs.Device = function(args) {
    this.breakPointNarrow = args.breakPointNarrow;
    this.breakPointMedium = args.breakPointMedium;
    return this.init();
  }
  Ijs.Device.prototype = {

    init: function() {
      this.deviceUa = this.getDeviceFromUa();
      this.deviceSize = this.getDeviveFromSize(this.breakPointNarrow, this.breakPointMedium);
      this.browserUa = this.getBrowserFromUa();
      this.browserSupport = this.getBrowserFromSupport();
    },
    
    /**
    * UAからSP/PC/TBのデバイスタイプを取得
    * @return {Object: Boolean} {iphone, android, windowsphone, ipad, androidtab, pc}
    */  
    getDeviceFromUa: function() {
      var userAgent = window.navigator.userAgent.toLowerCase();
      var deviceType = {
        iphone:       false,
        android:      false,
        windowsphone: false,
        ipad:         false,
        androidtab:   false,
        pc:           false
      }
      
      if((userAgent.indexOf('iphone') > -1 && userAgent.indexOf('ipad') == -1) || userAgent.indexOf('ipod') > -1) {
        deviceType.iphone = true; //iPhone&iPod
      } else if(userAgent.indexOf('android') > -1 && userAgent.indexOf('mobile') > -1) {
        deviceType.android = true; //AndroidMobile(一部のタブレット型アンドロイドを含む)
      } else if(userAgent.indexOf('windows phone') > -1) {
        deviceType.windowsphone = true; //WindowsPhone
      } else if(userAgent.indexOf('ipad') > -1) {
        deviceType.ipad = true; //iPad
      } else if(userAgent.indexOf('android') > -1) {
        deviceType.androidTab = true; //AndroidTablet
      } else {
        deviceType.pc = true; //PC
      }
      return deviceType;
    },
        
    /**
    * ウインドウサイズからデバイスタイプ(SP/PC/TB)を取得
    * @return {Object: Boolean} {mouseWide, touchWide, mouseMedium, touchMedium, mouseNarrow, touchNarrow}
    */
    getDeviveFromSize: function(breakPointNarrow, breakPointMedium) {
      var width = window.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
      var deviceType = {
        mouseWide: false,
        touchWide: false,
        mouseMedium: false,
        touchMedium: false,
        mouseNarrow: false,
        touchNarrow: false
      }
      
      if(!('ontouchstart' in window)) {
        if(typeof window.addEventListener == 'undefined' && typeof document.getElementsByClassName == 'undefined') {//mediaQueryに対応していないブラウザ(lteIe8)は除外
          deviceType.mouseWide = true;
        } else {
          if(breakPointNarrow && width <= breakPointNarrow) {
            deviceType.mouseNarrow = true;
          } else if(breakPointMedium && width <= breakPointMedium) {
            deviceType.mouseMedium = true;
          } else {
            deviceType.mouseWide = true;
          }
        }
      } else {
        if(breakPointNarrow && width <= breakPointNarrow) {
          deviceType.touchNarrow = true;
        } else if(breakPointMedium && width <= breakPointMedium) {
          deviceType.touchMedium = true;
        } else {
          deviceType.touchWide = true;
        }
      }            
      return deviceType;
    },

    /**
    * UAからPCのブラウザタイプを取得
    * @return {Object: Boolean} {lteIe6, lteIe7, lteIe8, ie, ie6, ie7, ie8, ie9, firefox, opera, chrome, safari}
    */
    getBrowserFromUa: function() {
      var userAgent = window.navigator.userAgent.toLowerCase();
      var ieVersion = userAgent.slice(userAgent.indexOf('msie ')+'msie '.length,userAgent.indexOf('msie ')+'msie '.length+1);
      var browserType = {
        lteIe6:  false,
        lteIe7:  false,
        lteIe8:  false,
        ie:      false,
        ie6:     false,
        ie7:     false,
        ie8:     false,
        ie9:     false,
        ie10:    false,
        firefox: false,
        opera:   false,
        chrome:  false,
        safari:  false,
        other:  false
      }

      if(ieVersion<7) {
        browserType.lteIe6 = true;
      } else if(ieVersion<8) {
        browserType.lteIe7 = true;
      } else if(ieVersion<9) {
        browserType.lteIe8 = true;
      } else if(ieVersion<10) {
        browserType.lteIe9 = true;
      } else if(userAgent.indexOf('msie') > -1) {
        browserType.ie = true;
      } else if(userAgent.indexOf('msie 6.') > -1) {
        browserType.ie6 = true;
      } else if(userAgent.indexOf('msie 7.') > -1) {
        browserType.ie7 = true;
      } else if(userAgent.indexOf('msie 8.') > -1) {
        browserType.ie8 = true;
      } else if(userAgent.indexOf('msie 9.') > -1) {
        browserType.ie9 = true;
      } else if(userAgent.indexOf('msie 10.') > -1) {
        browserType.ie10 = true;
      } else if(userAgent.indexOf('firefox') > -1) {
        browserType.firefox = true;
      } else if(userAgent.indexOf('opera') > -1) {
        browserType.opera = true;
      } else if(userAgent.indexOf('chrome') > -1) {
        browserType.chrome = true;
      } else if(userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') == -1) {
        browserType.safari = true;
      } else {
        browserType.other = true;
      }

      return browserType;
    },
        
    /**
    * 機能テストからブラウザ/デバイスタイプを取得
    * @return {Object: Boolean} {lteIe6, lteIe7, ie, firefox, opera, webkit, mobile}
    */
    getBrowserFromSupport: function() {
      return {
        lteIe6:  typeof window.addEventListener == 'undefined' && typeof document.documentElement.style.maxHeight == 'undefined',
        lteIe7:  typeof window.addEventListener == 'undefined' && typeof document.querySelectorAll == 'undefined',
        lteIe8:  typeof window.addEventListener == 'undefined' && typeof document.getElementsByClassName == 'undefined',
        ie:      document.uniqueID,
        firefox: window.sidebar,
        opera:   window.opera,
        webkit:  !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation == 'undefined',
        mobile:  typeof window.orientation != 'undefined'
      }
    }
  }

  var iDevice = new Ijs.Device({
    breakPointNarrow: 568,
    breakPointWide: 746
  });

  /**
  * 外部から参照するメソッド
  * prototypeをIjsと共有する
  */
  Ijs.Functions = function() {}
  Ijs.Functions.prototype = Ijs.prototype = {

    /** ready */

    ready: function(callback) {

      if (doc.readyState === "complete") {//すでにonloadを実行している場合は即実行
        setTimeout(callback, 1);

      } else if(doc.addEventListener) {//standard
        doc.addEventListener("DOMContentLoaded", callback, false);
      
      } else {//legacy

        //http://javascript.nwbox.com/IEContentLoaded/
        var isReady = false;
        // only fire once
        function done() {
          if (!isReady) {
            isReady = true;
            callback();
          }
        };
        // polling for no errors
        (function doScrollCheck() {
          try {
            // throws errors until after ondocumentready
            doc.documentElement.doScroll('left');
          } catch (e) {
            setTimeout(doScrollCheck, 50);
            return;
          }
          // no errors, fire
          done();
        })();
        // trying to always fire before onload
        doc.onreadystatechange = function() {
          if (doc.readyState == 'complete') {
            doc.onreadystatechange = null;
            done();
          }
        };
      }
    },

    load: function(callback) {
      this.addEventListener(window, 'load', callback);
    },

    imageLoader: function(imageSrcList, callbacks, timeout) {
      callbacks = callbacks || {};

      //create wrap element for append
      var cacheEl = doc.createElement('div');
      cacheEl.style.display = 'none';
      doc.body.appendChild(cacheEl);

      var all = imageSrcList.length, 
      progress = 0,
      isTimeout = false,
      isComplete = false;

      for(var i=0; i<all; i++) {
        var img = new Image();
        img.onload = function() {
          progress++;
          if(typeof callbacks.progress == 'function' && !isTimeout) {
            callbacks.progress(progress, all);
          }
          if(progress == all) {
            complete();
          }
        };
        img.onerror = function() {
          console.log('image: error');
          if(progress == all-1) {//最後の1つがerrorの場合
            complete();
          } else {
            all--;
          }
          //ie6で複数回実行される場合があるため
          img.onerror = null;
        }
        cacheEl.appendChild(img);

        //append後にsrcをsetしなければieでonloadが発生しない場合がある(キャッシュが原因)
        img.src = imageSrcList[i];
      }

      //safetynet timeout処理
      if(timeout && typeof callbacks.complete == 'function') {
        var timer = 0, stepTime = 100;
        setInterval(function(){
          timer += stepTime;
          if(timer == timeout && !isComplete) {
            isTimeout = true;
            console.log('image: timeout');
            callbacks.complete();
          }
        },stepTime);
      }

      /**
      * @inner
      * completeは1度だけ実行
      */
      function complete() {
        if(typeof callbacks.complete == 'function' && !isComplete && !isTimeout) {
          isComplete = true;
          callbacks.complete();
          //remove wrapper
          cacheEl.parentNode.removeChild(cacheEl);
        }
      }
    },

    /** Event */
    
    /**
    * addEventListener IE補完
    * @param {Object} el 要素ノード(Domオブジェクト)
    * @param {String} ev イベント名
    * @param {Function} listenerFunc イベントリスナ関数
    * @return {void}
    */
    addEventListener: function(el, ev, listenerFunc) {
      if(el.addEventListener) { //IE以外
        el.addEventListener(ev, listenerFunc, false);
      } else if(el.attachEvent) { //IE
        el.attachEvent('on' + ev, listenerFunc);
      }
    },
    
    /**
    * removeEventListener IE補完
    * @param {Object} el 要素ノード(Domオブジェクト)
    * @param {String} ev イベント名
    * @param {Function} listenerFunc イベントリスナ関数
    * @return {void}
    */
    removeEventListener: function(el, ev, listenerFunc){
      if(el.removeEventListener) { //except for IE
        el.removeEventListener(ev, listenerFunc, false);
      } else if(el.detachEvent) { //IE
        el.detachEvent('on' + ev, listenerFunc);
      }
    },
  
    /**
    * stopPropagation IE補完 (ieではlistener内でもstopPropagationはwindow.event)
    * @param {Object} e イベントオブジェクト
    * @return {void}
    */
    stopPropagation: function(e) {
      if(e.stopPropagation) { //except for IE
        e.stopPropagation();
      } else if(window.event) { //IE
        window.event.cancelBubble = true;
      }
    },
  
    /**
    * preventDefault IE補完 (ieではlistener内でもpreventDefaultはwindow.event)
    * @param {Object} e イベントオブジェクト
    * @return {void}
    */
    preventDefault: function(e) {
      if(e.preventDefault) { //except for IE
        e.preventDefault();
      } else if(window.event) { //IE
        window.event.returnValue = false;
      }
    },
  
    /** Array */
    
    objToArray: function(a) {
      try {
        return Array.prototype.slice.call(a); //not work lteIe8
      } catch(e) {
        var rv = new Array(a.length);
        for(i = 0, l=rv.length; i < l; i++) { rv[i] = a[i]; }
        return rv;
      }
    },

    /** Object */
    
    /**
    * オブジェクトのlength取得
    * @param {Object} lengthを取得したいオブジェクト
    * @return {Integer} length
    */  
    countObjLength: function (obj) {
      var count = 0;
      for (var prop in obj){
        count++;
      }
      return count;
    },

    copyProp: function(base, convert) {
      for(var prop in base) {
        convert[prop] = base[prop];
      }
    }
    
  }

  var iFn = new Ijs.Functions();

  /**
  * セレクターエンジン
  * メソッドチェーンとして使用可能(return this;)
  */
  Ijs.Selectors = function(selector, context) {
    return this.find(selector, context);
  }
  Ijs.Selectors.prototype = {

    0: null,//dom element {Array}

    context: null,

    selector: null,
    
    find: function(selector, context) {
      //selector string cleanup
      if(typeof selector == 'string') {
        selector = selector.replace(/(?:\s)+$/,'').replace(/^(?:\s)+/,'');
      }

      //override context for method chain
      if(this[0]) context = this;
      //override properties
      this.context = context;
      this.selector = selector;

      //documentオブジェクト(new Ijs.Selectors(doc)の前に処理を行うと無限ループになる)
      if(typeof selector == 'object' && (selector.nodeType || selector[0].nodeType)) {
        this[0] = [selector];
        return this;
      }

      context = context instanceof Ijs.Selectors ? context : new Ijs.Selectors(doc);

      //browser test
      var isStandard = doc.querySelectorAll,
      elArr = [];

      //standard
      if(!isStandard) {
        context.each(function() {
          elArr = elArr.concat(iFn.objToArray(this.querySelectorAll(selector)));
        });

      //legacy
      } else {
        selector = selector.split(' ');
        
        if(selector.length > 1) {//ij('.foo .bar');
        
          //#から始まる文字列からをfindの対象とする
          for(var i=selector.length-1,l=-1; i>l; i--) {
            if(/^#/.test(selector[i])) {
              selector = selector.slice(i);
              break;
            }
          }
          //find loop
          for(var i=0,l=selector.length; i<l; i++) {
            this.find(selector[i]);
          }
          return true;
          
        } else {//ij('.foo');
          selector = selector[0];
          
          if(/^#/.test(selector)) {//id
            selector = selector.replace(/^#/, '');
            elArr = elArr.concat([doc.getElementById(selector)]);
            
          } else if(/^\./.test(selector)) {//class
            context.each(function() {
              var all = this.getElementsByTagName('*'), arr = [];
              selector = selector.replace(/^\./, '');
              var rClassName = new RegExp('\\b' + selector + '\\b');
              for (var i = 0, l = all.length; i < l; i++) {
                if (rClassName.test(all[i].className)) {
                  arr.push(all[i]);
                }
              }
              elArr = elArr.concat(arr);
            });
            
          } else {//tagname
            context.each(function() {
              elArr = elArr.concat(iFn.objToArray(this.getElementsByTagName(selector)));
            });
          }

        }
      }
      this[0] = elArr;
      return this;
    },
    
    //function内のthisはdom element,第１引数にindex番号
    each: function(func) {
      if(this[0]) {
        for(var i=0,l=this[0].length; i<l; i++) {
          if(typeof func == 'function') func.call(this[0][i],i);
        }
      }
    },
    
    on: function(ev, listenerFunc) {
      if(this[0]) {
        this.each(function(i) {
          iFn.addEventListener(this, ev, listenerFunc);
        });
      }
    },
    
    off: function(ev, listenerFunc) {
      if(this[0]) {
        this.each(function() {
          iFn.removeEventListener(this, ev, listenerFunc);
        });
      }
    }
  }

  /**
  * ロード時に実行するメソッド
  * Ijs.initialize時に実行
  */
  Ijs.Onload = function() {}
  Ijs.Onload.prototype = {
  }

  /**
  * window.ijs = new Ijs() の際に1度だけ実行
  * 静的なデータをinitializeでwindow.ijsに追加
  */
  Ijs.prototype.initialize = function() {
    this.deviceUa = iDevice.deviceUa;
    this.deviceSize = iDevice.deviceSize;
    this.browserUa = iDevice.browserUa;
    this.browserSupport = iDevice.browserSupport;
  }

  window.ij = ij;
  window.ijs = new Ijs();

  console.log(window.ijs);

})();

//test
(function(){

ijs.ready(function(){
  console.log('ready');

  /**
  * selector
  */
  //id
  var _id_selector = ij('#hoge')[0];
  _id_selector[0].style.color = '#00f';
  
  //class
  var _class_selector = ij('.hoge')[0];
  for(var i = 0, l = _class_selector.length; i < l; i++) _class_selector[i].style.color = '#f00';

  //event
  ij('.hoge').on('click',clickConsole);
  //ij('.hoge').off('click',clickConsole);
  function clickConsole() {
    console.log('click');
    console.log(this.style.color);
    console.log(ij(this)[0][0].style.color);
  }
  ij('.hoge').each(function(index) {
    // console.log(index);
    // console.log(this);
  });

  //elemnt
  var _element_selector = ij('span')[0];
  for(var i = 0, l = _element_selector.length; i < l; i++) _element_selector[i].style.color = '#390';
  
  //find
  var _find_selector = ij('.findOuter').find('.findInner')[0];
  //var _find_selector = ij('.findInner', ij('.findOuter'))[0];
  //var _find_selector = ij('.findOuter .findInner')[0];
  for(var i = 0, l = _find_selector.length; i < l; i++) _find_selector[i].style.color = 'pink';
  
  /**
  * browser
  */
  ij('#lteIE6').find('strong')[0][0].innerText = ijs.browserSupport.lteIe6;
  ij('#lteIE7').find('strong')[0][0].innerText = ijs.browserSupport.lteIe7;
  ij('#lteIE8').find('strong')[0][0].innerText = ijs.browserSupport.lteIe8;
  ij('#IE').find('strong')[0][0].innerText = ijs.browserSupport.ie;
  ij('#Firefox').find('strong')[0][0].innerText = ijs.browserSupport.firefox;
  ij('#Opera').find('strong')[0][0].innerText = ijs.browserSupport.opera;
  ij('#Webkit').find('strong')[0][0].innerText = ijs.browserSupport.webkit;
  ij('#Mobile').find('strong')[0][0].innerText = ijs.browserSupport.mobile;

  var imageSrcList = [];
  for(var i=1, l=19; i<=l; i++) {
    imageSrcList.push('./img/dummy/dummy_' + i + '.jpg');
  }

  //404
  //imageSrcList.push('aaaa');

  ijs.imageLoader(imageSrcList,{
    progress: function(progress, all) {
      console.log('image: ' + Math.floor(progress/all*100) + '%');
    },
    complete: function() {
      console.log('image: complete');
    }
  }, 2000);

});

  /**
  * fn: ready
  */  
  ijs.ready(function(){
    console.log('ready2');
  });
  ijs.load(function(){
    console.log('load');
  });
  ijs.load(function(){
    console.log('load2');
  });

})();
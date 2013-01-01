if(!window.console){
  window.console = {};
  window.console.log = function(c){
    alert(c);
  };
}

/**
* @fileOverview ijs JavaScript Library
* @name ijs.js
* @version 1.0.0 2012.12.23 Creating New File
* @namespace global namespace [ijs, ij]
*/
(function(){

  var conf = {
    detectBrowserType: 'support',
    detectDeviceType: 'size',
    breakPointSp: 640,
    breakPointTb: 850
  };
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
    * stopPropagation IE補完
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
    * preventDefault IE補完
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
    }
    
  }

  var fn = new Ijs.Functions();

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
      if(selector == doc) {
        this[0] = [doc];
        return this;
      }

      context = context instanceof Ijs.Selectors ? context : new Ijs.Selectors(doc);

      //browser test
      var isStandard = doc.querySelectorAll,
      elArr = [];

      //standard
      if(isStandard) {
        context.each(function() {
          elArr = elArr.concat(fn.objToArray(this.querySelectorAll(selector)));
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
              for (var i = 0, l = all.length; i < l; i++) {
                if (all[i].className === selector) {
                  arr.push(all[i]);
                }
              }
              elArr = elArr.concat(arr);
            });
            
          } else {//tagname
            context.each(function() {
              elArr = elArr.concat(fn.objToArray(this.getElementsByTagName(selector)));
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
          fn.addEventListener(this, ev, listenerFunc);
        });
      }
    },
    
    off: function(ev, listenerFunc) {
      if(this[0]) {
        this.each(function() {
          fn.removeEventListener(this, ev, listenerFunc);
        });
      }
    }
  }

  /**
  * ロード時に実行するメソッド
  * Ijs.initialize時に実行
  */
  Ijs.Onload = function(conf) {}
  Ijs.Onload.prototype = {
  }

  /**
  * ユーザー環境データの取得
  * Ijs.initialize時に実行
  */
  Ijs.Device = function(conf) {
    this.detectBrowserType = conf.detectBrowserType;
    this.detectDeviceType = conf.detectDeviceType;
    this.breakPointSp = conf.breakPointSp || 568;
    this.breakPointTb = conf.breakPointTb || 746;
    return this.init();
  }
  Ijs.Device.prototype = {
    
    device: null,//return static data

    browser: null,//return static data

    init: function() {
      switch(this.detectBrowserType) {
        case 'ua':
          this.browser = this.getBrowserFromUa();
          break;
        case 'support':
          this.browser = this.getBrowserFromSupport();
          break;
      }
      switch(this.detectDeviceType) {
        case 'ua':
          this.device = this.getDeviceFromUa();
          break;
        case 'size':
          this.device = this.getDeviveFromSize(this.breakPointSp, this.breakPointTb);
          break;
      }
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
    * @return {Object: Boolean} {mousePc, touchPc, mouseTb, touchTb, mouseSp, touchSp}
    */
    getDeviveFromSize: function(breakPointSp, breakPointTb) {
      var browser = this.getDeviceFromUa(),
      width = window.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
      var deviceType = {
        mousePc: false,
        touchPc: false,
        mouseTb: false,
        touchTb: false,
        mouseSp: false,
        touchSp: false
      }
      
      if(!('ontouchstart' in window)) {
        if(typeof window.addEventListener == 'undefined' && typeof document.getElementsByClassName == 'undefined') {//mediaQueryに対応していないブラウザ(lteIe8)は除外
          deviceType.mousePc = true;
        } else {
          if(width <= this.breakPointSp) {
            deviceType.mouseSp = true;
          } else if(width <= this.breakPointTb) {
            deviceType.mouseTb = true;
          } else {
            deviceType.mousePc = true;
          }
        }
      } else {
        if(width <= this.breakPointSp) {
          deviceType.touchSp = true;
        } else if(width <= this.breakPointTb) {
          deviceType.touchTb = true;
        } else {
          deviceType.touchPc = true;
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
      return {
        lteIe6:  ieVersion<7,
        lteIe7:  ieVersion<8,
        lteIe8:  ieVersion<9,
        ie:      userAgent.indexOf('msie') > -1,
        ie6:     userAgent.indexOf('msie 6.') > -1,
        ie7:     userAgent.indexOf('msie 7.') > -1,
        ie8:     userAgent.indexOf('msie 8.') > -1,
        ie9:     userAgent.indexOf('msie 9.') > -1,
        ie10:    userAgent.indexOf('msie 10.') > -1,
        firefox: userAgent.indexOf('firefox') > -1,
        opera:   userAgent.indexOf('opera') > -1,
        chrome:  userAgent.indexOf('chrome') > -1,
        safari:  userAgent.indexOf('safari') > -1
      }
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

  var device = new Ijs.Device(conf);

  /**
  * window.ijs = new Ijs() の際に1度だけ実行
  * 静的なデータをinitializeでwindow.ijsに追加
  */
  Ijs.prototype.initialize = function() {
    var deviceObj = new Ijs.Device(conf);
    this.browser = deviceObj.browser;
    this.device = deviceObj.device;
  
  }

  window.ij = ij;
  window.ijs = new Ijs();

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
  }
  ij('.hoge').each(function(index) {
    //console.log(index);
    //console.log(this);
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
  ij('#lteIE6').find('strong')[0][0].innerText = ijs.browser.lteIe6;
  ij('#lteIE7').find('strong')[0][0].innerText = ijs.browser.lteIe7;
  ij('#lteIE8').find('strong')[0][0].innerText = ijs.browser.lteIe8;
  ij('#IE').find('strong')[0][0].innerText = ijs.browser.ie;
  ij('#Firefox').find('strong')[0][0].innerText = ijs.browser.firefox;
  ij('#Opera').find('strong')[0][0].innerText = ijs.browser.opera;
  ij('#Webkit').find('strong')[0][0].innerText = ijs.browser.webkit;
  ij('#Mobile').find('strong')[0][0].innerText = ijs.browser.mobile;

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
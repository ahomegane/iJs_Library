if(!window.console){
  window.console = {};
  window.console.log = function(c){
    return c;
  };
}

/**
* memo:
* ・createElement
* ・selector複数
* ・extend
*/

/**
* @fileOverview iJs JavaScript Library
* @name ijs.js
* @version 1.0.0 2012.12.23 Creating New File
* @namespace global namespace [iJs, ij]
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
      return new IJs.Selectors(selector, context);      
    }  else {
      return null;
    }
  }
  
  /**
  * IJsオブジェクト
  * window.iJs = new IJs(); として外部インターフェースとする
  */
  var IJs = function() {
    return this.initialize();
  }

  /**
  * 外部から参照するメソッド
  * prototypeをIJsと共有する
  */
  IJs.Functions = function() {}
  IJs.Functions.prototype = IJs.prototype = {
    
    /** Array */
    
    concat: function(a,b) {
      return Array.prototype.push.apply(a,b);
    },
    
    objToArray: function(a) {
      return Array.prototype.slice.call(a);
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
      } else {
        throw new Error('error: no event listener');
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
      } else {
        throw new Error('error: no event listener');
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
      if (e.preventDefault) { //except for IE
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

  var fn = new IJs.Functions();

  /**
  * セレクターエンジン
  * メソッドチェーンとして使用可能(return this;)
  */
  IJs.Selectors = function(selector, context) {
    this[0] = null;//array
    this.context = context;
    this.selector = selector;
    return this.find(this.selector, this.context);
  }
  IJs.Selectors.prototype = {
    
    find: function(selector, context) {
      //override context for method chain
      if(this[0]) context = this;
      //override properties
      this.context = context;
      this.selector = selector;
      
      //documentオブジェクト(new IJs.Selectors(doc)の前に処理を行うと無限ループになる)
      if(selector == doc) {
        this[0] = [doc];
        return this;
      }
      
      context = context instanceof IJs.Selectors ? context : new IJs.Selectors(doc);
      
      //browser test
      var isStandard = doc.querySelectorAll,
      elArr = [];

      if(isStandard) {//standard
        context.each(function() {
          fn.concat(elArr, fn.objToArray(this.querySelectorAll(selector)));
        });

      } else {//legacy
        if( /^#/.test(selector) ) {//id
          selector = selector.replace(/^#/, '');
          fn.concat(elArr, [doc.getElementById(selector)]);
          
        } else if( /^\./.test(selector) ) {//class
          context.each(function() {
            var all = this.getElementsByTagName('*'), arr = [];
            selector = selector.replace(/^\./, '');
            for (var i = 0, l = all.length; i < l; i++) {
              if (all[i].className === selector) {
                arr.push(all[i]);
              }
            }
            fn.concat(elArr, arr);
          });
          
        } else {//tagname
          context.each(function() {
            fn.concat(elArr, this.getElementsByTagName(selector));
          });
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
  * IJs.initialize時に実行
  */
  IJs.Onload = function(conf) {}
  IJs.Onload.prototype = {
  }

  /**
  * ユーザー環境データの取得
  * IJs.initialize時に実行
  */
  IJs.Device = function(conf) {
    this.detectBrowserType = conf.detectBrowserType;
    this.detectDeviceType = conf.detectDeviceType;
    this.breakPointSp = conf.breakPointSp || 568;
    this.breakPointTb = conf.breakPointTb || 746;
    
    //return static data
    this.data = {};
    return this.init();
  }
  IJs.Device.prototype = {
      
    init: function() {
      switch(this.detectBrowserType) {
        case 'ua':
          this.data.browser = this.getBrowserFromUa();
          break;
        case 'support':
          this.data.browser = this.getBrowserFromSupport();
          break;
      }
      switch(this.detectDeviceType) {
        case 'ua':
          this.data.device = this.getDeviceFromUa();
          break;
        case 'size':
          this.data.device = this.getDeviveFromSize(this.breakPointSp, this.breakPointTb);
          break;
      }
      console.log(this.data);
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
      } else if(userAgent.indexOf('ipad') > -1 ) {
        deviceType.ipad = true; //iPad
      } else if(userAgent.indexOf('android') > -1 ) {
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

  /**
  * window.iJs = new IJs() の際に1度だけ実行
  * 静的なデータをinitializeでwindow.iJsに追加
  */
  IJs.prototype.initialize = function() {
    var deviceObj = new IJs.Device(conf);
    this.browser = deviceObj.data.browser;
    this.device = deviceObj.data.dev;
  }

  window.ij = ij;
  window.iJs = new IJs();

})();

//test
(function(){
  
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
    console.log(index);
    console.log(this);
  });

  //elemnt
  var _element_selector = ij('span')[0];
  for(var i = 0, l = _element_selector.length; i < l; i++) _element_selector[i].style.color = '#390';
  
  //find
  var _find_selector = ij('.findOuter').find('.findInner')[0];
  //var _find_selector = ij('.findInner', ij('.findOuter'))[0];
  for(var i = 0, l = _find_selector.length; i < l; i++) _find_selector[i].style.color = 'pink';
  
  /**
  * browser
  */
  ij('#lteIE6').find('strong')[0][0].innerText = iJs.browser.lteIe6;
  ij('#lteIE7').find('strong')[0][0].innerText = iJs.browser.lteIe7;
  ij('#lteIE8').find('strong')[0][0].innerText = iJs.browser.lteIe8;
  ij('#IE').find('strong')[0][0].innerText = iJs.browser.ie;
  ij('#Firefox').find('strong')[0][0].innerText = iJs.browser.firefox;
  ij('#Opera').find('strong')[0][0].innerText = iJs.browser.opera;
  ij('#Webkit').find('strong')[0][0].innerText = iJs.browser.webkit;
  ij('#Mobile').find('strong')[0][0].innerText = iJs.browser.mobile;
  
})();
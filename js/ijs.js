/**
* @fileOverview iJs JavaScript Library
* @name ijs.js
* @version 1.0.0 2012.12.23 Creating New File
* @namespace global namespace [iJs, ij]
*/
(function(){
	
	var doc = document;

	/**
	* ijファンクション ex.ij('selector');
	* window.ij = ij としてijオブジェクトの外部インターフェースとする
	*/
	var ij = function (selector, context){
		if(selector) {
				return new IJs.Selectors(selector, context);			
		}	else {
			return null;
		}
  }
	
	/**
	* IJsオブジェクト
	* window.iJs = new IJs(); として外部インターフェースとする
	*/
	var IJs = function () {
		return this.initialize();
	}

	IJs.conf =  {
		deviceDetect: 'ua'
	};

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
		
		obj2Array: function(a) {
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
		getObjLength: function (obj) {
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
		this.el = null;//array
		this.context = context;
		this.selector = selector;
		return this.find(this.selector, this.context);
	}
  IJs.Selectors.prototype = {
		
		find: function(selector, context) {
			//override context for method chain
			if(this.el) context = this;
			//override properties
			this.context = context;
			this.selector = selector;
			
			//documentオブジェクト(new IJs.Selectors(doc)の前に処理を行うと無限ループになる)
			if(selector == doc) {
				this.el = [doc];
				return this;
			}
			
			context = context instanceof IJs.Selectors ? context : new IJs.Selectors(doc);
			
			//browser test
			var isStandard = doc.querySelectorAll,
			elArr = [];

			if(isStandard) {//standard
				context.each(function() {
					fn.concat(elArr, fn.obj2Array(this.querySelectorAll(selector)));
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
			
			this.el = elArr;
			return this;
		},
		
		//function内のthisはdom element,第１引数にindex番号
		each: function(func) {
			if(this.el) {
				for(var i=0,l=this.el.length; i<l; i++) {
					if(typeof func == 'function') func.call(this.el[i],i);
				}
			}
		},
		
		on: function(ev, listenerFunc) {
			if(this.el) {
				this.each(function(i) {
					fn.addEventListener(this, ev, listenerFunc);
				});
			}
		},
		
		off: function(ev, listenerFunc) {
			if(this.el) {
				this.each(function() {
					fn.removeEventListener(this, ev, listenerFunc);
				});
			}
		}
		
  }

	/**
	* ロード時実行するメソッド
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
		this.detectType = conf.deviceDetect;
		this.data = {};
		return this.init();
	}
	IJs.Device.prototype = {
		init: function() {
			switch(this.detectType) {
				case 'ua':
					this.data = this.getUa();
					break;
			}
		},
		
		getUa: function() {
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
		}
	}

	/**
	* window.iJs = new IJs() の際に1度だけ実行
	* 静的なデータをinitializeでwindow.iJsに追加
	*/
	IJs.prototype.initialize = function() {
		var deviceObj = new IJs.Device(IJs.conf);
		this.dev = deviceObj.data;
		
	}

	window.ij = ij;
	window.iJs = new IJs();

})();

//test
(function(){

  if(!window.console){
    window.console = {};
    window.console.log = function(c){
        return c;
    };
  }
	
  /**
  * selector
  */
  //id
  var _id_selector = ij('#hoge').el;
  _id_selector[0].style.color = '#00f';
	
  //class
  var _class_selector = ij('.hoge').el;
  for(var i = 0, l = _class_selector.length; i < l; i++) _class_selector[i].style.color = '#f00';
	
	//event
	ij('.hoge').on('click',clickConsole);
	//ij('.hoge').off('click',clickConsole);
	function clickConsole() {
		console.log('click');
	}
	ij('.hoge').each(function() {
		console.log(this);
	});

  //elemnt
  var _element_selector = ij('span').el;
  for(var i = 0, l = _element_selector.length; i < l; i++) _element_selector[i].style.color = '#390';
	
	//find
	var _find_selector = ij('.findOuter').find('.findInner').el;
	//var _find_selector = ij('.findInner', ij('.findOuter')).el;
	for(var i = 0, l = _find_selector.length; i < l; i++) _find_selector[i].style.color = 'pink';
	
	/**
	* browser
	*/
	ij('#lteIE6').find('strong').el[0].innerText = iJs.dev.lteIE6;
	ij('#lteIE7').find('strong').el[0].innerText = iJs.dev.lteIE7;
	ij('#lteIE8').find('strong').el[0].innerText = iJs.dev.lteIE8;
	ij('#IE').find('strong').el[0].innerText = iJs.dev.IE;
	ij('#Firefox').find('strong').el[0].innerText = iJs.dev.Firefox;
	ij('#Opera').find('strong').el[0].innerText = iJs.dev.Opera;
	ij('#Webkit').find('strong').el[0].innerText = iJs.dev.Webkit;
	ij('#Mobile').find('strong').el[0].innerText = iJs.dev.Mobile;
	
})();
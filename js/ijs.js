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
		concat: function(a,b) {
			return Array.prototype.push.apply(a,b);
		},
		obj2Array: function(a) {
			return Array.prototype.slice.call(a);
		}
	}

	var fn = new IJs.Functions();

	/**
	* セレクターエンジン
	* メソッドチェーンとして使用可能(return this;)
	*/
	IJs.Selectors = function(selector, context) {
		this.el = null;
		this.context = context;
		this.selector = selector;
		return this.find(this.selector, this.context);
	}
  IJs.Selectors.prototype = {
		
		find: function(selector, context) {
			//override context for method chain
			if(this.el) {
				context = this;
			}			
			//override properties
			this.context = context;
			this.selector = selector;
			
			context = context instanceof IJs.Selectors ? context.el : [doc];
			
			//browser test
			var isStandard = doc.querySelectorAll;
			var elArr = [];

			if(isStandard) {//standard
				for(var i=0,l=context.length; i<l; i++) fn.concat(elArr, fn.obj2Array(context[i].querySelectorAll(selector)));

			} else {//legacy
				if( /^#/.test(selector) ) {//id
					selector = selector.replace(/^#/, '');
					fn.concat(elArr, [doc.getElementById(selector)]);
					
				} else if( /^\./.test(selector) ) {//class
					for(var i=0,l=context.length; i<l; i++) {
						var all = context[i].getElementsByTagName('*'), arr = [];
						selector = selector.replace(/^\./, '');
						for (var i = 0, l = all.length; i < l; i++) {
							if (all[i].className === selector) {
								arr.push(all[i]);
							}
						}
						fn.concat(elArr, arr);
					}
					
				} else {//tagname
					for(var i=0,l=context.length; i<l; i++) fn.concat(elArr, context[i].getElementsByTagName(selector));

				}
			}
			
			this.el = elArr;
			return this;
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
if(!window.console){
		window.console = {};
		window.console.log = function(c){
						return c;
		};
}

/**
* memo:
* �EcreateElement
* �Eselector����
* �Eextend
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
  * ij�t�@���N�V���� ex.ij('selector');
  * window.ij = ij �Ƃ���ij�I�u�W�F�N�g�̊O���C���^�[�t�F�[�X�Ƃ���
  */
  var ij = function(selector, context){
    if(selector) {
        return new IJs.Selectors(selector, context);      
    }  else {
      return null;
    }
  }
  
  /**
  * IJs�I�u�W�F�N�g
  * window.iJs = new IJs(); �Ƃ��ĊO���C���^�[�t�F�[�X�Ƃ���
  */
  var IJs = function() {
    return this.initialize();
  }

  /**
  * �O������Q�Ƃ��郁�\�b�h
  * prototype��IJs�Ƌ��L����
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
    * addEventListener IE�⊮
    * @param {Object} el �v�f�m�[�h(Dom�I�u�W�F�N�g)
    * @param {String} ev �C�x���g��
    * @param {Function} listenerFunc �C�x���g���X�i�֐�
    * @return {void}
    */
    addEventListener: function(el, ev, listenerFunc) {
      if(el.addEventListener) { //IE�ȊO
        el.addEventListener(ev, listenerFunc, false);
      } else if(el.attachEvent) { //IE
        el.attachEvent('on' + ev, listenerFunc);
      } else {
        throw new Error('error: no event listener');
      }
    },
    
    /**
    * removeEventListener IE�⊮
    * @param {Object} el �v�f�m�[�h(Dom�I�u�W�F�N�g)
    * @param {String} ev �C�x���g��
    * @param {Function} listenerFunc �C�x���g���X�i�֐�
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
    * stopPropagation IE�⊮
    * @param {Object} e �C�x���g�I�u�W�F�N�g
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
    * preventDefault IE�⊮
    * @param {Object} e �C�x���g�I�u�W�F�N�g
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
    * �I�u�W�F�N�g��length�擾
    * @param {Object} length���擾�������I�u�W�F�N�g
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
  * �Z���N�^�[�G���W��
  * ���\�b�h�`�F�[���Ƃ��Ďg�p�\(return this;)
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
      
      //document�I�u�W�F�N�g(new IJs.Selectors(doc)�̑O�ɏ������s���Ɩ������[�v�ɂȂ�)
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
    
    //function����this��dom element,��P������index�ԍ�
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
  * ���[�h���Ɏ��s���郁�\�b�h
  * IJs.initialize���Ɏ��s
  */
  IJs.Onload = function(conf) {}
  IJs.Onload.prototype = {
  }

  /**
  * ���[�U�[���f�[�^�̎擾
  * IJs.initialize���Ɏ��s
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
				* UA����SP/PC/TB�̃f�o�C�X�^�C�v���擾
				* @return {Object: Boolean} {iphone, android, windowsphone, ipad, androidtab, pc}
				*/	
				getDeviceFromUa: function() {
						var userAgent = window.navigator.userAgent.toLowerCase();
						var deviceType = {
								iphone:							false,
        android: 					false,
        windowsphone: false,
        ipad:      			false,
								androidtab:			false,
								pc: 										false
						}
						
						if((userAgent.indexOf('iphone') > -1 && userAgent.indexOf('ipad') == -1) || userAgent.indexOf('ipod') > -1) {
							deviceType.iphone = true; //iPhone&iPod
						} else if(userAgent.indexOf('android') > -1 && userAgent.indexOf('mobile') > -1) {
							deviceType.android = true; //AndroidMobile(�ꕔ�̃^�u���b�g�^�A���h���C�h���܂�)
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
				* �E�C���h�E�T�C�Y����f�o�C�X�^�C�v(SP/PC/TB)���擾
				* @return {Object: Boolean} {mousePc, touchPc, mouseTb, touchTb, mouseSp, touchSp}
				*/
				getDeviveFromSize: function(breakPointSp, breakPointTb) {
						var browser = this.getDeviceFromUa(),
						width = window.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
						var deviceType = {
								mousePc:	false,
        touchPc: false,
        mouseTb: false,
        touchTb: false,
								mouseSp:	false,
								touchSp: false
						}
						
						if(!('ontouchstart' in window)) {
							if(typeof window.addEventListener == 'undefined' && typeof document.getElementsByClassName == 'undefined') {//mediaQuery�ɑΉ����Ă��Ȃ��u���E�U(lteIe8)�͏��O
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
				* UA����PC�̃u���E�U�^�C�v���擾
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
								ie6:					userAgent.indexOf('msie 6.') > -1,
								ie7:					userAgent.indexOf('msie 7.') > -1,
								ie8:					userAgent.indexOf('msie 8.') > -1,
								ie9:					userAgent.indexOf('msie 9.') > -1,
        firefox: userAgent.indexOf('firefox') > -1,
        opera:   userAgent.indexOf('opera') > -1,
        chrome:  userAgent.indexOf('chrome') > -1,
								safari:  userAgent.indexOf('safari') > -1
						}
				},
				
				/**
				* �@�\�e�X�g����u���E�U/�f�o�C�X�^�C�v���擾
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
  * window.iJs = new IJs() �̍ۂ�1�x�������s
  * �ÓI�ȃf�[�^��initialize��window.iJs�ɒǉ�
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
  ij('.hoge').each(function(index) {
    console.log(index);
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
  ij('#lteIE6').find('strong').el[0].innerText = iJs.browser.lteIe6;
  ij('#lteIE7').find('strong').el[0].innerText = iJs.browser.lteIe7;
  ij('#lteIE8').find('strong').el[0].innerText = iJs.browser.lteIe8;
  ij('#IE').find('strong').el[0].innerText = iJs.browser.ie;
  ij('#Firefox').find('strong').el[0].innerText = iJs.browser.firefox;
  ij('#Opera').find('strong').el[0].innerText = iJs.browser.opera;
  ij('#Webkit').find('strong').el[0].innerText = iJs.browser.webkit;
  ij('#Mobile').find('strong').el[0].innerText = iJs.browser.mobile;
  
})();
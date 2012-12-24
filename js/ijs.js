/**
* @fileOverview iJs JavaScript Library
* @name ijs.js
* @version 1.0.0 2012.12.23 Creating New File
* @namespace global namespace [iJs, ij]
*/
(function(){

  var doc = document;

  /**
  * ij�t�@���N�V���� ex.ij('selector');
  * window.ij = ij �Ƃ���ij�I�u�W�F�N�g�̊O���C���^�[�t�F�[�X�Ƃ���
  */
  var ij = function (selector, context){
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
  var IJs = function () {
    return this.initialize();
  }

  IJs.conf =  {
    deviceDetect: 'ua'
  };

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
  * ���[�h�����s���郁�\�b�h
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
  * window.iJs = new IJs() �̍ۂ�1�x�������s
  * �ÓI�ȃf�[�^��initialize��window.iJs�ɒǉ�
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
  ij('#lteIE6').find('strong').el[0].innerText = iJs.dev.lteIE6;
  ij('#lteIE7').find('strong').el[0].innerText = iJs.dev.lteIE7;
  ij('#lteIE8').find('strong').el[0].innerText = iJs.dev.lteIE8;
  ij('#IE').find('strong').el[0].innerText = iJs.dev.IE;
  ij('#Firefox').find('strong').el[0].innerText = iJs.dev.Firefox;
  ij('#Opera').find('strong').el[0].innerText = iJs.dev.Opera;
  ij('#Webkit').find('strong').el[0].innerText = iJs.dev.Webkit;
  ij('#Mobile').find('strong').el[0].innerText = iJs.dev.Mobile;
  
})();
(function($, win, doc, undefined){

	//声明命名空间
	$ = {};

	$.browser = (function(){
		/*@cc_on @if (@_jscript)
			return {msie: doc.documentMode || (/CSS1Compat/i.test(doc.compatMode) ? "XMLHttpRequest" in win ? 7 : 6 : 5)};
		@else @*/
			if(win.opera){
				return {opera: opera.version()};
			}else{
				function getVer(name){
				  try{
					return navigator.userAgent.match(new RegExp(name + "\\D*([\\d\\.]+)"))[1];
				  }catch(ex){}
				}
				if(win.WebKitPoint){
					return {
						webkit: getVer("WebKit") || true,
						safari: /^apple\s+/i.test(navigator.vendor) ? getVer("Version") || getVer("Safari") || true : undefined,
						chrome: win.chrome ? getVer("Chrome") || true : undefined,
						maxthon: win.external ? external.max_version : undefined
					};
				}else if(win.netscape){
					return {
						gecko: true,
						firefox: getVer("Firefox")
					};
				}
			}
			$.browser = {
				gecko: win.netscape && navigator.product == "Gecko" ? navigator.buildID : false,
				opera: win.opera ? opera.version() : false,
				webkit: !!win.webkit
			}
		/*@end @*/
	})();

	$.each = function( obj, fun ){
		if(obj.length >= 0 ){
			for( var i = 0; i< obj.length; i++ ){
				if(fun.call(obj[i], i) == false){
					return;
				}
			}
		}else{
			for( var key in obj ){
				if(fun.call(obj[key], key) == false){
					return;
				}
			}
		}
	}

	$.nameFix = {
		//IE使用，其他使用e.style.styleFloat
		//其他浏览器使用e.style.cssFloat
		"float": $.browser.msie < 9 ? "styleFloat" : "cssFloat"
	}

	if($.browser.msie < 8){
		$.nameFix = {
			"class": "className",
			"for": "htmlFor"
		};
	}else if($.browser.gecko){
		$.nameFix["mousewhee"] = "DOMMouseScroll";
		$.nameFix["innerText"] = "textContent";
	}

	$.attr = function(elm, name, val){
		name = $.nameFix[name] || name;
		if(val == undefined){
			return elm[name] || elm.getAttribute(name);
		}else{
			elm[name] = val;
			elm.setAttribute(name, val);
			return elm;
		}
	}

	$.getClass = function(elm){
		return $.attr(elm, "class") || "";
	}
	$.addClass = function(elm, name){
		return $.attr(elm, "class", $.getClass(elm) + " " + name );;
	}

	$.delClass = function(elm, name){
		return $.attr(elm, "class", $.getClass(elm).replace(new RegExp( "\\s*\\b" + name + "\\b", "g" ), ""));
	}

	$.findPos = function(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {x:curleft,y:curtop};
	}

	if (!doc.getElementsByClassName){
		//为document添加getElementsByClassName方法
		doc.getElementsByClassName = function(selector){
			return this.querySelectorAll( "." + selector );
		}
		//为Element的原型添加getElementsByClassName方法
		if(win.Element){
			Element.prototype.getElementsByClassName = doc.getElementsByClassName;
		}
	}

	
	
	document.realy = function(fun){
		if(/loaded|complete/.test(doc.readyState)){
			fun($);
		} else if($.browser.msie < 9){
			var timer = setInterval(function () {
				try {
					doc.body.doScroll('left');
					clearInterval(timer);
					fun($);
				} catch(exp) {};
			},0);
		} else {
			document.addEventListener("DOMContentLoaded", function(){fun($);}, false);
		}
	};
	win.gucong = $;

})(window.gucong, window, document);
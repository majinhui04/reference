var util = function () {

    // dom
    function addEvent(obj, sEv, fn) {
        if (obj.attachEvent) {
            obj.attachEvent('on' + sEv, function() {
                if (false == fn.call(obj)) {
                    event.cancelBubble = true;
                    return false;
                }
            });
        } else {
            obj.addEventListener(sEv, function(ev) {
                if (false == fn.call(obj)) {
                    ev.cancelBubble = true;
                    ev.preventDefault();
                }
            }, false);
        }
    }
    function getStyle(dom, attr) {
        if (dom.currentStyle) {
            return dom.currentStyle[attr]; //IE6\7\8
        } else {
            return getComputedStyle(dom, false)[attr];
        }
    }
    function hasClass(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    }

    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }


    function substitute(str, obj) {
        if (!(Object.prototype.toString.call(str) === '[object String]')) {
            return '';
        }
        // {}, new Object(), new Class()
        // Object.prototype.toString.call(node=document.getElementById("xx")) : ie678 == '[object Object]', other =='[object HTMLElement]'
        // 'isPrototypeOf' in node : ie678 === false , other === true
        if (!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
            return str;
        }
        //       /\{([^{}]+)\}/g
        return str.replace(/\{(.*?)\}/igm, function(match, key) {
            return obj[key] ? obj[key] : key;
        });
    }

    //生成指定范围的随机数
    function r(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    // 生成随机uuid guid();
    function guid() {
        var S4 = function(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    
    //最佳实践2：高频执行事件/方法的防抖
    // 取自 UnderscoreJS 实用框架  
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    // 添加resize的回调函数，但是只允许它每300毫秒执行一次  
    /* window.addEventListener('resize', debounce(function(event) {

        console.log('这里写resize过程 ') 

    }, 300));*/

    // format(new Date(1384931712000), 'yyyy-MM-dd hh:mm:ss')
    var format = function(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            //月份   
            "d+": date.getDate(),
            //日   
            "h+": date.getHours(),
            //小时   
            "m+": date.getMinutes(),
            //分   
            "s+": date.getSeconds(),
            //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3),
            //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    return {
        on:function (obj, type, handler) {
            var types = this.isArray(type) ? type : [type],
                k = types.length,
                d;
            if (!obj.addEventListener) {
                //绑定obj 为this
                d = function (evt) {
                    evt = evt || window.event;
                    var el = evt.srcElement;
                    return handler.call(el, evt);
                };
                handler._d = d;
            }
            if (k) while (k--) {
                type = types[k];
                if (obj.addEventListener) {
                    obj.addEventListener(type, handler, false);
                } else {
                    obj.attachEvent('on' + type, d);
                }
            }
            obj = null;
        },
        un:function (obj, type, handler) {
            var types = this.isArray(type) ? type : [type],
                k = types.length;
            if (k) while (k--) {
                type = types[k];
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, handler, false);
                } else {
                    obj.detachEvent('on' + type, handler._d || handler);
                }
            }
        },
        isEmpty:function (data) {
            return data.replace(/[ ]/g, "") != "" ? data : "无";
        },
        getEvent:function (event) {
            return event ? event : window.event;
        },
        getTarget:function (event) {
            return event.target || event.srcElement;
        },
        setInnerText:function (element, text) {
            if (typeof element.textContent == "string")
                element.textContent = text;
            else
                element.innerText = text;
        },
        $G:function (id) {
            return document.getElementById(id)
        },
        getFirstNode:function (ele) {
            return ele.firstChild.nodeType == 1 ? ele.firstChild : ele.firstElementChild;
        },
        getElementsByClassName:function (clsName) {
            var doc = document;
            if (!doc.getElementsByClassName) {
                var clsArr = [];
                var reg = new RegExp("\\b" + clsName + "\\b");
                var eleArr = doc.getElementsByTagName("*");
                for (var i = 0, eleobj; eleobj = eleArr[i++];) {
                    if (reg.test(eleobj.className))
                        clsArr.push(eleobj);
                }
                return clsArr;
            }
            else {
                return doc.getElementsByClassName(clsName);
            }
        },
        getCharCode:function (event) {
            return event.keyCode || event.which || event.charCode;
        },
        //IE6\7\8  ele.currentStyle
        getStyleValue:function(ele,attr){
            var doc=document;
            var style=ele.currentStyle||doc.defaultView.getComputedStyle(ele,null);
            return parseInt(style[attr].replace(/px/g,""));
        },
        getBrowerVersion:function(){
            var agent = navigator.userAgent.toLowerCase(),
                opera = window.opera,
                browser = {
                    ie		: !!window.ActiveXObject,
                    webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),
                    quirks : ( document.compatMode == 'BackCompat' ),
                    opera	: ( !!opera && opera.version )
                };
            if ( browser.ie ){
                browser.version = parseFloat( agent.match( /msie (\d+)/ )[1] );
            }
            browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );
            return browser;
        },
        isArray:function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        request:function (option) {
            var ajaxRequest = creatAjaxRequest();
            if (ajaxRequest == null) {
                alert("您的浏览器不支持AJAX！");
                return;
            }
            ajaxRequest.onreadystatechange = function () {
                if (ajaxRequest.readyState == 4) {
                    if (ajaxRequest.status >= 200 && ajaxRequest.status < 300 || ajaxRequest.status == 304) {
                        option.onSuccess(ajaxRequest.responseText);
                    }
                }
                else {
                    if (option.hasLoading)
                        util.$G(option.loading_Id).innerHTML = "<div class='hook_con'><img class='loading_pic' src='images/loading.gif'/></div>";
                }
            };
            ajaxRequest.open("post", option.url, true);
            ajaxRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajaxRequest.send(option.param);
        }
    };

    /**
     * 创建一个ajaxRequest对象
     */
    function creatAjaxRequest() {
        var xmlHttp = null;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                }
            }
        }
        return xmlHttp;
    }
}();
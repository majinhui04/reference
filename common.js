(function(){
	var imgLoad = function(url, callback, error) {
        var img = new Image();

        img.src = url;
        if (img.complete) {
            callback(img.width, img.height);
        } else {
            img.onload = function() {
                callback(img.width, img.height);
                img.onload = null;
            };
        };
        // 图片加载错误
        img.onerror = function() {
            error && error(url);
        };


    };
    function imgReady(url, success, error) {
        var width, height, intervalId, check, div,
            img = new Image(),
            body = document.body;

        img.src = url;

        // 从缓存中读取
        if (img.complete) {
            return success(img.width, img.height);
        }
        // 通过占位提前获取图片头部数据
        if (body) {
            div = document.createElement('div');
            div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:0px;height:0px;overflow:hidden';
            div.appendChild(img)
            body.appendChild(div);
            width = img.offsetWidth;
            height = img.offsetHeight;

            check = function() {
                if (img.offsetWidth !== width || img.offsetHeight !== height) {
                    clearInterval(intervalId);
                    success(img.offsetWidth, img.clientHeight);
                    img.onload = null;
                    div.innerHTML = '';
                    div.parentNode.removeChild(div);
                };
            };

            intervalId = setInterval(check, 150);
        }

        // 加载完毕后方式获取
        img.onload = function() {
            success(img.width, img.height);
            img.onload = img.onerror = null;
            clearInterval(intervalId);
            body && img.parentNode.removeChild(img);
        };

        // 图片加载错误
        img.onerror = function() {
            error && error();
            clearInterval(intervalId);
            body && img.parentNode.removeChild(img);
        };

    }

    //图片加载完成 
    function Imagess(url, callback) {
        var Browser = new Object();
        Browser.userAgent = window.navigator.userAgent.toLowerCase();
        Browser.ie = /msie/.test(Browser.userAgent);
        Browser.Moz = /gecko/.test(Browser.userAgent);

        var img = new Image();
        if (Browser.ie) {
            img.onreadystatechange = function() {
                if (img.readyState == "complete" || img.readyState == "loaded") {
                    callback();
                }
            }
        } else if (Browser.Moz) {
            img.onload = function() {
                if (img.complete == true) {
                    callback();
                }
            }
        }
        //如果因为网络或图片的原因发生异常，则显示该图片 
        img.onerror = function() {
            img.src = 'http://www.baidu.com/img/baidu_logo.gif'
        }
        img.src = url;
    }
    //合并数组
    function merge(left, right) {
        var result = [];
        while (left.length > 0 && right.length > 0) {
            if (left[0] < right[0]) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }
        return result.concat(left).concat(right);
    }

    function mergeSort(items) {
        if (items.length == 1) {
            return items;
        }
        var work = [];
        for (var i = 0, len = items.length; i < len; i++) {
            work.push([items[i]]);
        }
        work.push([]); //in case of odd number of items
        for (var lim = len; lim > 1; lim = (lim + 1) / 2) {
            for (var j = 0, k = 0; k < lim; j++, k += 2) {
                work[j] = merge(work[k], work[k + 1]);
            }
            work[j] = []; //in case of odd number of items
        }
        return work[0];
    }
    // 阶乘递归
    function factorial(n) {
        if (n == 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }

    //优化阶乘 使用缓存
    function memfactorial(n) {
        if (!memfactorial.cache) {
            memfactorial.cache = {
                "0": 1,
                "1": 1
            };
        }
        if (!memfactorial.cache.hasOwnProperty(n)) {
            memfactorial.cache[n] = n * memfactorial(n - 1);
        }
        return memfactorial.cache[n];
    }
    //通用
    function memoize(fundamental, cache) {
        cache = cache || {};
        var shell = function(arg) {
            if (!cache.hasOwnProperty(arg)) {
                cache[arg] = fundamental(arg);
            }
            return cache[arg];
        };
        return shell;
    }
    //memoize the factorial function
    //var memfactorial = memoize(factorial, { "0": 1, "1": 1 });
    //call the new function
    //var fact6 = memfactorial(6);

    //判断闰年
    function IsRunYear(year) {
        var monarr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //闰年的话
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            monarr[1] = "29";
            return true;
        }
        return false;
    }
    //克隆对象
    function clone(myObj) {
        if (typeof(myObj) != 'object') return myObj;
        if (myObj == null) return myObj;

        var myNewObj = new Object();
        for (var i in myObj) {
            myNewObj[i] = clone(myObj[i]);
        }

        return myNewObj;
    }

    //删除指定索引
    function arr_del(arr, index) {
        //var arr = ['a','b','c','d','e'];
        if (isNaN(index) || index < 0 || index > arr.length) {
            return arr;
        }

        //arr.splice(2,1);
        return arr.slice(0, index).concat(arr.slice(index + 1));
    }

    //删除指定内容
    function arr_del(arr, value) {
        var i = 0,
            len = arr.length,
            index = -1;

        for (; i < len; i++) {
            if (arr[i] === value) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
});
    
function state() {
    var e = arguments;
    changestate(LambdaTM.list2json(e))
}
function getUrlParam(e) {
    var n = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"), t = window.location.search.substr(1).match(n);
    return null != t ? unescape(t[2]) : null
}
var LambdaTM = {};
Util = {}, Util.cons = function(e, n) {
    var t = new LambdaTM.Cell;
    return t.car = e, t.cdr = n, t
}, LambdaTM.Symbol = function(e) {
    this.name = e
}, LambdaTM.getSymbol = function(e) {
    return "#t" == e ? !0 : "#f" == e ? !1 : (this.name = e, new LambdaTM.Symbol(e))
}, LambdaTM.EOFException = function() {
}, LambdaTM.SyntaxEx = function(e) {
    this.errorMessage = e
}, LambdaTM.Cell = function() {
    this.car = null, this.cdr = null
}, LambdaTM.StringReader = function(e) {
    var n = 0, t = e;
    return function() {
        return t.length == n ? 65535 : t.charAt(n++)
    }
}, LambdaTM.LambdaTMReader = function(e) {
    function n(e) {
        return " " == e || "\n" == e || "	" == e || "\r" == e
    }
    function t() {
        if (m === !1 && (m = e(), 65535 == m))
            throw new LambdaTM.EOFException;
        return m
    }
    function a() {
        var e = t();
        if (65535 == e)
            throw new LambdaTM.EOFException;
        return m = !1, e
    }
    function r() {
        for (var e = t(); n(e); )
            a(), e = t()
    }
    function o() {
        var e = "";
        try {
            for (var n = a(); '"' != n; )
                "\\" == n && (n = a(), "t" == n ? e += "	" : "n" == n ? e += "\n" : "r" == n ? e += "\r" : "b" == n ? e += "\b" : "f" == n && (e += "\f")), e += n, n = a()
        } catch (t) {
            if (t instanceof LambdaTM.EOFException)
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading string: ")
        }
        return e
    }
    function i(e) {
        return e >= "0" && "9" >= e ? !0 : !1
    }
    function c(e) {
        var n = e.charCodeAt(0);
        return "!" == e || n > 34 && 39 > n || n > 41 && 59 > n || n > 59 && 96 > n || n > 96 && 127 > n || e >= 128 && 65535 != e ? !0 : !1
    }
    function l() {
        for (var e, r = ""; ; )
            try {
                if (e = t(), n(e) || "(" == e || ")" == e || '"' == e || ";" == e)
                    return r;
                r += a()
            } catch (o) {
                if (o instanceof LambdaTM.EOFException)
                    return r
            }
    }
    function s(e) {
        return "#f" == e ? !1 : "#t" == e ? !0 : LambdaTM.getSymbol(e)
    }
    function d() {
        var e = new LambdaTM.Cell, n = e;
        try {
            for (; ; ) {
                var o = u();
                n.car = o, r();
                var i = t();
                if (")" == i) {
                    a();
                    break
                }
                if ("." == i) {
                    if (a(), n.cdr = u(), r(), i = t(), ")" != i)
                        throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ");
                    a();
                    break
                }
                var c = new LambdaTM.Cell;
                n.cdr = c, n = c
            }
        } catch (l) {
            if (l instanceof LambdaTM.EOFException)
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ")
        }
        return e
    }
    function u() {
        for (var e = a(); n(e) || ";" == e; ) {
            for (; n(e); )
                e = a();
            if (";" == e)
                for (; "\n" != e; )
                    e = a()
        }
        if (65535 == e)
            return null;
        if ("'" == e || "`" == e) {
            var m = u(), f = new LambdaTM.Cell, b = new LambdaTM.Cell;
            return f.car = LambdaTM.getSymbol("'" == e ? "quote" : "quasiquote"), f.cdr = b, b.car = m, b.cdr = null, f
        }
        if ("," == e) {
            var f = new LambdaTM.Cell, b = new LambdaTM.Cell;
            f.car = LambdaTM.getSymbol("unquote"), e = t(), "@" == e && (a(), f.car = LambdaTM.getSymbol("unquote-splicing"));
            var m = u();
            return f.cdr = b, b.car = m, b.cdr = null, f
        }
        if ("#" == e) {
            try {
                t()
            } catch (v) {
                if (!(v instanceof LambdaTM.EOFException))
                    throw v
            }
            var p = l();
            return s(e + p)
        }
        if ('"' == e)
            return o();
        if (i(e)) {
            var L = l(), p = e + L, T = parseFloat(p);
            if (T == 0 / 0)
                throw new LambdaTM.SyntaxEx("");
            return T
        }
        if ("+" == e || "-" == e) {
            var L = l();
            if ("" == L)
                return LambdaTM.getSymbol("" + e);
            var T = parseFloat(e + L);
            if (T == 0 / 0)
                throw new LambdaTM.SyntaxEx("");
            return T
        }
        if (c(e)) {
            var L = l();
            return LambdaTM.getSymbol(e + L)
        }
        if ("(" == e)
            return r(), e = t(), ")" == e ? (a(), null) : d();
        throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list char:" + e)
    }
    var e = e, m = !1;
    return u
}, LambdaTM.evalEx = function(e) {
    this.errorMessage = e
}, LambdaTM.calljsmacro = function(lisp) {
    if (lisp instanceof LambdaTM.Cell) {
        if (lisp.car instanceof LambdaTM.Symbol) {
            for (var f = eval(lisp.car.name), args = [], cell = lisp.cdr; null != cell && cell instanceof LambdaTM.Cell; )
                args.push(cell.car), cell = cell.cdr;
            return f.apply(window, args)
        }
        throw new LambdaTM.evalEx("eval error, not symbol function")
    }
    throw new LambdaTM.evalEx("eval error,not code")
}, LambdaTM.sexp2list = function(e) {
    for (var n = [], t = e; null != t && t instanceof LambdaTM.Cell; )
        n.push(t.car), t = t.cdr;
    return n
}, LambdaTM.Error = function(e, n) {
    return this.fatal = !0, this.car = e, this.cdr = n, this
}, LambdaTM.ERROR = {}, LambdaTM.ERROR.EnvironmentSymbol_EX = new LambdaTM.getSymbol("EnvironmentSymbol_EX"), LambdaTM.ERROR.Syntex_Ex = new LambdaTM.getSymbol("Syntex_Ex"), LambdaTM.Env = function(e) {
    return this.car = e || null, this.cdr = null, this.make = function(e, n) {
        return Util.cons(Util.cons(e, n), null)
    }, this.find = function(e) {
        if ("string" == typeof e)
            return this.find(LambdaTM.getSymbol(e));
        if (e instanceof LambdaTM.Symbol) {
            var n = null;
            for (n = this.cdr; null != n; ) {
                var t = n.car;
                if (e.name === t.car.name)
                    return t.cdr;
                n = n.cdr
            }
            return null != this.car ? this.car.find(e) : new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "find not symbol:" + e)
        }
    }, this.set = function(e, n) {
        if (e instanceof LambdaTM.Symbol) {
            for (var t = this.cdr; null != t; ) {
                var a = t.car;
                if (e === a.car)
                    return a.cdr = n, n;
                t = t.cdr
            }
            return null != this.car ? this.car.set(e, n) : new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "symbol:" + e + " value:" + n)
        }
    }, this.setLocal = function(e, n) {
        if ("string" == typeof e)
            return this.setLocal(LambdaTM.getSymbol(e), n);
        if (e instanceof LambdaTM.Symbol) {
            var t = this.cdr;
            for (null == t && (this.cdr = this.make(e, n)); null != t; ) {
                var a = t.car;
                if (e === a.car)
                    return a.cdr = n, n;
                if (null == t.cdr)
                    return t.cdr = this.make(e, n), n;
                t = t.cdr
            }
        }
        return n
    }, this
}, LambdaTM.TailRecursive = function() {
    this.closureenv = null, this.closurecode = null
}, LambdaTM.LispEval = {}, LambdaTM.LispEval.lisp_eval = function(e, n) {
    if (null != n) {
        if (n instanceof LambdaTM.Symbol)
            return e.find(n);
        if (n instanceof LambdaTM.Cell)
            return LambdaTM.LispEval.eval_list(e, n)
    }
    return n
}, LambdaTM.LispEval.eval_func_args = function(e, n) {
    if (null == n)
        return null;
    for (var t = new LambdaTM.Cell, a = t, r = n; ; ) {
        var o = LambdaTM.LispEval.lisp_eval(e, r.car);
        if (o instanceof LambdaTM.Error)
            return o;
        if (a.car = o, r = r.cdr, null == r)
            break;
        a.cdr = new LambdaTM.Cell, a = a.cdr
    }
    return t
}, LambdaTM.LispEval.defer_eval = function(e, n) {
    if (!(n instanceof LambdaTM.Cell))
        return lisp_eval(e, n);
    var t = new LambdaTM.TailRecursive;
    return t.closureenv = e, t.closurecode = n, t
}, LambdaTM.LispEval.eval_call = function(e, n) {
    if (null == n)
        return null;
    var t = LambdaTM.LispEval.lisp_eval(e, n.car);
    if (null == t)
        return n;
    var a = null;
    if (t instanceof LambdaTM.LambdaFunction) {
        var r = LambdaTM.LispEval.eval_func_args(e, n.cdr);
        return r instanceof LambdaTM.Error ? r : a = t.apply(e, r)
    }
    if (t instanceof LambdaTM.mprocedure) {
        var r = n.cdr;
        a = t.apply(e, r);
        var o = LambdaTM.LispEval.lisp_eval(e, a);
        return o
    }
    if (t instanceof LambdaTM.LambdaMacro) {
        var r = n.cdr;
        return a = t.apply(e, r)
    }
    return t instanceof LambdaTM.Error ? t : new LambdaTM.Error("EnvironmentSymbol_EX", "Invalid function call " + t)
}, LambdaTM.LispEval.run_function_body = function(e, n, t) {
    for (var a = null; null != n; n = n.cdr) {
        if (!(n instanceof LambdaTM.Cell))
            return new LambdaTM.Error(LambdaTM.ERROR.Syntex_Ex, " not list ");
        if (null == n.cdr && t)
            return LambdaTM.LispEval.defer_eval(e, n.car);
        if (a = LambdaTM.LispEval.lisp_eval(e, n.car), a instanceof LambdaTM.Error)
            return a
    }
    return a
}, LambdaTM.LispEval.eval_list = function(e, n) {
    for (var t = LambdaTM.LispEval.eval_call(e, n); null != t && t instanceof LambdaTM.TailRecursive; )
        e = t.closureenv, n = t.closurecode, t = LambdaTM.LispEval.eval_call(e, n);
    return t
}, LambdaTM.LambdaMacro = function() {
}, LambdaTM.LambdaFunction = function() {
}, LambdaTM.LambdaFunction.prototype = new LambdaTM.LambdaMacro, LambdaTM.mprocedure = function() {
    this.closurecode, this.closureenv
}, LambdaTM.mprocedure.prototype = new LambdaTM.LambdaFunction, Util.proxycall = function(e, n, t) {
    return e.apply(window, LambdaTM.sexp2list(Util.cons(n, t)))
}, LambdaTM.globalenv = new LambdaTM.Env, onmessage = function() {
    return this.apply = function(env, args) {
        if (args.cdr.car === window.tid) {
            var tag = args.cdr.cdr.car, f = eval(tag), as = LambdaTM.sexp2list(args.cdr.cdr.cdr);
            return f.apply(window, as)
        }
    }, this
}, onmessage.prototype = new LambdaTM.LambdaFunction, LambdaTM.globalenv.setLocal("onmessage", new onmessage), LambdaTM.list2json = function(e) {
    for (var n = {}, t = 0; t < e.length; ) {
        var a = e[t++], r = e[t++];
        n[a] = r
    }
    return n
};
var SEXP = {};
SEXP.parse = function(e) {
    var n = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(e))();
    return LambdaTM.sexp2list(n)
}, SEXP.exec = function(e) {
    var n = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(e))();
    return LambdaTM.LispEval.lisp_eval(LambdaTM.globalenv, n)
}, Array.prototype.toObj = function() {
    var e = {};
    if (this.length % 2 == 0) {
        for (var n = 0; n < this.length; n += 2)
            e[this[n]] = this[n + 1];
        return e
    }
};
var Toast = function(e) {
    this.context = null == e.context ? $("body") : e.context, this.message = e.message, this.time = null == e.time ? 3e3 : e.time, this.left = e.left, this.bottom = e.bottom, this.init()
}, msgEntity;
Toast.prototype = {init: function() {
        $("#toastMessage").remove();
        var e = new Array;
        e.push('<div id="toastMessage">'), e.push("<span>" + this.message + "</span>"), e.push("</div>"), msgEntity = $(e.join("")).appendTo(this.context);
        var n = null == this.left ? this.context.width() / 2 - msgEntity.find("span").width() / 2 : this.left, t = null == this.bottom ? "20px" : this.bottom;
        msgEntity.css({position: "fixed",bottom: t,"z-index": "99",left: n,"background-color": "#000000",color: "white","font-size": "14px",padding: "5px",margin: "0px","border-radius": "2px"}), msgEntity.hide()
    },show: function() {
        msgEntity.fadeIn(this.time / 2), msgEntity.fadeOut(this.time / 2)
    }}, 

    function(e, n) {
    "function" == typeof define && define.amd ? define([], n) : "undefined" != typeof module && module.exports ? module.exports = n() : e.ReconnectingWebSocket = n()
}(this, function() {
    function e(n, t, a) {
        function r(e, n) {
            var t = document.createEvent("CustomEvent");
            return t.initCustomEvent(e, !1, !1, n), t
        }
        var o = {debug: !1,automaticOpen: !0,reconnectInterval: 1e3,maxReconnectInterval: 3e4,reconnectDecay: 1.5,timeoutInterval: 2e3,maxReconnectAttempts: null};
        a || (a = {});
        for (var i in o)
            this[i] = "undefined" != typeof a[i] ? a[i] : o[i];
        this.url = n, this.reconnectAttempts = 0, this.readyState = WebSocket.CONNECTING, this.protocol = null;
        var c, l = this, s = !1, d = !1, u = document.createElement("div");
        u.addEventListener("open", function(e) {
            l.onopen(e)
        }), u.addEventListener("close", function(e) {
            l.onclose(e)
        }), u.addEventListener("connecting", function(e) {
            l.onconnecting(e)
        }), u.addEventListener("message", function(e) {
            l.onmessage(e)
        }), u.addEventListener("error", function(e) {
            l.onerror(e)
        }), this.addEventListener = u.addEventListener.bind(u), this.removeEventListener = u.removeEventListener.bind(u), this.dispatchEvent = u.dispatchEvent.bind(u), this.open = function(n) {
            if (c = new WebSocket(l.url, t || []), n) {
                if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts)
                    return
            } else
                u.dispatchEvent(r("connecting")), this.reconnectAttempts = 0;
            (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "attempt-connect", l.url);
            var a = c, o = setTimeout(function() {
                (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "connection-timeout", l.url), d = !0, a.close(), d = !1
            }, l.timeoutInterval);
            c.onopen = function(t) {
                clearTimeout(o), (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onopen", l.url), l.protocol = c.protocol, l.readyState = WebSocket.OPEN, l.reconnectAttempts = 0;
                var a = r("open");
                a.isReconnect = n, n = !1, u.dispatchEvent(a)
            }, 
            c.onclose = function(t) {
                if (clearTimeout(o), c = null, s)
                    l.readyState = WebSocket.CLOSED, u.dispatchEvent(r("close"));
                else {
                    l.readyState = WebSocket.CONNECTING;
                    var a = r("connecting");
                    a.code = t.code, a.reason = t.reason, a.wasClean = t.wasClean, u.dispatchEvent(a), n || d || ((l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onclose", l.url), u.dispatchEvent(r("close")));
                    var o = l.reconnectInterval * Math.pow(l.reconnectDecay, l.reconnectAttempts);
                    setTimeout(function() {
                        l.reconnectAttempts++, l.open(!0)
                    }, o > l.maxReconnectInterval ? l.maxReconnectInterval : o)
                }
            }, c.onmessage = function(n) {
                (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onmessage", l.url, n.data);
                var t = r("message");
                t.data = n.data, u.dispatchEvent(t)
            }, c.onerror = function(n) {
                (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onerror", l.url, n), u.dispatchEvent(r("error"))
            }
        }, 1 == this.automaticOpen && this.open(!1), this.send = function(n) {
            if (c)
                return (l.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "send", l.url, n), c.send(n);
            throw "INVALID_STATE_ERR : Pausing to reconnect websocket"
        }, this.close = function(e, n) {
            "undefined" == typeof e && (e = 1e3), s = !0, c && c.close(e, n)
        }, this.refresh = function() {
            c && c.close()
        }
    }
    if ("WebSocket" in window)
        return e.prototype.onopen = function(e) {
        }, e.prototype.onclose = function(e) {
        }, e.prototype.onconnecting = function(e) {
        }, e.prototype.onmessage = function(e) {
        }, e.prototype.onerror = function(e) {
        }, e.debugAll = !1, e.CONNECTING = WebSocket.CONNECTING, e.OPEN = WebSocket.OPEN, e.CLOSING = WebSocket.CLOSING, e.CLOSED = WebSocket.CLOSED, e
});


   
$("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});

var toast = new Toast({message: "指令已发送"}),
 tid = getUrlParam("tid"), host = getUrlParam("host") || "device.hekr.me", 
 token = getUrlParam("access_key"), 
 user = Math.floor(100 * Math.random()),
url = "ws://" + host + ":8080/websocket/t/" + user + "/code/" + token + "/user", 
ws = new ReconnectingWebSocket(url);
ws.onmessage = function(e) {
    console.debug("[WEBSOCKET] " + e.data), SEXP.exec(e.data)
}, ws.onerror = function() {
    console.error("[WEBSOCKET] connection error")
}, ws.onopen = function() {
     console.debug("[WEBSOCKET] connection opened"),
     setTimeout(function(){
         ws.send('(get-state "{tid}")'.replace("{tid}", tid));
     // ws.send('(@devcall "{tid}" (display (getall) cloud-port) (lambda (x) x))'.replace("{tid}",tid));
     },100)
    $.modal.close()
}, ws.onclose = function() {
    console.error("[WEBSOCKET] connection closed")
}, $(function() {
    $("#power").click(function(e) {
        var n = '(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.replace("{tid}", tid).replace("{args}", isPowerOn() ? 0 : 1);
        console.debug("[CODE] " + n), ws.send(n), toast.show()
         // ws.send('(@devcall "ESP_2M_1AFE349C3E7A" (controltimer 60 1) (lambda (x) x))')

    }), $("#timer").on("mouseup touchend", function(e) {
        clearKeep();
        var n = e.target.value;
        console.debug("[EVENT] slider value is " + n);
        var t = 3600 * n + " " + (isPowerOn() ? 0 : 1), 
        a = '(@devcall "{tid}" (begin (controlpower {args1})(controltimer {args2})) (lambda (x) x))'
        .replace("{tid}", tid)
        .replace("{args1}", isPowerOn() ? 1 : 0)
        .replace("{args2}", t);
        timerChange(n*3600), console.debug("[CODE] " + a), ws.send(a)
        resetKeep();
        
    }), $("#back").click(function(e) {
        console.debug("[EVENT] back button clicked"), window.close()
    })
   
      
});
var isPowerOn = function() {
    return !$("#power").hasClass("off")
}, powerOn = function() {
    $("#power").removeClass("off"), $("#powerState").text("开"), $("#timerState1").text("关闭"), $("#timerState2").text("关闭")
}, powerOff = function() {
    $("#power").addClass("off"), $("#powerState").text("关"), $("#timerState1").text("开启"), $("#timerState2").text("开启")
}, timerChange = function(e) {
    var h=Math.floor(e/3600),
     m=e>=3600?Math.floor((e%3600)/60):Math.floor(e/60);
    $("#timer").val(h), $("#time1").text(h), $("#time2").text(m),$("#time3").text(h), $("#time4").text(m)
};
window.changestate = function(e) {
    void 0 !== e.power && (0 == e.power ? powerOff() : powerOn()), void 0 !== e.timer && timerChange(e.timer)
};


    var keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);
function clearKeep(){
    clearInterval(keepconnecting);
}
function resetKeep(){
     keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);
}

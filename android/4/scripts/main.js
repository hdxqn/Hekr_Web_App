function state() {
    var e = arguments;
    changestate(LambdaTM.list2json(e))
}
function getUrlParam(e) {
    var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"), n = window.location.search.substr(1).match(t);
    return null != n ? unescape(n[2]) : null
}
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", n = t.length, a = "";
    for (i = 0; i < e; i++)
        a += t.charAt(Math.floor(Math.random() * n));
    return a
}
function toggle01(e) {
    return 0 === e ? 1 : 0
}
function toggle12(e) {
    return 2 === e ? 1 : 2
}
function toggle23(e) {
    return 2 === e ? 3 : 2
}
function setPowerState(e) {
     if(3 == e){
        e = 2,
        $("#funcPower").data("power",e), 
        $("#funcPower")[2 == e ? "removeClass" : "addClass"]("off"), 
        $("#funcMode")[2 == e ? "removeClass" : "addClass"]("off"),
         $("#funcMode").off("click", onFuncMode), 
        $("#funcMode")[2 == e ? "on" : "off"]("click", onFuncMode)
    }else if(e==1){
        e=0,
         $("#funcPower").data("power",e), 
        $("#funcPower")[2 == e ? "removeClass" : "addClass"]("off"), 
        $("#funcMode")[2 == e ? "removeClass" : "addClass"]("off"),
         $("#funcMode").off("click", onFuncMode), 
        $("#funcMode")[2 == e ? "on" : "off"]("click", onFuncMode)
    }else if(e==2){
        e=2,
         $("#funcPower").data("power",e), 
        $("#funcPower")[2 == e ? "removeClass" : "addClass"]("off"), 
        $("#funcMode")[2 == e ? "removeClass" : "addClass"]("off"),
         $("#funcMode").off("click", onFuncMode), 
        $("#funcMode")[2 == e ? "on" : "off"]("click", onFuncMode)
    }
}
function setModeState(e) {
    $("#stateMode").text(getModeText(e)), $("#funcMode").data("mode", e), $("#hcPanel")[3 == e ? "slideDown" : "slideUp"](1e3)
}
function setWCState(e) {
    $("#stateWC").text(getSpeedText(e)), $("#funcWC").data("wc", e)
}
function setUVState(e) {
    $("#stateUV").text(getUVText(e)), $("#funcUV").data("uv", e), $("#funcUV")[1 == e ? "removeClass" : "addClass"]("off")
}
function setHControlState(e, t) {
    $("#funcH").val(e);
    $("#toHumidity").text(e)
}
function setHumidityState(e) {
    $("#stateHumidity").text(e)
}
function setWState(e) {
    $("#stateWState").text(getWaterText(e))
}
function setTemperatureState(e) {
    $("#stateTemperature").text(e)
}
function setTimerState(e, t) {
    $("#timers>button").addClass("off");
    var n = $($("#timers>button")[e - 2]);
    n.removeClass("off"), 
    $("#funcTime").val(t),
     $("#timers").data("mode", e), 
     $("#timerLabel").text(getTimerLabel(e, t)),
      1 == e ? $("#cancleButton").hide() : $("#cancleButton").show()
}
var LambdaTM = {};
Util = {}, Util.cons = function(e, t) {
    var n = new LambdaTM.Cell;
    return n.car = e, n.cdr = t, n
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
    var t = 0, n = e;
    return function() {
        return n.length == t ? 65535 : n.charAt(t++)
    }
}, LambdaTM.LambdaTMReader = function(e) {
    function t(e) {
        return " " == e || "\n" == e || "	" == e || "\r" == e
    }
    function n() {
        if (m === !1 && (m = e(), 65535 == m))
            throw new LambdaTM.EOFException;
        return m
    }
    function a() {
        var e = n();
        if (65535 == e)
            throw new LambdaTM.EOFException;
        return m = !1, e
    }
    function r() {
        for (var e = n(); t(e); )
            a(), e = n()
    }
    function o() {
        var e = "";
        try {
            for (var t = a(); '"' != t; )
                "\\" == t && (t = a(), "t" == t ? e += "	" : "n" == t ? e += "\n" : "r" == t ? e += "\r" : "b" == t ? e += "\b" : "f" == t && (e += "\f")), e += t, t = a()
        } catch (n) {
            if (n instanceof LambdaTM.EOFException)
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading string: ")
        }
        return e
    }
    function i(e) {
        return e >= "0" && "9" >= e ? !0 : !1
    }
    function c(e) {
        var t = e.charCodeAt(0);
        return "!" == e || t > 34 && 39 > t || t > 41 && 59 > t || t > 59 && 96 > t || t > 96 && 127 > t || e >= 128 && 65535 != e ? !0 : !1
    }
    function s() {
        for (var e, r = ""; ; )
            try {
                if (e = n(), t(e) || "(" == e || ")" == e || '"' == e || ";" == e)
                    return r;
                r += a()
            } catch (o) {
                if (o instanceof LambdaTM.EOFException)
                    return r
            }
    }
    function l(e) {
        return "#f" == e ? !1 : "#t" == e ? !0 : LambdaTM.getSymbol(e)
    }
    function d() {
        var e = new LambdaTM.Cell, t = e;
        try {
            for (; ; ) {
                var o = u();
                t.car = o, r();
                var i = n();
                if (")" == i) {
                    a();
                    break
                }
                if ("." == i) {
                    if (a(), t.cdr = u(), r(), i = n(), ")" != i)
                        throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ");
                    a();
                    break
                }
                var c = new LambdaTM.Cell;
                t.cdr = c, t = c
            }
        } catch (s) {
            if (s instanceof LambdaTM.EOFException)
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ")
        }
        return e
    }
    function u() {
        for (var e = a(); t(e) || ";" == e; ) {
            for (; t(e); )
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
            f.car = LambdaTM.getSymbol("unquote"), e = n(), "@" == e && (a(), f.car = LambdaTM.getSymbol("unquote-splicing"));
            var m = u();
            return f.cdr = b, b.car = m, b.cdr = null, f
        }
        if ("#" == e) {
            try {
                n()
            } catch (v) {
                if (!(v instanceof LambdaTM.EOFException))
                    throw v
            }
            var g = s();
            return l(e + g)
        }
        if ('"' == e)
            return o();
        if (i(e)) {
            var p = s(), g = e + p, L = parseFloat(g);
            if (L == 0 / 0)
                throw new LambdaTM.SyntaxEx("");
            return L
        }
        if ("+" == e || "-" == e) {
            var p = s();
            if ("" == p)
                return LambdaTM.getSymbol("" + e);
            var L = parseFloat(e + p);
            if (L == 0 / 0)
                throw new LambdaTM.SyntaxEx("");
            return L
        }
        if (c(e)) {
            var p = s();
            return LambdaTM.getSymbol(e + p)
        }
        if ("(" == e)
            return r(), e = n(), ")" == e ? (a(), null) : d();
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
    for (var t = [], n = e; null != n && n instanceof LambdaTM.Cell; )
        t.push(n.car), n = n.cdr;
    return t
}, LambdaTM.Error = function(e, t) {
    return this.fatal = !0, this.car = e, this.cdr = t, this
}, LambdaTM.ERROR = {}, LambdaTM.ERROR.EnvironmentSymbol_EX = new LambdaTM.getSymbol("EnvironmentSymbol_EX"), LambdaTM.ERROR.Syntex_Ex = new LambdaTM.getSymbol("Syntex_Ex"), LambdaTM.Env = function(e) {
    return this.car = e || null, this.cdr = null, this.make = function(e, t) {
        return Util.cons(Util.cons(e, t), null)
    }, this.find = function(e) {
        if ("string" == typeof e)
            return this.find(LambdaTM.getSymbol(e));
        if (e instanceof LambdaTM.Symbol) {
            var t = null;
            for (t = this.cdr; null != t; ) {
                var n = t.car;
                if (e.name === n.car.name)
                    return n.cdr;
                t = t.cdr
            }
            return null != this.car ? this.car.find(e) : new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "find not symbol:" + e)
        }
    }, this.set = function(e, t) {
        if (e instanceof LambdaTM.Symbol) {
            for (var n = this.cdr; null != n; ) {
                var a = n.car;
                if (e === a.car)
                    return a.cdr = t, t;
                n = n.cdr
            }
            return null != this.car ? this.car.set(e, t) : new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "symbol:" + e + " value:" + t)
        }
    }, this.setLocal = function(e, t) {
        if ("string" == typeof e)
            return this.setLocal(LambdaTM.getSymbol(e), t);
        if (e instanceof LambdaTM.Symbol) {
            var n = this.cdr;
            for (null == n && (this.cdr = this.make(e, t)); null != n; ) {
                var a = n.car;
                if (e === a.car)
                    return a.cdr = t, t;
                if (null == n.cdr)
                    return n.cdr = this.make(e, t), t;
                n = n.cdr
            }
        }
        return t
    }, this
}, LambdaTM.TailRecursive = function() {
    this.closureenv = null, this.closurecode = null
}, LambdaTM.LispEval = {}, LambdaTM.LispEval.lisp_eval = function(e, t) {
    if (null != t) {
        if (t instanceof LambdaTM.Symbol)
            return e.find(t);
        if (t instanceof LambdaTM.Cell)
            return LambdaTM.LispEval.eval_list(e, t)
    }
    return t
}, LambdaTM.LispEval.eval_func_args = function(e, t) {
    if (null == t)
        return null;
    for (var n = new LambdaTM.Cell, a = n, r = t; ; ) {
        var o = LambdaTM.LispEval.lisp_eval(e, r.car);
        if (o instanceof LambdaTM.Error)
            return o;
        if (a.car = o, r = r.cdr, null == r)
            break;
        a.cdr = new LambdaTM.Cell, a = a.cdr
    }
    return n
}, LambdaTM.LispEval.defer_eval = function(e, t) {
    if (!(t instanceof LambdaTM.Cell))
        return lisp_eval(e, t);
    var n = new LambdaTM.TailRecursive;
    return n.closureenv = e, n.closurecode = t, n
}, LambdaTM.LispEval.eval_call = function(e, t) {
    if (null == t)
        return null;
    var n = LambdaTM.LispEval.lisp_eval(e, t.car);
    if (null == n)
        return t;
    var a = null;
    if (n instanceof LambdaTM.LambdaFunction) {
        var r = LambdaTM.LispEval.eval_func_args(e, t.cdr);
        return r instanceof LambdaTM.Error ? r : a = n.apply(e, r)
    }
    if (n instanceof LambdaTM.mprocedure) {
        var r = t.cdr;
        a = n.apply(e, r);
        var o = LambdaTM.LispEval.lisp_eval(e, a);
        return o
    }
    if (n instanceof LambdaTM.LambdaMacro) {
        var r = t.cdr;
        return a = n.apply(e, r)
    }
    return n instanceof LambdaTM.Error ? n : new LambdaTM.Error("EnvironmentSymbol_EX", "Invalid function call " + n)
}, LambdaTM.LispEval.run_function_body = function(e, t, n) {
    for (var a = null; null != t; t = t.cdr) {
        if (!(t instanceof LambdaTM.Cell))
            return new LambdaTM.Error(LambdaTM.ERROR.Syntex_Ex, " not list ");
        if (null == t.cdr && n)
            return LambdaTM.LispEval.defer_eval(e, t.car);
        if (a = LambdaTM.LispEval.lisp_eval(e, t.car), a instanceof LambdaTM.Error)
            return a
    }
    return a
}, LambdaTM.LispEval.eval_list = function(e, t) {
    for (var n = LambdaTM.LispEval.eval_call(e, t); null != n && n instanceof LambdaTM.TailRecursive; )
        e = n.closureenv, t = n.closurecode, n = LambdaTM.LispEval.eval_call(e, t);
    return n
}, LambdaTM.LambdaMacro = function() {
}, LambdaTM.LambdaFunction = function() {
}, LambdaTM.LambdaFunction.prototype = new LambdaTM.LambdaMacro, LambdaTM.mprocedure = function() {
    this.closurecode, this.closureenv
}, LambdaTM.mprocedure.prototype = new LambdaTM.LambdaFunction, Util.proxycall = function(e, t, n) {
    return e.apply(window, LambdaTM.sexp2list(Util.cons(t, n)))
}, LambdaTM.globalenv = new LambdaTM.Env, onmessage = function() {
    return this.apply = function(env, args) {
        if (args.cdr.car === window.tid) {
            var tag = args.cdr.cdr.car, f = eval(tag), as = LambdaTM.sexp2list(args.cdr.cdr.cdr);
            return f.apply(window, as)
        }
    }, this
}, onmessage.prototype = new LambdaTM.LambdaFunction, LambdaTM.globalenv.setLocal("onmessage", new onmessage), LambdaTM.list2json = function(e) {
    for (var t = {}, n = 0; n < e.length; ) {
        var a = e[n++], r = e[n++];
        t[a] = r
    }
    return t
};
var SEXP = {};
SEXP.parse = function(e) {
    var t = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(e))();
    return LambdaTM.sexp2list(t)
}, SEXP.exec = function(e) {
    var t = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(e))();
    return LambdaTM.LispEval.lisp_eval(LambdaTM.globalenv, t)
}, Array.prototype.toObj = function() {
    var e = {};
    if (this.length % 2 == 0) {
        for (var t = 0; t < this.length; t += 2)
            e[this[t]] = this[t + 1];
        return e
    }
}, function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof module && module.exports ? module.exports = t() : e.ReconnectingWebSocket = t()
}(this, function() {
    function e(t, n, a) {
        function r(e, t) {
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(e, !1, !1, t), n
        }
        var o = {debug: !1,automaticOpen: !0,reconnectInterval: 1e3,maxReconnectInterval: 3e4,reconnectDecay: 1.5,timeoutInterval: 2e3,maxReconnectAttempts: null};
        a || (a = {});
        for (var i in o)
            this[i] = "undefined" != typeof a[i] ? a[i] : o[i];
        this.url = t, this.reconnectAttempts = 0, this.ready = WebSocket.CONNECTING, this.protocol = null;
        var c, s = this, l = !1, d = !1, u = document.createElement("div");
        u.addEventListener("open", function(e) {
            s.onopen(e)
        }), u.addEventListener("close", function(e) {
            s.onclose(e)
        }), u.addEventListener("connecting", function(e) {
            s.onconnecting(e)
        }), u.addEventListener("message", function(e) {
            s.onmessage(e)
        }), u.addEventListener("error", function(e) {
            s.onerror(e)
        }), this.addEventListener = u.addEventListener.bind(u), this.removeEventListener = u.removeEventListener.bind(u), this.dispatchEvent = u.dispatchEvent.bind(u), this.open = function(t) {
            if (c = new WebSocket(s.url, n || []), t) {
                if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts)
                    return
            } else
                u.dispatchEvent(r("connecting")), this.reconnectAttempts = 0;
            (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "attempt-connect", s.url);
            var a = c, o = setTimeout(function() {
                (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "connection-timeout", s.url), d = !0, a.close(), d = !1
            }, s.timeoutInterval);
            c.onopen = function(n) {
                clearTimeout(o), 
                (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onopen", s.url), 
                s.protocol = c.protocol, 
                s.readyState = WebSocket.OPEN,
                 s.reconnectAttempts = 0;
                var a = r("open");
                a.isReconnect = t, t = !1, u.dispatchEvent(a)
            }, c.onclose = function(n) {
                if (clearTimeout(o), c = null, l)
                    s.readyState = WebSocket.CLOSED, u.dispatchEvent(r("close"));
                else {
                    s.readyState = WebSocket.CONNECTING;
                    var a = r("connecting");
                    a.code = n.code, a.reason = n.reason, a.wasClean = n.wasClean, u.dispatchEvent(a), t || d || ((s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onclose", s.url), u.dispatchEvent(r("close")));
                    var o = s.reconnectInterval * Math.pow(s.reconnectDecay, s.reconnectAttempts);
                    setTimeout(function() {
                        s.reconnectAttempts++, s.open(!0)
                    }, o > s.maxReconnectInterval ? s.maxReconnectInterval : o)
                }
            }, c.onmessage = function(t) {
                (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onmessage", s.url, t.data);
                var n = r("message");
                n.data = t.data, u.dispatchEvent(n)
            }, c.onerror = function(t) {
                (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "onerror", s.url, t), u.dispatchEvent(r("error"))
            }
        }, 1 == this.automaticOpen && this.open(!1), this.send = function(t) {
            if (c)
                return (s.debug || e.debugAll) && console.debug("ReconnectingWebSocket", "send", s.url, t), c.send(t);
            throw "INVALID_STATE_ERR : Pausing to reconnect websocket"
        }, this.close = function(e, t) {
            "undefined" == typeof e && (e = 1e3), l = !0, c && c.close(e, t)
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
var Toast = function(e) {
    this.context = null == e.context ? $("body") : e.context, this.message = e.message, this.time = null == e.time ? 3e3 : e.time, this.left = e.left, this.bottom = e.bottom, this.init()
}, msgEntity;
Toast.prototype = {init: function() {
        $("#toastMessage").remove();
        var e = new Array;
        e.push('<div id="toastMessage">'), e.push("<span>" + this.message + "</span>"), e.push("</div>"), msgEntity = $(e.join("")).appendTo(this.context);
        var t = null == this.left ? this.context.width() / 2 - msgEntity.find("span").width() / 2 : this.left, n = null == this.bottom ? "20px" : this.bottom;
        msgEntity.css({position: "fixed",bottom: n,"z-index": "99",left: t,"background-color": "#000000",color: "white","font-size": "14px",padding: "5px",margin: "0px","border-radius": "2px"}), msgEntity.hide()
    },
    show: function() {
            msgEntity.stop(true);
            msgEntity.fadeIn(this.time / 2);
            msgEntity.fadeOut(this.time / 2) ;  
        
       
    }}, String.prototype.format = function(e) {
    if (arguments.length > 0) {
        var t = this;
        if (1 == arguments.length && "object" == typeof e)
            for (var n in e) {
                var a = new RegExp("({" + n + "})", "g");
                t = t.replace(a, e[n])
            }
        else
            for (var r = 0; r < arguments.length; r++) {
                if (void 0 == arguments[r])
                    return "";
                var a = new RegExp("({[" + r + "]})", "g");
                t = t.replace(a, arguments[r])
            }
        return t
    }
    return this
};
var tid = getUrlParam("tid"),
 host = getUrlParam("host") || "device.hekr.me", 
 token = getUrlParam("access_key"), 
 user = getUrlParam("user") || randomString(10),
  url = "ws://{host}:8080/websocket/t/{user}/code/{token}/user".format({host: host,user: user,token: token}), 
  ws = new ReconnectingWebSocket(url);
ws.onmessage = function(e) {
    console.debug("[RESULT] " + e.data), SEXP.exec(e.data)
}, ws.onerror = function() {
    console.error("[ERROR]")
}, ws.onopen = function() {
    console.debug("[CONNECTED]"), ws.send('(get-state "{tid}")'.format({tid: tid})), 
     $.modal.close()
}, ws.onclose = function() {
    console.error("[CLOSED]")
}, $(function() {
    i18n.init({detectLngQS: "lang",fallbackLng: "en"}, function(e) {
        $(document).i18n();
        var t = new Toast({message: e("toast.message")});
        // p=new Toast({message: e("toast.equiment-off-line")});
        $("#back").click(function(e) {
            console.debug("[EVENT] back button clicked"), window.close()
        }), $("#funcPower").click(function(e) {
            if(($('#funcMode').data('mode')!=1)&&($('#funcUV').data('uv')==1)){
              var n = '(@devcall "{tid}" (control 1 255 0 255 255 255)(lambda (x) x))'.replace("{tid}", tid);
                console.debug("[CODE] " + n); ws.send(n); t.show();
                return;
            };
            if(($('#funcPower').data('power')==0)&&($('#funcUV').data('uv')==1)){
               var n = '(@devcall "{tid}" (control 2 255 255 255 1 2)(lambda (x) x))'.replace("{tid}", tid);
                console.debug("[CODE] " + n); ws.send(n); t.show();
                return;
            };
            var n = '(@devcall "{tid}" (controlModel {args}) (lambda (x) x))'.replace("{tid}", tid),
             a = $(this).data("power"), r = toggle12(a),
              o = n.replace("{args}", r);
            console.debug("[CODE] " + o); ws.send(o); t.show();
            

        }), window.onFuncMode = function() {
            var e = '(@devcall "{tid}" (controlModel {args}) (lambda (x) x))'.replace("{tid}", tid), 
            n = $("#funcMode").data("mode"), 
            a = toggle23(n),
             r = e.replace("{args}", a);
            console.debug("[CODE] " + r), 
            ws.send(r), t.show()
        }, $("#funcWC").click(function(e) {

            if($('#funcPower').data('power')==2||$('#funcUV').data('uv')==1){
                 var n = '(@devcall "{tid}" (controlWC {args}) (lambda (x) x))'.replace("{tid}", tid), 
                 a = 1 === parseInt($(this).data("wc")) ? 2 : 1,
                  r = n.replace("{args}", a);
            console.debug("[CODE] " + r), ws.send(r), t.show()
            }
           
            
        }), $("#funcUV").click(function(e) {
            var n = '(@devcall "{tid}" (controlUV {args}) (lambda (x) x))'.replace("{tid}", tid),
             a = 1 == parseInt($(this).data("uv")) ? 0 : 1,
              r = n.replace("{args}", a);
            console.debug("[CODE] " + r), ws.send(r), t.show()
        }),
         $("#funcH").bind('touchmove',function(){
            $('#toHumidity').text($(this).val());
        }),  
         $("#funcH").bind('touchend',function(){
            $('#toHumidity').text('- -');
        }),
       
         $("#funcH").change(function(e) {
            var n = '(@devcall "{tid}" (controlH {args}) (lambda (x) x))'.replace("{tid}", tid),
             a = n.replace("{args}", e.target.value);
            console.debug("[CODE] " + a),
             ws.send(a), t.show(); 
        }), $("#funcTime").change(function(e) {
            var n = '(@devcall "{tid}" (controlSetTime {args}) (lambda (x) x))'.replace("{tid}", tid), 
            a = $("#timers").data("mode"), 
            r = $("#funcTime").val(),
             o = a + " " + r, 
             i = n.replace("{args}", o);
            console.debug("[CODE] " + i), ws.send(i),
             t.show(), 
             $("#timerLabel").text(getTimerLabel(a, r))
        }), $("#timers>button").click(function(e) {
            var m = $("#timers>button").index(this) + 2, 
            n = $("#funcTime").val();
           if(timerModeSwitchable(m)){
                $("#timers>button").addClass("off"), 
                $(this).removeClass("off"), 
                $("#timers").data("mode", m),
                 $("#timerLabel").text(getTimerLabel(m, n)),
                 e = '(@devcall "{tid}" (controlSetTime args 2) (lambda (x) x))'.replace("{tid}", tid),
                i=e.replace("args",m),
                console.debug("[CODE] " + i), 
                ws.send(i),
                 t.show()
           }   
                 
        }), $("#cancleButton").click(function() {
            var e = '(@devcall "{tid}" (controlSetTime 1 0) (lambda (x) x))'.replace("{tid}", tid);
            console.debug("[CODE] " + e), ws.send(e), t.show()
        }), $("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1}),
         window.getTimerLabel = function(t, n) {
            switch (t) {
                case 1:
                    return e("panel.timerLabel.cancle");
                    break;
                case 2:
                    return e("panel.timerLabel.on", {hour: n});
                    break;
                case 3:
                    return e("panel.timerLabel.uvOn", {hour: n});
                    break;
                case 4:
                    return e("panel.timerLabel.off", {hour: n});
                    break;
                    default: break;
            }
        }, window.getSpeedText = function(t) {
            return e(2 == t ? "status.speed.high" : "status.speed.low")
        }, window.getModeText = function(t) {
            return e(1 == t ? "status.mode.off" : 2 == t ? "status.mode.dryClothes" : "status.mode.dehumidifying")
        }, window.getUVText = function(t) {
            return e(1 == t ? "status.uv.on" : "status.uv.off")
        }, window.getWaterText = function(t) {
            return e(1 == t ? "status.water.full" : "status.water.notFull")
        }, window.timerModeSwitchable = function(e) {
            var t = 2 == $("#funcPower").data("power"),
             n = !t, 
             a = 0 == $("#funcUV").data("uv"),
             b=!a;
            switch (e) {
                case 2:
                    return n&&a;
                    break;
                case 3:
                    return a&&n;
                    break;
                case 4:
                    return t||b;
                    break;
                default:
                    return !1
                    break;
            }
        }
    })
}), window.changestate = function(e) {
    console.debug("[STATE] ================"),
     console.debug(e), console.debug("[STATE] ================"), 
     setPowerState(e.model),
     setModeState(e.model), 
     setWCState(e.wc),
     setUVState(e.uv),
     setHControlState(e.hcontrol, e.model), 
     setHumidityState(e.humidity),
    setWState(e.wstate),
     setTemperatureState(e.temperature),
      setTimerState(e.timem, e.time)
};

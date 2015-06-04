var LambdaTM = {};
Util = {};
Util.cons = function(a, b) {
    var p = new LambdaTM.Cell();
    p.car = a;
    p.cdr = b;
    return p;
}
LambdaTM.Symbol = function(s) {
    this.name = s;
}
LambdaTM.getSymbol = function(s) {
    if ("#t" == s) {
        return true;
    } else if ("#f" == s) {
        return false;
    } else {
        this.name = s;
        return new LambdaTM.Symbol(s);
    }
}
LambdaTM.EOFException = function() {}
LambdaTM.SyntaxEx = function(str) {
    this.errorMessage = str;
}
LambdaTM.Cell = function() {
    this.car = null;
    this.cdr = null;
}
LambdaTM.StringReader = function(str) {
    var i = 0;
    var s = str;
    return function() {
        if (s.length == i) {
            return 65535;
        } else {
            return s.charAt(i++);
        }
    }
}
LambdaTM.LambdaTMReader = function(r) {
    //public LambdaTMReader(java.io.Reader isr) {
    var r = r;
    //}
    var last_char = false;

    function is_space(c) {
        return c == ' ' || c == '\n' || c == '\t' || c == '\r';
    }

    function peek_char() {
        if (last_char === false) {
            last_char = r();
            if (last_char == 65535) {
                throw new LambdaTM.EOFException();
            }
        }
        return last_char;
    }

    function get_char() {
        var c = peek_char();
        if (c == 65535) {
            throw new LambdaTM.EOFException();
        }
        last_char = false;
        return c;
    }

    function eat_space() {
        var c = peek_char();
        while (is_space(c)) {
            get_char();
            c = peek_char();
        }
    }

    function read_string() {
        var sb = '';

        try {
            var c = get_char();
            while (c != '"') {
                if (c == '\\') {
                    c = get_char();
                    if (c == 't') {
                        sb += '\t';
                    } else if (c == 'n') {
                        sb += '\n';
                    } else if (c == 'r') {
                        sb += '\r';
                    } else if (c == 'b') {
                        sb += '\b';
                    } else if (c == 'f') {
                        sb += '\f';
                    }
                }
                sb += c;
                c = get_char();
            }
        } catch (ee) {
            if (ee instanceof LambdaTM.EOFException) {
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading string: ");
            }
        }
        return sb;
    }

    function is_number(c) {
        return (c >= '0' && c <= '9') ? true : false;
    }

    function is_symbol(c) { // not ( ) ' " `
        var n = c.charCodeAt(0);
        //return (c == '!' || (c > 34 && c < 39) || (c > 41 && c < 59) || (c > 59 && c < 96) || (c > 96 && c < 127)) ? true : false;
        return (c == '!' || (n > 34 && n < 39) || (n > 41 && n < 59) || (n > 59 && n < 96) || (n > 96 && n < 127) || (c >= 128 && c != 65535)) ? true : false;
    }

    function read_till_delimiter() {
        var c;
        var sb = '';
        while (true) {
            try {
                c = peek_char();
                if (is_space(c) || c == '(' || c == ')' || c == '"' || c == ';') {
                    return sb;
                } else {
                    sb += get_char();
                }
            } catch (eof) {
                if (eof instanceof LambdaTM.EOFException) {
                    return sb;
                }
            }
        }
    }

    function hashtag(token) {
        if ("#f" == token) {
            return false;
        } else if ("#t" == token) {
            return true;
        } else {
            return LambdaTM.getSymbol(token);
        }
    }

    function read_list() {
        var pair = new LambdaTM.Cell();
        var p = pair;
        try {
            while (true) {
                var exp = read();
                p.car = exp;
                eat_space();
                var c = peek_char();
                if (c == ')') {
                    get_char();
                    break;
                } else if (c == '.') {
                    get_char();
                    p.cdr = read();
                    eat_space();
                    c = peek_char();
                    if (c == ')') {
                        get_char();
                    } else {
                        throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ");
                    }
                    break;
                } else {
                    var p2 = new LambdaTM.Cell();
                    p.cdr = p2;
                    p = p2;
                }
            }
        } catch (ee) {
            if (ee instanceof LambdaTM.EOFException) {
                throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list: ");
            }
        }
        return pair;
    }

    function read() {
        var c = get_char();
        while (is_space(c) || c == ';') {
            while (is_space(c)) {
                c = get_char();
            }
            if (c == ';') {
                while (c != '\n') {
                    c = get_char();
                }
            }
        }
        if (c == 65535) {
            return null;
        }
        if (c == '\'' || c == '`') {
            var exp = read();
            var p1 = new LambdaTM.Cell();
            var p2 = new LambdaTM.Cell();
            if (c == '\'') {
                p1.car = LambdaTM.getSymbol("quote");
            } else {
                p1.car = LambdaTM.getSymbol("quasiquote");
            }
            p1.cdr = p2;
            p2.car = exp;
            p2.cdr = null;
            return p1;
        } else if (c == ',') {
            var p1 = new LambdaTM.Cell();
            var p2 = new LambdaTM.Cell();
            p1.car = LambdaTM.getSymbol("unquote");
            c = peek_char();
            if (c == '@') {
                get_char();
                p1.car = LambdaTM.getSymbol("unquote-splicing");
            }
            var exp = read();
            p1.cdr = p2;
            p2.car = exp;
            p2.cdr = null;
            return p1;
        } else if (c == '#') {
            try {
                peek_char();
            } catch (e) {
                if (e instanceof LambdaTM.EOFException) {} else
                    throw e;
            }
            var str = read_till_delimiter();
            return hashtag(c + str);
        } else if (c == '"') {
            return read_string();
        } else if (is_number(c)) {
            var rest = read_till_delimiter();
            var str = c + rest;
            var r = parseFloat(str);
            if (r == NaN) {
                throw new LambdaTM.SyntaxEx("");
            } else
                return r;

        } else if (c == '+' || c == '-') {
            var rest = read_till_delimiter();
            if ("" == rest) {
                return LambdaTM.getSymbol("" + c);
            } else {
                var r = parseFloat(c + rest);
                if (r == NaN) {
                    throw new LambdaTM.SyntaxEx("");
                } else {
                    return r;
                }
            }
        } else if (is_symbol(c)) {
            var rest = read_till_delimiter();
            return LambdaTM.getSymbol(c + rest);
        } else if (c == '(') {
            eat_space();
            c = peek_char();
            if (c == ')') {
                get_char();
                return null;
            } else {
                return read_list();
            }
        }
        throw new LambdaTM.SyntaxEx("Unknown read syntax reading improper list char:" + c);
    }
    return read;
}
LambdaTM.evalEx = function(str) {
    this.errorMessage = str;
}
LambdaTM.calljsmacro = function(lisp) {
    if (lisp instanceof LambdaTM.Cell) {
        if (lisp.car instanceof LambdaTM.Symbol) {
            var f = eval(lisp.car.name);
            var args = [];
            var cell = lisp.cdr;
            while (cell != null && cell instanceof LambdaTM.Cell) {
                args.push(cell.car);
                cell = cell.cdr;
            }
            return f.apply(window, args);
        }
        throw new LambdaTM.evalEx("eval error, not symbol function");
    }
    throw new LambdaTM.evalEx("eval error,not code");
}
LambdaTM.sexp2list = function(lisp) {
    var args = [];
    var cell = lisp;
    while (cell != null && cell instanceof LambdaTM.Cell) {
        args.push(cell.car);
        cell = cell.cdr;
    }
    return args;
}
LambdaTM.Error = function(errorsym, msg) {
    this.fatal = true;
    this.car = errorsym;
    this.cdr = msg;
    return this;
}
LambdaTM.ERROR = {}
LambdaTM.ERROR.EnvironmentSymbol_EX = new LambdaTM.getSymbol("EnvironmentSymbol_EX");
LambdaTM.ERROR.Syntex_Ex = new LambdaTM.getSymbol("Syntex_Ex");
LambdaTM.Env = function(f) {
    this.car = f || null;
    this.cdr = null;
    this.make = function(sym, obj) {
        return Util.cons(Util.cons(sym, obj), null);
    }
    this.find = function(sym) {
        if (typeof(sym) === "string") {
            return this.find(LambdaTM.getSymbol(sym));
        } else if (sym instanceof LambdaTM.Symbol) {
            var cell = null;
            cell = this.cdr;
            while (cell != null) {
                var o = cell.car;
                if (sym.name === o.car.name) {
                    return o.cdr;
                }
                cell = cell.cdr;
            }
            if (this.car != null) {
                return this.car.find(sym);
            } else {
                return new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "find not symbol:" + sym);
            }
        }
    }
    this.set = function(sym, obj) {
        if (sym instanceof LambdaTM.Symbol) {
            var cell = this.cdr;
            while (cell != null) {
                var o = cell.car;
                if (sym === o.car) {
                    o.cdr = obj;
                    return obj;
                }
                cell = cell.cdr;
            }
            if (this.car != null) {
                return this.car.set(sym, obj);
            } else {
                return new LambdaTM.Error(LambdaTM.ERROR.EnvironmentSymbol_EX, "symbol:" + sym + " value:" + obj);
            }
        }
    }
    this.setLocal = function(sym, obj) {
        if (typeof(sym) === "string") {
            return this.setLocal(LambdaTM.getSymbol(sym), obj);
        } else if (sym instanceof LambdaTM.Symbol) {
            var cell = this.cdr;
            if (cell == null) {
                this.cdr = this.make(sym, obj);
            }
            while (cell != null) {
                var o = cell.car;
                if (sym === o.car) {
                    o.cdr = obj;
                    return obj;
                }
                if (cell.cdr == null) {
                    cell.cdr = this.make(sym, obj);
                    return obj;
                } else {
                    cell = cell.cdr;
                }
            }
        }
        return obj;
    }
    return this;
}
LambdaTM.TailRecursive = function() {
    this.closureenv = null;
    this.closurecode = null;
}
LambdaTM.LispEval = {};
LambdaTM.LispEval.lisp_eval = function(env, code) {
    if (code != null) {
        if (code instanceof LambdaTM.Symbol) {
            return env.find(code);
        } else if (code instanceof LambdaTM.Cell) {
            return LambdaTM.LispEval.eval_list(env, code);
        }
    }
    return code;
}
LambdaTM.LispEval.eval_func_args = function(env, code) {
    if (code == null) {
        return null;
    }
    var root = new LambdaTM.Cell();
    var current = root;
    for (var c = code;;) {
        var r = LambdaTM.LispEval.lisp_eval(env, c.car);
        if (r instanceof LambdaTM.Error) {
            return r;
        }
        current.car = r;
        c = c.cdr;
        if (c != null) {
            current.cdr = new LambdaTM.Cell();
            current = current.cdr;
        } else {
            break;
        }
    }
    return root;
}
LambdaTM.LispEval.defer_eval = function(env, code) {
    if (!(code instanceof LambdaTM.Cell)) {
        return lisp_eval(env, code);
    }
    var tr = new LambdaTM.TailRecursive();
    tr.closureenv = env;
    tr.closurecode = code;
    return tr;
}
LambdaTM.LispEval.eval_call = function(env, code) {
    if (code == null) {
        return null;
    }
    var func = LambdaTM.LispEval.lisp_eval(env, code.car);
    if (func == null) {
        return code;
    }
    var result = null;
    if (func instanceof LambdaTM.LambdaFunction) {
        var args = LambdaTM.LispEval.eval_func_args(env, code.cdr);
        if (args instanceof LambdaTM.Error) {
            return args;
        }
        result = func.apply(env, args);
        return result;
    } else if (func instanceof LambdaTM.mprocedure) {
        var args = code.cdr;
        result = func.apply(env, args);
        var r = LambdaTM.LispEval.lisp_eval(env, result);
        return r;
    } else if (func instanceof LambdaTM.LambdaMacro) {
        var args = code.cdr;
        result = func.apply(env, args);
        return result;
    } else if (func instanceof LambdaTM.Error) {
        return func;
    } else {
        return new LambdaTM.Error("EnvironmentSymbol_EX", "Invalid function call " + func);
    }
}
LambdaTM.LispEval.run_function_body = function(env, code, tailrec) {
    var result = null;
    for (; code != null; code = code.cdr) {
        if (!(code instanceof LambdaTM.Cell)) {
            return new LambdaTM.Error(LambdaTM.ERROR.Syntex_Ex, " not list ");
        }
        if (code.cdr == null && tailrec) {
            return LambdaTM.LispEval.defer_eval(env, code.car);
        } else {
            result = LambdaTM.LispEval.lisp_eval(env, code.car);
            if (result instanceof LambdaTM.Error) {
                return result;
            }
        }
    }
    return result;
}
LambdaTM.LispEval.eval_list = function(env, code) {
    var result = LambdaTM.LispEval.eval_call(env, code);
    while (result != null && result instanceof LambdaTM.TailRecursive) {
        env = result.closureenv;
        code = result.closurecode;
        result = LambdaTM.LispEval.eval_call(env, code);
    }
    return result;
}
LambdaTM.LambdaMacro = function() {
    function apply(env, args) {}

    function toString() {
        return " #macro:";
    }
}
LambdaTM.LambdaFunction = function() {
    function toString() {
        return " #lambda:";
    }
}
LambdaTM.LambdaFunction.prototype = new LambdaTM.LambdaMacro();
LambdaTM.mprocedure = function() {
    this.closurecode;
    this.closureenv;

    function apply(env, args) {
        var newenv = new Env();
        newenv.car = closureenv;
        var as = closurecode.car;
        var o = args;
        while (as != null) {
            if (as instanceof LambdaTM.Symbol) {
                newenv.setLocal(as, o);
                break;
            }
            var s = as.car;
            if (s instanceof LambdaTM.Symbol) {
                newenv.setLocal(s, o.car);
            } else {
                return new LambdaTM.Error(LambdaTM.ERROR.Args_EX, "lambda proc args error");
            }

            as = as.cdr;
            if (o != null && o instanceof LambdaTM.Cell) {
                o = o.cdr;
            } else {
                return new LambdaTM.Error(LambdaTM.ERROR.Args_EX, "lambda proc args length error");
            }
        }
        return LambdaTM.LispEval.run_function_body(newenv, closurecode.cdr, false);
    }
}
LambdaTM.mprocedure.prototype = new LambdaTM.LambdaFunction();
Util.proxycall = function(fun, env, args) {
    return fun.apply(window, LambdaTM.sexp2list(Util.cons(env, args)));
}
LambdaTM.globalenv = new LambdaTM.Env();
onmessage = function() {
    this.apply = function(env, args) {
        if (args.cdr.car === window.tid) {
            var tag = args.cdr.cdr.car;
            var f = eval(tag);
            var as = LambdaTM.sexp2list(args.cdr.cdr.cdr);
            return f.apply(window, as);
        }
    }
    return this;
}
onmessage.prototype = new LambdaTM.LambdaFunction();
LambdaTM.globalenv.setLocal("onmessage", new onmessage());
LambdaTM.list2json = function(list) {
    var json = {};
    for (var i = 0; i < list.length;) {
        var k = list[i++];
        var v = list[i++];
        json[k] = v;
    }
    return json;
}



function state() {
    var list = arguments;
    changestate(LambdaTM.list2json(list));
}



/**

var r = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader('(add 1 2 3)')) ;
var lisp = r();
function add(x,y,z){
  return x+y+z;
}
console.log(lisp);
LambdaTM.calljsmacro(lisp);

var r = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader('(print "asdasdsadsad" "sssssssss" )')) ;

var lisp = r();
function print(str,s){
	console.log(str + s );
}
LambdaTM.calljsmacro(lisp);

var r = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader('( "asdasdsadsad" "sssssssss" 1 2 3  )')) ;
var lisp = r();
LambdaTM.sexp2list(lisp);

*/

/**

var r = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader('(state "pid" "1" "mid" "1" "cid" "1" "provider" "LSA" "category" "yuba" "model" "" "phone" "400-826-1986" )')) ;
var lisp = r();
var env = new LambdaTM.Env();

add = function (){
  this.apply = function ( env, args){
    //return this.fun.apply(window , LambdaTM.sexp2list( args ) );
    return Util.proxycall(this.fun,env,args);
  }
  this.fun = function(env , b , c , d , e){
    return  b + c + d + e;
  }
  return this;
}
add.prototype = new LambdaTM.LambdaFunction();

aaa = function (){
  this.apply = function ( env, args){
    return 100;
  }
  return this;
}
aaa.prototype = new LambdaTM.LambdaFunction();

env.setLocal("add",new add());
env.setLocal("aaa",new aaa());

LambdaTM.LispEval.lisp_eval( env , lisp );

//LambdaTM.LispEval.lisp_eval( LambdaTM.globalenv , lisp );


**/

var SEXP = {};

SEXP.parse = function(sExprString) {
	
    var sexp = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(sExprString))();
    return LambdaTM.sexp2list(sexp);
}

SEXP.exec = function(sExprString) {
    
	var index = sExprString.indexOf('serial:');

	if(index==1){
		$("#serialget").val(sExprString.substring(8, sExprString.length -1  ));
		return;
	}
	var sexp = new LambdaTM.LambdaTMReader(new LambdaTM.StringReader(sExprString))();
    return LambdaTM.LispEval.lisp_eval( LambdaTM.globalenv , sexp );
}

Array.prototype.toObj = function() {
    var rv = {};
    if (this.length % 2 != 0) return;
    for (var i = 0; i < this.length; i += 2)
        rv[this[i]] = this[i + 1];
    return rv;
};



// MIT License:
//
// Copyright (c) 2010-2012, Joe Walnes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * This behaves like a WebSocket in every way, except if it fails to connect,
 * or it gets disconnected, it will repeatedly poll until it successfully connects
 * again.
 *
 * It is API compatible, so when you have:
 *   ws = new WebSocket('ws://....');
 * you can replace with:
 *   ws = new ReconnectingWebSocket('ws://....');
 *
 * The event stream will typically look like:
 *  onconnecting
 *  onopen
 *  onmessage
 *  onmessage
 *  onclose // lost connection
 *  onconnecting
 *  onopen  // sometime later...
 *  onmessage
 *  onmessage
 *  etc...
 *
 * It is API compatible with the standard WebSocket API, apart from the following members:
 *
 * - `bufferedAmount`
 * - `extensions`
 * - `binaryType`
 *
 * Latest version: https://github.com/joewalnes/reconnecting-websocket/
 * - Joe Walnes
 *
 * Syntax
 * ======
 * var socket = new ReconnectingWebSocket(url, protocols, options);
 *
 * Parameters
 * ==========
 * url - The url you are connecting to.
 * protocols - Optional string or array of protocols.
 * options - See below
 *
 * Options
 * =======
 * Options can either be passed upon instantiation or set after instantiation:
 *
 * var socket = new ReconnectingWebSocket(url, null, { debug: true, reconnectInterval: 4000 });
 *
 * or
 *
 * var socket = new ReconnectingWebSocket(url);
 * socket.debug = true;
 * socket.reconnectInterval = 4000;
 *
 * debug
 * - Whether this instance should log debug messages. Accepts true or false. Default: false.
 *
 * automaticOpen
 * - Whether or not the websocket should attempt to connect immediately upon instantiation. The socket can be manually opened or closed at any time using ws.open() and ws.close().
 *
 * reconnectInterval
 * - The number of milliseconds to delay before attempting to reconnect. Accepts integer. Default: 1000.
 *
 * maxReconnectInterval
 * - The maximum number of milliseconds to delay a reconnection attempt. Accepts integer. Default: 30000.
 *
 * reconnectDecay
 * - The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. Accepts integer or float. Default: 1.5.
 *
 * timeoutInterval
 * - The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. Accepts integer. Default: 2000.
 *
 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports){
        module.exports = factory();
    } else {
        global.ReconnectingWebSocket = factory();
    }
})(this, function () {

    if (!('WebSocket' in window)) {
        return;
    }

    function ReconnectingWebSocket(url, protocols, options) {

        // Default settings
        var settings = {

            /** Whether this instance should log debug messages. */
            debug: false,

            /** Whether or not the websocket should attempt to connect immediately upon instantiation. */
            automaticOpen: true,

            /** The number of milliseconds to delay before attempting to reconnect. */
            reconnectInterval: 1000,
            /** The maximum number of milliseconds to delay a reconnection attempt. */
            maxReconnectInterval: 30000,
            /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
            reconnectDecay: 1.5,

            /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
            timeoutInterval: 2000,

            /** The maximum number of reconnection attempts to make. Unlimited if null. */
            maxReconnectAttempts: null
        }
        if (!options) { options = {}; }

        // Overwrite and define settings with options if they exist.
        for (var key in settings) {
            if (typeof options[key] !== 'undefined') {
                this[key] = options[key];
            } else {
                this[key] = settings[key];
            }
        }

        // These should be treated as read-only properties

        /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
        this.url = url;

        /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
        this.reconnectAttempts = 0;

        /**
         * The current state of the connection.
         * Can be one of: WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED
         * Read only.
         */
        this.readyState = WebSocket.CONNECTING;

        /**
         * A string indicating the name of the sub-protocol the server selected; this will be one of
         * the strings specified in the protocols parameter when creating the WebSocket object.
         * Read only.
         */
        this.protocol = null;

        // Private state variables

        var self = this;
        var ws;
        var forcedClose = false;
        var timedOut = false;
        var eventTarget = document.createElement('div');

        // Wire up "on*" properties as event handlers

        eventTarget.addEventListener('open',       function(event) { self.onopen(event); });
        eventTarget.addEventListener('close',      function(event) { self.onclose(event); });
        eventTarget.addEventListener('connecting', function(event) { self.onconnecting(event); });
        eventTarget.addEventListener('message',    function(event) { self.onmessage(event); });
        eventTarget.addEventListener('error',      function(event) { self.onerror(event); });

        // Expose the API required by EventTarget

        this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
        this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
        this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);

        /**
         * This function generates an event that is compatible with standard
         * compliant browsers and IE9 - IE11
         *
         * This will prevent the error:
         * Object doesn't support this action
         *
         * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
         * @param s String The name that the event should use
         * @param args Object an optional object that the event will use
         */
        function generateEvent(s, args) {
        	var evt = document.createEvent("CustomEvent");
        	evt.initCustomEvent(s, false, false, args);
        	return evt;
        };

        this.open = function (reconnectAttempt) {
            ws = new WebSocket(self.url, protocols || []);

            if (reconnectAttempt) {
                if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
                    return;
                }
            } else {
                eventTarget.dispatchEvent(generateEvent('connecting'));
                this.reconnectAttempts = 0;
            }

            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'attempt-connect', self.url);
            }

            var localWs = ws;
            var timeout = setTimeout(function() {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'connection-timeout', self.url);
                }
                timedOut = true;
                localWs.close();
                timedOut = false;
            }, self.timeoutInterval);

            ws.onopen = function(event) {
                clearTimeout(timeout);
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onopen', self.url);
                }
                self.protocol = ws.protocol;
                self.readyState = WebSocket.OPEN;
                self.reconnectAttempts = 0;
                var e = generateEvent('open');
                e.isReconnect = reconnectAttempt;
                reconnectAttempt = false;
                eventTarget.dispatchEvent(e);
            };

            ws.onclose = function(event) {
                clearTimeout(timeout);
                ws = null;
                if (forcedClose) {
                    self.readyState = WebSocket.CLOSED;
                    eventTarget.dispatchEvent(generateEvent('close'));
                } else {
                    self.readyState = WebSocket.CONNECTING;
                    var e = generateEvent('connecting');
                    e.code = event.code;
                    e.reason = event.reason;
                    e.wasClean = event.wasClean;
                    eventTarget.dispatchEvent(e);
                    if (!reconnectAttempt && !timedOut) {
                        if (self.debug || ReconnectingWebSocket.debugAll) {
                            console.debug('ReconnectingWebSocket', 'onclose', self.url);
                        }
                        eventTarget.dispatchEvent(generateEvent('close'));
                    }

                    var timeout = self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts);
                    setTimeout(function() {
                        self.reconnectAttempts++;
                        self.open(true);
                    }, timeout > self.maxReconnectInterval ? self.maxReconnectInterval : timeout);
                }
            };
            ws.onmessage = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onmessage', self.url, event.data);
                }
                var e = generateEvent('message');
                e.data = event.data;
                eventTarget.dispatchEvent(e);
            };
            ws.onerror = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onerror', self.url, event);
                }
                eventTarget.dispatchEvent(generateEvent('error'));
            };
        }

        // Whether or not to create a websocket upon instantiation
        if (this.automaticOpen == true) {
            this.open(false);
        }

        /**
         * Transmits data to the server over the WebSocket connection.
         *
         * @param data a text string, ArrayBuffer or Blob to send to the server.
         */
        this.send = function(data) {
            if (ws) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'send', self.url, data);
                }
                return ws.send(data);
            } else {
                throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
            }
        };

        /**
         * Closes the WebSocket connection or connection attempt, if any.
         * If the connection is already CLOSED, this method does nothing.
         */
        this.close = function(code, reason) {
            // Default CLOSE_NORMAL code
            if (typeof code == 'undefined') {
                code = 1000;
            }
            forcedClose = true;
            if (ws) {
                ws.close(code, reason);
            }
        };

        /**
         * Additional public API method to refresh the connection if still open (close, re-open).
         * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
         */
        this.refresh = function() {
            if (ws) {
                ws.close();
            }
        };
    }

    /**
     * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
     * this indicates that the connection is ready to send and receive data.
     */
    ReconnectingWebSocket.prototype.onopen = function(event) {};
    /** An event listener to be called when the WebSocket connection's readyState changes to CLOSED. */
    ReconnectingWebSocket.prototype.onclose = function(event) {};
    /** An event listener to be called when a connection begins being attempted. */
    ReconnectingWebSocket.prototype.onconnecting = function(event) {};
    /** An event listener to be called when a message is received from the server. */
    ReconnectingWebSocket.prototype.onmessage = function(event) {};
    /** An event listener to be called when an error occurs. */
    ReconnectingWebSocket.prototype.onerror = function(event) {};

    /**
     * Whether all instances of ReconnectingWebSocket should log debug messages.
     * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
     */
    ReconnectingWebSocket.debugAll = false;

    ReconnectingWebSocket.CONNECTING = WebSocket.CONNECTING;
    ReconnectingWebSocket.OPEN = WebSocket.OPEN;
    ReconnectingWebSocket.CLOSING = WebSocket.CLOSING;
    ReconnectingWebSocket.CLOSED = WebSocket.CLOSED;

    return ReconnectingWebSocket;
});




var Toast = function(config){  
	this.context = config.context==null?$('body'):config.context;
	this.message = config.message;
	this.time = config.time==null?3000:config.time;
	this.left = config.left;
	
	this.bottom = config.bottom;
	this.init();
}

var msgEntity;
Toast.prototype = { 
	
	init : function(){  
		$("#toastMessage").remove();  
	
		var msgDIV = new Array();  
		msgDIV.push('<div id="toastMessage">');  
		msgDIV.push('<span>'+this.message+'</span>');  
		msgDIV.push('</div>');  
		msgEntity = $(msgDIV.join('')).appendTo(this.context);  
		
		var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;  
		
		var bottom = this.bottom == null ? '20px' : this.bottom;
		msgEntity.css({position:'fixed',bottom:bottom,'z-index':'99',left:left,'background-color':'#000000',color:'white','font-size':'14px',padding:'5px',margin:'0px','border-radius':'2px'});
		msgEntity.hide();  
	},  
	
	show :function(){  
		msgEntity.fadeIn(this.time/2);  
		msgEntity.fadeOut(this.time/2);  
	}
}  

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


var tid = getUrlParam("tid");
var host = getUrlParam("host") || "device.hekr.me";

var token = getUrlParam("access_key");

var user = Math.floor(Math.random() * 100);
var url = "ws://" + host + ":8080/websocket/t/" + user + "/code/" + token + "/user";
var ws = new ReconnectingWebSocket(url);


ws.onmessage = function(e) {
  console.debug("[RESULT] " + e.data);
  SEXP.exec(e.data);
}

ws.onerror = function() {
  console.error("[ERROR]");
}

ws.onopen = function() {
  console.debug("[CONNECTED]");
  ws.send('(get-state "{tid}")'.replace("{tid}", tid));
  $.modal.close();
}
ws.onclose = function() {
  console.error("[CLOSED]");
}


$(function() {

  var toast = new Toast({
    message: "指令已发送"
  });

  $("#back").click(function(e) {
    console.debug("[EVENT] back button clicked");
    window.close();
  });


  $("#getserial").click(function(e) {
	var codet = '(@devcall "{tid}" (dev.serial.get 0) (lambda (x) (str-append "serial:" x "" ) ) )'.replace("{tid}", tid);
    console.debug("[CODE] " + codet);
    ws.send(codet);


  });

  
  $("#setserial").click(function(e) {
    var codet = '(@devcall "{tid}" (dev.serial.send 0 "{args}" ) (lambda (x) x))'.replace("{tid}", tid);
    var v = $("#serialset").val();
    var code = codet.replace("{args}", v );
    console.debug("[CODE] " + code);
    ws.send(code);

  });

  $("#funcPWM").change(function(e) {
    var codet = '(@devcall "{tid}" (dev.pwm.setduty 0 {args} ) (lambda (x) x))'.replace("{tid}", tid);
    var code = codet.replace("{args}", e.target.value);
    console.debug("[CODE] " + code);
    ws.send(code);
    toast.show();
    $("#toPWM").text(e.target.value);
  });


  $("#modal").modal({
    escapeClose: false,
    clickClose: false,
    showClose: false
  });

});


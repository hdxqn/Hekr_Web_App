o.splice(t, 1));
for (t = 0; s > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
delete n.finish
})
}
}), Z.each(["toggle", "show", "hide"],
function(e, t) {
    var n = Z.fn[t];
    Z.fn[t] = function(e, r, i) {
        return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(A(t, !0), e, r, i)
    }
}), Z.each({
    slideDown: A("show"),
    slideUp: A("hide"),
    slideToggle: A("toggle"),
    fadeIn: {
        opacity: "show"
    },
    fadeOut: {
        opacity: "hide"
    },
    fadeToggle: {
        opacity: "toggle"
    }
},
function(e, t) {
    Z.fn[e] = function(e, n, r) {
        return this.animate(t, e, n, r)
    }
}), Z.timers = [], Z.fx.tick = function() {
    var e, t = 0,
    n = Z.timers;
    for (Qe = Z.now(); t < n.length; t++) e = n[t],
    e() || n[t] !== e || n.splice(t--, 1);
    n.length || Z.fx.stop(),
    Qe = void 0
},
Z.fx.timer = function(e) {
    Z.timers.push(e),
    e() ? Z.fx.start() : Z.timers.pop()
},
Z.fx.interval = 13, Z.fx.start = function() {
    Je || (Je = setInterval(Z.fx.tick, Z.fx.interval))
},
Z.fx.stop = function() {
    clearInterval(Je),
    Je = null
},
Z.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
},
Z.fn.delay = function(e, t) {
    return e = Z.fx ? Z.fx.speeds[e] || e: e,
    t = t || "fx",
    this.queue(t,
    function(t, n) {
        var r = setTimeout(t, e);
        n.stop = function() {
            clearTimeout(r)
        }
    })
},
function() {
    var e = J.createElement("input"),
    t = J.createElement("select"),
    n = t.appendChild(J.createElement("option"));
    e.type = "checkbox",
    Q.checkOn = "" !== e.value,
    Q.optSelected = n.selected,
    t.disabled = !0,
    Q.optDisabled = !n.disabled,
    e = J.createElement("input"),
    e.value = "t",
    e.type = "radio",
    Q.radioValue = "t" === e.value
} ();
var rt, it, ot = Z.expr.attrHandle;Z.fn.extend({
    attr: function(e, t) {
        return me(this, Z.attr, e, t, arguments.length > 1)
    },
    removeAttr: function(e) {
        return this.each(function() {
            Z.removeAttr(this, e)
        })
    }
}), Z.extend({
    attr: function(e, t, n) {
        var r, i, o = e.nodeType;
        if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === ke ? Z.prop(e, t, n) : (1 === o && Z.isXMLDoc(e) || (t = t.toLowerCase(), r = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? it: rt)), void 0 === n ? r && "get" in r && null !== (i = r.get(e, t)) ? i: (i = Z.find.attr(e, t), null == i ? void 0 : i) : null !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i: (e.setAttribute(t, n + ""), n) : void Z.removeAttr(e, t))
    },
    removeAttr: function(e, t) {
        var n, r, i = 0,
        o = t && t.match(de);
        if (o && 1 === e.nodeType) for (; n = o[i++];) r = Z.propFix[n] || n,
        Z.expr.match.bool.test(n) && (e[r] = !1),
        e.removeAttribute(n)
    },
    attrHooks: {
        type: {
            set: function(e, t) {
                if (!Q.radioValue && "radio" === t && Z.nodeName(e, "input")) {
                    var n = e.value;
                    return e.setAttribute("type", t),
                    n && (e.value = n),
                    t
                }
            }
        }
    }
}), it = {
    set: function(e, t, n) {
        return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n),
        n
    }
},
Z.each(Z.expr.match.bool.source.match(/\w+/g),
function(e, t) {
    var n = ot[t] || Z.find.attr;
    ot[t] = function(e, t, r) {
        var i, o;
        return r || (o = ot[t], ot[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, ot[t] = o),
        i
    }
});
var st = /^(?:input|select|textarea|button)$/i;Z.fn.extend({
    prop: function(e, t) {
        return me(this, Z.prop, e, t, arguments.length > 1)
    },
    removeProp: function(e) {
        return this.each(function() {
            delete this[Z.propFix[e] || e]
        })
    }
}), Z.extend({
    propFix: {
        "for": "htmlFor",
        "class": "className"
    },
    prop: function(e, t, n) {
        var r, i, o, s = e.nodeType;
        if (e && 3 !== s && 8 !== s && 2 !== s) return o = 1 !== s || !Z.isXMLDoc(e),
        o && (t = Z.propFix[t] || t, i = Z.propHooks[t]),
        void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r: e[t] = n: i && "get" in i && null !== (r = i.get(e, t)) ? r: e[t]
    },
    propHooks: {
        tabIndex: {
            get: function(e) {
                return e.hasAttribute("tabindex") || st.test(e.nodeName) || e.href ? e.tabIndex: -1
            }
        }
    }
}), Q.optSelected || (Z.propHooks.selected = {
    get: function(e) {
        var t = e.parentNode;
        return t && t.parentNode && t.parentNode.selectedIndex,
        null
    }
}), Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"],
function() {
    Z.propFix[this.toLowerCase()] = this
});
var at = /[\t\r\n\f]/g;Z.fn.extend({
    addClass: function(e) {
        var t, n, r, i, o, s, a = "string" == typeof e && e,
        u = 0,
        l = this.length;
        if (Z.isFunction(e)) return this.each(function(t) {
            Z(this).addClass(e.call(this, t, this.className))
        });
        if (a) for (t = (e || "").match(de) || []; l > u; u++) if (n = this[u], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(at, " ") : " ")) {
            for (o = 0; i = t[o++];) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
            s = Z.trim(r),
            n.className !== s && (n.className = s)
        }
        return this
    },
    removeClass: function(e) {
        var t, n, r, i, o, s, a = 0 === arguments.length || "string" == typeof e && e,
        u = 0,
        l = this.length;
        if (Z.isFunction(e)) return this.each(function(t) {
            Z(this).removeClass(e.call(this, t, this.className))
        });
        if (a) for (t = (e || "").match(de) || []; l > u; u++) if (n = this[u], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(at, " ") : "")) {
            for (o = 0; i = t[o++];) for (; r.indexOf(" " + i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
            s = e ? Z.trim(r) : "",
            n.className !== s && (n.className = s)
        }
        return this
    },
    toggleClass: function(e, t) {
        var n = typeof e;
        return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(Z.isFunction(e) ?
        function(n) {
            Z(this).toggleClass(e.call(this, n, this.className, t), t)
        }: function() {
            if ("string" === n) for (var t, r = 0,
            i = Z(this), o = e.match(de) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
            else(n === ke || "boolean" === n) && (this.className && ve.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "": ve.get(this, "__className__") || "")
        })
    },
    hasClass: function(e) {
        for (var t = " " + e + " ",
        n = 0,
        r = this.length; r > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(at, " ").indexOf(t) >= 0) return ! 0;
        return ! 1
    }
});
var ut = /\r/g;Z.fn.extend({
    val: function(e) {
        var t, n, r, i = this[0]; {
            if (arguments.length) return r = Z.isFunction(e),
            this.each(function(n) {
                var i;
                1 === this.nodeType && (i = r ? e.call(this, n, Z(this).val()) : e, null == i ? i = "": "number" == typeof i ? i += "": Z.isArray(i) && (i = Z.map(i,
                function(e) {
                    return null == e ? "": e + ""
                })), t = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            });
            if (i) return t = Z.valHooks[i.type] || Z.valHooks[i.nodeName.toLowerCase()],
            t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n: (n = i.value, "string" == typeof n ? n.replace(ut, "") : null == n ? "": n)
        }
    }
}), Z.extend({
    valHooks: {
        option: {
            get: function(e) {
                var t = Z.find.attr(e, "value");
                return null != t ? t: Z.trim(Z.text(e))
            }
        },
        select: {
            get: function(e) {
                for (var t, n, r = e.options,
                i = e.selectedIndex,
                o = "select-one" === e.type || 0 > i,
                s = o ? null: [], a = o ? i + 1 : r.length, u = 0 > i ? a: o ? i: 0; a > u; u++) if (n = r[u], !(!n.selected && u !== i || (Q.optDisabled ? n.disabled: null !== n.getAttribute("disabled")) || n.parentNode.disabled && Z.nodeName(n.parentNode, "optgroup"))) {
                    if (t = Z(n).val(), o) return t;
                    s.push(t)
                }
                return s
            },
            set: function(e, t) {
                for (var n, r, i = e.options,
                o = Z.makeArray(t), s = i.length; s--;) r = i[s],
                (r.selected = Z.inArray(r.value, o) >= 0) && (n = !0);
                return n || (e.selectedIndex = -1),
                o
            }
        }
    }
}), Z.each(["radio", "checkbox"],
function() {
    Z.valHooks[this] = {
        set: function(e, t) {
            return Z.isArray(t) ? e.checked = Z.inArray(Z(e).val(), t) >= 0 : void 0
        }
    },
    Q.checkOn || (Z.valHooks[this].get = function(e) {
        return null === e.getAttribute("value") ? "on": e.value
    })
}), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
function(e, t) {
    Z.fn[t] = function(e, n) {
        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
    }
}), Z.fn.extend({
    hover: function(e, t) {
        return this.mouseenter(e).mouseleave(t || e)
    },
    bind: function(e, t, n) {
        return this.on(e, null, t, n)
    },
    unbind: function(e, t) {
        return this.off(e, null, t)
    },
    delegate: function(e, t, n, r) {
        return this.on(t, e, n, r)
    },
    undelegate: function(e, t, n) {
        return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
    }
});
var lt = Z.now(), ct = /\?/;Z.parseJSON = function(e) {
    return JSON.parse(e + "")
},
Z.parseXML = function(e) {
    var t, n;
    if (!e || "string" != typeof e) return null;
    try {
        n = new DOMParser,
        t = n.parseFromString(e, "text/xml")
    } catch(r) {
        t = void 0
    }
    return (!t || t.getElementsByTagName("parsererror").length) && Z.error("Invalid XML: " + e),
    t
};
var ft = /#.*$/,
pt = /([?&])_=[^&]*/,
dt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
ht = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
gt = /^(?:GET|HEAD)$/,
mt = /^\/\//,
vt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
yt = {},
xt = {},
bt = "*/".concat("*"), wt = e.location.href, Tt = vt.exec(wt.toLowerCase()) || [];Z.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
        url: wt,
        type: "GET",
        isLocal: ht.test(Tt[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
            "*": bt,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        },
        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },
        responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
        },
        converters: {
            "* text": String,
            "text html": !0,
            "text json": Z.parseJSON,
            "text xml": Z.parseXML
        },
        flatOptions: {
            url: !0,
            context: !0
        }
    },
    ajaxSetup: function(e, t) {
        return t ? R(R(e, Z.ajaxSettings), t) : R(Z.ajaxSettings, e)
    },
    ajaxPrefilter: F(yt),
    ajaxTransport: F(xt),
    ajax: function(e, t) {
        function n(e, t, n, s) {
            var u, c, v, y, b, T = t;
            2 !== x && (x = 2, a && clearTimeout(a), r = void 0, o = s || "", w.readyState = e > 0 ? 4 : 0, u = e >= 200 && 300 > e || 304 === e, n && (y = M(f, w, n)), y = W(f, y, w, u), u ? (f.ifModified && (b = w.getResponseHeader("Last-Modified"), b && (Z.lastModified[i] = b), b = w.getResponseHeader("etag"), b && (Z.etag[i] = b)), 204 === e || "HEAD" === f.type ? T = "nocontent": 304 === e ? T = "notmodified": (T = y.state, c = y.data, v = y.error, u = !v)) : (v = T, (e || !T) && (T = "error", 0 > e && (e = 0))), w.status = e, w.statusText = (t || T) + "", u ? h.resolveWith(p, [c, T, w]) : h.rejectWith(p, [w, T, v]), w.statusCode(m), m = void 0, l && d.trigger(u ? "ajaxSuccess": "ajaxError", [w, f, u ? c: v]), g.fireWith(p, [w, T]), l && (d.trigger("ajaxComplete", [w, f]), --Z.active || Z.event.trigger("ajaxStop")))
        }
        "object" == typeof e && (t = e, e = void 0),
        t = t || {};
        var r, i, o, s, a, u, l, c, f = Z.ajaxSetup({},
        t),
        p = f.context || f,
        d = f.context && (p.nodeType || p.jquery) ? Z(p) : Z.event,
        h = Z.Deferred(),
        g = Z.Callbacks("once memory"),
        m = f.statusCode || {},
        v = {},
        y = {},
        x = 0,
        b = "canceled",
        w = {
            readyState: 0,
            getResponseHeader: function(e) {
                var t;
                if (2 === x) {
                    if (!s) for (s = {}; t = dt.exec(o);) s[t[1].toLowerCase()] = t[2];
                    t = s[e.toLowerCase()]
                }
                return null == t ? null: t
            },
            getAllResponseHeaders: function() {
                return 2 === x ? o: null
            },
            setRequestHeader: function(e, t) {
                var n = e.toLowerCase();
                return x || (e = y[n] = y[n] || e, v[e] = t),
                this
            },
            overrideMimeType: function(e) {
                return x || (f.mimeType = e),
                this
            },
            statusCode: function(e) {
                var t;
                if (e) if (2 > x) for (t in e) m[t] = [m[t], e[t]];
                else w.always(e[w.status]);
                return this
            },
            abort: function(e) {
                var t = e || b;
                return r && r.abort(t),
                n(0, t),
                this
            }
        };
        if (h.promise(w).complete = g.add, w.success = w.done, w.error = w.fail, f.url = ((e || f.url || wt) + "").replace(ft, "").replace(mt, Tt[1] + "//"), f.type = t.method || t.type || f.method || f.type, f.dataTypes = Z.trim(f.dataType || "*").toLowerCase().match(de) || [""], null == f.crossDomain && (u = vt.exec(f.url.toLowerCase()), f.crossDomain = !(!u || u[1] === Tt[1] && u[2] === Tt[2] && (u[3] || ("http:" === u[1] ? "80": "443")) === (Tt[3] || ("http:" === Tt[1] ? "80": "443")))), f.data && f.processData && "string" != typeof f.data && (f.data = Z.param(f.data, f.traditional)), P(yt, f, t, w), 2 === x) return w;
        l = Z.event && f.global,
        l && 0 === Z.active++&&Z.event.trigger("ajaxStart"),
        f.type = f.type.toUpperCase(),
        f.hasContent = !gt.test(f.type),
        i = f.url,
        f.hasContent || (f.data && (i = f.url += (ct.test(i) ? "&": "?") + f.data, delete f.data), f.cache === !1 && (f.url = pt.test(i) ? i.replace(pt, "$1_=" + lt++) : i + (ct.test(i) ? "&": "?") + "_=" + lt++)),
        f.ifModified && (Z.lastModified[i] && w.setRequestHeader("If-Modified-Since", Z.lastModified[i]), Z.etag[i] && w.setRequestHeader("If-None-Match", Z.etag[i])),
        (f.data && f.hasContent && f.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", f.contentType),
        w.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + bt + "; q=0.01": "") : f.accepts["*"]);
        for (c in f.headers) w.setRequestHeader(c, f.headers[c]);
        if (f.beforeSend && (f.beforeSend.call(p, w, f) === !1 || 2 === x)) return w.abort();
        b = "abort";
        for (c in {
            success: 1,
            error: 1,
            complete: 1
        }) w[c](f[c]);
        if (r = P(xt, f, t, w)) {
            w.readyState = 1,
            l && d.trigger("ajaxSend", [w, f]),
            f.async && f.timeout > 0 && (a = setTimeout(function() {
                w.abort("timeout")
            },
            f.timeout));
            try {
                x = 1,
                r.send(v, n)
            } catch(T) {
                if (! (2 > x)) throw T;
                n( - 1, T)
            }
        } else n( - 1, "No Transport");
        return w
    },
    getJSON: function(e, t, n) {
        return Z.get(e, t, n, "json")
    },
    getScript: function(e, t) {
        return Z.get(e, void 0, t, "script")
    }
}), Z.each(["get", "post"],
function(e, t) {
    Z[t] = function(e, n, r, i) {
        return Z.isFunction(n) && (i = i || r, r = n, n = void 0),
        Z.ajax({
            url: e,
            type: t,
            dataType: i,
            data: n,
            success: r
        })
    }
}), Z._evalUrl = function(e) {
    return Z.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        "throws": !0
    })
},
Z.fn.extend({
    wrapAll: function(e) {
        var t;
        return Z.isFunction(e) ? this.each(function(t) {
            Z(this).wrapAll(e.call(this, t))
        }) : (this[0] && (t = Z(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
            for (var e = this; e.firstElementChild;) e = e.firstElementChild;
            return e
        }).append(this)), this)
    },
    wrapInner: function(e) {
        return this.each(Z.isFunction(e) ?
        function(t) {
            Z(this).wrapInner(e.call(this, t))
        }: function() {
            var t = Z(this),
            n = t.contents();
            n.length ? n.wrapAll(e) : t.append(e)
        })
    },
    wrap: function(e) {
        var t = Z.isFunction(e);
        return this.each(function(n) {
            Z(this).wrapAll(t ? e.call(this, n) : e)
        })
    },
    unwrap: function() {
        return this.parent().each(function() {
            Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes)
        }).end()
    }
}), Z.expr.filters.hidden = function(e) {
    return e.offsetWidth <= 0 && e.offsetHeight <= 0
},
Z.expr.filters.visible = function(e) {
    return ! Z.expr.filters.hidden(e)
};
var Ct = /%20/g,
Nt = /\[\]$/,
kt = /\r?\n/g,
Et = /^(?:submit|button|image|reset|file)$/i,
St = /^(?:input|select|textarea|keygen)/i;Z.param = function(e, t) {
    var n, r = [],
    i = function(e, t) {
        t = Z.isFunction(t) ? t() : null == t ? "": t,
        r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
    };
    if (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e,
    function() {
        i(this.name, this.value)
    });
    else for (n in e) $(n, e[n], t, i);
    return r.join("&").replace(Ct, "+")
},
Z.fn.extend({
    serialize: function() {
        return Z.param(this.serializeArray())
    },
    serializeArray: function() {
        return this.map(function() {
            var e = Z.prop(this, "elements");
            return e ? Z.makeArray(e) : this
        }).filter(function() {
            var e = this.type;
            return this.name && !Z(this).is(":disabled") && St.test(this.nodeName) && !Et.test(e) && (this.checked || !Ne.test(e))
        }).map(function(e, t) {
            var n = Z(this).val();
            return null == n ? null: Z.isArray(n) ? Z.map(n,
            function(e) {
                return {
                    name: t.name,
                    value: e.replace(kt, "\r\n")
                }
            }) : {
                name: t.name,
                value: n.replace(kt, "\r\n")
            }
        }).get()
    }
}), Z.ajaxSettings.xhr = function() {
    try {
        return new XMLHttpRequest
    } catch(e) {}
};
var Dt = 0,
jt = {},
At = {
    0 : 200,
    1223 : 204
},
Lt = Z.ajaxSettings.xhr();e.attachEvent && e.attachEvent("onunload",
function() {
    for (var e in jt) jt[e]()
}), Q.cors = !!Lt && "withCredentials" in Lt, Q.ajax = Lt = !!Lt, Z.ajaxTransport(function(e) {
    var t;
    return Q.cors || Lt && !e.crossDomain ? {
        send: function(n, r) {
            var i, o = e.xhr(),
            s = ++Dt;
            if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields) for (i in e.xhrFields) o[i] = e.xhrFields[i];
            e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType),
            e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
            for (i in n) o.setRequestHeader(i, n[i]);
            t = function(e) {
                return function() {
                    t && (delete jt[s], t = o.onload = o.onerror = null, "abort" === e ? o.abort() : "error" === e ? r(o.status, o.statusText) : r(At[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                        text: o.responseText
                    }: void 0, o.getAllResponseHeaders()))
                }
            },
            o.onload = t(),
            o.onerror = t("error"),
            t = jt[s] = t("abort");
            try {
                o.send(e.hasContent && e.data || null)
            } catch(a) {
                if (t) throw a
            }
        },
        abort: function() {
            t && t()
        }
    }: void 0
}), Z.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /(?:java|ecma)script/
    },
    converters: {
        "text script": function(e) {
            return Z.globalEval(e),
            e
        }
    }
}), Z.ajaxPrefilter("script",
function(e) {
    void 0 === e.cache && (e.cache = !1),
    e.crossDomain && (e.type = "GET")
}), Z.ajaxTransport("script",
function(e) {
    if (e.crossDomain) {
        var t, n;
        return {
            send: function(r, i) {
                t = Z("<script>").prop({
                    async: !0,
                    charset: e.scriptCharset,
                    src: e.url
                }).on("load error", n = function(e) {
                    t.remove(),
                    n = null,
                    e && i("error" === e.type ? 404 : 200, e.type)
                }),
                J.head.appendChild(t[0])
            },
            abort: function() {
                n && n()
            }
        }
    }
});
var qt = [], Ht = /(=)\?(?=&|$)|\?\?/;Z.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        var e = qt.pop() || Z.expando + "_" + lt++;
        return this[e] = !0,
        e
    }
}), Z.ajaxPrefilter("json jsonp",
function(t, n, r) {
    var i, o, s, a = t.jsonp !== !1 && (Ht.test(t.url) ? "url": "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Ht.test(t.data) && "data");
    return a || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback = Z.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Ht, "$1" + i) : t.jsonp !== !1 && (t.url += (ct.test(t.url) ? "&": "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
        return s || Z.error(i + " was not called"),
        s[0]
    },
    t.dataTypes[0] = "json", o = e[i], e[i] = function() {
        s = arguments
    },
    r.always(function() {
        e[i] = o,
        t[i] && (t.jsonpCallback = n.jsonpCallback, qt.push(i)),
        s && Z.isFunction(o) && o(s[0]),
        s = o = void 0
    }), "script") : void 0
}), Z.parseHTML = function(e, t, n) {
    if (!e || "string" != typeof e) return null;
    "boolean" == typeof t && (n = t, t = !1),
    t = t || J;
    var r = se.exec(e),
    i = !n && [];
    return r ? [t.createElement(r[1])] : (r = Z.buildFragment([e], t, i), i && i.length && Z(i).remove(), Z.merge([], r.childNodes))
};
var Ot = Z.fn.load;Z.fn.load = function(e, t, n) {
    if ("string" != typeof e && Ot) return Ot.apply(this, arguments);
    var r, i, o, s = this,
    a = e.indexOf(" ");
    return a >= 0 && (r = Z.trim(e.slice(a)), e = e.slice(0, a)),
    Z.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"),
    s.length > 0 && Z.ajax({
        url: e,
        type: i,
        dataType: "html",
        data: t
    }).done(function(e) {
        o = arguments,
        s.html(r ? Z("<div>").append(Z.parseHTML(e)).find(r) : e)
    }).complete(n &&
    function(e, t) {
        s.each(n, o || [e.responseText, t, e])
    }),
    this
},
Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"],
function(e, t) {
    Z.fn[t] = function(e) {
        return this.on(t, e)
    }
}), Z.expr.filters.animated = function(e) {
    return Z.grep(Z.timers,
    function(t) {
        return e === t.elem
    }).length
};
var Ft = e.document.documentElement;Z.offset = {
    setOffset: function(e, t, n) {
        var r, i, o, s, a, u, l, c = Z.css(e, "position"),
        f = Z(e),
        p = {};
        "static" === c && (e.style.position = "relative"),
        a = f.offset(),
        o = Z.css(e, "top"),
        u = Z.css(e, "left"),
        l = ("absolute" === c || "fixed" === c) && (o + u).indexOf("auto") > -1,
        l ? (r = f.position(), s = r.top, i = r.left) : (s = parseFloat(o) || 0, i = parseFloat(u) || 0),
        Z.isFunction(t) && (t = t.call(e, n, a)),
        null != t.top && (p.top = t.top - a.top + s),
        null != t.left && (p.left = t.left - a.left + i),
        "using" in t ? t.using.call(e, p) : f.css(p)
    }
},
Z.fn.extend({
    offset: function(e) {
        if (arguments.length) return void 0 === e ? this: this.each(function(t) {
            Z.offset.setOffset(this, e, t)
        });
        var t, n, r = this[0],
        i = {
            top: 0,
            left: 0
        },
        o = r && r.ownerDocument;
        if (o) return t = o.documentElement,
        Z.contains(t, r) ? (typeof r.getBoundingClientRect !== ke && (i = r.getBoundingClientRect()), n = I(o), {
            top: i.top + n.pageYOffset - t.clientTop,
            left: i.left + n.pageXOffset - t.clientLeft
        }) : i
    },
    position: function() {
        if (this[0]) {
            var e, t, n = this[0],
            r = {
                top: 0,
                left: 0
            };
            return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), Z.nodeName(e[0], "html") || (r = e.offset()), r.top += Z.css(e[0], "borderTopWidth", !0), r.left += Z.css(e[0], "borderLeftWidth", !0)),
            {
                top: t.top - r.top - Z.css(n, "marginTop", !0),
                left: t.left - r.left - Z.css(n, "marginLeft", !0)
            }
        }
    },
    offsetParent: function() {
        return this.map(function() {
            for (var e = this.offsetParent || Ft; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position");) e = e.offsetParent;
            return e || Ft
        })
    }
}), Z.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
},
function(t, n) {
    var r = "pageYOffset" === n;
    Z.fn[t] = function(i) {
        return me(this,
        function(t, i, o) {
            var s = I(t);
            return void 0 === o ? s ? s[n] : t[i] : void(s ? s.scrollTo(r ? e.pageXOffset: o, r ? o: e.pageYOffset) : t[i] = o)
        },
        t, i, arguments.length, null)
    }
}), Z.each(["top", "left"],
function(e, t) {
    Z.cssHooks[t] = T(Q.pixelPosition,
    function(e, n) {
        return n ? (n = w(e, t), Be.test(n) ? Z(e).position()[t] + "px": n) : void 0
    })
}), Z.each({
    Height: "height",
    Width: "width"
},
function(e, t) {
    Z.each({
        padding: "inner" + e,
        content: t,
        "": "outer" + e
    },
    function(n, r) {
        Z.fn[r] = function(r, i) {
            var o = arguments.length && (n || "boolean" != typeof r),
            s = n || (r === !0 || i === !0 ? "margin": "border");
            return me(this,
            function(t, n, r) {
                var i;
                return Z.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? Z.css(t, n, s) : Z.style(t, n, r, s)
            },
            t, o ? r: void 0, o, null)
        }
    })
}), Z.fn.size = function() {
    return this.length
},
Z.fn.andSelf = Z.fn.addBack, "function" == typeof define && define.amd && define("jquery", [],
function() {
    return Z
});
var Pt = e.jQuery,
Rt = e.$;
return Z.noConflict = function(t) {
    return e.$ === Z && (e.$ = Rt),
    t && e.jQuery === Z && (e.jQuery = Pt),
    Z
},
typeof t === ke && (e.jQuery = e.$ = Z), Z
});
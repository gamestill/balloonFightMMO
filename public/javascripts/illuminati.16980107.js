!function(a, b, c, d) {
    b[a] = c.call(b);
    for (var e = 0; e < d.length; e++) d[e](b[a]);
    "undefined" != typeof module && module.exports ? module.exports = b[a] : "function" == typeof define && define.amd && define(function() {
        return b[a];
    });
}("Primus", this || {}, function() {
    var a = function() {
        function a(b, c, d) {
            function e(g, h) {
                if (!c[g]) {
                    if (!b[g]) {
                        var i = "function" == typeof require && require;
                        if (!h && i) return i(g, !0);
                        if (f) return f(g, !0);
                        var j = new Error("Cannot find module '" + g + "'");
                        throw j.code = "MODULE_NOT_FOUND", j;
                    }
                    var k = c[g] = {
                        exports: {}
                    };
                    b[g][0].call(k.exports, function(a) {
                        return e(b[g][1][a] || a);
                    }, k, k.exports, a, b, c, d);
                }
                return c[g].exports;
            }
            for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
            return e;
        }
        return a;
    }()({
        1: [ function(a, b, c) {
            "use strict";
            b.exports = function(a, b) {
                function c(a, c) {
                    if (b[a]) {
                        if ("string" == typeof b[a] && (b[a] = b[a].split(d)), "function" == typeof b[a]) return b[a].call(c);
                        for (var e, f, g = 0; g < b[a].length; g++) f = b[a][g], e = typeof f, "function" === e ? f.call(c) : "string" === e && "function" == typeof c[f] && c[f]();
                    }
                }
                var d = /[, ]+/;
                return b = b || {}, a = a || [], "string" == typeof a && (a = a.split(d)), function() {
                    var b, d = this, e = 0;
                    if (null === d[a[0]]) return !1;
                    for (c("before", d); e < a.length; e++) b = a[e], d[b] && ("function" == typeof d[b].destroy && d[b].destroy(), 
                    d[b] = null);
                    return d.emit && d.emit("destroy"), c("after", d), !0;
                };
            };
        }, {} ],
        2: [ function(a, b, c) {
            "use strict";
            b.exports = function() {
                for (var a, b = this, c = 0, d = arguments.length, e = new Array(d); c < d; c++) e[c] = arguments[c];
                return "function" != typeof e[e.length - 1] ? function() {
                    for (var a = 0, c = arguments.length, d = new Array(c); a < c; a++) d[a] = arguments[a];
                    return b.emit.apply(b, e.concat(d));
                } : (a = e.pop(), function() {
                    for (var c = 0, d = arguments.length, f = new Array(d + 1); c < d; c++) f[c + 1] = arguments[c];
                    return f[0] = function(a, c) {
                        if (a) return b.emit("error", a);
                        f = void 0 === c ? f.slice(1) : null === c ? [] : c, b.emit.apply(b, e.concat(f));
                    }, a.apply(b, f), !0;
                });
            };
        }, {} ],
        3: [ function(a, b, c) {
            "use strict";
            function d() {}
            function e(a, b, c) {
                this.fn = a, this.context = b, this.once = c || !1;
            }
            function f(a, b, c, d, f) {
                if ("function" != typeof c) throw new TypeError("The listener must be a function");
                var g = new e(c, d || a, f), h = j ? j + b : b;
                return a._events[h] ? a._events[h].fn ? a._events[h] = [ a._events[h], g ] : a._events[h].push(g) : (a._events[h] = g, 
                a._eventsCount++), a;
            }
            function g(a, b) {
                0 == --a._eventsCount ? a._events = new d() : delete a._events[b];
            }
            function h() {
                this._events = new d(), this._eventsCount = 0;
            }
            var i = Object.prototype.hasOwnProperty, j = "~";
            Object.create && (d.prototype = Object.create(null), new d().__proto__ || (j = !1)), 
            h.prototype.eventNames = function() {
                var a, b, c = [];
                if (0 === this._eventsCount) return c;
                for (b in a = this._events) i.call(a, b) && c.push(j ? b.slice(1) : b);
                return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(a)) : c;
            }, h.prototype.listeners = function(a) {
                var b = j ? j + a : a, c = this._events[b];
                if (!c) return [];
                if (c.fn) return [ c.fn ];
                for (var d = 0, e = c.length, f = new Array(e); d < e; d++) f[d] = c[d].fn;
                return f;
            }, h.prototype.listenerCount = function(a) {
                var b = j ? j + a : a, c = this._events[b];
                return c ? c.fn ? 1 : c.length : 0;
            }, h.prototype.emit = function(a, b, c, d, e, f) {
                var g = j ? j + a : a;
                if (!this._events[g]) return !1;
                var h, i, k = this._events[g], l = arguments.length;
                if (k.fn) {
                    switch (k.once && this.removeListener(a, k.fn, void 0, !0), l) {
                      case 1:
                        return k.fn.call(k.context), !0;

                      case 2:
                        return k.fn.call(k.context, b), !0;

                      case 3:
                        return k.fn.call(k.context, b, c), !0;

                      case 4:
                        return k.fn.call(k.context, b, c, d), !0;

                      case 5:
                        return k.fn.call(k.context, b, c, d, e), !0;

                      case 6:
                        return k.fn.call(k.context, b, c, d, e, f), !0;
                    }
                    for (i = 1, h = new Array(l - 1); i < l; i++) h[i - 1] = arguments[i];
                    k.fn.apply(k.context, h);
                } else {
                    var m, n = k.length;
                    for (i = 0; i < n; i++) switch (k[i].once && this.removeListener(a, k[i].fn, void 0, !0), 
                    l) {
                      case 1:
                        k[i].fn.call(k[i].context);
                        break;

                      case 2:
                        k[i].fn.call(k[i].context, b);
                        break;

                      case 3:
                        k[i].fn.call(k[i].context, b, c);
                        break;

                      case 4:
                        k[i].fn.call(k[i].context, b, c, d);
                        break;

                      default:
                        if (!h) for (m = 1, h = new Array(l - 1); m < l; m++) h[m - 1] = arguments[m];
                        k[i].fn.apply(k[i].context, h);
                    }
                }
                return !0;
            }, h.prototype.on = function(a, b, c) {
                return f(this, a, b, c, !1);
            }, h.prototype.once = function(a, b, c) {
                return f(this, a, b, c, !0);
            }, h.prototype.removeListener = function(a, b, c, d) {
                var e = j ? j + a : a;
                if (!this._events[e]) return this;
                if (!b) return g(this, e), this;
                var f = this._events[e];
                if (f.fn) f.fn !== b || d && !f.once || c && f.context !== c || g(this, e); else {
                    for (var h = 0, i = [], k = f.length; h < k; h++) (f[h].fn !== b || d && !f[h].once || c && f[h].context !== c) && i.push(f[h]);
                    i.length ? this._events[e] = 1 === i.length ? i[0] : i : g(this, e);
                }
                return this;
            }, h.prototype.removeAllListeners = function(a) {
                var b;
                return a ? (b = j ? j + a : a, this._events[b] && g(this, b)) : (this._events = new d(), 
                this._eventsCount = 0), this;
            }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, 
            h.prefixed = j, h.EventEmitter = h, void 0 !== b && (b.exports = h);
        }, {} ],
        4: [ function(a, b, c) {
            "function" == typeof Object.create ? b.exports = function(a, b) {
                a.super_ = b, a.prototype = Object.create(b.prototype, {
                    constructor: {
                        value: a,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                });
            } : b.exports = function(a, b) {
                a.super_ = b;
                var c = function() {};
                c.prototype = b.prototype, a.prototype = new c(), a.prototype.constructor = a;
            };
        }, {} ],
        5: [ function(a, b, c) {
            "use strict";
            var d = new RegExp("^((?:\\d+)?\\.?\\d+) *(" + [ "milliseconds?", "msecs?", "ms", "seconds?", "secs?", "s", "minutes?", "mins?", "m", "hours?", "hrs?", "h", "days?", "d", "weeks?", "wks?", "w", "years?", "yrs?", "y" ].join("|") + ")?$", "i");
            b.exports = function(a) {
                var b, c, e = typeof a;
                if ("number" === e) return a;
                if ("string" !== e || "0" === a || !a) return 0;
                if (+a) return +a;
                if (a.length > 1e4 || !(c = d.exec(a))) return 0;
                switch (b = parseFloat(c[1]), c[2].toLowerCase()) {
                  case "years":
                  case "year":
                  case "yrs":
                  case "yr":
                  case "y":
                    return 31536e6 * b;

                  case "weeks":
                  case "week":
                  case "wks":
                  case "wk":
                  case "w":
                    return 6048e5 * b;

                  case "days":
                  case "day":
                  case "d":
                    return 864e5 * b;

                  case "hours":
                  case "hour":
                  case "hrs":
                  case "hr":
                  case "h":
                    return 36e5 * b;

                  case "minutes":
                  case "minute":
                  case "mins":
                  case "min":
                  case "m":
                    return 6e4 * b;

                  case "seconds":
                  case "second":
                  case "secs":
                  case "sec":
                  case "s":
                    return 1e3 * b;

                  default:
                    return b;
                }
            };
        }, {} ],
        6: [ function(a, b, c) {
            "use strict";
            b.exports = function(a) {
                function b() {
                    return d ? c : (d = 1, c = a.apply(this, arguments), a = null, c);
                }
                var c, d = 0;
                return b.displayName = a.displayName || a.name || b.displayName || b.name, b;
            };
        }, {} ],
        7: [ function(a, b, c) {
            function d() {
                throw new Error("setTimeout has not been defined");
            }
            function e() {
                throw new Error("clearTimeout has not been defined");
            }
            function f(a) {
                if (l === setTimeout) return setTimeout(a, 0);
                if ((l === d || !l) && setTimeout) return l = setTimeout, setTimeout(a, 0);
                try {
                    return l(a, 0);
                } catch (b) {
                    try {
                        return l.call(null, a, 0);
                    } catch (b) {
                        return l.call(this, a, 0);
                    }
                }
            }
            function g(a) {
                if (m === clearTimeout) return clearTimeout(a);
                if ((m === e || !m) && clearTimeout) return m = clearTimeout, clearTimeout(a);
                try {
                    return m(a);
                } catch (b) {
                    try {
                        return m.call(null, a);
                    } catch (b) {
                        return m.call(this, a);
                    }
                }
            }
            function h() {
                q && o && (q = !1, o.length ? p = o.concat(p) : r = -1, p.length && i());
            }
            function i() {
                if (!q) {
                    var a = f(h);
                    q = !0;
                    for (var b = p.length; b; ) {
                        for (o = p, p = []; ++r < b; ) o && o[r].run();
                        r = -1, b = p.length;
                    }
                    o = null, q = !1, g(a);
                }
            }
            function j(a, b) {
                this.fun = a, this.array = b;
            }
            function k() {}
            var l, m, n = b.exports = {};
            !function() {
                try {
                    l = "function" == typeof setTimeout ? setTimeout : d;
                } catch (a) {
                    l = d;
                }
                try {
                    m = "function" == typeof clearTimeout ? clearTimeout : e;
                } catch (a) {
                    m = e;
                }
            }();
            var o, p = [], q = !1, r = -1;
            n.nextTick = function(a) {
                var b = new Array(arguments.length - 1);
                if (arguments.length > 1) for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
                p.push(new j(a, b)), 1 !== p.length || q || f(i);
            }, j.prototype.run = function() {
                this.fun.apply(null, this.array);
            }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", 
            n.versions = {}, n.on = k, n.addListener = k, n.once = k, n.off = k, n.removeListener = k, 
            n.removeAllListeners = k, n.emit = k, n.prependListener = k, n.prependOnceListener = k, 
            n.listeners = function(a) {
                return [];
            }, n.binding = function(a) {
                throw new Error("process.binding is not supported");
            }, n.cwd = function() {
                return "/";
            }, n.chdir = function(a) {
                throw new Error("process.chdir is not supported");
            }, n.umask = function() {
                return 0;
            };
        }, {} ],
        8: [ function(a, b, c) {
            "use strict";
            function d(a) {
                return decodeURIComponent(a.replace(/\+/g, " "));
            }
            function e(a) {
                for (var b, c = /([^=?&]+)=?([^&]*)/g, e = {}; b = c.exec(a); ) {
                    var f = d(b[1]), g = d(b[2]);
                    f in e || (e[f] = g);
                }
                return e;
            }
            function f(a, b) {
                b = b || "";
                var c = [];
                "string" != typeof b && (b = "?");
                for (var d in a) g.call(a, d) && c.push(encodeURIComponent(d) + "=" + encodeURIComponent(a[d]));
                return c.length ? b + c.join("&") : "";
            }
            var g = Object.prototype.hasOwnProperty;
            c.stringify = f, c.parse = e;
        }, {} ],
        9: [ function(a, b, c) {
            "use strict";
            function d(a, b, c) {
                return g(a in c ? c[a] : a in b ? b[a] : e[a]);
            }
            function e(a) {
                var b = this;
                if (!(b instanceof e)) return new e(a);
                a = a || {}, b.attempt = null, b._fn = null, b["reconnect timeout"] = d("reconnect timeout", b, a), 
                b.retries = d("retries", b, a), b.factor = d("factor", b, a), b.max = d("max", b, a), 
                b.min = d("min", b, a), b.timers = new i(b);
            }
            var f = a("eventemitter3"), g = a("millisecond"), h = a("demolish"), i = a("tick-tock"), j = a("one-time");
            e.prototype = new f(), e.prototype.constructor = e, e["reconnect timeout"] = "30 seconds", 
            e.max = 1 / 0, e.min = "500 ms", e.retries = 10, e.factor = 2, e.prototype.reconnect = function() {
                var a = this;
                return a.backoff(function(b, c) {
                    if (c.duration = +new Date() - c.start, b) return a.emit("reconnect failed", b, c);
                    a.emit("reconnected", c);
                }, a.attempt);
            }, e.prototype.backoff = function(a, b) {
                var c = this;
                return b = b || c.attempt || {}, b.backoff ? c : (b["reconnect timeout"] = d("reconnect timeout", c, b), 
                b.retries = d("retries", c, b), b.factor = d("factor", c, b), b.max = d("max", c, b), 
                b.min = d("min", c, b), b.start = +b.start || +new Date(), b.duration = +b.duration || 0, 
                b.attempt = +b.attempt || 0, b.attempt === b.retries ? (a.call(c, new Error("Unable to recover"), b), 
                c) : (b.backoff = !0, b.attempt++, c.attempt = b, b.scheduled = 1 !== b.attempt ? Math.min(Math.round((Math.random() + 1) * b.min * Math.pow(b.factor, b.attempt - 1)), b.max) : b.min, 
                c.timers.setTimeout("reconnect", function() {
                    b.duration = +new Date() - b.start, b.backoff = !1, c.timers.clear("reconnect, timeout");
                    var d = c._fn = j(function(d) {
                        if (c.reset(), d) return c.backoff(a, b);
                        a.call(c, void 0, b);
                    });
                    c.emit("reconnect", b, d), c.timers.setTimeout("timeout", function() {
                        var a = new Error("Failed to reconnect in a timely manner");
                        b.duration = +new Date() - b.start, c.emit("reconnect timeout", a, b), d(a);
                    }, b["reconnect timeout"]);
                }, b.scheduled), c.emit("reconnect scheduled", b), c));
            }, e.prototype.reconnecting = function() {
                return !!this.attempt;
            }, e.prototype.reconnected = function(a) {
                return this._fn && this._fn(a), this;
            }, e.prototype.reset = function() {
                return this._fn = this.attempt = null, this.timers.clear("reconnect, timeout"), 
                this;
            }, e.prototype.destroy = h("timers attempt _fn"), b.exports = e;
        }, {
            demolish: 1,
            eventemitter3: 10,
            millisecond: 5,
            "one-time": 6,
            "tick-tock": 12
        } ],
        10: [ function(a, b, c) {
            "use strict";
            function d(a, b, c) {
                this.fn = a, this.context = b, this.once = c || !1;
            }
            function e() {}
            var f = "function" != typeof Object.create && "~";
            e.prototype._events = void 0, e.prototype.listeners = function(a, b) {
                var c = f ? f + a : a, d = this._events && this._events[c];
                if (b) return !!d;
                if (!d) return [];
                if (d.fn) return [ d.fn ];
                for (var e = 0, g = d.length, h = new Array(g); e < g; e++) h[e] = d[e].fn;
                return h;
            }, e.prototype.emit = function(a, b, c, d, e, g) {
                var h = f ? f + a : a;
                if (!this._events || !this._events[h]) return !1;
                var i, j, k = this._events[h], l = arguments.length;
                if ("function" == typeof k.fn) {
                    switch (k.once && this.removeListener(a, k.fn, void 0, !0), l) {
                      case 1:
                        return k.fn.call(k.context), !0;

                      case 2:
                        return k.fn.call(k.context, b), !0;

                      case 3:
                        return k.fn.call(k.context, b, c), !0;

                      case 4:
                        return k.fn.call(k.context, b, c, d), !0;

                      case 5:
                        return k.fn.call(k.context, b, c, d, e), !0;

                      case 6:
                        return k.fn.call(k.context, b, c, d, e, g), !0;
                    }
                    for (j = 1, i = new Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
                    k.fn.apply(k.context, i);
                } else {
                    var m, n = k.length;
                    for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a, k[j].fn, void 0, !0), 
                    l) {
                      case 1:
                        k[j].fn.call(k[j].context);
                        break;

                      case 2:
                        k[j].fn.call(k[j].context, b);
                        break;

                      case 3:
                        k[j].fn.call(k[j].context, b, c);
                        break;

                      default:
                        if (!i) for (m = 1, i = new Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                        k[j].fn.apply(k[j].context, i);
                    }
                }
                return !0;
            }, e.prototype.on = function(a, b, c) {
                var e = new d(b, c || this), g = f ? f + a : a;
                return this._events || (this._events = f ? {} : Object.create(null)), this._events[g] ? this._events[g].fn ? this._events[g] = [ this._events[g], e ] : this._events[g].push(e) : this._events[g] = e, 
                this;
            }, e.prototype.once = function(a, b, c) {
                var e = new d(b, c || this, !0), g = f ? f + a : a;
                return this._events || (this._events = f ? {} : Object.create(null)), this._events[g] ? this._events[g].fn ? this._events[g] = [ this._events[g], e ] : this._events[g].push(e) : this._events[g] = e, 
                this;
            }, e.prototype.removeListener = function(a, b, c, d) {
                var e = f ? f + a : a;
                if (!this._events || !this._events[e]) return this;
                var g = this._events[e], h = [];
                if (b) if (g.fn) (g.fn !== b || d && !g.once || c && g.context !== c) && h.push(g); else for (var i = 0, j = g.length; i < j; i++) (g[i].fn !== b || d && !g[i].once || c && g[i].context !== c) && h.push(g[i]);
                return h.length ? this._events[e] = 1 === h.length ? h[0] : h : delete this._events[e], 
                this;
            }, e.prototype.removeAllListeners = function(a) {
                return this._events ? (a ? delete this._events[f ? f + a : a] : this._events = f ? {} : Object.create(null), 
                this) : this;
            }, e.prototype.off = e.prototype.removeListener, e.prototype.addListener = e.prototype.on, 
            e.prototype.setMaxListeners = function() {
                return this;
            }, e.prefixed = f, void 0 !== b && (b.exports = e);
        }, {} ],
        11: [ function(a, b, c) {
            "use strict";
            b.exports = function(a, b) {
                if (b = b.split(":")[0], !(a = +a)) return !1;
                switch (b) {
                  case "http":
                  case "ws":
                    return 80 !== a;

                  case "https":
                  case "wss":
                    return 443 !== a;

                  case "ftp":
                    return 21 !== a;

                  case "gopher":
                    return 70 !== a;

                  case "file":
                    return !1;
                }
                return 0 !== a;
            };
        }, {} ],
        12: [ function(a, b, c) {
            (function(c, d) {
                "use strict";
                function e(a, b, c, d) {
                    this.start = +new Date(), this.duration = c, this.clear = b, this.timer = a, this.fns = [ d ];
                }
                function f(a) {
                    clearTimeout(a);
                }
                function g(a) {
                    clearInterval(a);
                }
                function h(a) {
                    d(a);
                }
                function i(a) {
                    if (!(this instanceof i)) return new i(a);
                    this.timers = {}, this.context = a || this;
                }
                var j = Object.prototype.hasOwnProperty, k = a("millisecond");
                e.prototype.remaining = function() {
                    return this.duration - this.taken();
                }, e.prototype.taken = function() {
                    return +new Date() - this.start;
                }, i.prototype.tock = function(a, b) {
                    var c = this;
                    return function() {
                        if (a in c.timers) {
                            var d = c.timers[a], e = d.fns.slice(), f = e.length, g = 0;
                            for (b ? c.clear(a) : c.start = +new Date(); g < f; g++) e[g].call(c.context);
                        }
                    };
                }, i.prototype.setTimeout = function(a, b, c) {
                    var d, g = this;
                    return g.timers[a] ? (g.timers[a].fns.push(b), g) : (d = k(c), g.timers[a] = new e(setTimeout(g.tock(a, !0), k(c)), f, d, b), 
                    g);
                }, i.prototype.setInterval = function(a, b, c) {
                    var d, f = this;
                    return f.timers[a] ? (f.timers[a].fns.push(b), f) : (d = k(c), f.timers[a] = new e(setInterval(f.tock(a), k(c)), g, d, b), 
                    f);
                }, i.prototype.setImmediate = function(a, b) {
                    var d = this;
                    return "function" != typeof c ? d.setTimeout(a, b, 0) : d.timers[a] ? (d.timers[a].fns.push(b), 
                    d) : (d.timers[a] = new e(c(d.tock(a, !0)), h, 0, b), d);
                }, i.prototype.active = function(a) {
                    return a in this.timers;
                }, i.prototype.clear = function() {
                    var a, b, c, d = arguments.length ? arguments : [], e = this;
                    if (1 === d.length && "string" == typeof d[0] && (d = d[0].split(/[, ]+/)), !d.length) for (a in e.timers) j.call(e.timers, a) && d.push(a);
                    for (b = 0, c = d.length; b < c; b++) (a = e.timers[d[b]]) && (a.clear(a.timer), 
                    a.fns = a.timer = a.clear = null, delete e.timers[d[b]]);
                    return e;
                }, i.prototype.adjust = function(a, b) {
                    var c, d = this, e = k(b), f = d.timers[a];
                    return f ? (c = f.clear === g, f.clear(f.timer), f.start = +new Date(), f.duration = e, 
                    f.timer = (c ? setInterval : setTimeout)(d.tock(a, !c), e), d) : d;
                }, i.prototype.end = i.prototype.destroy = function() {
                    return !!this.context && (this.clear(), this.context = this.timers = null, !0);
                }, i.Timer = e, b.exports = i;
            }).call(this, a("timers").setImmediate, a("timers").clearImmediate);
        }, {
            millisecond: 5,
            timers: 13
        } ],
        13: [ function(a, b, c) {
            (function(b, d) {
                function e(a, b) {
                    this._id = a, this._clearFn = b;
                }
                var f = a("process/browser.js").nextTick, g = Function.prototype.apply, h = Array.prototype.slice, i = {}, j = 0;
                c.setTimeout = function() {
                    return new e(g.call(setTimeout, window, arguments), clearTimeout);
                }, c.setInterval = function() {
                    return new e(g.call(setInterval, window, arguments), clearInterval);
                }, c.clearTimeout = c.clearInterval = function(a) {
                    a.close();
                }, e.prototype.unref = e.prototype.ref = function() {}, e.prototype.close = function() {
                    this._clearFn.call(window, this._id);
                }, c.enroll = function(a, b) {
                    clearTimeout(a._idleTimeoutId), a._idleTimeout = b;
                }, c.unenroll = function(a) {
                    clearTimeout(a._idleTimeoutId), a._idleTimeout = -1;
                }, c._unrefActive = c.active = function(a) {
                    clearTimeout(a._idleTimeoutId);
                    var b = a._idleTimeout;
                    b >= 0 && (a._idleTimeoutId = setTimeout(function() {
                        a._onTimeout && a._onTimeout();
                    }, b));
                }, c.setImmediate = "function" == typeof b ? b : function(a) {
                    var b = j++, d = !(arguments.length < 2) && h.call(arguments, 1);
                    return i[b] = !0, f(function() {
                        i[b] && (d ? a.apply(null, d) : a.call(null), c.clearImmediate(b));
                    }), b;
                }, c.clearImmediate = "function" == typeof d ? d : function(a) {
                    delete i[a];
                };
            }).call(this, a("timers").setImmediate, a("timers").clearImmediate);
        }, {
            "process/browser.js": 7,
            timers: 13
        } ],
        14: [ function(a, b, c) {
            (function(c) {
                "use strict";
                function d(a) {
                    a = a || c.location || {};
                    var b, d = {}, e = typeof a;
                    if ("blob:" === a.protocol) d = new g(unescape(a.pathname), {}); else if ("string" === e) {
                        d = new g(a, {});
                        for (b in o) delete d[b];
                    } else if ("object" === e) {
                        for (b in a) b in o || (d[b] = a[b]);
                        void 0 === d.slashes && (d.slashes = m.test(a.href));
                    }
                    return d;
                }
                function e(a) {
                    var b = l.exec(a);
                    return {
                        protocol: b[1] ? b[1].toLowerCase() : "",
                        slashes: !!b[2],
                        rest: b[3]
                    };
                }
                function f(a, b) {
                    for (var c = (b || "/").split("/").slice(0, -1).concat(a.split("/")), d = c.length, e = c[d - 1], f = !1, g = 0; d--; ) "." === c[d] ? c.splice(d, 1) : ".." === c[d] ? (c.splice(d, 1), 
                    g++) : g && (0 === d && (f = !0), c.splice(d, 1), g--);
                    return f && c.unshift(""), "." !== e && ".." !== e || c.push(""), c.join("/");
                }
                function g(a, b, c) {
                    if (!(this instanceof g)) return new g(a, b, c);
                    var h, i, l, m, o, p, q = n.slice(), r = typeof b, s = this, t = 0;
                    for ("object" !== r && "string" !== r && (c = b, b = null), c && "function" != typeof c && (c = k.parse), 
                    b = d(b), i = e(a || ""), h = !i.protocol && !i.slashes, s.slashes = i.slashes || h && b.slashes, 
                    s.protocol = i.protocol || b.protocol || "", a = i.rest, i.slashes || (q[2] = [ /(.*)/, "pathname" ]); t < q.length; t++) m = q[t], 
                    l = m[0], p = m[1], l !== l ? s[p] = a : "string" == typeof l ? ~(o = a.indexOf(l)) && ("number" == typeof m[2] ? (s[p] = a.slice(0, o), 
                    a = a.slice(o + m[2])) : (s[p] = a.slice(o), a = a.slice(0, o))) : (o = l.exec(a)) && (s[p] = o[1], 
                    a = a.slice(0, o.index)), s[p] = s[p] || (h && m[3] ? b[p] || "" : ""), m[4] && (s[p] = s[p].toLowerCase());
                    c && (s.query = c(s.query)), h && b.slashes && "/" !== s.pathname.charAt(0) && ("" !== s.pathname || "" !== b.pathname) && (s.pathname = f(s.pathname, b.pathname)), 
                    j(s.port, s.protocol) || (s.host = s.hostname, s.port = ""), s.username = s.password = "", 
                    s.auth && (m = s.auth.split(":"), s.username = m[0] || "", s.password = m[1] || ""), 
                    s.origin = s.protocol && s.host && "file:" !== s.protocol ? s.protocol + "//" + s.host : "null", 
                    s.href = s.toString();
                }
                function h(a, b, c) {
                    var d = this;
                    switch (a) {
                      case "query":
                        "string" == typeof b && b.length && (b = (c || k.parse)(b)), d[a] = b;
                        break;

                      case "port":
                        d[a] = b, j(b, d.protocol) ? b && (d.host = d.hostname + ":" + b) : (d.host = d.hostname, 
                        d[a] = "");
                        break;

                      case "hostname":
                        d[a] = b, d.port && (b += ":" + d.port), d.host = b;
                        break;

                      case "host":
                        d[a] = b, /:\d+$/.test(b) ? (b = b.split(":"), d.port = b.pop(), d.hostname = b.join(":")) : (d.hostname = b, 
                        d.port = "");
                        break;

                      case "protocol":
                        d.protocol = b.toLowerCase(), d.slashes = !c;
                        break;

                      case "pathname":
                      case "hash":
                        if (b) {
                            var e = "pathname" === a ? "/" : "#";
                            d[a] = b.charAt(0) !== e ? e + b : b;
                        } else d[a] = b;
                        break;

                      default:
                        d[a] = b;
                    }
                    for (var f = 0; f < n.length; f++) {
                        var g = n[f];
                        g[4] && (d[g[1]] = d[g[1]].toLowerCase());
                    }
                    return d.origin = d.protocol && d.host && "file:" !== d.protocol ? d.protocol + "//" + d.host : "null", 
                    d.href = d.toString(), d;
                }
                function i(a) {
                    a && "function" == typeof a || (a = k.stringify);
                    var b, c = this, d = c.protocol;
                    d && ":" !== d.charAt(d.length - 1) && (d += ":");
                    var e = d + (c.slashes ? "//" : "");
                    return c.username && (e += c.username, c.password && (e += ":" + c.password), e += "@"), 
                    e += c.host + c.pathname, b = "object" == typeof c.query ? a(c.query) : c.query, 
                    b && (e += "?" !== b.charAt(0) ? "?" + b : b), c.hash && (e += c.hash), e;
                }
                var j = a("requires-port"), k = a("querystringify"), l = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i, m = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, n = [ [ "#", "hash" ], [ "?", "query" ], [ "/", "pathname" ], [ "@", "auth", 1 ], [ NaN, "host", void 0, 1, 1 ], [ /:(\d+)$/, "port", void 0, 1 ], [ NaN, "hostname", void 0, 1, 1 ] ], o = {
                    hash: 1,
                    query: 1
                };
                g.prototype = {
                    set: h,
                    toString: i
                }, g.extractProtocol = e, g.location = d, g.qs = k, b.exports = g;
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            querystringify: 8,
            "requires-port": 11
        } ],
        15: [ function(a, b, c) {
            "use strict";
            function d(a) {
                var b = "";
                do {
                    b = h[a % i] + b, a = Math.floor(a / i);
                } while (a > 0);
                return b;
            }
            function e(a) {
                var b = 0;
                for (l = 0; l < a.length; l++) b = b * i + j[a.charAt(l)];
                return b;
            }
            function f() {
                var a = d(+new Date());
                return a !== g ? (k = 0, g = a) : a + "." + d(k++);
            }
            for (var g, h = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), i = 64, j = {}, k = 0, l = 0; l < i; l++) j[h[l]] = l;
            f.encode = d, f.decode = e, b.exports = f;
        }, {} ],
        16: [ function(a, c, d) {
            "use strict";
            function e(a, b) {
                if (!(a instanceof f)) {
                    var c = new Error("Primus#" + b + "'s context should called with a Primus instance");
                    if ("function" != typeof a.listeners || !a.listeners("error").length) throw c;
                    a.emit("error", c);
                }
            }
            function f(a, b) {
                if (!(this instanceof f)) return new f(a, b);
                if (f.Stream.call(this), "function" != typeof this.client) return this.critical(new Error("The client library has not been compiled correctly, see https://github.com/primus/primus#client-library for more details"));
                if ("object" == typeof a ? (b = a, a = b.url || b.uri || g) : b = b || {}, "ping" in b || "pong" in b) return this.critical(new Error("The `ping` and `pong` options have been removed"));
                var c = this;
                b.queueSize = "queueSize" in b ? b.queueSize : 1 / 0, b.timeout = "timeout" in b ? b.timeout : 1e4, 
                b.reconnect = "reconnect" in b ? b.reconnect : {}, b.pingTimeout = "pingTimeout" in b && b.pingTimeout, 
                b.strategy = "strategy" in b ? b.strategy : [], b.transport = "transport" in b ? b.transport : {}, 
                c.buffer = [], c.writable = !0, c.readable = !0, c.url = c.parse(a || g), c.readyState = f.CLOSED, 
                c.options = b, c.timers = new i(this), c.socket = null, c.disconnect = !1, c.transport = b.transport, 
                c.transformers = {
                    outgoing: [],
                    incoming: []
                }, c.recovery = new j(b.reconnect), "string" == typeof b.strategy && (b.strategy = b.strategy.split(/\s?,\s?/g)), 
                !1 === b.strategy ? b.strategy = [] : b.strategy.length || (b.strategy.push("disconnect", "online"), 
                this.authorization || b.strategy.push("timeout")), b.strategy = b.strategy.join(",").toLowerCase(), 
                "websockets" in b && (c.AVOID_WEBSOCKETS = !b.websockets), "network" in b && (c.NETWORK_EVENTS = b.network), 
                b.manual || c.timers.setTimeout("open", function() {
                    c.timers.clear("open"), c.open();
                }, 0), c.initialise(b);
            }
            var g, h = a("eventemitter3"), i = a("tick-tock"), j = a("recovery"), k = a("querystringify"), l = a("inherits"), m = a("demolish"), n = a("yeast"), o = /\u2028/g, p = /\u2029/g;
            try {
                g = location.origin ? location.origin : location.protocol + "//" + location.host;
            } catch (a) {
                g = "http://127.0.0.1";
            }
            f.requires = f.require = function(b) {
                if ("function" == typeof a) return a(b);
            };
            try {
                f.Stream = f.requires("stream");
            } catch (a) {}
            f.Stream || (f.Stream = h), l(f, f.Stream), f.OPENING = 1, f.CLOSED = 2, f.OPEN = 3, 
            f.prototype.AVOID_WEBSOCKETS = !1, f.prototype.NETWORK_EVENTS = !1, f.prototype.online = !0;
            try {
                (f.prototype.NETWORK_EVENTS = "onLine" in navigator && (window.addEventListener || document.body.attachEvent)) && (navigator.onLine || (f.prototype.online = !1));
            } catch (a) {}
            if (f.prototype.ark = {}, f.prototype.emits = a("emits"), f.prototype.plugin = function(a) {
                if (e(this, "plugin"), a) return this.ark[a];
                var b = {};
                for (a in this.ark) b[a] = this.ark[a];
                return b;
            }, f.prototype.reserved = function(a) {
                return /^(incoming|outgoing)::/.test(a) || a in this.reserved.events;
            }, f.prototype.reserved.events = {
                "reconnect scheduled": 1,
                "reconnect timeout": 1,
                readyStateChange: 1,
                "reconnect failed": 1,
                reconnected: 1,
                reconnect: 1,
                offline: 1,
                timeout: 1,
                destroy: 1,
                online: 1,
                error: 1,
                close: 1,
                open: 1,
                data: 1,
                end: 1
            }, f.prototype.initialise = function(a) {
                var b = this;
                b.recovery.on("reconnected", b.emits("reconnected")).on("reconnect failed", b.emits("reconnect failed", function(a) {
                    b.emit("end"), a();
                })).on("reconnect timeout", b.emits("reconnect timeout")).on("reconnect scheduled", b.emits("reconnect scheduled")).on("reconnect", b.emits("reconnect", function(a) {
                    b.emit("outgoing::reconnect"), a();
                })), b.on("outgoing::open", function() {
                    var a = b.readyState;
                    b.readyState = f.OPENING, a !== b.readyState && b.emit("readyStateChange", "opening");
                }), b.on("incoming::open", function() {
                    var a = b.readyState;
                    if (b.recovery.reconnecting() && b.recovery.reconnected(), b.writable = !0, b.readable = !0, 
                    b.online || (b.online = !0, b.emit("online")), b.readyState = f.OPEN, a !== b.readyState && b.emit("readyStateChange", "open"), 
                    b.heartbeat(), b.buffer.length) {
                        var c = b.buffer.slice(), d = c.length, e = 0;
                        for (b.buffer.length = 0; e < d; e++) b._write(c[e]);
                    }
                    b.emit("open");
                }), b.on("incoming::ping", function(a) {
                    b.online = !0, b.heartbeat(), b.emit("outgoing::pong", a), b._write("primus::pong::" + a);
                }), b.on("incoming::error", function(a) {
                    var c = b.timers.active("connect"), d = a;
                    if ("string" == typeof a) d = new Error(a); else if (!(a instanceof Error) && "object" == typeof a) {
                        d = new Error(a.message || a.reason);
                        for (var e in a) Object.prototype.hasOwnProperty.call(a, e) && (d[e] = a[e]);
                    }
                    if (b.recovery.reconnecting()) return b.recovery.reconnected(d);
                    b.listeners("error").length && b.emit("error", d), c && (~b.options.strategy.indexOf("timeout") ? b.recovery.reconnect() : b.end());
                }), b.on("incoming::data", function(a) {
                    b.decoder(a, function(c, d) {
                        if (c) return b.listeners("error").length && b.emit("error", c);
                        b.protocol(d) || b.transforms(b, b, "incoming", d, a);
                    });
                }), b.on("incoming::end", function() {
                    var a = b.readyState;
                    return b.disconnect ? (b.disconnect = !1, b.end()) : (b.readyState = f.CLOSED, a !== b.readyState && b.emit("readyStateChange", "end"), 
                    b.timers.active("connect") && b.end(), a !== f.OPEN ? !!b.recovery.reconnecting() && b.recovery.reconnect() : (this.writable = !1, 
                    this.readable = !1, this.timers.clear(), b.emit("close"), ~b.options.strategy.indexOf("disconnect") ? b.recovery.reconnect() : (b.emit("outgoing::end"), 
                    void b.emit("end"))));
                }), b.client();
                for (var c in b.ark) b.ark[c].call(b, b, a);
                return b.NETWORK_EVENTS ? (b.offlineHandler = function() {
                    b.online && (b.online = !1, b.emit("offline"), b.end(), b.recovery.reset());
                }, b.onlineHandler = function() {
                    b.online || (b.online = !0, b.emit("online"), ~b.options.strategy.indexOf("online") && b.recovery.reconnect());
                }, window.addEventListener ? (window.addEventListener("offline", b.offlineHandler, !1), 
                window.addEventListener("online", b.onlineHandler, !1)) : document.body.attachEvent && (document.body.attachEvent("onoffline", b.offlineHandler), 
                document.body.attachEvent("ononline", b.onlineHandler)), b) : b;
            }, f.prototype.protocol = function(a) {
                if ("string" != typeof a || 0 !== a.indexOf("primus::")) return !1;
                var b = a.indexOf(":", 8), c = a.slice(b + 2);
                switch (a.slice(8, b)) {
                  case "ping":
                    this.emit("incoming::ping", +c);
                    break;

                  case "server":
                    "close" === c && (this.disconnect = !0);
                    break;

                  case "id":
                    this.emit("incoming::id", c);
                    break;

                  default:
                    return !1;
                }
                return !0;
            }, f.prototype.transforms = function(a, b, c, d, e) {
                var f = {
                    data: d
                }, g = a.transformers[c];
                return function a(c, d) {
                    var e = g[c++];
                    if (!e) return d();
                    if (1 === e.length) {
                        if (!1 === e.call(b, f)) return;
                        return a(c, d);
                    }
                    e.call(b, f, function(e, f) {
                        if (e) return b.emit("error", e);
                        !1 !== f && a(c, d);
                    });
                }(0, function() {
                    if ("incoming" === c) return b.emit("data", f.data, e);
                    b._write(f.data);
                }), this;
            }, f.prototype.id = function(a) {
                return this.socket && this.socket.id ? a(this.socket.id) : (this._write("primus::id::"), 
                this.once("incoming::id", a));
            }, f.prototype.open = function() {
                return e(this, "open"), !this.recovery.reconnecting() && this.options.timeout && this.timeout(), 
                this.emit("outgoing::open"), this;
            }, f.prototype.write = function(a) {
                return e(this, "write"), this.transforms(this, this, "outgoing", a), !0;
            }, f.prototype._write = function(a) {
                var b = this;
                return f.OPEN !== b.readyState ? (this.buffer.length === this.options.queueSize && this.buffer.splice(0, 1), 
                this.buffer.push(a), !1) : (b.encoder(a, function(a, c) {
                    if (a) return b.listeners("error").length && b.emit("error", a);
                    "string" == typeof c && (~c.indexOf("\u2028") && (c = c.replace(o, "\\u2028")), 
                    ~c.indexOf("\u2029") && (c = c.replace(p, "\\u2029"))), b.emit("outgoing::data", c);
                }), !0);
            }, f.prototype.heartbeat = function() {
                return this.options.pingTimeout ? (this.timers.clear("heartbeat"), this.timers.setTimeout("heartbeat", function() {
                    this.online && (this.online = !1, this.emit("offline"), this.emit("incoming::end"));
                }, this.options.pingTimeout), this) : this;
            }, f.prototype.timeout = function() {
                function a() {
                    b.removeListener("error", a).removeListener("open", a).removeListener("end", a).timers.clear("connect");
                }
                var b = this;
                return b.timers.setTimeout("connect", function() {
                    a(), b.readyState === f.OPEN || b.recovery.reconnecting() || (b.emit("timeout"), 
                    ~b.options.strategy.indexOf("timeout") ? b.recovery.reconnect() : b.end());
                }, b.options.timeout), b.on("error", a).on("open", a).on("end", a);
            }, f.prototype.end = function(a) {
                if (e(this, "end"), this.readyState === f.CLOSED && !this.timers.active("connect") && !this.timers.active("open")) return this.recovery.reconnecting() && (this.recovery.reset(), 
                this.emit("end")), this;
                void 0 !== a && this.write(a), this.writable = !1, this.readable = !1;
                var b = this.readyState;
                return this.readyState = f.CLOSED, b !== this.readyState && this.emit("readyStateChange", "end"), 
                this.timers.clear(), this.emit("outgoing::end"), this.emit("close"), this.emit("end"), 
                this;
            }, f.prototype.destroy = m("url timers options recovery socket transport transformers", {
                before: "end",
                after: [ "removeAllListeners", function() {
                    this.NETWORK_EVENTS && (window.addEventListener ? (window.removeEventListener("offline", this.offlineHandler), 
                    window.removeEventListener("online", this.onlineHandler)) : document.body.attachEvent && (document.body.detachEvent("onoffline", this.offlineHandler), 
                    document.body.detachEvent("ononline", this.onlineHandler)));
                } ]
            }), f.prototype.clone = function(a) {
                return this.merge({}, a);
            }, f.prototype.merge = function(a) {
                for (var b, c, d = 1; d < arguments.length; d++) {
                    c = arguments[d];
                    for (b in c) Object.prototype.hasOwnProperty.call(c, b) && (a[b] = c[b]);
                }
                return a;
            }, f.prototype.parse = a("url-parse"), f.prototype.querystring = k.parse, f.prototype.querystringify = k.stringify, 
            f.prototype.uri = function(a) {
                var b = this.url, c = [], d = !1;
                a.query && (d = !0), a = a || {}, a.protocol = "protocol" in a ? a.protocol : "http:", 
                a.query = !(!b.query || !d) && b.query.slice(1), a.secure = "secure" in a ? a.secure : "https:" === b.protocol || "wss:" === b.protocol, 
                a.auth = "auth" in a ? a.auth : b.auth, a.pathname = "pathname" in a ? a.pathname : this.pathname, 
                a.port = "port" in a ? +a.port : +b.port || (a.secure ? 443 : 80);
                var e = this.querystring(a.query || "");
                return e._primuscb = n(), a.query = this.querystringify(e), this.emit("outgoing::url", a), 
                c.push(a.secure ? a.protocol.replace(":", "s:") : a.protocol, ""), c.push(a.auth ? a.auth + "@" + b.host : b.host), 
                a.pathname && c.push(a.pathname.slice(1)), d ? c[c.length - 1] += "?" + a.query : delete a.query, 
                a.object ? a : c.join("/");
            }, f.prototype.transform = function(a, b) {
                return e(this, "transform"), a in this.transformers ? (this.transformers[a].push(b), 
                this) : this.critical(new Error("Invalid transformer type"));
            }, f.prototype.critical = function(a) {
                if (this.emit("error", a)) return this;
                throw a;
            }, f.connect = function(a, b) {
                return new f(a, b);
            }, f.EventEmitter = h, f.prototype.client = function() {
                var a, b = this, c = function() {
                    if ("undefined" != typeof WebSocket) return WebSocket;
                    if ("undefined" != typeof MozWebSocket) return MozWebSocket;
                    try {
                        return f.requires("ws");
                    } catch (a) {}
                }();
                if (!c) return b.critical(new Error("Missing required `ws` module. Please run `npm install --save ws`"));
                b.on("outgoing::open", function() {
                    b.emit("outgoing::end");
                    try {
                        var d = {
                            protocol: "ws+unix:" === b.url.protocol ? "ws+unix:" : "ws:",
                            query: !0
                        };
                        3 === c.length ? ("ws+unix:" === d.protocol && (d.pathname = b.url.pathname + ":" + b.pathname), 
                        b.socket = a = new c(b.uri(d), [], b.transport)) : (b.socket = a = new c(b.uri(d)), 
                        a.binaryType = "arraybuffer");
                    } catch (a) {
                        return b.emit("error", a);
                    }
                    a.onopen = b.emits("incoming::open"), a.onerror = b.emits("incoming::error"), a.onclose = b.emits("incoming::end"), 
                    a.onmessage = b.emits("incoming::data", function(a, b) {
                        a(void 0, b.data);
                    });
                }), b.on("outgoing::data", function(d) {
                    if (a && a.readyState === c.OPEN) try {
                        a.send(d);
                    } catch (a) {
                        b.emit("incoming::error", a);
                    }
                }), b.on("outgoing::reconnect", function() {
                    b.emit("outgoing::open");
                }), b.on("outgoing::end", function() {
                    a && (a.onerror = a.onopen = a.onclose = a.onmessage = function() {}, a.close(), 
                    a = null);
                });
            }, f.prototype.authorization = !1, f.prototype.pathname = "/kark.live2222", f.prototype.encoder = function(a, c) {
                var d;
                try {
                    a = b.pack(a);
                } catch (a) {
                    d = a;
                }
                c(d, a);
            }, f.prototype.decoder = function(a, c) {
                var d;
                try {
                    a = b.unpack(a);
                } catch (a) {
                    d = a;
                }
                c(d, a);
            }, f.prototype.version = "7.2.1", "undefined" != typeof document && "undefined" != typeof navigator) {
                document.addEventListener && document.addEventListener("keydown", function(a) {
                    27 === a.keyCode && a.preventDefault && a.preventDefault();
                }, !1);
                var q = (navigator.userAgent || "").toLowerCase(), r = q.match(/.+(?:rv|it|ra|ie)[\/: ](\d+)\.(\d+)(?:\.(\d+))?/) || [], s = +[ r[1], r[2] ].join(".");
                !~q.indexOf("chrome") && ~q.indexOf("safari") && s < 534.54 && (f.prototype.AVOID_WEBSOCKETS = !0);
            }
            c.exports = f;
        }, {
            demolish: 1,
            emits: 2,
            eventemitter3: 3,
            inherits: 4,
            querystringify: 8,
            recovery: 9,
            "tick-tock": 12,
            "url-parse": 14,
            yeast: 15
        } ]
    }, {}, [ 16 ])(16), b = function() {
        var b, c;
        try {
            c = a.requires("binary-pack");
        } catch (a) {}
        return c || (b = {}, function() {
            !function(a) {
                !function a(b, c, d) {
                    function e(g, h) {
                        if (!c[g]) {
                            if (!b[g]) {
                                var i = "function" == typeof require && require;
                                if (!h && i) return i(g, !0);
                                if (f) return f(g, !0);
                                var j = new Error("Cannot find module '" + g + "'");
                                throw j.code = "MODULE_NOT_FOUND", j;
                            }
                            var k = c[g] = {
                                exports: {}
                            };
                            b[g][0].call(k.exports, function(a) {
                                var c = b[g][1][a];
                                return e(c || a);
                            }, k, k.exports, a, b, c, d);
                        }
                        return c[g].exports;
                    }
                    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
                    return e;
                }({
                    1: [ function(a, b, c) {
                        function d(a) {
                            this.index = 0, this.dataBuffer = a, this.dataView = new Uint8Array(this.dataBuffer), 
                            this.length = this.dataBuffer.byteLength;
                        }
                        function e() {
                            this.bufferBuilder = new h();
                        }
                        function f(a) {
                            var b = a.charCodeAt(0);
                            return b <= 2047 ? "00" : b <= 65535 ? "000" : b <= 2097151 ? "0000" : b <= 67108863 ? "00000" : "000000";
                        }
                        function g(a) {
                            return a.length > 600 ? new Blob([ a ]).size : a.replace(/[^\u0000-\u007F]/g, f).length;
                        }
                        var h = a("./bufferbuilder").BufferBuilder, i = a("./bufferbuilder").binaryFeatures, j = {
                            unpack: function(a) {
                                return new d(a).unpack();
                            },
                            pack: function(a) {
                                var b = new e();
                                return b.pack(a), b.getBuffer();
                            }
                        };
                        b.exports = j, d.prototype.unpack = function() {
                            var a = this.unpack_uint8();
                            if (a < 128) {
                                return a;
                            }
                            if ((224 ^ a) < 32) {
                                return (224 ^ a) - 32;
                            }
                            var b;
                            if ((b = 160 ^ a) <= 15) return this.unpack_raw(b);
                            if ((b = 176 ^ a) <= 15) return this.unpack_string(b);
                            if ((b = 144 ^ a) <= 15) return this.unpack_array(b);
                            if ((b = 128 ^ a) <= 15) return this.unpack_map(b);
                            switch (a) {
                              case 192:
                                return null;

                              case 193:
                                return;

                              case 194:
                                return !1;

                              case 195:
                                return !0;

                              case 202:
                                return this.unpack_float();

                              case 203:
                                return this.unpack_double();

                              case 204:
                                return this.unpack_uint8();

                              case 205:
                                return this.unpack_uint16();

                              case 206:
                                return this.unpack_uint32();

                              case 207:
                                return this.unpack_uint64();

                              case 208:
                                return this.unpack_int8();

                              case 209:
                                return this.unpack_int16();

                              case 210:
                                return this.unpack_int32();

                              case 211:
                                return this.unpack_int64();

                              case 212:
                              case 213:
                              case 214:
                              case 215:
                                return;

                              case 216:
                                return b = this.unpack_uint16(), this.unpack_string(b);

                              case 217:
                                return b = this.unpack_uint32(), this.unpack_string(b);

                              case 218:
                                return b = this.unpack_uint16(), this.unpack_raw(b);

                              case 219:
                                return b = this.unpack_uint32(), this.unpack_raw(b);

                              case 220:
                                return b = this.unpack_uint16(), this.unpack_array(b);

                              case 221:
                                return b = this.unpack_uint32(), this.unpack_array(b);

                              case 222:
                                return b = this.unpack_uint16(), this.unpack_map(b);

                              case 223:
                                return b = this.unpack_uint32(), this.unpack_map(b);
                            }
                        }, d.prototype.unpack_uint8 = function() {
                            var a = 255 & this.dataView[this.index];
                            return this.index++, a;
                        }, d.prototype.unpack_uint16 = function() {
                            var a = this.read(2), b = 256 * (255 & a[0]) + (255 & a[1]);
                            return this.index += 2, b;
                        }, d.prototype.unpack_uint32 = function() {
                            var a = this.read(4), b = 256 * (256 * (256 * a[0] + a[1]) + a[2]) + a[3];
                            return this.index += 4, b;
                        }, d.prototype.unpack_uint64 = function() {
                            var a = this.read(8), b = 256 * (256 * (256 * (256 * (256 * (256 * (256 * a[0] + a[1]) + a[2]) + a[3]) + a[4]) + a[5]) + a[6]) + a[7];
                            return this.index += 8, b;
                        }, d.prototype.unpack_int8 = function() {
                            var a = this.unpack_uint8();
                            return a < 128 ? a : a - 256;
                        }, d.prototype.unpack_int16 = function() {
                            var a = this.unpack_uint16();
                            return a < 32768 ? a : a - 65536;
                        }, d.prototype.unpack_int32 = function() {
                            var a = this.unpack_uint32();
                            return a < Math.pow(2, 31) ? a : a - Math.pow(2, 32);
                        }, d.prototype.unpack_int64 = function() {
                            var a = this.unpack_uint64();
                            return a < Math.pow(2, 63) ? a : a - Math.pow(2, 64);
                        }, d.prototype.unpack_raw = function(a) {
                            if (this.length < this.index + a) throw new Error("BinaryPackFailure: index is out of range " + this.index + " " + a + " " + this.length);
                            var b = this.dataBuffer.slice(this.index, this.index + a);
                            return this.index += a, b;
                        }, d.prototype.unpack_string = function(a) {
                            for (var b, c, d = this.read(a), e = 0, f = ""; e < a; ) b = d[e], b < 128 ? (f += String.fromCharCode(b), 
                            e++) : (192 ^ b) < 32 ? (c = (192 ^ b) << 6 | 63 & d[e + 1], f += String.fromCharCode(c), 
                            e += 2) : (c = (15 & b) << 12 | (63 & d[e + 1]) << 6 | 63 & d[e + 2], f += String.fromCharCode(c), 
                            e += 3);
                            return this.index += a, f;
                        }, d.prototype.unpack_array = function(a) {
                            for (var b = new Array(a), c = 0; c < a; c++) b[c] = this.unpack();
                            return b;
                        }, d.prototype.unpack_map = function(a) {
                            for (var b = {}, c = 0; c < a; c++) {
                                var d = this.unpack(), e = this.unpack();
                                b[d] = e;
                            }
                            return b;
                        }, d.prototype.unpack_float = function() {
                            var a = this.unpack_uint32(), b = a >> 31, c = (a >> 23 & 255) - 127, d = 8388607 & a | 8388608;
                            return (0 == b ? 1 : -1) * d * Math.pow(2, c - 23);
                        }, d.prototype.unpack_double = function() {
                            var a = this.unpack_uint32(), b = this.unpack_uint32(), c = a >> 31, d = (a >> 20 & 2047) - 1023, e = 1048575 & a | 1048576, f = e * Math.pow(2, d - 20) + b * Math.pow(2, d - 52);
                            return (0 == c ? 1 : -1) * f;
                        }, d.prototype.read = function(a) {
                            var b = this.index;
                            if (b + a <= this.length) return this.dataView.subarray(b, b + a);
                            throw new Error("BinaryPackFailure: read index out of range");
                        }, e.prototype.getBuffer = function() {
                            return this.bufferBuilder.getBuffer();
                        }, e.prototype.pack = function(a) {
                            var b = typeof a;
                            if ("string" == b) this.pack_string(a); else if ("number" == b) Math.floor(a) === a ? this.pack_integer(a) : this.pack_double(a); else if ("boolean" == b) !0 === a ? this.bufferBuilder.append(195) : !1 === a && this.bufferBuilder.append(194); else if ("undefined" == b) this.bufferBuilder.append(192); else {
                                if ("object" != b) throw new Error('Type "' + b + '" not yet supported');
                                if (null === a) this.bufferBuilder.append(192); else {
                                    var c = a.constructor;
                                    if (c == Array) this.pack_array(a); else if (c == Blob || c == File) this.pack_bin(a); else if (c == ArrayBuffer) i.useArrayBufferView ? this.pack_bin(new Uint8Array(a)) : this.pack_bin(a); else if ("BYTES_PER_ELEMENT" in a) i.useArrayBufferView ? this.pack_bin(new Uint8Array(a.buffer)) : this.pack_bin(a.buffer); else if (c == Object) this.pack_object(a); else if (c == Date) this.pack_string(a.toString()); else {
                                        if ("function" != typeof a.toBinaryPack) throw new Error('Type "' + c.toString() + '" not yet supported');
                                        this.bufferBuilder.append(a.toBinaryPack());
                                    }
                                }
                            }
                            this.bufferBuilder.flush();
                        }, e.prototype.pack_bin = function(a) {
                            var b = a.length || a.byteLength || a.size;
                            if (b <= 15) this.pack_uint8(160 + b); else if (b <= 65535) this.bufferBuilder.append(218), 
                            this.pack_uint16(b); else {
                                if (!(b <= 4294967295)) throw new Error("Invalid length");
                                this.bufferBuilder.append(219), this.pack_uint32(b);
                            }
                            this.bufferBuilder.append(a);
                        }, e.prototype.pack_string = function(a) {
                            var b = g(a);
                            if (b <= 15) this.pack_uint8(176 + b); else if (b <= 65535) this.bufferBuilder.append(216), 
                            this.pack_uint16(b); else {
                                if (!(b <= 4294967295)) throw new Error("Invalid length");
                                this.bufferBuilder.append(217), this.pack_uint32(b);
                            }
                            this.bufferBuilder.append(a);
                        }, e.prototype.pack_array = function(a) {
                            var b = a.length;
                            if (b <= 15) this.pack_uint8(144 + b); else if (b <= 65535) this.bufferBuilder.append(220), 
                            this.pack_uint16(b); else {
                                if (!(b <= 4294967295)) throw new Error("Invalid length");
                                this.bufferBuilder.append(221), this.pack_uint32(b);
                            }
                            for (var c = 0; c < b; c++) this.pack(a[c]);
                        }, e.prototype.pack_integer = function(a) {
                            if (-32 <= a && a <= 127) this.bufferBuilder.append(255 & a); else if (0 <= a && a <= 255) this.bufferBuilder.append(204), 
                            this.pack_uint8(a); else if (-128 <= a && a <= 127) this.bufferBuilder.append(208), 
                            this.pack_int8(a); else if (0 <= a && a <= 65535) this.bufferBuilder.append(205), 
                            this.pack_uint16(a); else if (-32768 <= a && a <= 32767) this.bufferBuilder.append(209), 
                            this.pack_int16(a); else if (0 <= a && a <= 4294967295) this.bufferBuilder.append(206), 
                            this.pack_uint32(a); else if (-2147483648 <= a && a <= 2147483647) this.bufferBuilder.append(210), 
                            this.pack_int32(a); else if (-0x8000000000000000 <= a && a <= 0x8000000000000000) this.bufferBuilder.append(211), 
                            this.pack_int64(a); else {
                                if (!(0 <= a && a <= 0x10000000000000000)) throw new Error("Invalid integer");
                                this.bufferBuilder.append(207), this.pack_uint64(a);
                            }
                        }, e.prototype.pack_double = function(a) {
                            var b = 0;
                            a < 0 && (b = 1, a = -a);
                            var c = Math.floor(Math.log(a) / Math.LN2), d = a / Math.pow(2, c) - 1, e = Math.floor(d * Math.pow(2, 52)), f = Math.pow(2, 32), g = b << 31 | c + 1023 << 20 | e / f & 1048575, h = e % f;
                            this.bufferBuilder.append(203), this.pack_int32(g), this.pack_int32(h);
                        }, e.prototype.pack_object = function(a) {
                            var b = Object.keys(a), c = b.length;
                            if (c <= 15) this.pack_uint8(128 + c); else if (c <= 65535) this.bufferBuilder.append(222), 
                            this.pack_uint16(c); else {
                                if (!(c <= 4294967295)) throw new Error("Invalid length");
                                this.bufferBuilder.append(223), this.pack_uint32(c);
                            }
                            for (var d in a) a.hasOwnProperty(d) && (this.pack(d), this.pack(a[d]));
                        }, e.prototype.pack_uint8 = function(a) {
                            this.bufferBuilder.append(a);
                        }, e.prototype.pack_uint16 = function(a) {
                            this.bufferBuilder.append(a >> 8), this.bufferBuilder.append(255 & a);
                        }, e.prototype.pack_uint32 = function(a) {
                            var b = 4294967295 & a;
                            this.bufferBuilder.append((4278190080 & b) >>> 24), this.bufferBuilder.append((16711680 & b) >>> 16), 
                            this.bufferBuilder.append((65280 & b) >>> 8), this.bufferBuilder.append(255 & b);
                        }, e.prototype.pack_uint64 = function(a) {
                            var b = a / Math.pow(2, 32), c = a % Math.pow(2, 32);
                            this.bufferBuilder.append((4278190080 & b) >>> 24), this.bufferBuilder.append((16711680 & b) >>> 16), 
                            this.bufferBuilder.append((65280 & b) >>> 8), this.bufferBuilder.append(255 & b), 
                            this.bufferBuilder.append((4278190080 & c) >>> 24), this.bufferBuilder.append((16711680 & c) >>> 16), 
                            this.bufferBuilder.append((65280 & c) >>> 8), this.bufferBuilder.append(255 & c);
                        }, e.prototype.pack_int8 = function(a) {
                            this.bufferBuilder.append(255 & a);
                        }, e.prototype.pack_int16 = function(a) {
                            this.bufferBuilder.append((65280 & a) >> 8), this.bufferBuilder.append(255 & a);
                        }, e.prototype.pack_int32 = function(a) {
                            this.bufferBuilder.append(a >>> 24 & 255), this.bufferBuilder.append((16711680 & a) >>> 16), 
                            this.bufferBuilder.append((65280 & a) >>> 8), this.bufferBuilder.append(255 & a);
                        }, e.prototype.pack_int64 = function(a) {
                            var b = Math.floor(a / Math.pow(2, 32)), c = a % Math.pow(2, 32);
                            this.bufferBuilder.append((4278190080 & b) >>> 24), this.bufferBuilder.append((16711680 & b) >>> 16), 
                            this.bufferBuilder.append((65280 & b) >>> 8), this.bufferBuilder.append(255 & b), 
                            this.bufferBuilder.append((4278190080 & c) >>> 24), this.bufferBuilder.append((16711680 & c) >>> 16), 
                            this.bufferBuilder.append((65280 & c) >>> 8), this.bufferBuilder.append(255 & c);
                        };
                    }, {
                        "./bufferbuilder": 2
                    } ],
                    2: [ function(a, b, c) {
                        function d() {
                            this._pieces = [], this._parts = [];
                        }
                        var e = {};
                        e.useBlobBuilder = function() {
                            try {
                                return new Blob([]), !1;
                            } catch (a) {
                                return !0;
                            }
                        }(), e.useArrayBufferView = !e.useBlobBuilder && function() {
                            try {
                                return 0 === new Blob([ new Uint8Array([]) ]).size;
                            } catch (a) {
                                return !0;
                            }
                        }(), b.exports.binaryFeatures = e;
                        var f = b.exports.BlobBuilder;
                        "undefined" != typeof window && (f = b.exports.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder || window.BlobBuilder), 
                        d.prototype.append = function(a) {
                            "number" == typeof a ? this._pieces.push(a) : (this.flush(), this._parts.push(a));
                        }, d.prototype.flush = function() {
                            if (this._pieces.length > 0) {
                                var a = new Uint8Array(this._pieces);
                                e.useArrayBufferView || (a = a.buffer), this._parts.push(a), this._pieces = [];
                            }
                        }, d.prototype.getBuffer = function() {
                            if (this.flush(), e.useBlobBuilder) {
                                for (var a = new f(), b = 0, c = this._parts.length; b < c; b++) a.append(this._parts[b]);
                                return a.getBlob();
                            }
                            return new Blob(this._parts);
                        }, b.exports.BufferBuilder = d;
                    }, {} ],
                    3: [ function(b, c, d) {
                        a.BinaryPack = b("js-binarypack");
                    }, {
                        "js-binarypack": 1
                    } ]
                }, {}, [ 3 ]);
            }(this);
        }.call(b), b.BinaryPack);
    }();
    return a.prototype.ark.emitter = function() {}, a;
}, [ function(a) {
    !function(a, b) {
        function c(a, b) {
            "use strict";
            function c(a, b, c) {
                return /^(newListener|removeListener)/.test(a) ? this : (this.emitter.send.apply(this.emitter, arguments), 
                this);
            }
            var d = a.prototype.initialise;
            a.prototype.initialise = function() {
                this.emitter || (this.emitter = new b(this)), this.__initialise || d.apply(this, arguments);
            }, a.readable ? a.prototype.send || a.readable("send", c) : a.prototype.send = c;
        }
        function d() {
            "use strict";
            function a(b) {
                if (!(this instanceof a)) return new a(b);
                this.ids = 1, this.acks = {}, this.conn = b, this.conn && this.bind();
            }
            var b = Object.prototype.toString, c = Array.prototype.slice, d = Array.isArray || function(a) {
                return "[object Array]" === b.call(a);
            }, e = {
                EVENT: 0,
                ACK: 1
            };
            return a.prototype.bind = function() {
                var a = this;
                return this.conn.on("data", function(b) {
                    a.ondata.call(a, b);
                }), this;
            }, a.prototype.ondata = function(a) {
                if (!d(a.data) || a.id && "number" != typeof a.id) return this;
                switch (a.type) {
                  case e.EVENT:
                    this.onevent(a);
                    break;

                  case e.ACK:
                    this.onack(a);
                }
                return this;
            }, a.prototype.send = function() {
                var a = c.call(arguments);
                return this.conn.write(this.packet(a)), this;
            }, a.prototype.packet = function(a) {
                var b = {
                    type: e.EVENT,
                    data: a
                };
                if ("function" == typeof a[a.length - 1]) {
                    var c = this.ids++;
                    this.acks[c] = a.pop(), b.id = c;
                }
                return b;
            }, a.prototype.onevent = function(a) {
                var b = a.data;
                return this.conn.reserved(b[0]) ? this : (a.id && b.push(this.ack(a.id)), this.conn.emit.apply(this.conn, b), 
                this);
            }, a.prototype.ack = function(a) {
                var b = this.conn, d = !1;
                return function() {
                    d || (d = !0, b.write({
                        id: a,
                        type: e.ACK,
                        data: c.call(arguments)
                    }));
                };
            }, a.prototype.onack = function(a) {
                var b = this.acks[a.id];
                return "function" == typeof b && (b.apply(this, a.data), delete this.acks[a.id]), 
                this;
            }, a.packets = e, a;
        }
        void 0 !== a && (a.$ = a.$ || {}, a.$.emitter = {}, a.$.emitter.spark = c, a.$.emitter.emitter = d, 
        c(a, d()));
    }(a);
} ]), this.Soulcrashers = this.Soulcrashers || {}, this.Soulcrashers.Templates = this.Soulcrashers.Templates || {}, 
this.Soulcrashers.Templates["avatar-sel"] = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '  <span class="skintabs tn-tab t-unselectable" data-tab="' + i((f = null != (f = c.type || (null != b ? b.type : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "type",
            hash: {},
            data: e
        }) : f)) + '"> ' + i((f = null != (f = c.type || (null != b ? b.type : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "type",
            hash: {},
            data: e
        }) : f)) + "</span>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = ' <div class="tn-tabs-border"></div>\n';
        return g = null != (g = c.avatartypes || (null != b ? b.avatartypes : b)) ? g : c.helperMissing, 
        h = {
            name: "avatartypes",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.avatartypes || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), 
        i + "  ";
    },
    useData: !0
}), this.Soulcrashers.Templates.backskins = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '<option class="skinoption">' + a.escapeExpression((f = null != (f = c.bskin || (null != b ? b.bskin : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "bskin",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.backskins || (null != b ? b.backskins : b)) ? g : c.helperMissing, 
        h = {
            name: "backskins",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.backskins || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), 
        i;
    },
    useData: !0
}), this.Soulcrashers.Templates.blank = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '     <div class="ol-blank-div">\n<span class="t-unselectable bl_heading">' + i((f = null != (f = c.heading || (null != b ? b.heading : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "heading",
            hash: {},
            data: e
        }) : f)) + '</span>\n     <div class="ol-blank-sign"><i style=" color:#2875ad;\n    font-size: 1400%;\n    margin-right: 2px;\n    position: absolute;\n    bottom: 0;\n    margin: auto;\n    line-height: 190px;\n    display: inline-block;\n    left: 0;\n    right: 0;\n    height: 100%;" class="glyphicon ' + i((f = null != (f = c.gly1 || (null != b ? b.gly1 : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "gly1",
            hash: {},
            data: e
        }) : f)) + '">\n       <i style="color: #ff0000;\n    font-size: 30%;\n    margin-right: 2px;\n    position: absolute;\n    bottom: 0;\n    margin: auto;\n    left: 0;\n    left: 0;\n    right: -16%;\n    top: 68%;" class="glyphicon ' + i((f = null != (f = c.gly2 || (null != b ? b.gly2 : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "gly2",
            hash: {},
            data: e
        }) : f)) + '"></i>\n    \n    </i>\n </div>\n <span class="t-unselectable issue">' + i((f = null != (f = c.issue || (null != b ? b.issue : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "issue",
            hash: {},
            data: e
        }) : f)) + "</span>\n     </div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.chatType = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return "                <option>" + a.escapeExpression((f = null != (f = c.data || (null != b ? b.data : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "data",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.opt || (null != b ? b.opt : b)) ? g : c.helperMissing, 
        h = {
            name: "opt",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.opt || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.citiesall = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '    <li class="clearfix">\n      <span class="city"><span class="city-nm">' + a.escapeExpression((f = null != (f = c.cityName || (null != b ? b.cityName : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "cityName",
            hash: {},
            data: e
        }) : f)) + '</span> <span class="glowbtn glow-inactive" data-toggle="tooltip" title="not active"></span></span>\n      <button class="btn btn-primary btn-sm city-detail-btn" style="border: 1px solid #72d2ff;font-weight:bold;border-radius:10px;">Details</button>\t\n    </li >\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.cities || (null != b ? b.cities : b)) ? g : c.helperMissing, 
        h = {
            name: "cities",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.cities || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.citiestemp = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '<option class="cityoptions">' + a.escapeExpression((f = null != (f = c.cityName || (null != b ? b.cityName : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "cityName",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.cities || (null != b ? b.cities : b)) ? g : c.helperMissing, 
        h = {
            name: "cities",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.cities || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i + "\n";
    },
    useData: !0
}), this.Soulcrashers.Templates.controls = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '    <span class="t-unselectable ctrl-fn">' + i((f = null != (f = c.controlfn || (null != b ? b.controlfn : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "controlfn",
            hash: {},
            data: e
        }) : f)) + '</span>\n      <input class="control-set form-control control-form" autofocus="" autocomplete="off" autocorrect="off" autocapitalize="off" \n      spellcheck="false" type="text" maxlength="5" value=' + i((f = null != (f = c.controlkey || (null != b ? b.controlkey : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "controlkey",
            hash: {},
            data: e
        }) : f)) + ">\n\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.controls || (null != b ? b.controls : b)) ? g : c.helperMissing, 
        h = {
            name: "controls",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.controls || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.debugview = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        return ' <link rel="stylesheet" href="/stylesheets/debug.css">\n <div class="debug-head">DEBUG</div>\n<div class="dev-window">\n<button class="dev-clear btn btn-success btn-settings"><span>Clear</span> </button>\n<ul class="dev-w-ul">\t\n</ul>\t\n</div>\n <input class="dev-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" type="text" class="button" placeholder="Enter text" >\n<button  id="resize-dev" class="halfsize btn btn-success btn-settings">\n\t<i style="position: relative;top: 2px;left: -2px;" class="glyphicon glyphicon-cog gi-15x"> </i>\n</button>\n<button  id="moveup-dev" class="halfsize-up btn btn-success btn-settings">\n\t<i style="position: relative;top: 2px;left: -2px;" class="glyphicon glyphicon-cog gi-15x"> </i>\n</button>\n\n\n';
    },
    useData: !0
}), this.Soulcrashers.Templates.debugviewli = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f;
        return "<li>" + a.escapeExpression((f = null != (f = c.lidata || (null != b ? b.lidata : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "lidata",
            hash: {},
            data: e
        }) : f)) + "</li>";
    },
    useData: !0
}), this.Soulcrashers.Templates.disconnect = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        return '<div data-type=\'h\' style="display: block;text-align: center;" class="disc-panel">\n    <span class="t-unselectable" style="position:relative;top:-35px; font-family: Arial Unicode MS, Lucida Grande;color:red;font-size:280px;text-shadow:8px 12px 11px black;">&#9888;</span>\n    <div style="position: absolute;  bottom: 10px;padding: 10px;">\n            <div class="disc-connect main-connect boombtn mm-btn-main t-unselectable">\n                        <span style="color:white;" class="t-unselectable">Reconnect</span>\n            </div>\n         <span class="t-unselectable" style="color:wheat;font-size: 15px;position:relative;top:5px;">We couldn\'t keep you connected to the server because you have been idle for too long :(</span>\n    </div>\n   \n</div>';
    },
    useData: !0
}), this.Soulcrashers.Templates.gameads = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return "<li style=\" background-image: url('../images/promo/" + i((f = null != (f = c.url || (null != b ? b.url : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "url",
            hash: {},
            data: e
        }) : f)) + '.jpg\');">\n<a href="' + i((f = null != (f = c.link || (null != b ? b.link : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "link",
            hash: {},
            data: e
        }) : f)) + '"></a>\n</li>\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "<ul>\n";
        return g = null != (g = c.gameAds || (null != b ? b.gameAds : b)) ? g : c.helperMissing, 
        h = {
            name: "gameAds",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.gameAds || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i + "</ul>";
    },
    useData: !0
}), this.Soulcrashers.Templates.gamemodes = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '<option class="modeoption">' + a.escapeExpression((f = null != (f = c.mode || (null != b ? b.mode : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "mode",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.gamemodes || (null != b ? b.gamemodes : b)) ? g : c.helperMissing, 
        h = {
            name: "gamemodes",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.gamemodes || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), 
        i;
    },
    useData: !0
}), this.Soulcrashers.Templates.gamemodesmm = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '          <span class= "mm-mode mm-knt t-unselectable" data-toggle="tooltip" data-placement="top" title=' + i((f = null != (f = c.mode || (null != b ? b.mode : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "mode",
            hash: {},
            data: e
        }) : f)) + ">" + i((f = null != (f = c.mode || (null != b ? b.mode : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "mode",
            hash: {},
            data: e
        }) : f)) + " </span>\n \n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.gamemodes || (null != b ? b.gamemodes : b)) ? g : c.helperMissing, 
        h = {
            name: "gamemodes",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.gamemodes || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), 
        i;
    },
    useData: !0
}), this.Soulcrashers.Templates.graphic = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return "                <option>" + a.escapeExpression((f = null != (f = c.data || (null != b ? b.data : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "data",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.opt || (null != b ? b.opt : b)) ? g : c.helperMissing, 
        h = {
            name: "opt",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.opt || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.helptemp = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '      <li class="t-unselectable">' + a.escapeExpression((f = null != (f = c.data || (null != b ? b.data : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "data",
            hash: {},
            data: e
        }) : f)) + "</li>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = '\n<div data-type=\'h\' class="help-panel panel">\n    <ul class="help-ul">\n';
        return g = null != (g = c.tips || (null != b ? b.tips : b)) ? g : c.helperMissing, 
        h = {
            name: "tips",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.tips || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i + "    </ul>\n</div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.news = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        return "\n";
    },
    useData: !0
}), this.Soulcrashers.Templates.nicksymbol = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return '  <input type="button" name="number" value=' + a.escapeExpression((f = null != (f = c.symbol || (null != b ? b.symbol : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "symbol",
            hash: {},
            data: e
        }) : f)) + ' class="spsym">\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = ' <div class="mainsym-in">\n <span class="header">Customize your nick name</span>\n';
        return g = null != (g = c.symbols || (null != b ? b.symbols : b)) ? g : c.helperMissing, 
        h = {
            name: "symbols",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.symbols || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i + "\n  </div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.overload = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        return '<div data-type=\'h\' style="display: block;text-align: center;" class="overload-panel">\n    <span class="t-unselectable" style="position:relative;top:-35px; font-family: Arial Unicode MS, Lucida Grande;color:red;font-size:280px;text-shadow:8px 12px 11px black;">&#9888;</span>\n    <div style="position: absolute;  bottom: 10px;padding: 10px;">\n            <div class="overload-connect main-connect boombtn mm-btn-main t-unselectable">\n                        <span style="color:white;" class="t-unselectable">Reconnect</span>\n            </div>\n         <span class="t-unselectable" style="color:wheat;font-size: 15px;position:relative;top:5px;">All the servers in selected region are overloaded. Please change the region or try again later. :(</span>\n    </div>\n   \n</div>';
    },
    useData: !0
}), this.Soulcrashers.Templates.result_pop = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '        <li >\n          <span class="pl-name">' + i((f = null != (f = c.name || (null != b ? b.name : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "name",
            hash: {},
            data: e
        }) : f)) + '</span>  \n          <span class="pl-pops">' + i((f = null != (f = c.pops || (null != b ? b.pops : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "pops",
            hash: {},
            data: e
        }) : f)) + '</span>  \n          <span class="pl-deaths">' + i((f = null != (f = c.deaths || (null != b ? b.deaths : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "deaths",
            hash: {},
            data: e
        }) : f)) + "</span>  \n        </li>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = null != b ? b : a.nullContext || {}, j = c.helperMissing, k = ' <img  id="result-logo" class="t-unselectable" src="images/_logo.png" style="position: relative;\n    top: 0px;\n    left: 0;\n    right: 0;\n    width: 320px;\n    transform-origin:top;\n    margin: auto;" />\n  <span id="result-esc" style="position: absolute;\n    color: wheat;\n    left: 0;\n    bottom: 5px;\n    right: 0;">Press esc to go back</span>\n  <div hidden="" id="statsPanel">\n      <span class="next-match-time"></span>\n    \n    <header class="t-unselectable" style="       font-size: 35px;\n    background-color: #ff000078;\n    width: 300px;\n    text-align: center;\n    display: block;\n    text-align: center;\n    left: 0;\n    right: 0;\n    top: 0px;\n    margin: auto;\n    height: 59px;\n    text-shadow: 3px 2px 3px #330c0c99;\n    position: absolute;\n    line-height: 56px;\n    color: #f5cf17;\n    border: 2px solid #ff3c3c;\n    border-top: 0;">Match Results</header>\n\n  <span style="position: absolute;\n    left: 205px;\n    top: 80px;\n    color: wheat;\n    font-size: 36px;\n    padding: 10px; ">Your Rank</span>\n  <span style="position: absolute;\n    left: 414px;\n    top: 79px;\n    color: wheat;\n    font-size: 40px;\n    padding: 10px;\n    background-color: red;" id="final-rank">#' + a.escapeExpression((g = null != (g = c.rank || (null != b ? b.rank : b)) ? g : j, 
        "function" == typeof g ? g.call(i, {
            name: "rank",
            hash: {},
            data: e
        }) : g)) + '</span>\n\n    <div class="stat-headings">\n      <span class="name">Name</span>\n      <span>Pops</span>\n      <span>Deaths</span>\n\n    </div>\n    <ul id="result-ul">\n';
        return g = null != (g = c.items || (null != b ? b.items : b)) ? g : j, h = {
            name: "items",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(i, h) : g, c.items || (f = c.blockHelperMissing.call(b, f, h)), 
        null != f && (k += f), k + "    </ul>\n  </div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.server = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f;
        return "                <option>" + a.escapeExpression((f = null != (f = c.data || (null != b ? b.data : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "data",
            hash: {},
            data: e
        }) : f)) + "</option>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.opt || (null != b ? b.opt : b)) ? g : c.helperMissing, 
        h = {
            name: "opt",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.opt || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.shopcoins = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = "function", j = a.escapeExpression;
        return "   <li class='ol-shop-" + j((f = null != (f = c.itemcat || (null != b ? b.itemcat : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "itemcat",
            hash: {},
            data: e
        }) : f)) + '\'>\n     <div class="shopdiv">\n      <div class="coinsvalue">\n        <span class="coinsamount t-unselectable">' + j((f = null != (f = c.coinsvalue || (null != b ? b.coinsvalue : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "coinsvalue",
            hash: {},
            data: e
        }) : f)) + '</span>\n        <span class="coins_plus t-unselectable">+</span>\n        <span class="freecoins t-unselectable">' + j((f = null != (f = c.coinspercent || (null != b ? b.coinspercent : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "coinspercent",
            hash: {},
            data: e
        }) : f)) + '%</span>\n      <span class="coins_equal t-unselectable">=</span>\n      <span class="totalcoins t-unselectable">' + j((f = null != (f = c.coinstotal || (null != b ? b.coinstotal : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "coinstotal",
            hash: {},
            data: e
        }) : f)) + '\n      </span>\n      <span class="totalPrice t-unselectable">' + j((f = null != (f = c.coinsprice || (null != b ? b.coinsprice : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "coinsprice",
            hash: {},
            data: e
        }) : f)) + '</span>\n      </div>\n      <div class="coins-wrapper">\n      <div class="buycoins mm-btn-main mm-coin-buy-btn t-unselectable">  \n         <span class="cust-load"></span>\n         <span class="mm-btn t-unselectable">Buy</span>\n      </div>\n      </div>\n      </div>\n     </li>\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = " <ul>\n";
        return g = null != (g = c.packages || (null != b ? b.packages : b)) ? g : c.helperMissing, 
        h = {
            name: "packages",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.packages || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i + "   </ul>  ";
    },
    useData: !0
}), this.Soulcrashers.Templates.skinclr = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return "      <li data-name=" + i((f = null != (f = c.skinCatName || (null != b ? b.skinCatName : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "skinCatName",
            hash: {},
            data: e
        }) : f)) + ' class="t-unselectable skin-cat skin-cat-nsel">\n        ' + i((f = null != (f = c.skinCatName || (null != b ? b.skinCatName : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "skinCatName",
            hash: {},
            data: e
        }) : f)) + '\n        <span style="display:none" class="t-unselectable skincat-selected"></span>\n      </li>\n';
    },
    "3": function(a, b, c, d, e) {
        var f, g, h = null != b ? b : a.nullContext || {}, i = c.helperMissing, j = a.escapeExpression;
        return "   <div data-name=" + j((g = null != (g = c.skinCatValue || (null != b ? b.skinCatValue : b)) ? g : i, 
        "function" == typeof g ? g.call(h, {
            name: "skinCatValue",
            hash: {},
            data: e
        }) : g)) + ' class="skin-cat-data">\n    <div data-name=' + j((g = null != (g = c.skinCatValue || (null != b ? b.skinCatValue : b)) ? g : i, 
        "function" == typeof g ? g.call(h, {
            name: "skinCatValue",
            hash: {},
            data: e
        }) : g)) + ' style="width:' + j((g = null != (g = c.allwidth || (null != b ? b.allwidth : b)) ? g : i, 
        "function" == typeof g ? g.call(h, {
            name: "allwidth",
            hash: {},
            data: e
        }) : g)) + 'px" class="skin-clrs">\n     \n' + (null != (f = c.each.call(h, null != b ? b.catData : b, {
            name: "each",
            hash: {},
            fn: a.program(4, e, 0),
            inverse: a.noop,
            data: e
        })) ? f : "") + "\n\n      </div>\n      \n </div>\n";
    },
    "4": function(a, b, c, d, e) {
        var f = a.lambda, g = a.escapeExpression;
        return "        <div data-name=" + g(f(null != b ? b.name : b, b)) + ' style="left:' + g(f(null != b ? b.left : b, b)) + 'px" class="outer-clr-span">\n        <div style="overflow:hidden;" data-name=' + g(f(null != b ? b.name : b, b)) + ' class="inner-clr-span inner-clr-span_off">\n          <img   data-name=' + g(f(null != b ? b.name : b, b)) + ' style=" z-index:1;width:' + g(f(null != b ? b.size : b, b)) + "px; height:" + g(f(null != b ? b.size : b, b)) + 'px;" class="clrspan"></img>\n          <img style="position: absolute;left:  0;top: 176px;left:  26px;z-index: 0;" class="" src="/../images/shop/stv.png">\n          <div data-name=' + g(f(null != b ? b.name : b, b)) + ' class="skin-sel-btn mm-btn-main boombtnLower skin-btn-off">\n            <span>Select</span>\n          </div>\n        </div>\n      </div>\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = null != b ? b : a.nullContext || {}, j = '<div data-type=\'h\' class="skins-panel panel">\n  <div class="skin-settings">\n    <span class="region_header"></span>\n  </div>\n  <div  data-type="l" class=" skinl skinbtnstyle skinbtn">\n\n  </div>\n  <div data-type="r" class=" skinr skinbtnstyle skinbtn">\n\n  </div>\n  <div class="skincategory">\n    <ul>\n';
        return g = null != (g = c.skinCats || (null != b ? b.skinCats : b)) ? g : c.helperMissing, 
        h = {
            name: "skinCats",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(i, h) : g, c.skinCats || (f = c.blockHelperMissing.call(b, f, h)), 
        null != f && (j += f), j + '    </ul>\n  </div>\n\n  <div class="skins-mask">\n\n' + (null != (f = c.each.call(i, null != b ? b.skinCatData : b, {
            name: "each",
            hash: {},
            fn: a.program(3, e, 0),
            inverse: a.noop,
            data: e
        })) ? f : "") + "\n  </div>\n   \n</div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.skinsli = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g, h, i = null != b ? b : a.nullContext || {}, j = c.helperMissing, k = a.escapeExpression, l = '   <div  class="tab-data ' + k((g = null != (g = c.classname || (null != b ? b.classname : b)) ? g : j, 
        "function" == typeof g ? g.call(i, {
            name: "classname",
            hash: {},
            data: e
        }) : g)) + '">  \n  <ul class=' + k((g = null != (g = c.classname || (null != b ? b.classname : b)) ? g : j, 
        "function" == typeof g ? g.call(i, {
            name: "classname",
            hash: {},
            data: e
        }) : g)) + ">\n";
        return g = null != (g = c.skinsul || (null != b ? b.skinsul : b)) ? g : j, h = {
            name: "skinsul",
            hash: {},
            fn: a.program(2, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(i, h) : g, c.skinsul || (f = c.blockHelperMissing.call(b, f, h)), 
        null != f && (l += f), l + ' \n</ul>\n   \n <span class="left-right-c pleft" data-dir="left" ><i  style="left:7px;" class="fa fa-chevron-left" aria-hidden="true"></i></span>\n <span class="left-right-c pright" data-dir="right"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>\n</div>\n';
    },
    "2": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = "function", j = a.escapeExpression;
        return '  <li> \n    <span style="background-color:' + j((f = null != (f = c.skinbkcolor || (null != b ? b.skinbkcolor : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "skinbkcolor",
            hash: {},
            data: e
        }) : f)) + '" class="skin-color">\n      <span class="skin-deep">\n    <img  class="' + j((f = null != (f = c.imgclassname || (null != b ? b.imgclassname : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgclassname",
            hash: {},
            data: e
        }) : f)) + " " + j((f = null != (f = c.imgcolorclass || (null != b ? b.imgcolorclass : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgcolorclass",
            hash: {},
            data: e
        }) : f)) + '" width=125 height=125 src="' + j((f = null != (f = c.imgsrc || (null != b ? b.imgsrc : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgsrc",
            hash: {},
            data: e
        }) : f)) + '"/>\n    <img style="display:' + j((f = null != (f = c.distype || (null != b ? b.distype : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "distype",
            hash: {},
            data: e
        }) : f)) + " top:-" + j((f = null != (f = c.tz || (null != b ? b.tz : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "tz",
            hash: {},
            data: e
        }) : f)) + "%;left:-" + j((f = null != (f = c.lz || (null != b ? b.lz : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "lz",
            hash: {},
            data: e
        }) : f)) + '%;" class="imgeyesl  ' + j((f = null != (f = c.imgeyes || (null != b ? b.imgeyes : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes",
            hash: {},
            data: e
        }) : f)) + '"  width=' + j((f = null != (f = c.imgeyes_s || (null != b ? b.imgeyes_s : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes_s",
            hash: {},
            data: e
        }) : f)) + " height=" + j((f = null != (f = c.imgeyes_s || (null != b ? b.imgeyes_s : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes_s",
            hash: {},
            data: e
        }) : f)) + ' src="' + j((f = null != (f = c.imgeyes || (null != b ? b.imgeyes : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes",
            hash: {},
            data: e
        }) : f)) + '">\n    <img  style="display:' + j((f = null != (f = c.distype || (null != b ? b.distype : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "distype",
            hash: {},
            data: e
        }) : f)) + " top:-" + j((f = null != (f = c.tz || (null != b ? b.tz : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "tz",
            hash: {},
            data: e
        }) : f)) + "%;left:" + j((f = null != (f = c.lz || (null != b ? b.lz : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "lz",
            hash: {},
            data: e
        }) : f)) + '%;" class="imgeyesr  ' + j((f = null != (f = c.imgeyes || (null != b ? b.imgeyes : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes",
            hash: {},
            data: e
        }) : f)) + '" width=' + j((f = null != (f = c.imgeyes_s || (null != b ? b.imgeyes_s : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes_s",
            hash: {},
            data: e
        }) : f)) + " height=" + j((f = null != (f = c.imgeyes_s || (null != b ? b.imgeyes_s : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes_s",
            hash: {},
            data: e
        }) : f)) + ' src="' + j((f = null != (f = c.imgeyes || (null != b ? b.imgeyes : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "imgeyes",
            hash: {},
            data: e
        }) : f)) + '">\n   \n\n    </span>\n    </span>\n    <span class="avatar-cover"></span>\n    <span class="t-unselectable skin-name">' + j((f = null != (f = c.skinname || (null != b ? b.skinname : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "skinname",
            hash: {},
            data: e
        }) : f)) + '</span>\n    <div  data-name="' + j((f = null != (f = c.idname || (null != b ? b.idname : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "idname",
            hash: {},
            data: e
        }) : f)) + '" data-type="' + j((f = null != (f = c.obtype || (null != b ? b.obtype : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "obtype",
            hash: {},
            data: e
        }) : f)) + '" class="' + j((f = null != (f = c.skincolorclass || (null != b ? b.skincolorclass : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "skincolorclass",
            hash: {},
            data: e
        }) : f)) + ' skin-buy-btn mm-btn-main  t-unselectable">  \n         <span   class=" t-unselectable mm-btn ' + j((f = null != (f = c.status || (null != b ? b.status : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "status",
            hash: {},
            data: e
        }) : f)) + '">' + j((f = null != (f = c.status || (null != b ? b.status : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "status",
            hash: {},
            data: e
        }) : f)) + "</span>\n      </div>\n\n</li>\n";
    },
    "4": function(a, b, c, d, e) {
        var f;
        return '   <span style="background-color:' + a.escapeExpression((f = null != (f = c.skincolor || (null != b ? b.skincolor : b)) ? f : c.helperMissing, 
        "function" == typeof f ? f.call(null != b ? b : a.nullContext || {}, {
            name: "skincolor",
            hash: {},
            data: e
        }) : f)) + '" class="sk-color"></span>\n';
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = null != b ? b : a.nullContext || {}, j = c.helperMissing, k = c.blockHelperMissing, l = "\n\n";
        return g = null != (g = c.alltabs || (null != b ? b.alltabs : b)) ? g : j, h = {
            name: "alltabs",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(i, h) : g, c.alltabs || (f = k.call(b, f, h)), 
        null != f && (l += f), l += '<div class="color-sel">\n  <span class="heading">Choose color</span>\n', 
        g = null != (g = c.skcolor || (null != b ? b.skcolor : b)) ? g : j, h = {
            name: "skcolor",
            hash: {},
            fn: a.program(4, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(i, h) : g, c.skcolor || (f = k.call(b, f, h)), 
        null != f && (l += f), l + "   </div>";
    },
    useData: !0
}), this.Soulcrashers.Templates.taunt = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = "function", j = a.escapeExpression;
        return ' <div class="tau-div">\n      <span class="t-unselectable  taunt-txt" data-toggle="tooltip" data-placement="top" title="' + j((f = null != (f = c.name || (null != b ? b.name : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "name",
            hash: {},
            data: e
        }) : f)) + '">' + j((f = null != (f = c.name || (null != b ? b.name : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "name",
            hash: {},
            data: e
        }) : f)) + '   \n           <span class="t-unselectable taunt-rem-btn" style="position:absolute;font-family: Arial Unicode MS, Lucida Grande;color:red;font-size:13px;top:5px;margin:0 auto;">&#9940;</span>\n      </span>\n      <div style="border-color:' + j((f = null != (f = c.bcolor || (null != b ? b.bcolor : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "bcolor",
            hash: {},
            data: e
        }) : f)) + ";border-bottom:4px solid " + j((f = null != (f = c.border || (null != b ? b.border : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "border",
            hash: {},
            data: e
        }) : f)) + ";background-color:" + j((f = null != (f = c.color || (null != b ? b.color : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "color",
            hash: {},
            data: e
        }) : f)) + '" data-taunt=' + j((f = null != (f = c.tagno || (null != b ? b.tagno : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "tagno",
            hash: {},
            data: e
        }) : f)) + ' class="mm-btn-main mm-taunt-btn t-unselectable boombtn">  \n         <span  class="mm-btn"> ' + j((f = null != (f = c.tagstate || (null != b ? b.tagstate : b)) ? f : h, 
        typeof f === i ? f.call(g, {
            name: "tagstate",
            hash: {},
            data: e
        }) : f)) + "</span>\n      </div>\n</div>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h, i = "";
        return g = null != (g = c.tags || (null != b ? b.tags : b)) ? g : c.helperMissing, 
        h = {
            name: "tags",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.tags || (f = c.blockHelperMissing.call(b, f, h)), null != f && (i += f), i;
    },
    useData: !0
}), this.Soulcrashers.Templates.timesettings = Handlebars.template({
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        return '<div data-type=\'h\' style="display: block;text-align: center;" class="timesetting-panel">\n    <span class="t-unselectable" style="position:relative;top:-35px; font-family: Arial Unicode MS, Lucida Grande;color:red;font-size:280px;text-shadow:8px 12px 11px black;">&#9888;</span>\n    <div style="position: absolute;  bottom: 10px;padding: 10px;">\n            <div class="timesetting-connect main-connect boombtn mm-btn-main t-unselectable">\n                        <span style="color:white;" class="t-unselectable">Reconnect</span>\n            </div>\n         <span class="t-unselectable" style="color:wheat;font-size: 15px;position:relative;top:5px;">Time settings on your device is incorrect. Please correct the issue and try again.</span>\n    </div>\n   \n</div>';
    },
    useData: !0
}), this.Soulcrashers.Templates.topplayer = Handlebars.template({
    "1": function(a, b, c, d, e) {
        var f, g = null != b ? b : a.nullContext || {}, h = c.helperMissing, i = a.escapeExpression;
        return '<div class="top-pl-element">\n<span class="top-pl-name t-unselectable">' + i((f = null != (f = c.name || (null != b ? b.name : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "name",
            hash: {},
            data: e
        }) : f)) + '</span>\n<span class="top-pl-score t-unselectable">' + i((f = null != (f = c.score || (null != b ? b.score : b)) ? f : h, 
        "function" == typeof f ? f.call(g, {
            name: "score",
            hash: {},
            data: e
        }) : f)) + "</span>\n   </div>\n";
    },
    compiler: [ 7, ">= 4.0.0" ],
    main: function(a, b, c, d, e) {
        var f, g, h;
        return g = null != (g = c.topplayers || (null != b ? b.topplayers : b)) ? g : c.helperMissing, 
        h = {
            name: "topplayers",
            hash: {},
            fn: a.program(1, e, 0),
            inverse: a.noop,
            data: e
        }, f = "function" == typeof g ? g.call(null != b ? b : a.nullContext || {}, h) : g, 
        c.topplayers || (f = c.blockHelperMissing.call(b, f, h)), null != f ? f : "";
    },
    useData: !0
});
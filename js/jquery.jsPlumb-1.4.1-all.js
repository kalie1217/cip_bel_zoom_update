! function () {
    var t = function (t, n, e) {
        return t = jsPlumbUtil.isArray(t) ? t:[t.x, t.y], n = jsPlumbUtil.isArray(n) ? n:[n.x, n.y], e(t, n)
    };
    jsPlumbUtil = {
        isArray: function (t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        },
        isNumber: function (t) {
            return "[object Number]" === Object.prototype.toString.call(t)
        },
        isString: function (t) {
            return "string" == typeof t
        },
        isBoolean: function (t) {
            return "boolean" == typeof t
        },
        isNull: function (t) {
            return null == t
        },
        isObject: function (t) {
            return null == t ? ! 1: "[object Object]" === Object.prototype.toString.call(t)
        },
        isDate: function (t) {
            return "[object Date]" === Object.prototype.toString.call(t)
        },
        isFunction: function (t) {
            return "[object Function]" === Object.prototype.toString.call(t)
        },
        clone: function (t) {
            if (this.isString(t)) return "" + t;
            if (this.isBoolean(t)) return ! ! t;
            if (this.isDate(t)) return new Date(t.getTime());
            if (this.isFunction(t)) return t;
            if (this.isArray(t)) {
                for (var n =[], e = 0; e < t.length; e++) n.push(this.clone(t[e]));
                return n
            }
            if (this.isObject(t)) {
                var n = {
                };
                for (var e in t) n[e] = this.clone(t[e]);
                return n
            }
            return t
        },
        merge: function (t, n) {
            var e = this.clone(t);
            for (var r in n) if (null == e[r] || this.isString(n[r]) || this.isBoolean(n[r])) e[r] = n[r]; else if (this.isArray(n[r])) {
                var i =[];
                this.isArray(e[r]) && i.push.apply(i, e[r]), i.push.apply(i, n[r]), e[r] = i
            } else if (this.isObject(n[r])) {
                this.isObject(e[r]) ||(e[r] = {
                });
                for (var o in n[r]) e[r][o] = n[r][o]
            }
            return e
        },
        copyValues: function (t, n, e) {
            for (var r = 0; r < t.length; r++) e[t[r]] = n[t[r]]
        },
        functionChain: function (t, n, e) {
            for (var r = 0; r < e.length; r++) {
                var i = e[r][0][e[r][1]].apply(e[r][0], e[r][2]);
                if (i === n) return i
            }
            return t
        },
        populate: function (t, n) {
            var e = function (t) {
                var e = t.match(/(\${.*?})/g);
                if (null != e) for (var r = 0; r < e.length; r++) {
                    var i = n[e[r].substring(2, e[r].length -1)];
                    null != i &&(t = t.replace(e[r], i))
                }
                return t
            },
            r = function (t) {
                if (null != t) {
                    if (jsPlumbUtil.isString(t)) return e(t);
                    if (jsPlumbUtil.isArray(t)) {
                        for (var n =[], i = 0; i < t.length; i++) n.push(r(t[i]));
                        return n
                    }
                    if (jsPlumbUtil.isObject(t)) {
                        var n = {
                        };
                        for (var i in t) n[i] = r(t[i]);
                        return n
                    }
                    return t
                }
            };
            return r(t)
        },
        convertStyle: function (t, n) {
            if ("transparent" === t) return t;
            var e = t, r = function (t) {
                return 1 == t.length ? "0" + t: t
            },
            i = function (t) {
                return r(Number(t).toString(16))
            },
            o = /(rgb[a]?\()(.*)(\))/;
            if (t.match(o)) {
                var s = t.match(o)[2].split(",");
                e = "#" + i(s[0]) + i(s[1]) + i(s[2]), n || 4 != s.length ||(e += i(s[3]))
            }
            return e
        },
        gradient: function (n, e) {
            return t(n, e, function (t, n) {
                return n[0] == t[0] ? n[1] > t[1] ? 1 / 0: -(1 / 0): n[1] == t[1] ? n[0] > t[0] ? 0: -0:(n[1] - t[1]) /(n[0] - t[0])
            })
        },
        normal: function (t, n) {
            return -1 / this.gradient(t, n)
        },
        lineLength: function (n, e) {
            return t(n, e, function (t, n) {
                return Math.sqrt(Math.pow(n[1] - t[1], 2) + Math.pow(n[0] - t[0], 2))
            })
        },
        segment: function (n, e) {
            return t(n, e, function (t, n) {
                return n[0] > t[0] ? n[1] > t[1] ? 2: 1: n[0] == t[0] ? n[1] > t[1] ? 2: 1: n[1] > t[1] ? 3: 4
            })
        },
        theta: function (n, e) {
            return t(n, e, function (t, n) {
                var e = jsPlumbUtil.gradient(t, n), r = Math.atan(e), i = jsPlumbUtil.segment(t, n);
                return (4 == i || 3 == i) &&(r += Math.PI), 0 > r &&(r += 2 * Math.PI), r
            })
        },
        intersects: function (t, n) {
            var e = t.x, r = t.x + t.w, i = t.y, o = t.y + t.h, s = n.x, a = n.x + n.w, l = n.y, u = n.y + n.h;
            return s >= e && r >= s && l >= i && o >= l || a >= e && r >= a && l >= i && o >= l || s >= e && r >= s && u >= i && o >= u || a >= e && r >= s && u >= i && o >= u || e >= s && a >= e && i >= l && u >= i || r >= s && a >= r && i >= l && u >= i || e >= s && a >= e && o >= l && u >= o || r >= s && a >= e && o >= l && u >= o
        },
        segmentMultipliers:[ null,[1, -1],[1, 1],[-1, 1],[-1, -1]], inverseSegmentMultipliers:[ null,[-1, -1],[-1, 1],[1, 1],[1, -1]], pointOnLine: function (t, n, e) {
            var r = jsPlumbUtil.gradient(t, n), i = jsPlumbUtil.segment(t, n), o = e > 0 ? jsPlumbUtil.segmentMultipliers[i]: jsPlumbUtil.inverseSegmentMultipliers[i], s = Math.atan(r), a = Math.abs(e * Math.sin(s)) * o[1], l = Math.abs(e * Math.cos(s)) * o[0];
            return {
                x: t.x + l, y: t.y + a
            }
        },
        perpendicularLineTo: function (t, n, e) {
            var r = jsPlumbUtil.gradient(t, n), i = Math.atan(-1 / r), o = e / 2 * Math.sin(i), s = e / 2 * Math.cos(i);
            return[ {
                x: n.x + s, y: n.y + o
            }, {
                x: n.x - s, y: n.y - o
            }]
        },
        findWithFunction: function (t, n) {
            if (t) for (var e = 0; e < t.length; e++) if (n(t[e])) return e;
            return -1
        },
        clampToGrid: function (t, n, e, r, i) {
            var o = function (t, n) {
                var e = t % n, r = Math.floor(t / n), i = e >= n / 2 ? 1: 0;
                return (r + i) * n
            };
            return[r || null == e ? t: o(t, e[0]), i || null == e ? n: o(n, e[1])]
        },
        indexOf: function (t, n) {
            return jsPlumbUtil.findWithFunction(t, function (t) {
                return t == n
            })
        },
        removeWithFunction: function (t, n) {
            var e = jsPlumbUtil.findWithFunction(t, n);
            return e > -1 && t.splice(e, 1), -1 != e
        },
        remove: function (t, n) {
            var e = jsPlumbUtil.indexOf(t, n);
            return e > -1 && t.splice(e, 1), -1 != e
        },
        addWithFunction: function (t, n, e) { -1 == jsPlumbUtil.findWithFunction(t, e) && t.push(n)
        },
        addToList: function (t, n, e) {
            var r = t[n];
            return null == r &&(r =[], t[n] = r), r.push(e), r
        },
        EventGenerator: function () {
            var t = {
            },
            n = this, e = ! 1, r =[ "ready"];
            this.bind = function (e, r) {
                return jsPlumbUtil.addToList(t, e, r), n
            },
            this.fire = function (i, o, s) {
                if (! e && t[i]) for (var a = 0; a < t[i].length; a++) if (-1 != jsPlumbUtil.findWithFunction(r, function (t) {
                    return t === i
                })) t[i][a](o, s); else try {
                    t[i][a](o, s)
                }
                catch (l) {
                    jsPlumbUtil.log("jsPlumb: fire failed for event " + i + " : " + l)
                }
                return n
            },
            this.unbind = function (e) {
                return e ? delete t[e]: t = {
                },
                n
            },
            this.getListener = function (n) {
                return t[n]
            },
            this.setSuspendEvents = function (t) {
                e = t
            },
            this.isSuspendEvents = function () {
                return e
            }
        },
        logEnabled: ! 0, log: function () {
            if (jsPlumbUtil.logEnabled && "undefined" != typeof console) try {
                var t = arguments[arguments.length -1];
                console.log(t)
            }
            catch (n) {
            }
        },
        group: function (t) {
            jsPlumbUtil.logEnabled && "undefined" != typeof console && console.group(t)
        },
        groupEnd: function (t) {
            jsPlumbUtil.logEnabled && "undefined" != typeof console && console.groupEnd(t)
        },
        time: function (t) {
            jsPlumbUtil.logEnabled && "undefined" != typeof console && console.time(t)
        },
        timeEnd: function (t) {
            jsPlumbUtil.logEnabled && "undefined" != typeof console && console.timeEnd(t)
        },
        removeElement: function (t) {
            null != t && null != t.parentNode && t.parentNode.removeChild(t)
        },
        removeElements: function (t) {
            for (var n = 0; n < t.length; n++) jsPlumbUtil.removeElement(t[n])
        }
    }
}
(), function () {
    var t = ! ! document.createElement("canvas").getContext, n = ! ! window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"), e = function () {
        if (void 0 == e.vml) {
            var t = document.body.appendChild(document.createElement("div"));
            t.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
            var n = t.firstChild;
            n.style.behavior = "url(#default#VML)", e.vml = n ? "object" == typeof n.adj: ! 0, t.parentNode.removeChild(t)
        }
        return e.vml
    },
    r = function (t) {
        var n = {
        },
        e =[], r = {
        },
        i = {
        },
        o = {
        };
        this.register = function (s) {
            var a = jsPlumb.CurrentLibrary;
            s = a.getElementObject(s);
            var l = t.getId(s), u = a.getDOMElement(s), c = a.getOffset(s);
            n[l] ||(n[l] = s, e.push(s), r[l] = {
            });
            var d = function (n, e) {
                if (n) for (var s = 0; s < n.childNodes.length; s++) if (3 != n.childNodes[s].nodeType && 8 != n.childNodes[s].nodeType) {
                    var u = a.getElementObject(n.childNodes[s]), p = t.getId(u, null, ! 0);
                    if (p && i[p] && i[p] > 0) {
                        var h = a.getOffset(u);
                        r[l][p] = {
                            id: p, offset: {
                                left: h.left - c.left, top: h.top - c.top
                            }
                        },
                        o[p] = l
                    }
                    d(n.childNodes[s])
                }
            };
            d(u)
        },
        this.updateOffsets = function (n) {
            var e = jsPlumb.CurrentLibrary, i = e.getElementObject(n), s = t.getId(i), a = r[s], l = e.getOffset(i);
            if (a) for (var u in a) {
                var c = e.getElementObject(u), d = e.getOffset(c);
                r[s][u] = {
                    id: u, offset: {
                        left: d.left - l.left, top: d.top - l.top
                    }
                },
                o[u] = s
            }
        },
        this.endpointAdded = function (e) {
            var s = jsPlumb.CurrentLibrary, a = document.body, l = t.getId(e), u = s.getDOMElement(e), c = u.parentNode;
            for (i[l] = i[l] ? i[l] + 1: 1; null != c && c != a;) {
                var d = t.getId(c, null, ! 0);
                if (d && n[d]) {
                    var p = s.getElementObject(c), h = s.getOffset(p);
                    if (null == r[d][l]) {
                        var f = jsPlumb.CurrentLibrary.getOffset(e);
                        r[d][l] = {
                            id: l, offset: {
                                left: f.left - h.left, top: f.top - h.top
                            }
                        },
                        o[l] = d
                    }
                    break
                }
                c = c.parentNode
            }
        },
        this.endpointDeleted = function (t) {
            if (i[t.elementId] &&(i[t.elementId]--, i[t.elementId] <= 0)) for (var n in r) r[n] &&(delete r[n][t.elementId], delete o[t.elementId])
        },
        this.changeId = function (t, n) {
            r[n] = r[t], r[t] = {
            },
            o[n] = o[t], o[t] = null
        },
        this.getElementsForDraggable = function (t) {
            return r[t]
        },
        this.elementRemoved = function (t) {
            var n = o[t];
            n &&(delete r[n][t], delete o[t])
        },
        this.reset = function () {
            n = {
            },
            e =[], r = {
            },
            i = {
            }
        }
    };
    window.console ||(window.console = {
        time: function () {
        },
        timeEnd: function () {
        },
        group: function () {
        },
        groupEnd: function () {
        },
        log: function () {
        }
    }), window.jsPlumbAdapter = {
        headless: ! 1, appendToRoot: function (t) {
            document.body.appendChild(t)
        },
        getRenderModes: function () {
            return[ "canvas", "svg", "vml"]
        },
        isRenderModeAvailable: function (r) {
            return {
                canvas: t, svg: n, vml: e()
            }[r]
        },
        getDragManager: function (t) {
            return new r(t)
        },
        setRenderMode: function (t) {
            var n;
            if (t) {
                t = t.toLowerCase();
                var e = this.isRenderModeAvailable("canvas"), r = this.isRenderModeAvailable("svg"), i = this.isRenderModeAvailable("vml");
                "svg" === t ? r ? n = "svg": e ? n = "canvas": i &&(n = "vml"): "canvas" === t && e ? n = "canvas": i &&(n = "vml")
            }
            return n
        }
    }
}
(), function () {
    var t =(jsPlumbUtil.findWithFunction, jsPlumbUtil.indexOf), n = jsPlumbUtil.removeWithFunction, e =(jsPlumbUtil.remove, jsPlumbUtil.addWithFunction, jsPlumbUtil.addToList), r = jsPlumbUtil.isArray, i = jsPlumbUtil.isString, o = jsPlumbUtil.isObject, s = function (t, n) {
        return b.CurrentLibrary.getAttribute(c(t), n)
    },
    a = function (t, n, e) {
        b.CurrentLibrary.setAttribute(c(t), n, e)
    },
    l = function (t, n) {
        b.CurrentLibrary.addClass(c(t), n)
    },
    u = function (t, n) {
        b.CurrentLibrary.removeClass(c(t), n)
    },
    c = function (t) {
        return b.CurrentLibrary.getElementObject(t)
    },
    d = function (t, n) {
        var e = b.CurrentLibrary.getOffset(c(t));
        if (null != n) {
            var r = n.getZoom();
            return {
                left: e.left / r, top: e.top / r
            }
        }
        return e
    },
    p = function (t) {
        return b.CurrentLibrary.getSize(c(t))
    },
    h = jsPlumbUtil.log, f =(jsPlumbUtil.group, jsPlumbUtil.groupEnd, jsPlumbUtil.time, jsPlumbUtil.timeEnd, function () {
        return "" +(new Date).getTime()
    }), m = window.jsPlumbUIComponent = function (t) {
        var n = this, e = arguments, r = ! 1, i = t.parameters || {
        },
        o = n.idPrefix, s = o +(new Date).getTime(), a = null, c = null;
        if (n._jsPlumb = t._jsPlumb, n.getId = function () {
            return s
        },
        n.hoverClass = t.hoverClass || n._jsPlumb.Defaults.HoverClass || b.Defaults.HoverClass, jsPlumbUtil.EventGenerator.apply(this), t.events) for (var d in t.events) n.bind(d, t.events[d]);
        this.clone = function () {
            var t = new Object;
            return n. constructor.apply(t, e), t
        },
        this.getParameter = function (t) {
            return i[t]
        },
        this.getParameters = function () {
            return i
        },
        this.setParameter = function (t, n) {
            i[t] = n
        },
        this.setParameters = function (t) {
            i = t
        },
        this.overlayPlacements =[];
        var p = t.beforeDetach;
        this.isDetachAllowed = function (t) {
            var n = ! 0;
            if (p) try {
                n = p(t)
            }
            catch (e) {
                h("jsPlumb: beforeDetach callback failed", e)
            }
            return n
        };
        var m = t.beforeDrop;
        this.isDropAllowed = function (t, e, r, i, o) {
            var s = n._jsPlumb.checkCondition("beforeDrop", {
                sourceId: t, targetId: e, scope: r, connection: i, dropEndpoint: o
            });
            if (m) try {
                s = m({
                    sourceId: t, targetId: e, scope: r, connection: i, dropEndpoint: o
                })
            }
            catch (a) {
                h("jsPlumb: beforeDrop callback failed", a)
            }
            return s
        };
        var g = function () {
            if (a && c) {
                var t = {
                };
                b.extend(t, a), b.extend(t, c), delete n.hoverPaintStyle, t.gradient && a.fillStyle && delete t.gradient, c = t
            }
        };
        this.setPaintStyle = function (t, e) {
            a = t, n.paintStyleInUse = a, g(), e || n.repaint()
        },
        this.getPaintStyle = function () {
            return a
        },
        this.setHoverPaintStyle = function (t, e) {
            c = t, g(), e || n.repaint()
        },
        this.getHoverPaintStyle = function () {
            return c
        },
        this.setHover = function (t, e, i) {
            n._jsPlumb.currentlyDragging || n._jsPlumb.isHoverSuspended() ||(r = t, null != n.canvas &&(null != n.hoverClass &&(t ? v.addClass(n.canvas, n.hoverClass): v.removeClass(n.canvas, n.hoverClass)), t ? v.addClass(n.canvas, n._jsPlumb.hoverClass): v.removeClass(n.canvas, n._jsPlumb.hoverClass)), null != c &&(n.paintStyleInUse = t ? c: a, n._jsPlumb.isSuspendDrawing() ||(i = i || f(), n.repaint({
                timestamp: i, recalc: ! 1
            }))), n.getAttachedElements && ! e && E(t, f(), n))
        },
        this.isHover = function () {
            return r
        },
        this.bindListeners = function (t, n, e) {
            t.bind("click", function (t, e) {
                n.fire("click", n, e)
            }), t.bind("dblclick", function (t, e) {
                n.fire("dblclick", n, e)
            }), t.bind("contextmenu", function (t, e) {
                n.fire("contextmenu", n, e)
            }), t.bind("mouseenter", function (t, r) {
                n.isHover() ||(e(! 0), n.fire("mouseenter", n, r))
            }), t.bind("mouseexit", function (t, r) {
                n.isHover() &&(e(! 1), n.fire("mouseexit", n, r))
            }), t.bind("mousedown", function (t, e) {
                n.fire("mousedown", n, e)
            }), t.bind("mouseup", function (t, e) {
                n.fire("mouseup", n, e)
            })
        };
        var v = b.CurrentLibrary, y =[ "click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu"], P = {
            mouseout: "mouseexit"
        },
        x = function (t, n, e) {
            var r = P[e] || e;
            v.bind(t, e, function (t) {
                n.fire(r, n, t)
            })
        },
        C = function (t, n) {
            P[n] || n;
            v.unbind(t, n)
        };
        this.attachListeners = function (t, n) {
            for (var e = 0, r = y.length; r > e; e++) x(t, n, y[e])
        };
        var E = function (t, e, r) {
            var i = n.getAttachedElements();
            if (i) for (var o = 0, s = i.length; s > o; o++) r && r == i[o] || i[o].setHover(t, ! 0, e)
        };
        this.reattachListenersForElement = function (t) {
            if (arguments.length > 1) {
                for (var e = 0, r = y.length; r > e; e++) C(t, y[e]);
                for (var e = 1, r = arguments.length; r > e; e++) n.attachListeners(t, arguments[e])
            }
        };
        var j =[], S = function (t) {
            return null == t ? null: t.split(" ")
        },
        D = function (t, e) {
            if (n.getDefaultType) {
                for (var r = n.getTypeDescriptor(), i = jsPlumbUtil.merge({
                },
                n.getDefaultType()), o = 0, s = j.length; s > o; o++) i = jsPlumbUtil.merge(i, n._jsPlumb.getType(j[o], r));
                t &&(i = jsPlumbUtil.populate(i, t)), n.applyType(i, e), e || n.repaint()
            }
        };
        n.setType = function (t, n, e) {
            j = S(t) ||[], D(n, e)
        },
        n.getType = function () {
            return j
        },
        n.reapplyTypes = function (t, n) {
            D(t, n)
        },
        n.hasType = function (t) {
            return -1 != jsPlumbUtil.indexOf(j, t)
        },
        n.addType = function (t, e, r) {
            var i = S(t), o = ! 1;
            if (null != i) {
                for (var s = 0, a = i.length; a > s; s++) n.hasType(i[s]) ||(j.push(i[s]), o = ! 0);
                o && D(e, r)
            }
        },
        n.removeType = function (t, n) {
            var e = S(t), r = ! 1, i = function (t) {
                var n = jsPlumbUtil.indexOf(j, t);
                return -1 != n ?(j.splice(n, 1), ! 0): ! 1
            };
            if (null != e) {
                for (var o = 0, s = e.length; s > o; o++) r = i(e[o]) || r;
                r && D(null, n)
            }
        },
        n.toggleType = function (t, n, e) {
            var r = S(t);
            if (null != r) {
                for (var i = 0, o = r.length; o > i; i++) {
                    var s = jsPlumbUtil.indexOf(j, r[i]); -1 != s ? j.splice(s, 1): j.push(r[i])
                }
                D(n, e)
            }
        },
        this.applyType = function (t, e) {
            if (n.setPaintStyle(t.paintStyle, e), n.setHoverPaintStyle(t.hoverPaintStyle, e), t.parameters) for (var r in t.parameters) n.setParameter(r, t.parameters[r])
        },
        this.addClass = function (t) {
            null != n.canvas && l(n.canvas, t)
        },
        this.removeClass = function (t) {
            null != n.canvas && u(n.canvas, t)
        }
    },
    g =(window.overlayCapableJsPlumbUIComponent = function (t) {
        m.apply(this, arguments);
        var n = this; this.overlays =[]; var e = function (t) {
            var e = null; if (r(t)) {
                var i = t[0], o = b.extend({
                    component: n, _jsPlumb: n._jsPlumb
                },
                t[1]);
                3 == t.length && b.extend(o, t[2]), e = new (b.Overlays[n._jsPlumb.getRenderMode()][i])(o)
            } else e = t. constructor == String ? new (b.Overlays[n._jsPlumb.getRenderMode()][t])({
                component: n, _jsPlumb: n._jsPlumb
            }): t; n.overlays.push(e)
        },
        i = function (t) {
            var e = n.defaultOverlayKeys ||[], r = t.overlays, i = function (t) {
                return n._jsPlumb.Defaults[t] || b.Defaults[t] ||[]
            };
            r ||(r =[]);
            for (var o = 0, s = e.length; s > o; o++) r.unshift.apply(r, i(e[o]));
            return r
        },
        o = i(t);
        if (o) for (var s = 0, a = o.length; a > s; s++) e(o[s]);
        var l = function (t) {
            for (var e = -1, r = 0, i = n.overlays.length; i > r; r++) if (t === n.overlays[r].id) {
                e = r; break
            }
            return e
        };
        this.addOverlay = function (t, r) {
            e(t), r || n.repaint()
        },
        this.getOverlay = function (t) {
            var e = l(t);
            return e >= 0 ? n.overlays[e]: null
        },
        this.getOverlays = function () {
            return n.overlays
        },
        this.hideOverlay = function (t) {
            var e = n.getOverlay(t);
            e && e.hide()
        },
        this.hideOverlays = function () {
            for (var t = 0, e = n.overlays.length; e > t; t++) n.overlays[t].hide()
        },
        this.showOverlay = function (t) {
            var e = n.getOverlay(t);
            e && e.show()
        },
        this.showOverlays = function () {
            for (var t = 0, e = n.overlays.length; e > t; t++) n.overlays[t].show()
        },
        this.removeAllOverlays = function () {
            for (var t = 0, e = n.overlays.length; e > t; t++) n.overlays[t].cleanup && n.overlays[t].cleanup();
            n.overlays.splice(0, n.overlays.length), n.repaint()
        },
        this.removeOverlay = function (t) {
            var e = l(t);
            if (-1 != e) {
                var r = n.overlays[e]; r.cleanup && r.cleanup(), n.overlays.splice(e, 1)
            }
        },
        this.removeOverlays = function () {
            for (var t = 0, e = arguments.length; e > t; t++) n.removeOverlay(arguments[t])
        };
        var u = "__label", c = function (t) {
            var e = {
                cssClass: t.cssClass, labelStyle: this.labelStyle, id: u, component: n, _jsPlumb: n._jsPlumb
            },
            r = b.extend(e, t);
            return new (b.Overlays[n._jsPlumb.getRenderMode()].Label)(r)
        };
        if (t.label) {
            var d = t.labelLocation || n.defaultLabelLocation || .5, p = t.labelStyle || n._jsPlumb.Defaults.LabelStyle || b.Defaults.LabelStyle; this.overlays.push(c({
                label: t.label, location: d, labelStyle: p
            }))
        }
        this.setLabel = function (t) {
            var e = n.getOverlay(u);
            if (e) t. constructor == String || t. constructor == Function ? e.setLabel(t):(t.label && e.setLabel(t.label), t.location && e.setLocation(t.location)); else {
                var r = t. constructor == String || t. constructor == Function ? {
                    label: t
                }: t; e = c(r), this.overlays.push(e)
            }
            n._jsPlumb.isSuspendDrawing() || n.repaint()
        },
        this.getLabel = function () {
            var t = n.getOverlay(u);
            return null != t ? t.getLabel(): null
        },
        this.getLabelOverlay = function () {
            return n.getOverlay(u)
        };
        var h = this.applyType; this.applyType = function (t, e) {
            if (h(t, e), n.removeAllOverlays(), t.overlays) for (var r = 0, i = t.overlays.length; i > r; r++) n.addOverlay(t.overlays[r], ! 0)
        };
        var f = this.setHover; this.setHover = function (t, e, r) {
            f.apply(n, arguments);
            for (var i = 0, o = n.overlays.length; o > i; i++) n.overlays[i][t ? "addClass": "removeClass"](n._jsPlumb.hoverClass)
        }
    },
    0), v = function () {
        var t = g + 1;
        return g++, t
    },
    y = function (g) {
        this.Defaults = {
            Anchor: "BottomCenter", Anchors:[ null, null], ConnectionsDetachable: ! 0, ConnectionOverlays:[], Connector: "Bezier", Container: null, DoNotThrowErrors: ! 1, DragOptions: {
            },
            DropOptions: {
            },
            Endpoint: "Dot", EndpointOverlays:[], Endpoints:[ null, null], EndpointStyle: {
                fillStyle: "#456"
            },
            EndpointStyles:[ null, null], EndpointHoverStyle: null, EndpointHoverStyles:[ null, null], HoverPaintStyle: null, LabelStyle: {
                color: "black"
            },
            LogEnabled: ! 1, Overlays:[], MaxConnections: 1, PaintStyle: {
                lineWidth: 8, strokeStyle: "#456"
            },
            ReattachConnections: ! 1, RenderMode: "svg", Scope: "jsPlumb_DefaultScope"
        },
        g && b.extend(this.Defaults, g), this.logEnabled = this.Defaults.LogEnabled;
        var y = {
        },
        P = {
        };
        this.registerConnectionType = function (t, n) {
            y[t] = b.extend({
            },
            n)
        },
        this.registerConnectionTypes = function (t) {
            for (var n in t) y[n] = b.extend({
            },
            t[n])
        },
        this.registerEndpointType = function (t, n) {
            P[t] = b.extend({
            },
            n)
        },
        this.registerEndpointTypes = function (t) {
            for (var n in t) P[n] = b.extend({
            },
            t[n])
        },
        this.getType = function (t, n) {
            return "connection" === n ? y[t]: P[t]
        },
        jsPlumbUtil.EventGenerator.apply(this);
        var x = this, C = v(), E = x.bind, j = {
        },
        S = 1;
        this.getInstanceIndex = function () {
            return C
        },
        this.setZoom = function (t, n) {
            S = t, n && x.repaintEverything()
        },
        this.getZoom = function () {
            return S
        };
        for (var D in this.Defaults) j[D] = this.Defaults[D];
        this.bind = function (t, n) {
            "ready" === t && A ? n(): E.apply(x,[t, n])
        },
        x.importDefaults = function (t) {
            for (var n in t) x.Defaults[n] = t[n]
        },
        x.restoreDefaults = function () {
            x.Defaults = b.extend({
            },
            j)
        };
        var I = null, A = ! 1, w = null, O = {
        },
        L = {
        },
        M = {
        },
        _ = {
        },
        T = {
        },
        k = {
        },
        U = {
        },
        F =[], Y = this.Defaults.Scope, N = null, W = function (t, n) {
            x.Defaults.Container ? b.CurrentLibrary.appendElement(t, x.Defaults.Container): n ? b.CurrentLibrary.appendElement(t, n): jsPlumbAdapter.appendToRoot(t)
        },
        X = 1, H = function () {
            return "" + X++
        },
        R = function (t) {
            return t._nodes ? t._nodes: t
        },
        B = function (t, n, e, r) {
            if (! jsPlumbAdapter.headless && ! Nt) {
                var i = s(t, "id"), o = x.dragManager.getElementsForDraggable(i);
                if (null == e &&(e = f()), x.anchorManager.redraw(i, n, e, null, r), o) for (var a in o) x.anchorManager.redraw(o[a].id, n, e, o[a].offset, r)
            }
        },
        V = function (t, n) {
            var e = null;
            if (r(t)) {
                e =[];
                for (var i = 0, o = t.length; o > i; i++) {
                    var a = c(t[i]), l = s(a, "id");
                    e.push(n(a, l))
                }
            } else {
                var a = c(t), l = s(a, "id");
                e = n(a, l)
            }
            return e
        },
        z = function (t) {
            return M[t]
        },
        G = function (t, n, e) {
            if (! jsPlumbAdapter.headless) {
                var r = null == n ? ! 1: n, i = b.CurrentLibrary;
                if (r && i.isDragSupported(t) && ! i.isAlreadyDraggable(t)) {
                    var o = e || x.Defaults.DragOptions || b.Defaults.DragOptions;
                    o = b.extend({
                    },
                    o);
                    var s = i.dragEvents.drag, a = i.dragEvents.stop, c = i.dragEvents.start;
                    o[c] = lt(o[c], function () {
                        x.setHoverSuspended(! 0), x.select({
                            source: t
                        }).addClass(x.elementDraggingClass + " " + x.sourceElementDraggingClass, ! 0), x.select({
                            target: t
                        }).addClass(x.elementDraggingClass + " " + x.targetElementDraggingClass, ! 0)
                    }), o[s] = lt(o[s], function () {
                        var n = i.getUIPosition(arguments, x.getZoom());
                        B(t, n, null, ! 0), l(t, "jsPlumb_dragged")
                    }), o[a] = lt(o[a], function () {
                        var n = i.getUIPosition(arguments, x.getZoom());
                        B(t, n), u(t, "jsPlumb_dragged"), x.setHoverSuspended(! 1), x.select({
                            source: t
                        }).removeClass(x.elementDraggingClass + " " + x.sourceElementDraggingClass, ! 0), x.select({
                            target: t
                        }).removeClass(x.elementDraggingClass + " " + x.targetElementDraggingClass, ! 0)
                    });
                    var d = at(t);
                    U[d] = ! 0;
                    var r = U[d];
                    o.disabled = null == r ? ! 1: ! r, i.initDraggable(t, o, ! 1, x), x.dragManager.register(t)
                }
            }
        },
        q = function (t, n) {
            var e = b.extend({
                sourceIsNew: ! 0, targetIsNew: ! 0
            },
            t);
            if (n && b.extend(e, n), e.source && e.source.endpoint &&(e.sourceEndpoint = e.source), e.target && e.target.endpoint &&(e.targetEndpoint = e.target), t.uuids &&(e.sourceEndpoint = z(t.uuids[0]), e.targetEndpoint = z(t.uuids[1])), e.sourceEndpoint && e.sourceEndpoint.isFull()) return void h(x, "could not add connection; source endpoint is full");
            if (e.targetEndpoint && e.targetEndpoint.isFull()) return void h(x, "could not add connection; target endpoint is full");
            if (e.sourceEndpoint && ! e.sourceEndpoint.addedViaMouse &&(e.sourceIsNew = ! 1), e.targetEndpoint && ! e.targetEndpoint.addedViaMouse &&(e.targetIsNew = ! 1), ! e.type && e.sourceEndpoint &&(e.type = e.sourceEndpoint.connectionType), e.sourceEndpoint && e.sourceEndpoint.connectorOverlays) {
                e.overlays = e.overlays ||[];
                for (var r = 0, i = e.sourceEndpoint.connectorOverlays.length; i > r; r++) e.overlays.push(e.sourceEndpoint.connectorOverlays[r])
            }
            if (! e[ "pointer-events"] && e.sourceEndpoint && e.sourceEndpoint.connectorPointerEvents &&(e[ "pointer-events"] = e.sourceEndpoint.connectorPointerEvents), e.target && ! e.target.endpoint && ! e.targetEndpoint && ! e.newConnection) {
                var o = at(e.target), s = Et[o], a = jt[o];
                if (s) {
                    if (! Tt[o]) return;
                    var l = null != a ? a: x.addEndpoint(e.target, s);
                    St[o] &&(jt[o] = l), e.targetEndpoint = l, l._makeTargetCreator = ! 0, e.targetIsNew = ! 0
                }
            }
            if (e.source && ! e.source.endpoint && ! e.sourceEndpoint && ! e.newConnection) {
                var o = at(e.source), s = At[o], a = wt[o];
                if (s) {
                    if (! Lt[o]) return;
                    var l = null != a ? a: x.addEndpoint(e.source, s);
                    Ot[o] &&(wt[o] = l), e.sourceEndpoint = l, e.sourceIsNew = ! 0
                }
            }
            return e
        },
        Z = function (t) {
            var n = x.Defaults.ConnectionType || x.getDefaultConnectionType(), e = x.Defaults.EndpointType || b.Endpoint, r = b.CurrentLibrary.getParent;
            t.container ? t.parent = t.container: t.sourceEndpoint ? t.parent = t.sourceEndpoint.parent: t.source. constructor == e ? t.parent = t.source.parent: t.parent = r(t.source), t._jsPlumb = x, t.newConnection = Z, t.newEndpoint = $, t.endpointsByUUID = M, t.endpointsByElement = L, t.finaliseConnection = J;
            var i = new n(t);
            return i.id = "con_" + H(), K("click", "click", i), K("dblclick", "dblclick", i), K("contextmenu", "contextmenu", i), i
        },
        J = function (t, n, r) {
            if (n = n || {
            },
            t.suspendedEndpoint || e(O, t.scope, t), x.anchorManager.newConnection(t), B(t.source), ! n.doNotFireConnectionEvent && n.fireEvent !== ! 1) {
                var i = {
                    connection: t, source: t.source, target: t.target, sourceId: t.sourceId, targetId: t.targetId, sourceEndpoint: t.endpoints[0], targetEndpoint: t.endpoints[1]
                };
                x.fire("jsPlumbConnection", i, r), x.fire("connection", i, r)
            }
        },
        K = function (t, n, e) {
            e.bind(t, function (t, r) {
                x.fire(n, e, r)
            })
        },
        Q = function (t) {
            if (t.container) return t.container;
            var n = b.CurrentLibrary.getTagName(t.source), e = b.CurrentLibrary.getParent(t.source);
            return n && "td" === n.toLowerCase() ? b.CurrentLibrary.getParent(e): e
        },
        $ = function (t) {
            var n = x.Defaults.EndpointType || b.Endpoint, e = b.extend({
            },
            t);
            e.parent = Q(e), e._jsPlumb = x, e.newConnection = Z, e.newEndpoint = $, e.endpointsByUUID = M, e.endpointsByElement = L, e.finaliseConnection = J, e.fireDetachEvent = ut, e.floatingConnections = k, e.getParentFromParams = Q, e.connectionsByScope = O;
            var r = new n(e);
            return r.id = "ep_" + H(), K("click", "endpointClick", r), K("dblclick", "endpointDblClick", r), K("contextmenu", "contextmenu", r), jsPlumbAdapter.headless || x.dragManager.endpointAdded(t.source), r
        },
        tt = function (t, n, e) {
            var r = L[t];
            if (r && r.length) for (var i = 0, o = r.length; o > i; i++) {
                for (var s = 0, a = r[i].connections.length; a > s; s++) {
                    var l = n(r[i].connections[s]);
                    if (l) return
                }
                e && e(r[i])
            }
        },
        nt = function (t, n) {
            return V(t, function (t, e) {
                U[e] = n, b.CurrentLibrary.isDragSupported(t) && b.CurrentLibrary.setDraggable(t, n)
            })
        },
        et = function (t, n, e) {
            n = "block" === n;
            var r = null;
            e &&(r = n ? function (t) {
                t.setVisible(! 0, ! 0, ! 0)
            }: function (t) {
                t.setVisible(! 1, ! 0, ! 0)
            });
            var i = s(t, "id");
            tt(i, function (t) {
                if (n && e) {
                    var r = t.sourceId === i ? 1: 0; t.endpoints[r].isVisible() && t.setVisible(! 0)
                } else t.setVisible(n)
            },
            r)
        },
        rt = function (t) {
            return V(t, function (t, n) {
                var e = null == U[n] ? ! 1: U[n]; return e = ! e, U[n] = e, b.CurrentLibrary.setDraggable(t, e), e
            })
        },
        it = function (t, n) {
            var e = null;
            n &&(e = function (t) {
                var n = t.isVisible();
                t.setVisible(! n)
            }), tt(t, function (t) {
                var n = t.isVisible();
                t.setVisible(! n)
            },
            e)
        },
        ot = function (t) {
            var n = t.timestamp, e = t.recalc, r = t.offset, i = t.elId;
            if (Nt && ! n &&(n = Wt), ! e && n && n === T[i]) return {
                o: _[i], s: F[i]
            };
            if (e || ! r) {
                var o = c(i);
                null != o &&(F[i] = p(o), _[i] = d(o, x), T[i] = n)
            } else if (_[i] = r, null == F[i]) {
                var o = c(i);
                null != o &&(F[i] = p(o))
            }
            return _[i] && ! _[i].right &&(_[i].right = _[i].left + F[i][0], _[i].bottom = _[i].top + F[i][1], _[i].width = F[i][0], _[i].height = F[i][1], _[i].centerx = _[i].left + _[i].width / 2, _[i].centery = _[i].top + _[i].height / 2), {
                o: _[i], s: F[i]
            }
        },
        st = function (t) {
            var n = _[t];
            return n ? {
                o: n, s: F[t]
            }: ot({
                elId: t
            })
        },
        at = function (t, n, e) {
            var r = c(t), i = s(r, "id");
            return i && "undefined" != i ||(2 == arguments.length && void 0 != arguments[1] ? i = n:(1 == arguments.length || 3 == arguments.length && ! arguments[2]) &&(i = "jsPlumb_" + C + "_" + H()), e || a(r, "id", i)), i
        },
        lt = function (t, n, e) {
            return t = t || function () {
            },
            n = n || function () {
            },
            function () {
                var r = null;
                try {
                    r = n.apply(this, arguments)
                }
                catch (i) {
                    h(x, "jsPlumb function failed : " + i)
                }
                if (null == e || r !== e) try {
                    t.apply(this, arguments)
                }
                catch (i) {
                    h(x, "wrapped function failed : " + i)
                }
                return r
            }
        };
        this.isConnectionBeingDragged = function () {
            return null != w
        },
        this.setConnectionBeingDragged = function (t) {
            w = t
        },
        this.connectorClass = "_jsPlumb_connector", this.hoverClass = "_jsPlumb_hover", this.endpointClass = "_jsPlumb_endpoint", this.endpointConnectedClass = "_jsPlumb_endpoint_connected", this.endpointFullClass = "_jsPlumb_endpoint_full", this.endpointDropAllowedClass = "_jsPlumb_endpoint_drop_allowed", this.endpointDropForbiddenClass = "_jsPlumb_endpoint_drop_forbidden", this.overlayClass = "_jsPlumb_overlay", this.draggingClass = "_jsPlumb_dragging", this.elementDraggingClass = "_jsPlumb_element_dragging", this.sourceElementDraggingClass = "_jsPlumb_source_element_dragging", this.targetElementDraggingClass = "_jsPlumb_target_element_dragging", this.endpointAnchorClassPrefix = "_jsPlumb_endpoint_anchor", this.Anchors = {
        },
        this.Connectors = {
            canvas: {
            },
            svg: {
            },
            vml: {
            }
        },
        this.Endpoints = {
            canvas: {
            },
            svg: {
            },
            vml: {
            }
        },
        this.Overlays = {
            canvas: {
            },
            svg: {
            },
            vml: {
            }
        },
        this.ConnectorRenderers = {
        },
        this.addClass = function (t, n) {
            return b.CurrentLibrary.addClass(t, n)
        },
        this.removeClass = function (t, n) {
            return b.CurrentLibrary.removeClass(t, n)
        },
        this.hasClass = function (t, n) {
            return b.CurrentLibrary.hasClass(t, n)
        },
        this.addEndpoint = function (t, n, o) {
            o = o || {
            };
            var s = b.extend({
            },
            o);
            b.extend(s, n), s.endpoint = s.endpoint || x.Defaults.Endpoint || b.Defaults.Endpoint, s.paintStyle = s.paintStyle || x.Defaults.EndpointStyle || b.Defaults.EndpointStyle, t = R(t);
            for (var a =[], l = r(t) || null != t.length && ! i(t) ? t:[t], u = 0, d = l.length; d > u; u++) {
                var p = c(l[u]), h = at(p);
                s.source = p, ot({
                    elId: h, timestamp: Wt
                });
                var f = $(s);
                s.parentAnchor &&(f.parentAnchor = s.parentAnchor), e(L, h, f);
                var m = _[h], g = F[h], v = f.anchor.compute({
                    xy:[m.left, m.top], wh: g, element: f, timestamp: Wt
                }), y = {
                    anchorLoc: v, timestamp: Wt
                };
                Nt &&(y.recalc = ! 1), Nt || f.paint(y), a.push(f)
            }
            return 1 == a.length ? a[0]: a
        },
        this.addEndpoints = function (t, n, e) {
            for (var i =[], o = 0, s = n.length; s > o; o++) {
                var a = x.addEndpoint(t, n[o], e);
                r(a) ? Array.prototype.push.apply(i, a): i.push(a)
            }
            return i
        },
        this.animate = function (t, n, e) {
            var r = c(t), i = s(t, "id");
            e = e || {
            };
            var o = b.CurrentLibrary.dragEvents.step, a = b.CurrentLibrary.dragEvents.complete;
            e[o] = lt(e[o], function () {
                x.repaint(i)
            }), e[a] = lt(e[a], function () {
                x.repaint(i)
            }), b.CurrentLibrary.animate(r, n, e)
        },
        this.checkCondition = function (t, n) {
            var e = x.getListener(t), r = ! 0;
            if (e && e.length > 0) try {
                for (var i = 0, o = e.length; o > i; i++) r = r && e[i](n)
            }
            catch (s) {
                h(x, "cannot check condition [" + t + "]" + s)
            }
            return r
        },
        this.checkASyncCondition = function (t, n, e, r) {
            var i = x.getListener(t);
            if (i && i.length > 0) try {
                i[0](n, e, r)
            }
            catch (o) {
                h(x, "cannot asynchronously check condition [" + t + "]" + o)
            }
        },
        this.connect = function (t, n) {
            var e, r = q(t, n);
            return r &&(null == r.deleteEndpointsOnDetach &&(r.deleteEndpointsOnDetach = ! 0), e = Z(r), J(e, r)), e
        },
        this.deleteEndpoint = function (t, n) {
            x.doWhileSuspended(function () {
                var n = "string" == typeof t ? M[t]: t; if (n) {
                    var e = n.getUuid();
                    e &&(M[e] = null), n.detachAll().cleanup(), n.endpoint.cleanup && n.endpoint.cleanup(), jsPlumbUtil.removeElements(n.endpoint.getDisplayElements()), x.anchorManager.deleteEndpoint(n);
                    for (var r in L) {
                        var i = L[r]; if (i) {
                            for (var o =[], s = 0, a = i.length; a > s; s++) i[s] != n && o.push(i[s]);
                            L[r] = o
                        }
                        L[r].length < 1 && delete L[r]
                    }
                    jsPlumbAdapter.headless || x.dragManager.endpointDeleted(n)
                }
                return x
            },
            n)
        },
        this.deleteEveryEndpoint = function () {
            return x.doWhileSuspended(function () {
                for (var t in L) {
                    var n = L[t]; if (n && n.length) for (var e = 0, r = n.length; r > e; e++) x.deleteEndpoint(n[e], ! 0)
                }
                L = {
                },
                M = {
                },
                x.anchorManager.reset(), x.dragManager.reset()
            }), x
        };
        var ut = function (t, n, e) {
            var r = x.Defaults.ConnectionType || x.getDefaultConnectionType(), i = t. constructor == r, o = i ? {
                connection: t, source: t.source, target: t.target, sourceId: t.sourceId, targetId: t.targetId, sourceEndpoint: t.endpoints[0], targetEndpoint: t.endpoints[1]
            }: t;
            n &&(x.fire("jsPlumbConnectionDetached", o, e), x.fire("connectionDetached", o, e)), x.anchorManager.connectionDetached(o)
        };
        this.detach = function () {
            if (0 != arguments.length) {
                var t = x.Defaults.ConnectionType || x.getDefaultConnectionType(), n = arguments[0]. constructor == t, e = 2 == arguments.length && n ? arguments[1] || {
                }: arguments[0], r = e.fireEvent !== ! 1, i = e.forceDetach, o = n ? arguments[0]: e.connection;
                if (o)(i || jsPlumbUtil.functionChain(! 0, ! 1,[[o.endpoints[0], "isDetachAllowed",[o]],[o.endpoints[1], "isDetachAllowed",[o]],[o, "isDetachAllowed",[o]],[x, "checkCondition",[ "beforeDetach", o]]])) && o.endpoints[0].detach(o, ! 1, ! 0, r); else {
                    var s = b.extend({
                    },
                    e);
                    if (s.uuids) z(s.uuids[0]).detachFrom(z(s.uuids[1]), r); else if (s.sourceEndpoint && s.targetEndpoint) s.sourceEndpoint.detachFrom(s.targetEndpoint); else {
                        var a = at(s.source), l = at(s.target);
                        tt(a, function (t) {
                            (t.sourceId == a && t.targetId == l || t.targetId == a && t.sourceId == l) && x.checkCondition("beforeDetach", t) && t.endpoints[0].detach(t, ! 1, ! 0, r)
                        })
                    }
                }
            }
        },
        this.detachAllConnections = function (t, n) {
            n = n || {
            },
            t = c(t);
            var e = s(t, "id"), r = L[e];
            if (r && r.length) for (var i = 0, o = r.length; o > i; i++) r[i].detachAll(n.fireEvent);
            return x
        },
        this.detachEveryConnection = function (t) {
            t = t || {
            };
            for (var n in L) {
                var e = L[n];
                if (e && e.length) for (var r = 0, i = e.length; i > r; r++) e[r].detachAll(t.fireEvent)
            }
            return O = {
            },
            x
        },
        this.draggable = function (t, n) {
            if ("object" == typeof t && t.length) for (var e = 0, r = t.length; r > e; e++) {
                var i = c(t[e]);
                i && G(i, ! 0, n)
            } else if (t._nodes) for (var e = 0, r = t._nodes.length; r > e; e++) {
                var i = c(t._nodes[e]);
                i && G(i, ! 0, n)
            } else {
                var i = c(t);
                i && G(i, ! 0, n)
            }
            return x
        },
        this.extend = function (t, n) {
            return b.CurrentLibrary.extend(t, n)
        },
        this.getDefaultEndpointType = function () {
            return b.Endpoint
        },
        this.getDefaultConnectionType = function () {
            return b.Connection
        };
        var ct = function (t, n, e, r) {
            for (var i = 0, o = t.length; o > i; i++) t[i][n].apply(t[i], e);
            return r(t)
        },
        dt = function (t, n, e) {
            for (var r =[], i = 0, o = t.length; o > i; i++) r.push([t[i][n].apply(t[i], e), t[i]]);
            return r
        },
        pt = function (t, n, e) {
            return function () {
                return ct(t, n, arguments, e)
            }
        },
        ht = function (t, n) {
            return function () {
                return dt(t, n, arguments)
            }
        },
        ft = function (t, n) {
            var e =[];
            if (t) if ("string" == typeof t) {
                if ("*" === t) return t;
                e.push(t)
            } else if (n) e = t; else for (var r = 0, i = t.length; i > r; r++) e.push(at(c(t[r])));
            return e
        },
        mt = function (n, e, r) {
            return "*" === n ? ! 0: n.length > 0 ? -1 != t(n, e): ! r
        };
        this.getConnections = function (t, n) {
            t ? t. constructor == String &&(t = {
                scope: t
            }): t = {
            };
            var e = t.scope || x.getDefaultScope(), r = ft(e, ! 0), i = ft(t.source), o = ft(t.target), s = ! n && r.length > 1 ? {
            }:[], a = function (t, e) {
                if (! n && r.length > 1) {
                    var i = s[t];
                    null == i &&(i =[], s[t] = i), i.push(e)
                } else s.push(e)
            };
            for (var l in O) if (mt(r, l)) for (var u = 0, c = O[l].length; c > u; u++) {
                var d = O[l][u];
                mt(i, d.sourceId) && mt(o, d.targetId) && a(l, d)
            }
            return s
        };
        var gt = function (t, n) {
            return function (e) {
                for (var r = 0, i = t.length; i > r; r++) e(t[r]);
                return n(t)
            }
        },
        vt = function (t) {
            return function (n) {
                return t[n]
            }
        },
        yt = function (t, n) {
            for (var e = {
                length: t.length, each: gt(t, n), get: vt(t)
            },
            r =[ "setHover", "removeAllOverlays", "setLabel", "addClass", "addOverlay", "removeOverlay", "removeOverlays", "showOverlay", "hideOverlay", "showOverlays", "hideOverlays", "setPaintStyle", "setHoverPaintStyle", "setSuspendEvents", "setParameter", "setParameters", "setVisible", "repaint", "addType", "toggleType", "removeType", "removeClass", "setType", "bind", "unbind"], i =[ "getLabel", "getOverlay", "isHover", "getParameter", "getParameters", "getPaintStyle", "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents"], o = 0, s = r.length; s > o; o++) e[r[o]] = pt(t, r[o], n);
            for (var o = 0, s = i.length; s > o; o++) e[i[o]] = ht(t, i[o]);
            return e
        },
        bt = function (t) {
            var n = yt(t, bt);
            return b.CurrentLibrary.extend(n, {
                setDetachable: pt(t, "setDetachable", bt), setReattach: pt(t, "setReattach", bt), setConnector: pt(t, "setConnector", bt), detach: function () {
                    for (var n = 0, e = t.length; e > n; n++) x.detach(t[n]);
                },
                isDetachable: ht(t, "isDetachable"), isReattach: ht(t, "isReattach")
            })
        },
        Pt = function (t) {
            var n = yt(t, Pt);
            return b.CurrentLibrary.extend(n, {
                setEnabled: pt(t, "setEnabled", Pt), setAnchor: pt(t, "setAnchor", Pt), isEnabled: ht(t, "isEnabled"), detachAll: function () {
                    for (var n = 0, e = t.length; e > n; n++) t[n].detachAll()
                },
                remove: function () {
                    for (var n = 0, e = t.length; e > n; n++) x.deleteEndpoint(t[n])
                }
            })
        };
        this.select = function (t) {
            t = t || {
            },
            t.scope = t.scope || "*";
            var n = t.connections || x.getConnections(t, ! 0);
            return bt(n)
        },
        this.selectEndpoints = function (t) {
            t = t || {
            },
            t.scope = t.scope || "*";
            var n = ! t.element && ! t.source && ! t.target, e = n ? "*": ft(t.element), r = n ? "*": ft(t.source), i = n ? "*": ft(t.target), o = ft(t.scope, ! 0), s =[];
            for (var a in L) {
                var l = mt(e, a, ! 0), u = mt(r, a, ! 0), c = "*" != r, d = mt(i, a, ! 0), p = "*" != i;
                if (l || u || d) t: for (var h = 0, f = L[a].length; f > h; h++) {
                    var m = L[a][h];
                    if (mt(o, m.scope, ! 0)) {
                        var g = c && r.length > 0 && ! m.isSource, v = p && i.length > 0 && ! m.isTarget;
                        if (g || v) continue t;
                        s.push(m)
                    }
                }
            }
            return Pt(s)
        },
        this.getAllConnections = function () {
            return O
        },
        this.getDefaultScope = function () {
            return Y
        },
        this.getEndpoint = z, this.getEndpoints = function (t) {
            return L[at(t)]
        },
        this.getId = at, this.getOffset = function (t) {
            _[t];
            return ot({
                elId: t
            })
        },
        this.getSelector = function () {
            return b.CurrentLibrary.getSelector.apply(null, arguments)
        },
        this.getSize = function (t) {
            var n = F[t];
            return n || ot({
                elId: t
            }), F[t]
        },
        this.appendElement = W;
        var xt = ! 1;
        this.isHoverSuspended = function () {
            return xt
        },
        this.setHoverSuspended = function (t) {
            xt = t
        };
        var Ct = function (t) {
            return function () {
                return jsPlumbAdapter.isRenderModeAvailable(t)
            }
        };
        this.isCanvasAvailable = Ct("canvas"), this.isSVGAvailable = Ct("svg"), this.isVMLAvailable = Ct("vml"), this.hide = function (t, n) {
            return et(t, "none", n), x
        },
        this.idstamp = H, this.init = function () {
            A ||(x.anchorManager = new b.AnchorManager({
                jsPlumbInstance: x
            }), x.setRenderMode(x.Defaults.RenderMode), A = ! 0, x.fire("ready", x))
        },
        this.log = I, this.jsPlumbUIComponent = m, this.makeAnchor = function () {
            var t = function (t, n) {
                if (b.Anchors[t]) return new b.Anchors[t](n);
                if (! x.Defaults.DoNotThrowErrors) throw {
                    msg: "jsPlumb: unknown anchor type '" + t + "'"
                }
            };
            if (0 == arguments.length) return null;
            var n = arguments[0], e = arguments[1], s = arguments[2], a = null;
            if (n.compute && n.getOrientation) return n;
            if ("string" == typeof n) a = t(arguments[0], {
                elementId: e, jsPlumbInstance: x
            }); else if (r(n)) if (r(n[0]) || i(n[0])) if (2 == n.length && i(n[0]) && o(n[1])) {
                var l = b.extend({
                    elementId: e, jsPlumbInstance: x
                },
                n[1]);
                a = t(n[0], l)
            } else a = new b.DynamicAnchor({
                anchors: n, selector: null, elementId: e, jsPlumbInstance: s
            }); else {
                var u = {
                    x: n[0], y: n[1], orientation: n.length >= 4 ?[n[2], n[3]]:[0, 0], offsets: n.length >= 6 ?[n[4], n[5]]:[0, 0], elementId: e, jsPlumbInstance: s, cssClass: 7 == n.length ? n[6]: null
                };
                a = new b.Anchor(u), a.clone = function () {
                    return new b.Anchor(u)
                }
            }
            return a.id ||(a.id = "anchor_" + H()), a
        },
        this.makeAnchors = function (t, n, e) {
            for (var i =[], o = 0, s = t.length; s > o; o++) "string" == typeof t[o] ? i.push(b.Anchors[t[o]]({
                elementId: n, jsPlumbInstance: e
            })): r(t[o]) && i.push(x.makeAnchor(t[o], n, e));
            return i
        },
        this.makeDynamicAnchor = function (t, n) {
            return new b.DynamicAnchor({
                anchors: t, selector: n, elementId: null, jsPlumbInstance: x
            })
        };
        var Et = {
        },
        jt = {
        },
        St = {
        },
        Dt = {
        },
        It = function (t, n) {
            t.paintStyle = t.paintStyle || x.Defaults.EndpointStyles[n] || x.Defaults.EndpointStyle || b.Defaults.EndpointStyles[n] || b.Defaults.EndpointStyle, t.hoverPaintStyle = t.hoverPaintStyle || x.Defaults.EndpointHoverStyles[n] || x.Defaults.EndpointHoverStyle || b.Defaults.EndpointHoverStyles[n] || b.Defaults.EndpointHoverStyle, t.anchor = t.anchor || x.Defaults.Anchors[n] || x.Defaults.Anchor || b.Defaults.Anchors[n] || b.Defaults.Anchor, t.endpoint = t.endpoint || x.Defaults.Endpoints[n] || x.Defaults.Endpoint || b.Defaults.Endpoints[n] || b.Defaults.Endpoint
        };
        this.makeTarget = function (t, n, e) {
            var r = b.extend({
                _jsPlumb: x
            },
            e);
            b.extend(r, n), It(r, 1);
            var i = b.CurrentLibrary, o = r.scope || x.Defaults.Scope, a = !(r.deleteEndpointsOnDetach === ! 1), l = r.maxConnections || -1, u = r.onMaxConnections;
            _doOne = function (t) {
                var n = at(t);
                Et[n] = r, St[n] = r.uniqueEndpoint, Dt[n] = l, Tt[n] = ! 0, proxyComponent = new m(r);
                var e = b.extend({
                },
                r.dropOptions || {
                }), h = function () {
                    var e = b.CurrentLibrary.getDropEvent(arguments), o = x.select({
                        target: n
                    }).length;
                    x.currentlyDragging = ! 1;
                    var l = c(i.getDragObject(arguments)), h = s(l, "dragId"), f = s(l, "originalScope"), m = k[h], g = m.endpoints[0];
                    r.endpoint ? b.extend({
                    },
                    r.endpoint): {
                    };
                    if (! Tt[n] || Dt[n] > 0 && o >= Dt[n]) return u && u({
                        element: t, connection: m
                    },
                    e), ! 1;
                    g.anchor.locked = ! 1, f && i.setDragScope(l, f);
                    var v = proxyComponent.isDropAllowed(m.sourceId, at(t), m.scope, m, null);
                    if (m.endpointsToDeleteOnDetach &&(g === m.endpointsToDeleteOnDetach[0] ? m.endpointsToDeleteOnDetach[0] = null: g === m.endpointsToDeleteOnDetach[1] &&(m.endpointsToDeleteOnDetach[1] = null)), m.suspendedEndpoint &&(m.targetId = m.suspendedEndpoint.elementId, m.target = i.getElementObject(m.suspendedEndpoint.elementId), m.endpoints[1] = m.suspendedEndpoint), v) {
                        g.detach(m, ! 1, ! 0, ! 1);
                        var y = jt[n] || x.addEndpoint(t, r);
                        if (r.uniqueEndpoint &&(jt[n] = y), y._makeTargetCreator = ! 0, null != y.anchor.positionFinder) {
                            var P = i.getUIPosition(arguments, x.getZoom()), C = d(t, x), E = p(t), j = y.anchor.positionFinder(P, C, E, y.anchor.constructorParams);
                            y.anchor.x = j[0], y.anchor.y = j[1]
                        }
                        var S = x.connect({
                            source: g, target: y, scope: f, previousConnection: m, container: m.parent, deleteEndpointsOnDetach: a, endpointsToDeleteOnDetach: a ?[g, y]: null, doNotFireConnectionEvent: g.endpointWillMoveAfterConnection
                        });
                        m.endpoints[1]._makeTargetCreator && m.endpoints[1].connections.length < 2 && x.deleteEndpoint(m.endpoints[1]), S.repaint()
                    } else m.suspendedEndpoint &&(m.isReattach() ?(m.setHover(! 1), m.floatingAnchorIndex = null, m.suspendedEndpoint.addConnection(m), x.repaint(g.elementId)): g.detach(m, ! 1, ! 0, ! 0, e))
                },
                f = i.dragEvents.drop;
                e.scope = e.scope || o, e[f] = lt(e[f], h), i.initDroppable(t, e, ! 0)
            },
            t = R(t);
            for (var h = t.length && t. constructor != String ? t:[t], f = 0, g = h.length; g > f; f++) _doOne(c(h[f]));
            return x
        },
        this.unmakeTarget = function (t, n) {
            t = b.CurrentLibrary.getElementObject(t);
            var e = at(t);
            return n ||(delete Et[e], delete St[e], delete Dt[e], delete Tt[e]), x
        },
        this.makeTargets = function (t, n, e) {
            for (var r = 0, i = t.length; i > r; r++) x.makeTarget(t[r], n, e)
        };
        var At = {
        },
        wt = {
        },
        Ot = {
        },
        Lt = {
        },
        Mt = {
        },
        _t = {
        },
        Tt = {
        },
        kt = function (t, n, e) {
            for (var r = t.target || t.srcElement, i = ! 1, o = x.getSelector(n, e), s = 0; s < o.length; s++) if (o[s] == r) {
                i = ! 0;
                break
            }
            return i
        };
        this.makeSource = function (t, e, r) {
            var i = b.extend({
            },
            r);
            b.extend(i, e), It(i, 0);
            var o = b.CurrentLibrary, s = i.maxConnections || -1, a = i.onMaxConnections, l = function (t) {
                var e = at(t), r = function () {
                    return null == i.parent ? i.parent: "parent" === i.parent ? o.getElementObject(o.getDOMElement(t).parentNode): o.getElementObject(i.parent)
                },
                l = null != i.parent ? x.getId(r()): e;
                At[l] = i, Ot[l] = i.uniqueEndpoint, Lt[l] = ! 0;
                var u = o.dragEvents.stop, c = o.dragEvents.drag, d = b.extend({
                },
                i.dragOptions || {
                }), p = d.drag, h = d.stop, f = null, m = ! 1;
                _t[l] = s, d.scope = d.scope || i.scope, d[c] = lt(d[c], function () {
                    p && p.apply(this, arguments), m = ! 1
                }), d[u] = lt(d[u], function () {
                    if (h && h.apply(this, arguments), x.currentlyDragging = ! 1, 0 == f.connections.length) x.deleteEndpoint(f); else {
                        o.unbind(f.canvas, "mousedown");
                        var t = i.anchor || x.Defaults.Anchor, s =(f.anchor, f.connections[0]);
                        if (f.setAnchor(x.makeAnchor(t, e, x)), i.parent) {
                            var a = r();
                            if (a) {
                                var l = f.elementId, u = i.container || x.Defaults.Container || b.Defaults.Container; f.setElement(a, u), f.endpointWillMoveAfterConnection = ! 1, x.anchorManager.rehomeEndpoint(l, a), s.previousConnection = null, n(O[s.scope], function (t) {
                                    return t.id === s.id
                                }), x.anchorManager.connectionDetached({
                                    sourceId: s.sourceId, targetId: s.targetId, connection: s
                                }), J(s)
                            }
                        }
                        f.repaint(), x.repaint(f.elementId), x.repaint(s.targetId)
                    }
                });
                var g = function (n) {
                    if (Lt[l]) {
                        if (i.filter) {
                            var u = o.getOriginalEvent(n), c = jsPlumbUtil.isString(i.filter) ? kt(u, t, i.filter): i.filter(u, t);
                            if (c === ! 1) return
                        }
                        var p = x.select({
                            source: l
                        }).length;
                        if (_t[l] >= 0 && p >= _t[l]) return a && a({
                            element: t, maxConnections: s
                        },
                        n), ! 1;
                        var h = ot({
                            elId: e
                        }).o, g = x.getZoom(), v =((n.pageX || n.page.x) / g - h.left) / h.width, y =((n.pageY || n.page.y) / g - h.top) / h.height, P = v, C = y;
                        if (i.parent) {
                            var E = r(), j = at(E);
                            h = ot({
                                elId: j
                            }).o, P =((n.pageX || n.page.x) - h.left) / h.width, C =((n.pageY || n.page.y) - h.top) / h.height
                        }
                        var S = {
                        };
                        if (b.extend(S, i), S.isSource = ! 0, S.anchor =[v, y, 0, 0], S.parentAnchor =[P, C, 0, 0], S.dragOptions = d, i.parent) {
                            var D = S.container || x.Defaults.Container || b.Defaults.Container;
                            D ? S.container = D: S.container = b.CurrentLibrary.getParent(r())
                        }
                        f = x.addEndpoint(e, S), m = ! 0, f.endpointWillMoveAfterConnection = null != i.parent, f.endpointWillMoveTo = i.parent ? r(): null, f.addedViaMouse = ! 0;
                        var I = function () {
                            m && x.deleteEndpoint(f)
                        };
                        x.registerListener(f.canvas, "mouseup", I), x.registerListener(t, "mouseup", I), o.trigger(f.canvas, "mousedown", n)
                    }
                };
                x.registerListener(t, "mousedown", g), Mt[e] = g, i.filter && jsPlumbUtil.isString(i.filter) && o.setDragFilter(t, i.filter)
            };
            t = R(t);
            for (var u = t.length && t. constructor != String ? t:[t], d = 0, p = u.length; p > d; d++) l(c(u[d]));
            return x
        },
        this.unmakeSource = function (t, n) {
            t = b.CurrentLibrary.getElementObject(t);
            var e = at(t), r = Mt[e];
            return r && x.unregisterListener(t, "mousedown", r), n ||(delete At[e], delete Ot[e], delete Lt[e], delete Mt[e], delete _t[e]), x
        },
        this.unmakeEverySource = function () {
            for (var t in Lt) x.unmakeSource(t, ! 0);
            At = {
            },
            Ot = {
            },
            Lt = {
            },
            Mt = {
            }
        },
        this.unmakeEveryTarget = function () {
            for (var t in Tt) x.unmakeTarget(t, ! 0);
            return Et = {
            },
            St = {
            },
            Dt = {
            },
            Tt = {
            },
            x
        },
        this.makeSources = function (t, n, e) {
            for (var r = 0, i = t.length; i > r; r++) x.makeSource(t[r], n, e);
            return x
        };
        var Ut = function (t, n, e, r) {
            var o = "source" == t ? Lt: Tt;
            if (i(n)) o[n] = r ? ! o[n]: e; else if (n.length) {
                n = R(n);
                for (var s = 0, a = n.length; a > s; s++) {
                    var l = _el = b.CurrentLibrary.getElementObject(n[s]), l = at(_el);
                    o[l] = r ? ! o[l]: e
                }
            }
            return x
        };
        this.setSourceEnabled = function (t, n) {
            return Ut("source", t, n)
        },
        this.toggleSourceEnabled = function (t) {
            return Ut("source", t, null, ! 0), x.isSourceEnabled(t)
        },
        this.isSource = function (t) {
            return t = b.CurrentLibrary.getElementObject(t), null != Lt[at(t)]
        },
        this.isSourceEnabled = function (t) {
            return t = b.CurrentLibrary.getElementObject(t), Lt[at(t)] === ! 0
        },
        this.setTargetEnabled = function (t, n) {
            return Ut("target", t, n)
        },
        this.toggleTargetEnabled = function (t) {
            return Ut("target", t, null, ! 0), x.isTargetEnabled(t)
        },
        this.isTarget = function (t) {
            return t = b.CurrentLibrary.getElementObject(t), null != Tt[at(t)]
        },
        this.isTargetEnabled = function (t) {
            return t = b.CurrentLibrary.getElementObject(t), Tt[at(t)] === ! 0
        },
        this.ready = function (t) {
            x.bind("ready", t)
        },
        this.repaint = function (t, n, e) {
            if ("object" == typeof t && t.length) for (var r = 0, i = t.length; i > r; r++) B(c(t[r]), n, e); else B(c(t), n, e);
            return x
        },
        this.repaintEverything = function () {
            var t = null;
            for (var n in L) B(c(n), null, t);
            return x
        },
        this.removeAllEndpoints = function (t, n) {
            var e = function (t) {
                var r = jsPlumbUtil.isString(t) ? t: at(c(t)), i = L[r];
                if (i) for (var o = 0, s = i.length; s > o; o++) x.deleteEndpoint(i[o]);
                if (delete L[r], n) {
                    var a = b.CurrentLibrary.getDOMElement(c(t));
                    if (a && 3 != a.nodeType && 8 != a.nodeType) for (var o = 0, s = a.childNodes.length; s > o; o++) e(a.childNodes[o])
                }
            };
            return e(t), x
        },
        this.remove = function (t) {
            var n = c(t), e = jsPlumbUtil.isString(t) ? t: at(n);
            x.doWhileSuspended(function () {
                x.removeAllEndpoints(e, ! 0), x.dragManager.elementRemoved(e)
            }), b.CurrentLibrary.removeElement(n)
        };
        var Ft = {
        },
        Yt = function () {
            for (var t in Ft) for (var n = 0, e = Ft[t].length; e > n; n++) {
                var r = Ft[t][n];
                b.CurrentLibrary.unbind(r.el, r.event, r.listener)
            }
            Ft = {
            }
        };
        this.registerListener = function (t, n, r) {
            b.CurrentLibrary.bind(t, n, r), e(Ft, n, {
                el: t, event: n, listener: r
            })
        },
        this.unregisterListener = function (t, e, r) {
            b.CurrentLibrary.unbind(t, e, r), n(Ft, function (t) {
                return t.type == e && t.listener == r
            })
        },
        this.reset = function () {
            x.deleteEveryEndpoint(), x.unbind(), Et = {
            },
            jt = {
            },
            St = {
            },
            Dt = {
            },
            At = {
            },
            wt = {
            },
            Ot = {
            },
            _t = {
            },
            Yt(), x.anchorManager.reset(), jsPlumbAdapter.headless || x.dragManager.reset()
        },
        this.setDefaultScope = function (t) {
            return Y = t, x
        },
        this.setDraggable = nt, this.setId = function (t, n, e) {
            var r = t. constructor == String ? t: x.getId(t), i = x.getConnections({
                source: r, scope: "*"
            }, ! 0), o = x.getConnections({
                target: r, scope: "*"
            }, ! 0);
            n = "" + n, e ||(t = b.CurrentLibrary.getElementObject(r), b.CurrentLibrary.setAttribute(t, "id", n)), t = b.CurrentLibrary.getElementObject(n), L[n] = L[r] ||[];
            for (var s = 0, a = L[n].length; a > s; s++) L[n][s].setElementId(n), L[n][s].setReferenceElement(t);
            delete L[r], x.anchorManager.changeId(r, n), jsPlumbAdapter.headless || x.dragManager.changeId(r, n);
            var l = function (e, r, i) {
                for (var o = 0, s = e.length; s > o; o++) e[o].endpoints[r].setElementId(n), e[o].endpoints[r].setReferenceElement(t), e[o][i + "Id"] = n, e[o][i] = t
            };
            l(i, 0, "source"), l(o, 1, "target"), x.repaint(n)
        },
        this.setIdChanged = function (t, n) {
            x.setId(t, n, ! 0)
        },
        this.setDebugLog = function (t) {
            I = t
        };
        var Nt = ! 1, Wt = null;
        this.setSuspendDrawing = function (t, n) {
            Nt = t, Wt = t ?(new Date).getTime(): null, n && x.repaintEverything()
        },
        this.isSuspendDrawing = function () {
            return Nt
        },
        this.getSuspendedAt = function () {
            return Wt
        },
        this.doWhileSuspended = function (t, n) {
            x.setSuspendDrawing(! 0);
            try {
                t()
            }
            catch (e) {
                h("Function run while suspended failed", e)
            }
            x.setSuspendDrawing(! 1, ! n)
        },
        this.updateOffset = ot, this.getOffset = function (t) {
            return _[t]
        },
        this.getSize = function (t) {
            return F[t]
        },
        this.getCachedData = st, this.timestamp = f, this.SVG = "svg", this.CANVAS = "canvas", this.VML = "vml", this.setRenderMode = function (t) {
            return N = jsPlumbAdapter.setRenderMode(t)
        },
        this.getRenderMode = function () {
            return N
        },
        this.show = function (t, n) {
            return et(t, "block", n), x
        },
        this.sizeCanvas = function (t, n, e, r, i) {
            return t &&(t.style.height = i + "px", t.height = i, t.style.width = r + "px", t.width = r, t.style.left = n + "px", t.style.top = e + "px"), x
        },
        this.getTestHarness = function () {
            return {
                endpointsByElement: L, endpointCount: function (t) {
                    var n = L[t];
                    return n ? n.length: 0
                },
                connectionCount: function (t) {
                    t = t || Y;
                    var n = O[t];
                    return n ? n.length: 0
                },
                getId: at, makeAnchor: self.makeAnchor, makeDynamicAnchor: self.makeDynamicAnchor
            }
        },
        this.toggleVisible = it, this.toggleDraggable = rt, this.wrap = lt, this.addListener = this.bind, this.adjustForParentOffsetAndScroll = function (t, n) {
            var e = null, r = t;
            if ("svg" === n.tagName.toLowerCase() && n.parentNode ? e = n.parentNode: n.offsetParent &&(e = n.offsetParent), null != e) {
                var i = "body" === e.tagName.toLowerCase() ? {
                    left: 0, top: 0
                }: d(e, x), o = "body" === e.tagName.toLowerCase() ? {
                    left: 0, top: 0
                }: {
                    left: e.scrollLeft, top: e.scrollTop
                };
                r[0] = t[0] - i.left + o.left, r[1] = t[1] - i.top + o.top
            }
            return r
        },
        jsPlumbAdapter.headless ||(x.dragManager = jsPlumbAdapter.getDragManager(x), x.recalculateOffsets = x.dragManager.updateOffsets)
    },
    b = new y;
    "undefined" != typeof window &&(window.jsPlumb = b), b.getInstance = function (t) {
        var n = new y(t);
        return n.init(), n
    },
    "function" == typeof define &&(define("jsplumb",[], function () {
        return b
    }), define("jsplumbinstance",[], function () {
        return b.getInstance()
    })), "undefined" != typeof exports &&(exports.jsPlumb = b)
}
(), function () {
    jsPlumb.AnchorManager = function (t) {
        var n = {
        },
        e = {
        },
        r = {
        },
        i = {
        },
        o = {
        },
        s = {
            HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity"
        },
        a = {
        },
        l = this, u = {
        },
        c = t.jsPlumbInstance, d = jsPlumb.CurrentLibrary, p = {
        },
        h = function (t, n, e, r, i, o) {
            if (t === n) return {
                orientation: s.IDENTITY, a:[ "top", "top"]
            };
            var a = Math.atan2(r.centery - e.centery, r.centerx - e.centerx), l = Math.atan2(e.centery - r.centery, e.centerx - r.centerx), u = e.left <= r.left && e.right >= r.left || e.left <= r.right && e.right >= r.right || e.left <= r.left && e.right >= r.right || r.left <= e.left && r.right >= e.right, c = e.top <= r.top && e.bottom >= r.top || e.top <= r.bottom && e.bottom >= r.bottom || e.top <= r.top && e.bottom >= r.bottom || r.top <= e.top && r.bottom >= e.bottom, d = function (t) {
                return[i.isContinuous ? i.verifyEdge(t[0]): t[0], o.isContinuous ? o.verifyEdge(t[1]): t[1]]
            },
            p = {
                orientation: s.DIAGONAL, theta: a, theta2: l
            };
            return u || c ? u ?(p.orientation = s.HORIZONTAL, p.a = e.top < r.top ?[ "bottom", "top"]:[ "top", "bottom"]):(p.orientation = s.VERTICAL, p.a = e.left < r.left ?[ "right", "left"]:[ "left", "right"]): r.left > e.left && r.top > e.top ? p.a =[ "right", "top"]: r.left > e.left && e.top > r.top ? p.a =[ "top", "left"]: r.left < e.left && r.top < e.top ? p.a =[ "top", "right"]: r.left < e.left && r.top > e.top &&(p.a =[ "left", "top"]), p.a = d(p.a), p
        },
        f = function (t, n, e, r, i, o, s) {
            for (var a =[], l = n[i ? 0: 1] /(r.length+1),u=0;u<r.length;u++){var c=(u+1)*l,d=o*n[i?1:0];s&&(c=n[i?0:1]-c);var p=i?c:d,h=e[0]+p,f=p/ n[0], m = i ? d: c, g = e[1] + m, v = m / n[1]; a.push([h, g, f, v, r[u][1], r[u][2]])
        }
        return a
    },
    m = function (t) {
        return function (n, e) {
            var r = ! 0; return r = t ? n[0][0] < e[0][0]: n[0][0] > e[0][0], r === ! 1 ? -1: 1
        }
    },
    g = function (t, n) {
        var e = t[0][0] < 0 ? - Math.PI - t[0][0]: Math.PI - t[0][0], r = n[0][0] < 0 ? - Math.PI - n[0][0]: Math.PI - n[0][0]; return e > r ? 1: t[0][1] > n[0][1] ? 1: -1
    },
    v = {
        top: function (t, n) {
            return t[0] > n[0] ? 1: -1
        },
        right: m(! 0), bottom: m(! 0), left: g
    },
    y = function (t, n) {
        return t.sort(n)
    },
    b = function (t, n) {
        var e = c.getCachedData(t), i = e.s, s = e.o, a = function (n, e, i, s, a, l, u) {
            if (s.length > 0) for (var d = y(s, v[n]), p = "right" === n || "top" === n, h = f(n, e, i, d, a, l, p), m = function (t, n) {
                var e = c.adjustForParentOffsetAndScroll([n[0], n[1]], t.canvas);
                r[t.id] =[e[0], e[1], n[2], n[3]], o[t.id] = u
            },
            g = 0; g < h.length; g++) {
                var b = h[g][4], P = b.endpoints[0].elementId === t, x = b.endpoints[1].elementId === t; P ? m(b.endpoints[0], h[g]): x && m(b.endpoints[1], h[g])
            }
        };
        a("bottom", i,[s.left, s.top], n.bottom, ! 0, 1,[0, 1]), a("top", i,[s.left, s.top], n.top, ! 0, 0,[0, -1]), a("left", i,[s.left, s.top], n.left, ! 1, 0,[-1, 0]), a("right", i,[s.left, s.top], n.right, ! 1, 1,[1, 0])
    };
    this.reset = function () {
        n = {
        },
        a = {
        },
        u = {
        }
    },
    this.addFloatingConnection = function (t, n) {
        p[t] = n
    },
    this.removeFloatingConnection = function (t) {
        delete p[t]
    },
    this.newConnection = function (t) {
        var n = t.sourceId, e = t.targetId, r = t.endpoints, i = ! 0, o = function (t, o, s, l, u) {
            n == e && s.isContinuous &&(d.removeElement(r[1].canvas), i = ! 1), jsPlumbUtil.addToList(a, l,[u, o, s. constructor == jsPlumb.DynamicAnchor])
        };
        o(0, r[0], r[0].anchor, e, t), i && o(1, r[1], r[1].anchor, n, t)
    };
    var P = function (t) { ! function (t, n) {
            if (t) {
                var e = function (t) {
                    return t[4] == n
                };
                jsPlumbUtil.removeWithFunction(t.top, e), jsPlumbUtil.removeWithFunction(t.left, e), jsPlumbUtil.removeWithFunction(t.bottom, e), jsPlumbUtil.removeWithFunction(t.right, e)
            }
        }
        (u[t.elementId], t.id)
    };
    this.connectionDetached = function (t) {
        var n = t.connection || t, e = t.sourceId, r = t.targetId, i = n.endpoints, o = function (t, n, e, r, i) {
            e. constructor == jsPlumb.FloatingAnchor || jsPlumbUtil.removeWithFunction(a[r], function (t) {
                return t[0].id == i.id
            })
        };
        o(1, i[1], i[1].anchor, e, n), o(0, i[0], i[0].anchor, r, n), P(n.endpoints[0]), P(n.endpoints[1]), l.redraw(n.sourceId), l.redraw(n.targetId)
    },
    this.add = function (t, e) {
        jsPlumbUtil.addToList(n, e, t)
    },
    this.changeId = function (t, e) {
        a[e] = a[t], n[e] = n[t], delete a[t], delete n[t]
    },
    this.getConnectionsFor = function (t) {
        return a[t] ||[]
    },
    this.getEndpointsFor = function (t) {
        return n[t] ||[]
    },
    this.deleteEndpoint = function (t) {
        jsPlumbUtil.removeWithFunction(n[t.elementId], function (n) {
            return n.id == t.id
        }), P(t)
    },
    this.clearFor = function (t) {
        delete n[t], n[t] =[]
    };
    var x = function (n, e, r, i, o, s, a, l, u, c, d, p) {
        var h = -1, f = -1, m = i.endpoints[a], g = m.id, v =[1, 0][a], y =[[e, r], i, o, s, g], b = n[u], P = m._continuousAnchorEdge ? n[m._continuousAnchorEdge]: null; if (P) {
            var x = jsPlumbUtil.findWithFunction(P, function (t) {
                return t[4] == g
            });
            if (-1 != x) {
                P.splice(x, 1);
                for (var C = 0; C < P.length; C++) jsPlumbUtil.addWithFunction(d, P[C][1], function (t) {
                    return t.id == P[C][1].id
                }), jsPlumbUtil.addWithFunction(p, P[C][1].endpoints[a], function (t) {
                    return t.id == P[C][1].endpoints[a].id
                }), jsPlumbUtil.addWithFunction(p, P[C][1].endpoints[v], function (t) {
                    return t.id == P[C][1].endpoints[v].id
                })
            }
        }
        for (var C = 0; C < b.length; C++) 1 == t.idx && b[C][3] === s && -1 == f &&(f = C), jsPlumbUtil.addWithFunction(d, b[C][1], function (t) {
            return t.id == b[C][1].id
        }), jsPlumbUtil.addWithFunction(p, b[C][1].endpoints[a], function (t) {
            return t.id == b[C][1].endpoints[a].id
        }), jsPlumbUtil.addWithFunction(p, b[C][1].endpoints[v], function (t) {
            return t.id == b[C][1].endpoints[v].id
        });
        if (-1 != h) b[h] = y; else {
            var E = l ? -1 != f ? f: 0: b.length; b.splice(E, 0, y)
        }
        m._continuousAnchorEdge = u
    };
    this.redraw = function (t, e, r, i, o) {
        if (! c.isSuspendDrawing()) {
            var s = n[t] ||[], l = a[t] ||[], d =[], f =[], m =[]; r = r || c.timestamp(), i = i || {
                left: 0, top: 0
            },
            e &&(e = {
                left: e.left + i.left, top: e.top + i.top
            });
            for (var g = c.updateOffset({
                elId: t, offset: e, recalc: ! 1, timestamp: r
            }), v = {
            },
            y = 0; y < l.length; y++) {
                var P = l[y][0], C = P.sourceId, E = P.targetId, j = P.endpoints[0].anchor.isContinuous, S = P.endpoints[1].anchor.isContinuous; if (j || S) {
                    var D = C + "_" + E, I = v[D], A = P.sourceId == t ? 1: 0; j && ! u[C] &&(u[C] = {
                        top:[], right:[], bottom:[], left:[]
                    }), S && ! u[E] &&(u[E] = {
                        top:[], right:[], bottom:[], left:[]
                    }), t != E && c.updateOffset({
                        elId: E, timestamp: r
                    }), t != C && c.updateOffset({
                        elId: C, timestamp: r
                    });
                    var w = c.getCachedData(E), O = c.getCachedData(C);
                    E == C &&(j || S) ? x(u[C], - Math.PI / 2, 0, P, ! 1, E, 0, ! 1, "top", C, d, f):(I ||(I = h(C, E, O.o, w.o, P.endpoints[0].anchor, P.endpoints[1].anchor), v[D] = I), j && x(u[C], I.theta, 0, P, ! 1, E, 0, ! 1, I.a[0], C, d, f), S && x(u[E], I.theta2, -1, P, ! 0, C, 1, ! 0, I.a[1], E, d, f)), j && jsPlumbUtil.addWithFunction(m, C, function (t) {
                        return t === C
                    }), S && jsPlumbUtil.addWithFunction(m, E, function (t) {
                        return t === E
                    }), jsPlumbUtil.addWithFunction(d, P, function (t) {
                        return t.id == P.id
                    }),(j && 0 == A || S && 1 == A) && jsPlumbUtil.addWithFunction(f, P.endpoints[A], function (t) {
                        return t.id == P.endpoints[A].id
                    })
                }
            }
            for (var y = 0; y < s.length; y++) 0 == s[y].connections.length && s[y].anchor.isContinuous &&(u[t] ||(u[t] = {
                top:[], right:[], bottom:[], left:[]
            }), x(u[t], - Math.PI / 2, 0, {
                endpoints:[s[y], s[y]], paint: function () {
                }
            }, ! 1, t, 0, ! 1, "top", t, d, f), jsPlumbUtil.addWithFunction(m, t, function (n) {
                return n === t
            }));
            for (var y = 0; y < m.length; y++) b(m[y], u[m[y]]);
            for (var y = 0; y < s.length; y++) s[y].paint({
                timestamp: r, offset: g, dimensions: g.s
            });
            for (var y = 0; y < f.length; y++) {
                var L = c.getCachedData(f[y].elementId);
                f[y].paint({
                    timestamp: r, offset: L, dimensions: L.s
                })
            }
            for (var y = 0; y < l.length; y++) {
                var M = l[y][1]; if (M.anchor. constructor == jsPlumb.DynamicAnchor) {
                    M.paint({
                        elementWithPrecedence: t
                    }), jsPlumbUtil.addWithFunction(d, l[y][0], function (t) {
                        return t.id == l[y][0].id
                    });
                    for (var _ = 0; _ < M.connections.length; _++) M.connections[_] !== l[y][0] && jsPlumbUtil.addWithFunction(d, M.connections[_], function (t) {
                        return t.id == M.connections[_].id
                    })
                } else M.anchor. constructor == jsPlumb.Anchor && jsPlumbUtil.addWithFunction(d, l[y][0], function (t) {
                    return t.id == l[y][0].id
                })
            }
            var T = p[t]; T && T.paint({
                timestamp: r, recalc: ! 1, elId: t
            });
            for (var y = 0; y < d.length; y++) d[y].paint({
                elId: t, timestamp: r, recalc: ! 1, clearEdits: o
            })
        }
    },
    this.rehomeEndpoint = function (t, e) {
        var r = n[t] ||[], i = c.getId(e);
        if (i !== t) {
            for (var o = 0; o < r.length; o++) l.add(r[o], i);
            r.splice(0, r.length)
        }
    };
    var C = function (t) {
        jsPlumbUtil.EventGenerator.apply(this), this.type = "Continuous", this.isDynamic = ! 0, this.isContinuous = ! 0; for (var n = t.faces ||[ "top", "right", "bottom", "left"], e = !(t.clockwise === ! 1), s = {
        },
        a = {
            top: "bottom", right: "left", left: "right", bottom: "top"
        },
        l = {
            top: "right", right: "bottom", left: "top", bottom: "left"
        },
        u = {
            top: "left", right: "top", left: "bottom", bottom: "right"
        },
        c = e ? l: u, d = e ? u: l, p = t.cssClass || "", h = 0; h < n.length; h++) s[n[h]] = ! 0; this.verifyEdge = function (t) {
            return s[t] ? t: s[a[t]] ? a[t]: s[c[t]] ? c[t]: s[d[t]] ? d[t]: t
        },
        this.compute = function (t) {
            return i[t.element.id] || r[t.element.id] ||[0, 0]
        },
        this.getCurrentLocation = function (t) {
            return i[t.id] || r[t.id] ||[0, 0]
        },
        this.getOrientation = function (t) {
            return o[t.id] ||[0, 0]
        },
        this.clearUserDefinedLocation = function () {
            delete i[t.elementId]
        },
        this.setUserDefinedLocation = function (n) {
            i[t.elementId] = n
        },
        this.getCssClass = function () {
            return p
        },
        this.setCssClass = function (t) {
            p = t
        }
    };
    c.continuousAnchorFactory = {
        get: function (t) {
            var n = e[t.elementId]; return n ||(n = new C(t), e[t.elementId] = n), n
        }
    }
},
jsPlumb.Anchor = function (t) {
    var n = this; this.x = t.x || 0, this.y = t.y || 0, this.elementId = t.elementId, jsPlumbUtil.EventGenerator.apply(this);
    var e = t.orientation ||[0, 0], r = t.jsPlumbInstance, i = null, o = null, s = t.cssClass || ""; this.getCssClass = function () {
        return s
    },
    this.offsets = t.offsets ||[0, 0], n.timestamp = null, this.compute = function (t) {
        var e = t.xy, s = t.wh, a = t.element, l = t.timestamp; return t.clearUserDefinedLocation &&(o = null), l && l === n.timestamp ? i:(null != o ? i = o:(i =[e[0] + n.x * s[0] + n.offsets[0], e[1] + n.y * s[1] + n.offsets[1]], i = r.adjustForParentOffsetAndScroll(i, a.canvas)), n.timestamp = l, i)
    },
    this.getOrientation = function (t) {
        return e
    },
    this.equals = function (t) {
        if (! t) return ! 1; var n = t.getOrientation(), e = this.getOrientation();
        return this.x == t.x && this.y == t.y && this.offsets[0] == t.offsets[0] && this.offsets[1] == t.offsets[1] && e[0] == n[0] && e[1] == n[1]
    },
    this.getCurrentLocation = function () {
        return i
    },
    this.getUserDefinedLocation = function () {
        return o
    },
    this.setUserDefinedLocation = function (t) {
        o = t
    },
    this.clearUserDefinedLocation = function () {
        o = null
    }
},
jsPlumb.FloatingAnchor = function (t) {
    jsPlumb.Anchor.apply(this, arguments);
    var n = t.reference, e = jsPlumb.CurrentLibrary, r = t.jsPlumbInstance, i = t.referenceCanvas, o = e.getSize(e.getElementObject(i)), s = 0, a = 0, l = null, u = null; this.x = 0, this.y = 0, this.isFloating = ! 0, this.compute = function (t) {
        var n = t.xy, e = t.element, i =[n[0] + o[0] /2,n[1]+o[1]/ 2]; return i = r.adjustForParentOffsetAndScroll(i, e.canvas), u = i, i
    },
    this.getOrientation = function (t) {
        if (l) return l; var e = n.getOrientation(t);
        return[Math.abs(e[0]) * s * -1, Math.abs(e[1]) * a * -1]
    },
    this.over = function (t) {
        l = t.getOrientation()
    },
    this.out = function () {
        l = null
    },
    this.getCurrentLocation = function () {
        return u
    }
},
jsPlumb.DynamicAnchor = function (t) {
    jsPlumb.Anchor.apply(this, arguments), this.isSelective = ! 0, this.isDynamic = ! 0; for (var n =[], e = this, r = function (n) {
        return n. constructor == jsPlumb.Anchor ? n: t.jsPlumbInstance.makeAnchor(n, t.elementId, t.jsPlumbInstance)
    },
    i = 0; i < t.anchors.length; i++) n[i] = r(t.anchors[i]);
    this.addAnchor = function (t) {
        n.push(r(t))
    },
    this.getAnchors = function () {
        return n
    },
    this.locked = ! 1; var o = n.length > 0 ? n[0]: null, s =(n.length > 0 ? 0: -1, o), e = this, a = function (t, n, e, r, i) {
        var o = r[0] + t.x * i[0], s = r[1] + t.y * i[1], a = r[0] + i[0] /2,l=r[1]+i[1]/ 2; return Math.sqrt(Math.pow(n - o, 2) + Math.pow(e - s, 2)) + Math.sqrt(Math.pow(a - o, 2) + Math.pow(l - s, 2))
    },
    l = t.selector || function (t, n, e, r, i) {
        for (var o = e[0] + r[0] /2,s=e[1]+r[1]/ 2, l = -1, u = 1 / 0, c = 0; c < i.length; c++) {
            var d = a(i[c], o, s, t, n);
            u > d &&(l = c + 0, u = d)
        }
        return i[l]
    };
    this.compute = function (t) {
        var r = t.xy, i = t.wh, a =(t.timestamp, t.txy), u = t.twh; t.clearUserDefinedLocation &&(userDefinedLocation = null);
        var c = e.getUserDefinedLocation();
        return null != c ? c: e.locked || null == a || null == u ? o.compute(t):(t.timestamp = null, o = l(r, i, a, u, n), e.x = o.x, e.y = o.y, o != s && e.fire("anchorChanged", o), s = o, o.compute(t))
    },
    this.getCurrentLocation = function () {
        return e.getUserDefinedLocation() ||(null != o ? o.getCurrentLocation(): null)
    },
    this.getOrientation = function (t) {
        return null != o ? o.getOrientation(t):[0, 0]
    },
    this.over = function (t) {
        null != o && o.over(t)
    },
    this.out = function () {
        null != o && o.out()
    },
    this.getCssClass = function () {
        return o && o.getCssClass() || ""
    }
};
var t = function (t, n, e, r, i, o) {
    jsPlumb.Anchors[i] = function (s) {
        var a = s.jsPlumbInstance.makeAnchor([t, n, e, r, 0, 0], s.elementId, s.jsPlumbInstance);
        return a.type = i, o && o(a, s), a
    }
};
t(.5, 0, 0, -1, "TopCenter"), t(.5, 1, 0, 1, "BottomCenter"), t(0, .5, -1, 0, "LeftMiddle"), t(1, .5, 1, 0, "RightMiddle"), t(.5, 0, 0, -1, "Top"), t(.5, 1, 0, 1, "Bottom"), t(0, .5, -1, 0, "Left"), t(1, .5, 1, 0, "Right"), t(.5, .5, 0, 0, "Center"), t(1, 0, 0, -1, "TopRight"), t(1, 1, 0, 1, "BottomRight"), t(0, 0, 0, -1, "TopLeft"), t(0, 1, 0, 1, "BottomLeft"), jsPlumb.Defaults.DynamicAnchors = function (t) {
    return t.jsPlumbInstance.makeAnchors([ "TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], t.elementId, t.jsPlumbInstance)
},
jsPlumb.Anchors.AutoDefault = function (t) {
    var n = t.jsPlumbInstance.makeDynamicAnchor(jsPlumb.Defaults.DynamicAnchors(t));
    return n.type = "AutoDefault", n
};
var n = function (t, n) {
    jsPlumb.Anchors[t] = function (e) {
        var r = e.jsPlumbInstance.makeAnchor([ "Continuous", {
            faces: n
        }], e.elementId, e.jsPlumbInstance);
        return r.type = t, r
    }
};
jsPlumb.Anchors.Continuous = function (t) {
    return t.jsPlumbInstance.continuousAnchorFactory. get (t)
},
n("ContinuousLeft",[ "left"]), n("ContinuousTop",[ "top"]), n("ContinuousBottom",[ "bottom"]), n("ContinuousRight",[ "right"]), jsPlumb.Anchors.Assign = t(0, 0, 0, 0, "Assign", function (t, n) {
    var e = n.position || "Fixed"; t.positionFinder = e. constructor == String ? n.jsPlumbInstance.AnchorPositionFinders[e]: e, t.constructorParams = n
}), jsPlumb.AnchorPositionFinders = {
    Fixed: function (t, n, e, r) {
        return[(t.left - n.left) / e[0],(t.top - n.top) / e[1]]
    },
    Grid: function (t, n, e, r) {
        var i = t.left - n.left, o = t.top - n.top, s = e[0] /r.grid[0],a=e[1]/ r.grid[1], l = Math.floor(i / s), u = Math.floor(o / a);
        return[(l * s + s / 2) / e[0],(u * a + a / 2) / e[1]]
    }
},
jsPlumb.Anchors.Perimeter = function (t) {
    t = t || {
    };
    var n = t.anchorCount || 60, e = t.shape; if (! e) throw new Error("no shape supplied to Perimeter Anchor type");
    var r = function () {
        for (var t = .5, e = 2 * Math.PI / n, r = 0, i =[], o = 0; n > o; o++) {
            var s = t + t * Math.sin(r), a = t + t * Math.cos(r);
            i.push([s, a, 0, 0]), r += e
        }
        return i
    },
    i = function (t) {
        for (var e = n / t.length, r =[], i = function (t, i, o, s, a) {
            e = n * a; for (var l =(o - t) / e, u =(s - i) / e, c = 0; e > c; c++) r.push([t + l * c, i + u * c, 0, 0])
        },
        o = 0; o < t.length; o++) i.apply(null, t[o]);
        return r
    },
    o = function (t) {
        for (var n =[], e = 0; e < t.length; e++) n.push([t[e][0], t[e][1], t[e][2], t[e][3], 1 / t.length]);
        return i(n)
    },
    s = function () {
        return o([[0, 0, 1, 0],[1, 0, 1, 1],[1, 1, 0, 1],[0, 1, 0, 0]])
    },
    a = {
        Circle: r, Ellipse: r, Diamond: function () {
            return o([[.5, 0, 1, .5],[1, .5, .5, 1],[.5, 1, 0, .5],[0, .5, .5, 0]])
        },
        Rectangle: s, Square: s, Triangle: function () {
            return o([[.5, 0, 1, 1],[1, 1, 0, 1],[0, 1, .5, 0]])
        },
        Path: function (t) {
            for (var n = t.points, e =[], r = 0, o = 0; o < n.length -1; o++) {
                var s = Math.sqrt(Math.pow(n[o][2] - n[o][0]) + Math.pow(n[o][3] - n[o][1]));
                r += s, e.push([n[o][0], n[o][1], n[o + 1][0], n[o + 1][1], s])
            }
            for (var o = 0; o < e.length; o++) e[o][4] = e[o][4] /r;return i(e)}},l=function(t,n){for(var e=[],r=n/ 180 * Math.PI, i = 0; i < t.length; i++) {
                var o = t[i][0] -.5, s = t[i][1] -.5;
                e.push([.5 +(o * Math.cos(r) - s * Math.sin(r)), .5 +(o * Math.sin(r) + s * Math.cos(r)), t[i][2], t[i][3]])
            }
            return e
        };
        if (! a[e]) throw new Error("Shape [" + e + "] is unknown by Perimeter Anchor type");
        var u = a[e](t);
        t.rotation &&(u = l(u, t.rotation));
        var c = t.jsPlumbInstance.makeDynamicAnchor(u);
        return c.type = "Perimeter", c
    }
}
(), function () {
    var t = function (t, n) {
        var e = ! 1;
        return {
            drag: function () {
                if (e) return e = ! 1, ! 0;
                var r = jsPlumb.CurrentLibrary.getUIPosition(arguments, n.getZoom());
                t.element &&(jsPlumb.CurrentLibrary.setOffset(t.element, r), n.repaint(t.element, r))
            },
            stopDrag: function () {
                e = ! 0
            }
        }
    },
    n = function (t, n, e) {
        var r = document.createElement("div");
        r.style.position = "absolute";
        var i = jsPlumb.CurrentLibrary.getElementObject(r);
        jsPlumb.CurrentLibrary.appendElement(r, n);
        var o = e.getId(i);
        e.updateOffset({
            elId: o
        }), t.id = o, t.element = i
    },
    e = function (t, n, e, r, i, o, s) {
        var a = new jsPlumb.FloatingAnchor({
            reference: n, referenceCanvas: r, jsPlumbInstance: o
        });
        return s({
            paintStyle: t, endpoint: e, anchor: a, source: i, scope: "__floating"
        })
    },
    r =[ "connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass"];
    jsPlumb.Endpoint = function (i) {
        var o = this, s = i._jsPlumb, a = jsPlumb.CurrentLibrary, l = a.getAttribute, u = a.getElementObject, c = jsPlumbUtil, d = a.getOffset, p = i.newConnection, h = i.newEndpoint, f = i.finaliseConnection, m = i.fireDetachEvent, g = i.floatingConnections;
        o.idPrefix = "_jsplumb_e_", o.defaultLabelLocation =[.5, .5], o.defaultOverlayKeys =[ "Overlays", "EndpointOverlays"], this.parent = i.parent, overlayCapableJsPlumbUIComponent.apply(this, arguments), i = i || {
        },
        this.getTypeDescriptor = function () {
            return "endpoint"
        },
        this.getDefaultType = function () {
            return {
                parameters: {
                },
                scope: null, maxConnections: o._jsPlumb.Defaults.MaxConnections, paintStyle: o._jsPlumb.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle, endpoint: o._jsPlumb.Defaults.Endpoint || jsPlumb.Defaults.Endpoint, hoverPaintStyle: o._jsPlumb.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle, overlays: o._jsPlumb.Defaults.EndpointOverlays || jsPlumb.Defaults.EndpointOverlays, connectorStyle: i.connectorStyle, connectorHoverStyle: i.connectorHoverStyle, connectorClass: i.connectorClass, connectorHoverClass: i.connectorHoverClass, connectorOverlays: i.connectorOverlays, connector: i.connector, connectorTooltip: i.connectorTooltip
            }
        };
        var v = this.applyType;
        this.applyType = function (t, n) {
            v(t, n), null != t.maxConnections &&(T = t.maxConnections), t.scope &&(o.scope = t.scope), c.copyValues(r, t, o)
        };
        var y = ! 0, b = !(i.enabled === ! 1);
        this.isVisible = function () {
            return y
        },
        this.setVisible = function (t, n, e) {
            if (y = t, o.canvas &&(o.canvas.style.display = t ? "block": "none"), o[t ? "showOverlays": "hideOverlays"](), ! n) for (var r = 0; r < o.connections.length; r++) if (o.connections[r].setVisible(t), ! e) {
                var i = o === o.connections[r].endpoints[0] ? 1: 0;
                1 == o.connections[r].endpoints[i].connections.length && o.connections[r].endpoints[i].setVisible(t, ! 0, ! 0)
            }
        },
        this.isEnabled = function () {
            return b
        },
        this.setEnabled = function (t) {
            b = t
        };
        var P = i.source, x = i.uuid, C = null, E = null;
        x &&(i.endpointsByUUID[x] = o);
        var j = l(P, "id");
        this.elementId = j, this.element = P, o.setElementId = function (t) {
            j = t, o.elementId = t, o.anchor.elementId = t
        },
        o.setReferenceElement = function (t) {
            P = t, o.element = t
        };
        var S = i.connectionCost;
        this.getConnectionCost = function () {
            return S
        },
        this.setConnectionCost = function (t) {
            S = t
        };
        var D = i.connectionsDirected;
        this.areConnectionsDirected = function () {
            return D
        },
        this.setConnectionsDirected = function (t) {
            D = t
        };
        var I = "", A = function () {
            a.removeClass(P, s.endpointAnchorClassPrefix + "_" + I), o.removeClass(s.endpointAnchorClassPrefix + "_" + I), I = o.anchor.getCssClass(), o.addClass(s.endpointAnchorClassPrefix + "_" + I), a.addClass(P, s.endpointAnchorClassPrefix + "_" + I);
        };
        this.setAnchor = function (t, n) {
            o.anchor = s.makeAnchor(t, j, s), A(), o.anchor.bind("anchorChanged", function (t) {
                o.fire("anchorChanged", {
                    endpoint: o, anchor: t
                }), A()
            }), n || s.repaint(j)
        },
        this.cleanup = function () {
            a.removeClass(P, s.endpointAnchorClassPrefix + "_" + I)
        };
        var w = i.anchor ? i.anchor: i.anchors ? i.anchors: s.Defaults.Anchor || "Top";
        o.setAnchor(w, ! 0), i._transient || s.anchorManager.add(o, j);
        var O = null, L = null;
        this.setEndpoint = function (t) {
            var n = function (t, n) {
                var e = s.getRenderMode();
                if (jsPlumb.Endpoints[e][t]) return new jsPlumb.Endpoints[e][t](n);
                if (! s.Defaults.DoNotThrowErrors) throw {
                    msg: "jsPlumb: unknown endpoint type '" + t + "'"
                }
            },
            e = {
                _jsPlumb: o._jsPlumb, cssClass: i.cssClass, parent: i.parent, container: i.container, tooltip: i.tooltip, connectorTooltip: i.connectorTooltip, endpoint: o
            };
            c.isString(t) ? O = n(t, e): c.isArray(t) ?(e = c.merge(t[1], e), O = n(t[0], e)): O = t.clone();
            var r = jsPlumb.extend({
            },
            e);
            O.clone = function () {
                var t = new Object;
                return O. constructor.apply(t,[r]), t
            },
            o.endpoint = O, o.type = o.endpoint.type
        },
        this.setEndpoint(i.endpoint || s.Defaults.Endpoint || jsPlumb.Defaults.Endpoint || "Dot"), L = O;
        var M = o.setHover;
        o.setHover = function () {
            o.endpoint.setHover.apply(o.endpoint, arguments), M.apply(o, arguments)
        };
        var _ = function (t) {
            o.connections.length > 0 ? o.connections[0].setHover(t, ! 1): o.setHover(t)
        };
        o.bindListeners(o.endpoint, o, _), this.setPaintStyle(i.paintStyle || i.style || s.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle, ! 0), this.setHoverPaintStyle(i.hoverPaintStyle || s.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle, ! 0), this.paintStyleInUse = this.getPaintStyle();
        this.getPaintStyle();
        c.copyValues(r, i, this), this.isSource = i.isSource || ! 1, this.isTarget = i.isTarget || ! 1;
        var T = i.maxConnections || s.Defaults.MaxConnections;
        this.getAttachedElements = function () {
            return o.connections
        },
        this.canvas = this.endpoint.canvas, o.addClass(s.endpointAnchorClassPrefix + "_" + I), a.addClass(P, s.endpointAnchorClassPrefix + "_" + I), this.connections = i.connections ||[], this.connectorPointerEvents = i[ "connector-pointer-events"], this.scope = i.scope || s.getDefaultScope(), this.timestamp = null, o.reattachConnections = i.reattach || s.Defaults.ReattachConnections, o.connectionsDetachable = s.Defaults.ConnectionsDetachable,(i.connectionsDetachable === ! 1 || i.detachable === ! 1) &&(o.connectionsDetachable = ! 1);
        var k = i.dragAllowedWhenFull || ! 0;
        i.onMaxConnections && o.bind("maxConnections", i.onMaxConnections), this.computeAnchor = function (t) {
            return o.anchor.compute(t)
        },
        this.addConnection = function (t) {
            o.connections.push(t), o[(o.connections.length > 0 ? "add": "remove") + "Class"](s.endpointConnectedClass), o[(o.isFull() ? "add": "remove") + "Class"](s.endpointFullClass)
        },
        this.detach = function (t, n, e, r, a) {
            var l = c.findWithFunction(o.connections, function (n) {
                return n.id == t.id
            }), u = ! 1;
            if (r = r !== ! 1, l >= 0 &&(e || t._forceDetach || t.isDetachable() || t.isDetachAllowed(t))) {
                var d = t.endpoints[0] == o ? t.endpoints[1]: t.endpoints[0];
                if (e || t._forceDetach || o.isDetachAllowed(t)) {
                    if (o.connections.splice(l, 1), ! n &&(d.detach(t, ! 0, e), t.endpointsToDeleteOnDetach)) for (var p = 0; p < t.endpointsToDeleteOnDetach.length; p++) {
                        var h = t.endpointsToDeleteOnDetach[p];
                        h && 0 == h.connections.length && s.deleteEndpoint(h)
                    }
                    null != t.getConnector() && c.removeElements(t.getConnector().getDisplayElements(), t.parent), c.removeWithFunction(i.connectionsByScope[t.scope], function (n) {
                        return n.id == t.id
                    }), o[(o.connections.length > 0 ? "add": "remove") + "Class"](s.endpointConnectedClass), o[(o.isFull() ? "add": "remove") + "Class"](s.endpointFullClass), u = ! 0, m(t, ! n && r, a)
                }
            }
            return u
        },
        this.detachAll = function (t, n) {
            for (; o.connections.length > 0;) o.detach(o.connections[0], ! 1, ! 0, t, n);
            return o
        },
        this.detachFrom = function (t, n, e) {
            for (var r =[], i = 0; i < o.connections.length; i++)(o.connections[i].endpoints[1] == t || o.connections[i].endpoints[0] == t) && r.push(o.connections[i]);
            for (var i = 0; i < r.length; i++) o.detach(r[i], ! 1, ! 0, n, e) && r[i].setHover(! 1, ! 1);
            return o
        },
        this.detachFromConnection = function (t) {
            var n = c.findWithFunction(o.connections, function (n) {
                return n.id == t.id
            });
            n >= 0 &&(o.connections.splice(n, 1), o[(o.connections.length > 0 ? "add": "remove") + "Class"](s.endpointConnectedClass), o[(o.isFull() ? "add": "remove") + "Class"](s.endpointFullClass))
        },
        this.getElement = function () {
            return P
        },
        this.setElement = function (t, n) {
            var e = s.getId(t);
            c.removeWithFunction(i.endpointsByElement[o.elementId], function (t) {
                return t.id == o.id
            }), P = u(t), j = s.getId(P), o.elementId = j;
            var r = i.getParentFromParams({
                source: e, container: n
            }), l = a.getParent(o.canvas);
            a.removeElement(o.canvas, l), a.appendElement(o.canvas, r);
            for (var d = 0; d < o.connections.length; d++) o.connections[d].moveParent(r), o.connections[d].sourceId = j, o.connections[d].source = P;
            c.addToList(i.endpointsByElement, e, o)
        },
        this.getUuid = function () {
            return x
        },
        o.makeInPlaceCopy = function () {
            var t = o.anchor.getCurrentLocation(o), n = o.anchor.getOrientation(o), e = o.anchor.getCssClass(), r = {
                bind: function () {
                },
                compute: function () {
                    return[t[0], t[1]]
                },
                getCurrentLocation: function () {
                    return[t[0], t[1]]
                },
                getOrientation: function () {
                    return n
                },
                getCssClass: function () {
                    return e
                }
            };
            return h({
                anchor: r, source: P, paintStyle: this.getPaintStyle(), endpoint: i.hideOnDrag ? "Blank": O, _transient: ! 0, scope: o.scope
            })
        },
        this.isConnectedTo = function (t) {
            var n = ! 1;
            if (t) for (var e = 0; e < o.connections.length; e++) if (o.connections[e].endpoints[1] == t) {
                n = ! 0;
                break
            }
            return n
        },
        this.isFloating = function () {
            return null != C
        },
        this.connectorSelector = function () {
            var t = o.connections[0];
            return o.isTarget && t ? t: o.connections.length < T || -1 == T ? null: t
        },
        this.isFull = function () {
            return !(o.isFloating() || 1 > T || o.connections.length < T)
        },
        this.setDragAllowedWhenFull = function (t) {
            k = t
        },
        this.setStyle = o.setPaintStyle, this.equals = function (t) {
            return this.anchor.equals(t.anchor)
        };
        var U = function (t) {
            var n = 0;
            if (null != t) for (var e = 0; e < o.connections.length; e++) if (o.connections[e].sourceId == t || o.connections[e].targetId == t) {
                n = e;
                break
            }
            return o.connections[n]
        };
        if (this.paint = function (t) {
            t = t || {
            };
            var n = t.timestamp, e = !(t.recalc === ! 1);
            if (! n || o.timestamp !== n) {
                var r = s.updateOffset({
                    elId: j, timestamp: n, recalc: e
                }), i = t.offset ? t.offset.o: r.o; if (i) {
                    var a = t.anchorPoint, l = t.connectorPaintStyle; if (null == a) {
                        var u = t.dimensions || r.s;(null == i || null == u) &&(r = s.updateOffset({
                            elId: j, timestamp: n
                        }), i = r.o, u = r.s);
                        var c = {
                            xy:[i.left, i.top], wh: u, element: o, timestamp: n
                        };
                        if (e && o.anchor.isDynamic && o.connections.length > 0) {
                            var d = U(t.elementWithPrecedence), p = d.endpoints[0] == o ? 1: 0, h = 0 == p ? d.sourceId: d.targetId, f = s.getCachedData(h), m = f.o, g = f.s; c.txy =[m.left, m.top], c.twh = g, c.tElement = d.endpoints[p]
                        }
                        a = o.anchor.compute(c)
                    }
                    O.compute(a, o.anchor.getOrientation(o), o.paintStyleInUse, l || o.paintStyleInUse), O.paint(o.paintStyleInUse, o.anchor), o.timestamp = n; for (var v = 0; v < o.overlays.length; v++) {
                        var y = o.overlays[v]; y.isVisible() &&(o.overlayPlacements[v] = y.draw(o.endpoint, o.paintStyleInUse), y.paint(o.overlayPlacements[v]))
                    }
                }
            }
        },
        this.repaint = this.paint, a.isDragSupported(P)) {
            var F = {
                id: null, element: null
            },
            Y = null, N = ! 1, W = null, X = t(F, s), H = function () {
                Y = o.connectorSelector();
                var t = ! 0;
                if (o.isEnabled() ||(t = ! 1), null != Y || i.isSource ||(t = ! 1), i.isSource && o.isFull() && ! k &&(t = ! 1), null == Y || Y.isDetachable() ||(t = ! 1), t === ! 1) return a.stopDrag && a.stopDrag(), X.stopDrag(), ! 1;
                o.addClass("endpointDrag"), Y && ! o.isFull() && i.isSource &&(Y = null), s.updateOffset({
                    elId: j
                }), E = o.makeInPlaceCopy(), E.referenceEndpoint = o, E.paint(), n(F, o.parent, s);
                var r = u(E.canvas), l = d(r, s), f = s.adjustForParentOffsetAndScroll([l.left, l.top], E.canvas), m = u(o.canvas);
                if (a.setOffset(F.element, {
                    left: f[0], top: f[1]
                }), o.parentAnchor &&(o.anchor = s.makeAnchor(o.parentAnchor, o.elementId, s)), a.setAttribute(m, "dragId", F.id), a.setAttribute(m, "elId", j), C = e(o.getPaintStyle(), o.anchor, O, o.canvas, F.element, s, h), o.canvas.style.visibility = "hidden", null == Y) o.anchor.locked = ! 0, o.setHover(! 1, ! 1), Y = p({
                    sourceEndpoint: o, targetEndpoint: C, source: o.endpointWillMoveTo || P, target: F.element, anchors:[o.anchor, C.anchor], paintStyle: i.connectorStyle, hoverPaintStyle: i.connectorHoverStyle, connector: i.connector, overlays: i.connectorOverlays, type: o.connectionType, cssClass: o.connectorClass, hoverClass: o.connectorHoverClass
                }), Y.addClass(s.draggingClass), C.addClass(s.draggingClass), s.fire("connectionDrag", Y); else {
                    N = ! 0, Y.setHover(! 1), Z(r, ! 1, ! 0);
                    var v = Y.endpoints[0].id == o.id ? 0: 1;
                    Y.floatingAnchorIndex = v, o.detachFromConnection(Y);
                    var y = jsPlumb.CurrentLibrary.getDragScope(m);
                    a.setAttribute(m, "originalScope", y);
                    var b = a.getDropScope(m);
                    a.setDragScope(m, b), 0 == v ?(W =[Y.source, Y.sourceId, q, y], Y.source = F.element, Y.sourceId = F.id):(W =[Y.target, Y.targetId, q, y], Y.target = F.element, Y.targetId = F.id), Y.endpoints[0 == v ? 1: 0].anchor.locked = ! 0, Y.suspendedEndpoint = Y.endpoints[v], Y.suspendedElement = Y.endpoints[v].getElement(), Y.suspendedElementId = Y.endpoints[v].elementId, Y.suspendedElementType = 0 == v ? "source": "target", Y.suspendedEndpoint.setHover(! 1), C.referenceEndpoint = Y.suspendedEndpoint, Y.endpoints[v] = C, Y.addClass(s.draggingClass), C.addClass(s.draggingClass), s.fire("connectionDrag", Y)
                }
                g[F.id] = Y, s.anchorManager.addFloatingConnection(F.id, Y), C.addConnection(Y), c.addToList(i.endpointsByElement, F.id, C), s.currentlyDragging = ! 0
            },
            R = i.dragOptions || {
            },
            B = jsPlumb.extend({
            },
            a.defaultDragOptions), V = a.dragEvents.start, z = a.dragEvents.stop, G = a.dragEvents.drag;
            R = jsPlumb.extend(B, R), R.scope = R.scope || o.scope, R[V] = s.wrap(R[V], H), R[G] = s.wrap(R[G], X.drag), R[z] = s.wrap(R[z], function () {
                var t = a.getDropEvent(arguments);
                c.removeWithFunction(i.endpointsByElement[F.id], function (t) {
                    return t.id == C.id
                }), c.removeElement(E.canvas, P), s.anchorManager.clearFor(F.id);
                var n = null == Y.floatingAnchorIndex ? 1: Y.floatingAnchorIndex; Y.endpoints[0 == n ? 1: 0].anchor.locked = ! 1, Y.endpoints[n] == C &&(N && Y.suspendedEndpoint ?(0 == n ?(Y.source = W[0], Y.sourceId = W[1]):(Y.target = W[0], Y.targetId = W[1]), a.setDragScope(W[2], W[3]), Y.endpoints[n] = Y.suspendedEndpoint,(Y.isReattach() || Y._forceReattach || Y._forceDetach || ! Y.endpoints[0 == n ? 1: 0].detach(Y, ! 1, ! 1, ! 0, t)) &&(Y.setHover(! 1), Y.floatingAnchorIndex = null, Y.suspendedEndpoint.addConnection(Y), s.repaint(W[1])), Y._forceDetach = null, Y._forceReattach = null):(c.removeElements(Y.getConnector().getDisplayElements(), o.parent), o.detachFromConnection(Y))), c.removeElements([F.element[0], C.canvas], P), s.dragManager.elementRemoved(C.elementId), o.canvas.style.visibility = "visible", o.anchor.locked = ! 1, o.paint({
                    recalc: ! 1
                }), Y.removeClass(s.draggingClass), C.removeClass(s.draggingClass), s.fire("connectionDragStop", Y), Y = null, E = null, delete i.endpointsByElement[C.elementId], C.anchor = null, C = null, s.currentlyDragging = ! 1
            });
            var q = u(o.canvas);
            a.initDraggable(q, R, ! 0, s)
        }
        var Z = function (t, n, e, r) {
            if ((i.isTarget || n) && a.isDropSupported(P)) {
                var c = i.dropOptions || s.Defaults.DropOptions || jsPlumb.Defaults.DropOptions;
                c = jsPlumb.extend({
                },
                c), c.scope = c.scope || o.scope;
                var d = a.dragEvents.drop, p = a.dragEvents.over, h = a.dragEvents.out, v = function () {
                    o.removeClass(s.endpointDropAllowedClass), o.removeClass(s.endpointDropForbiddenClass);
                    var t = a.getDropEvent(arguments), n = u(a.getDragObject(arguments)), e = l(n, "dragId"), i =(l(n, "elId"), l(n, "originalScope")), c = g[e], d = c.suspendedEndpoint &&(c.suspendedEndpoint.id == o.id || o.referenceEndpoint && c.suspendedEndpoint.id == o.referenceEndpoint.id);
                    if (d) return void (c._forceReattach = ! 0);
                    if (null != c) {
                        var p = null == c.floatingAnchorIndex ? 1: c.floatingAnchorIndex;
                        i && jsPlumb.CurrentLibrary.setDragScope(n, i);
                        var h = null != r ? r.isEnabled(): ! 0;
                        if (o.isFull() && o.fire("maxConnections", {
                            endpoint: o, connection: c, maxConnections: T
                        },
                        t), ! o.isFull() &&(0 != p || o.isSource) &&(1 != p || o.isTarget) && h) {
                            var v = ! 0;
                            c.suspendedEndpoint && c.suspendedEndpoint.id != o.id &&(0 == p ?(c.source = c.suspendedEndpoint.element, c.sourceId = c.suspendedEndpoint.elementId):(c.target = c.suspendedEndpoint.element, c.targetId = c.suspendedEndpoint.elementId), c.isDetachAllowed(c) && c.endpoints[p].isDetachAllowed(c) && c.suspendedEndpoint.isDetachAllowed(c) && s.checkCondition("beforeDetach", c) ||(v = ! 1)), 0 == p ?(c.source = o.element, c.sourceId = o.elementId):(c.target = o.element, c.targetId = o.elementId);
                            var y = function () {
                                c.floatingAnchorIndex = null
                            },
                            b = function () {
                                c.endpoints[p].detachFromConnection(c), c.suspendedEndpoint && c.suspendedEndpoint.detachFromConnection(c), c.endpoints[p] = o, o.addConnection(c);
                                var n = o.getParameters();
                                for (var e in n) c.setParameter(e, n[e]);
                                if (c.suspendedEndpoint) {
                                    var r = c.suspendedEndpoint.getElement(), i = c.suspendedEndpoint.elementId;
                                    m({
                                        source: 0 == p ? r: c.source, target: 1 == p ? r: c.target, sourceId: 0 == p ? i: c.sourceId, targetId: 1 == p ? i: c.targetId, sourceEndpoint: 0 == p ? c.suspendedEndpoint: c.endpoints[0], targetEndpoint: 1 == p ? c.suspendedEndpoint: c.endpoints[1], connection: c
                                    }, ! 0, t)
                                } else n.draggable && jsPlumb.CurrentLibrary.initDraggable(o.element, R, ! 0, s);
                                c.endpoints[0].addedViaMouse &&(c.endpointsToDeleteOnDetach[0] = c.endpoints[0]), c.endpoints[1].addedViaMouse &&(c.endpointsToDeleteOnDetach[1] = c.endpoints[1]), f(c, null, t), y()
                            },
                            P = function () {
                                c.suspendedEndpoint &&(c.endpoints[p] = c.suspendedEndpoint, c.setHover(! 1), c._forceDetach = ! 0, 0 == p ?(c.source = c.suspendedEndpoint.element, c.sourceId = c.suspendedEndpoint.elementId):(c.target = c.suspendedEndpoint.element, c.targetId = c.suspendedEndpoint.elementId), c.suspendedEndpoint.addConnection(c), c.endpoints[0].repaint(), c.repaint(), s.repaint(c.sourceId), c._forceDetach = ! 1), y()
                            };
                            v = v && o.isDropAllowed(c.sourceId, c.targetId, c.scope, c, o), v ? b(): P()
                        }
                        s.currentlyDragging = ! 1, delete g[e], s.anchorManager.removeFloatingConnection(e)
                    }
                };
                c[d] = s.wrap(c[d], v), c[p] = s.wrap(c[p], function () {
                    var t = a.getDragObject(arguments), n = l(u(t), "dragId"), e = g[n]; if (null != e) {
                        var r = null == e.floatingAnchorIndex ? 1: e.floatingAnchorIndex, i = o.isTarget && 0 != e.floatingAnchorIndex || e.suspendedEndpoint && o.referenceEndpoint && o.referenceEndpoint.id == e.suspendedEndpoint.id; if (i) {
                            var c = s.checkCondition("checkDropAllowed", {
                                sourceEndpoint: e.endpoints[r], targetEndpoint: o, connection: e
                            });
                            o[(c ? "add": "remove") + "Class"](s.endpointDropAllowedClass), o[(c ? "remove": "add") + "Class"](s.endpointDropForbiddenClass), e.endpoints[r].anchor.over(o.anchor)
                        }
                    }
                }), c[h] = s.wrap(c[h], function () {
                    var t = a.getDragObject(arguments), n = l(u(t), "dragId"), e = g[n]; if (null != e) {
                        var r = null == e.floatingAnchorIndex ? 1: e.floatingAnchorIndex, i = o.isTarget && 0 != e.floatingAnchorIndex || e.suspendedEndpoint && o.referenceEndpoint && o.referenceEndpoint.id == e.suspendedEndpoint.id; i &&(o.removeClass(s.endpointDropAllowedClass), o.removeClass(s.endpointDropForbiddenClass), e.endpoints[r].anchor.out())
                    }
                }), a.initDroppable(t, c, ! 0, e)
            }
        };
        return Z(u(o.canvas), ! 0, !(i._transient || o.anchor.isFloating), o), i.type && o.addType(i.type, i.data, s.isSuspendDrawing()), o
    }
}
(), function () {
    jsPlumb.Connection = function (t) {
        var n, e, r = this, i = ! 0, o = t._jsPlumb, s = jsPlumb.CurrentLibrary, a = s.getAttribute, l = s.getElementObject, u = jsPlumbUtil, c =(s.getOffset, t.newConnection, t.newEndpoint), d = null;
        r.idPrefix = "_jsplumb_c_", r.defaultLabelLocation = .5, r.defaultOverlayKeys =[ "Overlays", "ConnectionOverlays"], this.parent = t.parent, overlayCapableJsPlumbUIComponent.apply(this, arguments), this.isVisible = function () {
            return i
        },
        this.setVisible = function (t) {
            i = t, r[t ? "showOverlays": "hideOverlays"](), d && d.canvas &&(d.canvas.style.display = t ? "block": "none"), r.repaint()
        };
        var p = t.editable === ! 0;
        this.setEditable = function (t) {
            return d && d.isEditable() &&(p = t), p
        },
        this.isEditable = function () {
            return p
        },
        this.editStarted = function () {
            r.fire("editStarted", {
                path: d.getPath()
            }), o.setHoverSuspended(! 0)
        },
        this.editCompleted = function () {
            r.fire("editCompleted", {
                path: d.getPath()
            }), r.setHover(! 1), o.setHoverSuspended(! 1)
        },
        this.editCanceled = function () {
            r.fire("editCanceled", {
                path: d.getPath()
            }), r.setHover(! 1), o.setHoverSuspended(! 1)
        };
        var h = this.addClass, f = this.removeClass;
        this.addClass = function (t, n) {
            h(t), n &&(r.endpoints[0].addClass(t), r.endpoints[1].addClass(t))
        },
        this.removeClass = function (t, n) {
            f(t), n &&(r.endpoints[0].removeClass(t), r.endpoints[1].removeClass(t))
        },
        this.getTypeDescriptor = function () {
            return "connection"
        },
        this.getDefaultType = function () {
            return {
                parameters: {
                },
                scope: null, detachable: r._jsPlumb.Defaults.ConnectionsDetachable, rettach: r._jsPlumb.Defaults.ReattachConnections, paintStyle: r._jsPlumb.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle, connector: r._jsPlumb.Defaults.Connector || jsPlumb.Defaults.Connector, hoverPaintStyle: r._jsPlumb.Defaults.HoverPaintStyle || jsPlumb.Defaults.HoverPaintStyle, overlays: r._jsPlumb.Defaults.ConnectorOverlays || jsPlumb.Defaults.ConnectorOverlays
            }
        };
        var m = this.applyType;
        this.applyType = function (t, n) {
            m(t, n), null != t.detachable && r.setDetachable(t.detachable), null != t.reattach && r.setReattach(t.reattach), t.scope &&(r.scope = t.scope), p = t.editable, r.setConnector(t.connector, n)
        },
        e = r.setHover, r.setHover = function (t) {
            d.setHover.apply(d, arguments), e.apply(r, arguments)
        },
        n = function (t) {
            o.isConnectionBeingDragged() || r.setHover(t, ! 1)
        };
        var g = function (t, n, e) {
            var r = new Object;
            if (! o.Defaults.DoNotThrowErrors && null == jsPlumb.Connectors[n]) throw {
                msg: "jsPlumb: unknown connector type '" + n + "'"
            };
            return jsPlumb.Connectors[n].apply(r,[e]), jsPlumb.ConnectorRenderers[t].apply(r,[e]), r
        };
        this.setConnector = function (e, i) {
            null != d && u.removeElements(d.getDisplayElements());
            var s = {
                _jsPlumb: r._jsPlumb, parent: t.parent, cssClass: t.cssClass, container: t.container, tooltip: r.tooltip, "pointer-events": t[ "pointer-events"]
            },
            a = o.getRenderMode();
            u.isString(e) ? d = g(a, e, s): u.isArray(e) &&(d = 1 == e.length ? g(a, e[0], s): g(a, e[0], u.merge(e[1], s))), r.bindListeners(d, r, n), r.canvas = d.canvas, p && null != jsPlumb.ConnectorEditors && jsPlumb.ConnectorEditors[d.type] && d.isEditable() ? new jsPlumb.ConnectorEditors[d.type]({
                connector: d, connection: r, params: t.editorParams || {
                }
            }): p = ! 1, i || r.repaint()
        },
        this.getConnector = function () {
            return d
        },
        this.source = l(t.source), this.target = l(t.target), t.sourceEndpoint &&(this.source = t.sourceEndpoint.endpointWillMoveTo || t.sourceEndpoint.getElement()), t.targetEndpoint &&(this.target = t.targetEndpoint.getElement()), r.previousConnection = t.previousConnection, this.sourceId = a(this.source, "id"), this.targetId = a(this.target, "id"), this.scope = t.scope, this.endpoints =[], this.endpointStyles =[];
        var v = function (t, n) {
            return t ? o.makeAnchor(t, n, o): null
        },
        y = function (t, n, e, i, s, a, l) {
            var u;
            if (t) r.endpoints[n] = t, t.addConnection(r); else {
                e.endpoints ||(e.endpoints =[ null, null]);
                var d = e.endpoints[n] || e.endpoint || o.Defaults.Endpoints[n] || jsPlumb.Defaults.Endpoints[n] || o.Defaults.Endpoint || jsPlumb.Defaults.Endpoint;
                e.endpointStyles ||(e.endpointStyles =[ null, null]), e.endpointHoverStyles ||(e.endpointHoverStyles =[ null, null]);
                var p = e.endpointStyles[n] || e.endpointStyle || o.Defaults.EndpointStyles[n] || jsPlumb.Defaults.EndpointStyles[n] || o.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
                null == p.fillStyle && null != a &&(p.fillStyle = a.strokeStyle), null == p.outlineColor && null != a &&(p.outlineColor = a.outlineColor), null == p.outlineWidth && null != a &&(p.outlineWidth = a.outlineWidth);
                var h = e.endpointHoverStyles[n] || e.endpointHoverStyle || o.Defaults.EndpointHoverStyles[n] || jsPlumb.Defaults.EndpointHoverStyles[n] || o.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle;
                null != l &&(null == h &&(h = {
                }), null == h.fillStyle &&(h.fillStyle = l.strokeStyle));
                var f = e.anchors ? e.anchors[n]: e.anchor ? e.anchor: v(o.Defaults.Anchors[n], s) || v(jsPlumb.Defaults.Anchors[n], s) || v(o.Defaults.Anchor, s) || v(jsPlumb.Defaults.Anchor, s), m = e.uuids ? e.uuids[n]: null;
                u = c({
                    paintStyle: p, hoverPaintStyle: h, endpoint: d, connections:[r], uuid: m, anchor: f, source: i, scope: e.scope, container: e.container, reattach: e.reattach || o.Defaults.ReattachConnections, detachable: e.detachable || o.Defaults.ConnectionsDetachable
                }), r.endpoints[n] = u, e.drawEndpoints === ! 1 && u.setVisible(! 1, ! 0, ! 0)
            }
            return u
        },
        b = y(t.sourceEndpoint, 0, t, r.source, r.sourceId, t.paintStyle, t.hoverPaintStyle);
        b && u.addToList(t.endpointsByElement, this.sourceId, b);
        var P = y(t.targetEndpoint, 1, t, r.target, r.targetId, t.paintStyle, t.hoverPaintStyle);
        P && u.addToList(t.endpointsByElement, this.targetId, P), this.scope ||(this.scope = this.endpoints[0].scope), r.endpointsToDeleteOnDetach =[ null, null], t.deleteEndpointsOnDetach &&(t.sourceIsNew &&(r.endpointsToDeleteOnDetach[0] = r.endpoints[0]), t.targetIsNew &&(r.endpointsToDeleteOnDetach[1] = r.endpoints[1])), t.endpointsToDeleteOnDetach &&(r.endpointsToDeleteOnDetach = t.endpointsToDeleteOnDetach), r.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || t.connector || o.Defaults.Connector || jsPlumb.Defaults.Connector, ! 0), t.path && d.setPath(t.path), this.setPaintStyle(this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || t.paintStyle || o.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle, ! 0), this.setHoverPaintStyle(this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || t.hoverPaintStyle || o.Defaults.HoverPaintStyle || jsPlumb.Defaults.HoverPaintStyle, ! 0), this.paintStyleInUse = this.getPaintStyle();
        var x = o.getSuspendedAt();
        if (o.updateOffset({
            elId: this.sourceId, timestamp: x
        }), o.updateOffset({
            elId: this.targetId, timestamp: x
        }), ! o.isSuspendDrawing()) {
            var C = o.getCachedData(this.sourceId), E = C.o, j = C.s, S = o.getCachedData(this.targetId), D = S.o, I = S.s, A = x || o.timestamp(), w = this.endpoints[0].anchor.compute({
                xy:[E.left, E.top], wh: j, element: this.endpoints[0], elementId: this.endpoints[0].elementId, txy:[D.left, D.top], twh: I, tElement: this.endpoints[1], timestamp: A
            });
            this.endpoints[0].paint({
                anchorLoc: w, timestamp: A
            }), w = this.endpoints[1].anchor.compute({
                xy:[D.left, D.top], wh: I, element: this.endpoints[1], elementId: this.endpoints[1].elementId, txy:[E.left, E.top], twh: j, tElement: this.endpoints[0], timestamp: A
            }), this.endpoints[1].paint({
                anchorLoc: w, timestamp: A
            })
        }
        var O = o.Defaults.ConnectionsDetachable;
        t.detachable === ! 1 &&(O = ! 1), r.endpoints[0].connectionsDetachable === ! 1 &&(O = ! 1), r.endpoints[1].connectionsDetachable === ! 1 &&(O = ! 1), this.isDetachable = function () {
            return O === ! 0
        },
        this.setDetachable = function (t) {
            O = t === ! 0
        };
        var L = t.reattach || r.endpoints[0].reattachConnections || r.endpoints[1].reattachConnections || o.Defaults.ReattachConnections;
        this.isReattach = function () {
            return L === ! 0
        },
        this.setReattach = function (t) {
            L = t === ! 0
        };
        var M = t.cost || r.endpoints[0].getConnectionCost();
        r.getCost = function () {
            return M
        },
        r.setCost = function (t) {
            M = t
        };
        var _ = t.directed;
        null == t.directed &&(_ = r.endpoints[0].areConnectionsDirected()), r.isDirected = function () {
            return _ === ! 0
        };
        var T = jsPlumb.extend({
        },
        this.endpoints[0].getParameters());
        jsPlumb.extend(T, this.endpoints[1].getParameters()), jsPlumb.extend(T, r.getParameters()), r.setParameters(T), this.getAttachedElements = function () {
            return r.endpoints
        },
        this.moveParent = function (t) {
            var n = jsPlumb.CurrentLibrary;
            n.getParent(d.canvas);
            d.bgCanvas &&(n.removeElement(d.bgCanvas), n.appendElement(d.bgCanvas, t)), n.removeElement(d.canvas), n.appendElement(d.canvas, t);
            for (var e = 0; e < r.overlays.length; e++) r.overlays[e].isAppendedAtTopLevel &&(n.removeElement(r.overlays[e].canvas), n.appendElement(r.overlays[e].canvas, t), r.overlays[e].reattachListeners && r.overlays[e].reattachListeners(d));
            d.reattachListeners && d.reattachListeners()
        };
        var k = null;
        this.paint = function (t) {
            if (i) {
                t = t || {
                };
                var n = t.elId, e = t.ui, s = t.recalc, a = t.timestamp, l = ! 1, u = l ? this.sourceId: this.targetId, c =(l ? this.targetId: this.sourceId, l ? 0: 1), p = l ? 1: 0;
                if (null == a || a != k) {
                    var h = o.updateOffset({
                        elId: n, offset: e, recalc: s, timestamp: a
                    }).o, f = o.updateOffset({
                        elId: u, timestamp: a
                    }).o, m = this.endpoints[p], g = this.endpoints[c];
                    t.clearEdits &&(m.anchor.clearUserDefinedLocation(), g.anchor.clearUserDefinedLocation(), d.setEdited(! 1));
                    var v = m.anchor.getCurrentLocation(m), y = g.anchor.getCurrentLocation(g);
                    d.resetBounds(), d.compute({
                        sourcePos: v, targetPos: y, sourceEndpoint: this.endpoints[p], targetEndpoint: this.endpoints[c], lineWidth: r.paintStyleInUse.lineWidth, sourceInfo: h, targetInfo: f, clearEdits: t.clearEdits === ! 0
                    });
                    for (var b = {
                        minX: 1 / 0, minY: 1 / 0, maxX: -(1 / 0), maxY: -(1 / 0)
                    },
                    P = 0; P < r.overlays.length; P++) {
                        var x = r.overlays[P];
                        x.isVisible() &&(r.overlayPlacements[P] = x.draw(d, r.paintStyleInUse), b.minX = Math.min(b.minX, r.overlayPlacements[P].minX), b.maxX = Math.max(b.maxX, r.overlayPlacements[P].maxX), b.minY = Math.min(b.minY, r.overlayPlacements[P].minY), b.maxY = Math.max(b.maxY, r.overlayPlacements[P].maxY))
                    }
                    var C = parseFloat(r.paintStyleInUse.lineWidth || 1) / 2, E = parseFloat(r.paintStyleInUse.lineWidth || 0), j = {
                        xmin: Math.min(d.bounds.minX -(C + E), b.minX), ymin: Math.min(d.bounds.minY -(C + E), b.minY), xmax: Math.max(d.bounds.maxX +(C + E), b.maxX), ymax: Math.max(d.bounds.maxY +(C + E), b.maxY)
                    };
                    d.paint(r.paintStyleInUse, null, j);
                    for (var P = 0; P < r.overlays.length; P++) {
                        var x = r.overlays[P];
                        x.isVisible() && x.paint(r.overlayPlacements[P], j)
                    }
                }
                k = a
            }
        },
        this.repaint = function (t) {
            t = t || {
            };
            var n = !(t.recalc === ! 1);
            this.paint({
                elId: this.sourceId, recalc: n, timestamp: t.timestamp, clearEdits: t.clearEdits
            })
        };
        var U = t.type || r.endpoints[0].connectionType || r.endpoints[1].connectionType;
        U && r.addType(U, t.data, o.isSuspendDrawing())
    }
}
(), function () {
    jsPlumb.DOMElementComponent = function (t) {
        jsPlumb.jsPlumbUIComponent.apply(this, arguments), this.mousemove = this.dblclick = this.click = this.mousedown = this.mouseup = function (t) {
        }
    },
    jsPlumb.Segments = {
        AbstractSegment: function (t) {
            this.params = t, this.findClosestPointOnPath = function (t, n) {
                return {
                    d: 1 / 0, x: null, y: null, l: null
                }
            },
            this.getBounds = function () {
                return {
                    minX: Math.min(t.x1, t.x2), minY: Math.min(t.y1, t.y2), maxX: Math.max(t.x1, t.x2), maxY: Math.max(t.y1, t.y2)
                }
            }
        },
        Straight: function (t) {
            var n, e, r, i, o, s, a, l = this, u =(jsPlumb.Segments.AbstractSegment.apply(this, arguments), function () {
                n = Math.sqrt(Math.pow(o - i, 2) + Math.pow(a - s, 2)), e = jsPlumbUtil.gradient({
                    x: i, y: s
                }, {
                    x: o, y: a
                }), r = -1 / e
            });
            this.type = "Straight", l.getLength = function () {
                return n
            },
            l.getGradient = function () {
                return e
            },
            this.getCoordinates = function () {
                return {
                    x1: i, y1: s, x2: o, y2: a
                }
            },
            this.setCoordinates = function (t) {
                i = t.x1, s = t.y1, o = t.x2, a = t.y2, u()
            },
            this.setCoordinates({
                x1: t.x1, y1: t.y1, x2: t.x2, y2: t.y2
            }), this.getBounds = function () {
                return {
                    minX: Math.min(i, o), minY: Math.min(s, a), maxX: Math.max(i, o), maxY: Math.max(s, a)
                }
            },
            this.pointOnPath = function (t, e) {
                if (0 != t || e) {
                    if (1 != t || e) {
                        var r = e ? t > 0 ? t: n + t: t * n;
                        return jsPlumbUtil.pointOnLine({
                            x: i, y: s
                        }, {
                            x: o, y: a
                        },
                        r)
                    }
                    return {
                        x: o, y: a
                    }
                }
                return {
                    x: i, y: s
                }
            },
            this.gradientAtPoint = function (t) {
                return e
            },
            this.pointAlongPathFrom = function (t, n, e) {
                var r = l.pointOnPath(t, e), u = 1 == t ? {
                    x: i + 10 *(o - i), y: s + 10 *(s - a)
                }: 0 >= n ? {
                    x: i, y: s
                }: {
                    x: o, y: a
                };
                return 0 >= n && Math.abs(n) > 1 &&(n *= -1), jsPlumbUtil.pointOnLine(r, u, n)
            },
            this.findClosestPointOnPath = function (t, o) {
                if (0 == e) return {
                    x: t, y: s, d: Math.abs(o - s)
                };
                if (e == 1 / 0 || e == -(1 / 0)) return {
                    x: i, y: o, d: Math.abs(t -1)
                };
                var a = s - e * i, l = o - r * t, u =(l - a) /(e - r), c = e * u + a, d = jsPlumbUtil.lineLength([t, o],[u, c]), p = jsPlumbUtil.lineLength([u, c],[i, s]);
                return {
                    d: d, x: u, y: c, l: p / n
                }
            }
        },
        Arc: function (t) {
            var n = this, e =(jsPlumb.Segments.AbstractSegment.apply(this, arguments), function (n, e) {
                return jsPlumbUtil.theta([t.cx, t.cy],[n, e])
            }), r = function (t) {
                if (n.anticlockwise) {
                    var e = n.startAngle < n.endAngle ? n.startAngle + i: n.startAngle, r = Math.abs(e - n.endAngle);
                    return e - r * t
                }
                var o = n.endAngle < n.startAngle ? n.endAngle + i: n.endAngle, r = Math.abs(o - n.startAngle);
                return n.startAngle + r * t
            },
            i = 2 * Math.PI;
            this.radius = t.r, this.anticlockwise = t.ac, this.type = "Arc", t.startAngle && t.endAngle ?(this.startAngle = t.startAngle, this.endAngle = t.endAngle, this.x1 = t.cx + n.radius * Math.cos(t.startAngle), this.y1 = t.cy + n.radius * Math.sin(t.startAngle), this.x2 = t.cx + n.radius * Math.cos(t.endAngle), this.y2 = t.cy + n.radius * Math.sin(t.endAngle)):(this.startAngle = e(t.x1, t.y1), this.endAngle = e(t.x2, t.y2), this.x1 = t.x1, this.y1 = t.y1, this.x2 = t.x2, this.y2 = t.y2), this.endAngle < 0 &&(this.endAngle += i), this.startAngle < 0 &&(this.startAngle += i), this.segment = jsPlumbUtil.segment([ this.x1, this.y1],[ this.x2, this.y2]);
            var o = n.endAngle < n.startAngle ? n.endAngle + i: n.endAngle;
            n.sweep = Math.abs(o - n.startAngle), n.anticlockwise &&(n.sweep = i - n.sweep);
            var s = 2 * Math.PI * n.radius, a = n.sweep / i, l = s * a;
            this.getLength = function () {
                return l
            },
            this.getBounds = function () {
                return {
                    minX: t.cx - t.r, maxX: t.cx + t.r, minY: t.cy - t.r, maxY: t.cy + t.r
                }
            };
            var u = 1e-10, c = function (t) {
                var n = Math.floor(t), e = Math.ceil(t);
                return u > t - n ? n: u > e - t ? e: t
            };
            this.pointOnPath = function (e, i) {
                if (0 == e) return {
                    x: n.x1, y: n.y1, theta: n.startAngle
                };
                if (1 == e) return {
                    x: n.x2, y: n.y2, theta: n.endAngle
                };
                i &&(e / = l);
                var o = r(e), s = t.cx + t.r * Math.cos(o), a = t.cy + t.r * Math.sin(o);
                return {
                    x: c(s), y: c(a), theta: o
                }
            },
            this.gradientAtPoint = function (e, r) {
                var i = n.pointOnPath(e, r), o = jsPlumbUtil.normal([t.cx, t.cy],[i.x, i.y]);
                return n.anticlockwise || o != 1 / 0 && o != -(1 / 0) ||(o *= -1), o
            },
            this.pointAlongPathFrom = function (e, r, i) {
                var o = n.pointOnPath(e, i), a = r / s * 2 * Math.PI, l = n.anticlockwise ? -1: 1, u = o.theta + l * a, c = t.cx + n.radius * Math.cos(u), d = t.cy + n.radius * Math.sin(u);
                return {
                    x: c, y: d
                }
            }
        },
        Bezier: function (t) {
            var n =(jsPlumb.Segments.AbstractSegment.apply(this, arguments),[ {
                x: t.x1, y: t.y1
            }, {
                x: t.cp1x, y: t.cp1y
            }, {
                x: t.cp2x, y: t.cp2y
            }, {
                x: t.x2, y: t.y2
            }]), e = {
                minX: Math.min(t.x1, t.x2, t.cp1x, t.cp2x), minY: Math.min(t.y1, t.y2, t.cp1y, t.cp2y), maxX: Math.max(t.x1, t.x2, t.cp1x, t.cp2x), maxY: Math.max(t.y1, t.y2, t.cp1y, t.cp2y)
            };
            this.type = "Bezier";
            var r = function (t, n, e) {
                return e &&(n = jsBezier.locationAlongCurveFrom(t, n > 0 ? 0: 1, n)), n
            };
            this.pointOnPath = function (t, e) {
                return t = r(n, t, e), jsBezier.pointOnCurve(n, t)
            },
            this.gradientAtPoint = function (t, e) {
                return t = r(n, t, e), jsBezier.gradientAtPoint(n, t)
            },
            this.pointAlongPathFrom = function (t, e, i) {
                return t = r(n, t, i), jsBezier.pointAlongCurveFrom(n, t, e)
            },
            this.getLength = function () {
                return jsBezier.getLength(n)
            },
            this.getBounds = function () {
                return e
            }
        }
    };
    var t = function () {
        var t = this;
        t.resetBounds = function () {
            t.bounds = {
                minX: 1 / 0, minY: 1 / 0, maxX: -(1 / 0), maxY: -(1 / 0)
            }
        },
        t.resetBounds()
    };
    jsPlumb.Connectors.AbstractConnector = function (n) {
        t.apply(this, arguments);
        var e = this, r =[], i = 0, o =[], s =[], a = n.stub || 0, l = jsPlumbUtil.isArray(a) ? a[0]: a, u = jsPlumbUtil.isArray(a) ? a[1]: a, c = n.gap || 0, d = jsPlumbUtil.isArray(c) ? c[0]: c, p = jsPlumbUtil.isArray(c) ? c[1]: c, h = null, f = ! 1, m = null;
        this.isEditable = function () {
            return ! 1
        },
        this.setEdited = function (t) {
            f = t
        },
        this.getPath = function () {
        },
        this.setPath = function (t) {
        },
        this.findSegmentForPoint = function (t, n) {
            for (var e = {
                d: 1 / 0, s: null, x: null, y: null, l: null
            },
            i = 0; i < r.length; i++) {
                var o = r[i].findClosestPointOnPath(t, n);
                o.d < e.d &&(e.d = o.d, e.l = o.l, e.x = o.x, e.y = o.y, e.s = r[i])
            }
            return e
        };
        var g = function () {
            for (var t = 0, n = 0; n < r.length; n++) {
                var e = r[n].getLength();
                s[n] = e / i, o[n] =[t, t += e / i]
            }
        },
        v = function (t, n) {
            n &&(t = t > 0 ? t / i:(i + t) / i);
            for (var e = o.length -1, a = 1, l = 0; l < o.length; l++) if (o[l][1] >= t) {
                e = l, a = 1 == t ? 1: 0 == t ? 0:(t - o[l][0]) / s[l];
                break
            }
            return {
                segment: r[e], proportion: a, index: e
            }
        },
        y = function (t, n) {
            var o = new jsPlumb.Segments[t](n);
            r.push(o), i += o.getLength(), e.updateBounds(o)
        },
        b = function () {
            i = 0, r.splice(0, r.length), o.splice(0, o.length), s.splice(0, s.length)
        };
        this.setSegments = function (t) {
            h =[], i = 0;
            for (var n = 0; n < t.length; n++) h.push(t[n]), i += t[n].getLength()
        };
        var P = function (t) {
            e.lineWidth = t.lineWidth;
            var n = jsPlumbUtil.segment(t.sourcePos, t.targetPos), r = t.targetPos[0] < t.sourcePos[0], i = t.targetPos[1] < t.sourcePos[1], o = t.lineWidth || 1, s = t.sourceEndpoint.anchor.orientation || t.sourceEndpoint.anchor.getOrientation(t.sourceEndpoint), a = t.targetEndpoint.anchor.orientation || t.targetEndpoint.anchor.getOrientation(t.targetEndpoint), c = r ? t.targetPos[0]: t.sourcePos[0], h = i ? t.targetPos[1]: t.sourcePos[1], f = Math.abs(t.targetPos[0] - t.sourcePos[0]), m = Math.abs(t.targetPos[1] - t.sourcePos[1]);
            if (0 == s[0] && 0 == s[1] || 0 == a[0] && 0 == a[1]) {
                var g = f > m ? 0: 1, v =[1, 0][g];
                s =[], a =[], s[g] = t.sourcePos[g] > t.targetPos[g] ? -1: 1, a[g] = t.sourcePos[g] > t.targetPos[g] ? 1: -1, s[v] = 0, a[v] = 0
            }
            var y = r ? f + d * s[0]: d * s[0], b = i ? m + d * s[1]: d * s[1], P = r ? p * a[0]: f + p * a[0], x = i ? p * a[1]: m + p * a[1], C = s[0] * a[0] + s[1] * a[1], E = {
                sx: y, sy: b, tx: P, ty: x, lw: o, xSpan: Math.abs(P - y), ySpan: Math.abs(x - b), mx:(y + P) / 2, my:(b + x) / 2, so: s, to: a, x: c, y: h, w: f, h: m, segment: n, startStubX: y + s[0] * l, startStubY: b + s[1] * l, endStubX: P + a[0] * u, endStubY: x + a[1] * u, isXGreaterThanStubTimes2: Math.abs(y - P) > l + u, isYGreaterThanStubTimes2: Math.abs(b - x) > l + u, opposite: -1 == C, perpendicular: 0 == C, orthogonal: 1 == C, sourceAxis: 0 == s[0] ? "y": "x", points:[c, h, f, m, y, b, P, x]
            };
            return E.anchorOrientation = E.opposite ? "opposite": E.orthogonal ? "orthogonal": "perpendicular", E
        };
        this.getSegments = function () {
            return r
        },
        e.updateBounds = function (t) {
            var n = t.getBounds();
            e.bounds.minX = Math.min(e.bounds.minX, n.minX), e.bounds.maxX = Math.max(e.bounds.maxX, n.maxX), e.bounds.minY = Math.min(e.bounds.minY, n.minY), e.bounds.maxY = Math.max(e.bounds.maxY, n.maxY)
        };
        return this.pointOnPath = function (t, n) {
            var e = v(t, n);
            return e.segment.pointOnPath(e.proportion, n)
        },
        this.gradientAtPoint = function (t) {
            var n = v(t, absolute);
            return n.segment.gradientAtPoint(n.proportion, absolute)
        },
        this.pointAlongPathFrom = function (t, n, e) {
            var r = v(t, e);
            return r.segment.pointAlongPathFrom(r.proportion, n, ! 1)
        },
        this.compute = function (t) {
            f ||(m = P(t)), b(), this._compute(m, t), e.x = m.points[0], e.y = m.points[1], e.w = m.points[2], e.h = m.points[3], e.segment = m.segment, g()
        }, {
            addSegment: y, prepareCompute: P, sourceStub: l, targetStub: u, maxStub: Math.max(l, u), sourceGap: d, targetGap: p, maxGap: Math.max(d, p)
        }
    },
    jsPlumb.Connectors.Straight = function () {
        this.type = "Straight";
        var t = jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
        this._compute = function (n, e) {
            t.addSegment("Straight", {
                x1: n.sx, y1: n.sy, x2: n.startStubX, y2: n.startStubY
            }), t.addSegment("Straight", {
                x1: n.startStubX, y1: n.startStubY, x2: n.endStubX, y2: n.endStubY
            }), t.addSegment("Straight", {
                x1: n.endStubX, y1: n.endStubY, x2: n.tx, y2: n.ty
            })
        }
    },
    jsPlumb.Connectors.Bezier = function (t) {
        t = t || {
        };
        var n = this, e = jsPlumb.Connectors.AbstractConnector.apply(this, arguments), r =(t.stub || 50, t.curviness || 150), i = 10;
        this.type = "Bezier", this.getCurviness = function () {
            return r
        },
        this._findControlPoint = function (t, n, e, o, s) {
            var a = o.anchor.getOrientation(o), l = s.anchor.getOrientation(s), u = a[0] != l[0] || a[1] == l[1], c =[];
            return u ?(0 == l[0] ? c.push(e[0] < n[0] ? t[0] + i: t[0] - i): c.push(t[0] + r * l[0]), 0 == l[1] ? c.push(e[1] < n[1] ? t[1] + i: t[1] - i): c.push(t[1] + r * a[1])):(0 == a[0] ? c.push(n[0] < e[0] ? t[0] + i: t[0] - i): c.push(t[0] - r * a[0]), 0 == a[1] ? c.push(n[1] < e[1] ? t[1] + i: t[1] - i): c.push(t[1] + r * l[1])), c
        },
        this._compute = function (t, r) {
            var i = r.sourcePos, o = r.targetPos, s = Math.abs(i[0] - o[0]), a = Math.abs(i[1] - o[1]), l = i[0] < o[0] ? s: 0, u = i[1] < o[1] ? a: 0, c = i[0] < o[0] ? 0: s, d = i[1] < o[1] ? 0: a, p = n._findControlPoint([l, u], i, o, r.sourceEndpoint, r.targetEndpoint), h = n._findControlPoint([c, d], o, i, r.targetEndpoint, r.sourceEndpoint);
            e.addSegment("Bezier", {
                x1: l, y1: u, x2: c, y2: d, cp1x: p[0], cp1y: p[1], cp2x: h[0], cp2y: h[1]
            })
        }
    },
    jsPlumb.Endpoints.AbstractEndpoint = function (n) {
        t.apply(this, arguments);
        var e = this;
        return this.compute = function (t, n, r, i) {
            var o = e._compute.apply(e, arguments);
            return e.x = o[0], e.y = o[1], e.w = o[2], e.h = o[3], e.bounds.minX = e.x, e.bounds.minY = e.y, e.bounds.maxX = e.x + e.w, e.bounds.maxY = e.y + e.h, o
        }, {
            compute: e.compute, cssClass: n.cssClass
        }
    },
    jsPlumb.Endpoints.Dot = function (t) {
        this.type = "Dot";
        var n = this;
        jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
        t = t || {
        },
        this.radius = t.radius || 10, this.defaultOffset = .5 * this.radius, this.defaultInnerRadius = this.radius / 3, this._compute = function (t, e, r, i) {
            n.radius = r.radius || n.radius;
            var o = t[0] - n.radius, s = t[1] - n.radius, a = 2 * n.radius, l = 2 * n.radius;
            if (r.strokeStyle) {
                var u = r.lineWidth || 1;
                o -= u, s -= u, a += 2 * u, l += 2 * u
            }
            return[o, s, a, l, n.radius]
        }
    },
    jsPlumb.Endpoints.Rectangle = function (t) {
        this.type = "Rectangle";
        var n = this;
        jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
        t = t || {
        },
        this.width = t.width || 20, this.height = t.height || 20, this._compute = function (t, e, r, i) {
            var o = r.width || n.width, s = r.height || n.height, a = t[0] - o / 2, l = t[1] - s / 2;
            return[a, l, o, s]
        }
    };
    var n = function (t) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        var n =[];
        this.getDisplayElements = function () {
            return n
        },
        this.appendDisplayElement = function (t) {
            n.push(t)
        }
    };
    jsPlumb.Endpoints.Image = function (t) {
        this.type = "Image", n.apply(this, arguments);
        var e = this, r =(jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments), ! 1), i = ! 1, o = t.width, s = t.height, a = null, l = t.endpoint;
        this.img = new Image, e.ready = ! 1, this.img.onload = function () {
            e.ready = ! 0, o = o || e.img.width, s = s || e.img.height, a && a(e)
        },
        l.setImage = function (t, n) {
            t. constructor == String ? t: t.src;
            a = n, e.img.src = t, null != e.canvas && e.canvas.setAttribute("src", t)
        },
        l.setImage(t.src || t.url, t.onload), this._compute = function (t, n, r, i) {
            return e.anchorPoint = t, e.ready ?[t[0] - o / 2, t[1] - s / 2, o, s]:[0, 0, 0, 0]
        },
        e.canvas = document.createElement("img"), r = ! 1, e.canvas.style.margin = 0, e.canvas.style.padding = 0, e.canvas.style.outline = 0, e.canvas.style.position = "absolute";
        var u = t.cssClass ? " " + t.cssClass: "";
        e.canvas.className = jsPlumb.endpointClass + u, o && e.canvas.setAttribute("width", o), s && e.canvas.setAttribute("height", s), jsPlumb.appendElement(e.canvas, t.parent), e.attachListeners(e.canvas, e), e.cleanup = function () {
            i = ! 0
        };
        var c = function (t, n, a) {
            if (! i) {
                r ||(e.canvas.setAttribute("src", e.img.src), e.appendDisplayElement(e.canvas), r = ! 0);
                var l = e.anchorPoint[0] - o / 2, u = e.anchorPoint[1] - s / 2;
                jsPlumb.sizeCanvas(e.canvas, l, u, o, s)
            }
        };
        this.paint = function (t, n) {
            e.ready ? c(t, n): window.setTimeout(function () {
                e.paint(t, n)
            },
            200)
        }
    },
    jsPlumb.Endpoints.Blank = function (t) {
        var e = this;
        jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
        this.type = "Blank", n.apply(this, arguments), this._compute = function (t, n, e, r) {
            return[t[0], t[1], 10, 0]
        },
        e.canvas = document.createElement("div"), e.canvas.style.display = "block", e.canvas.style.width = "1px", e.canvas.style.height = "1px", e.canvas.style.background = "transparent", e.canvas.style.position = "absolute", e.canvas.className = e._jsPlumb.endpointClass, jsPlumb.appendElement(e.canvas, t.parent), this.paint = function (t, n) {
            jsPlumb.sizeCanvas(e.canvas, e.x, e.y, e.w, e.h)
        }
    },
    jsPlumb.Endpoints.Triangle = function (t) {
        this.type = "Triangle";
        var n = this;
        jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
        t = t || {
        },
        t.width = t.width || 55, t.height = t.height || 55, this.width = t.width, this.height = t.height, this._compute = function (t, e, r, i) {
            var o = r.width || n.width, s = r.height || n.height, a = t[0] - o / 2, l = t[1] - s / 2;
            return[a, l, o, s]
        }
    };
    var e = jsPlumb.Overlays.AbstractOverlay = function (t) {
        var n = ! 0, e = this;
        this.isAppendedAtTopLevel = ! 0, this.component = t.component, this.loc = null == t.location ? .5: t.location, this.endpointLoc = null == t.endpointLocation ?[.5, .5]: t.endpointLocation, this.setVisible = function (t) {
            n = t, e.component.repaint()
        },
        this.isVisible = function () {
            return n
        },
        this.hide = function () {
            e.setVisible(! 1)
        },
        this.show = function () {
            e.setVisible(! 0)
        },
        this.incrementLocation = function (t) {
            e.loc += t, e.component.repaint()
        },
        this.setLocation = function (t) {
            e.loc = t, e.component.repaint()
        },
        this.getLocation = function () {
            return e.loc
        }
    };
    jsPlumb.Overlays.Arrow = function (t) {
        this.type = "Arrow", e.apply(this, arguments), this.isAppendedAtTopLevel = ! 1, t = t || {
        };
        var n = this, r = jsPlumbUtil;
        this.length = t.length || 20, this.width = t.width || 20, this.id = t.id;
        var i =(t.direction || 1) < 0 ? -1: 1, o = t.paintStyle || {
            lineWidth: 1
        },
        s = t.foldback || .623;
        this.computeMaxSize = function () {
            return 1.5 * n.width
        },
        this.cleanup = function () {
        },
        this.draw = function (t, e) {
            var a, l, u, c, d;
            if (t.pointAlongPathFrom) {
                if (r.isString(n.loc) || n.loc > 1 || n.loc < 0) {
                    var p = parseInt(n.loc);
                    a = t.pointAlongPathFrom(p, i * n.length / 2, ! 0), l = t.pointOnPath(p, ! 0), u = r.pointOnLine(a, l, n.length)
                } else if (1 == n.loc) {
                    if (a = t.pointOnPath(n.loc), l = t.pointAlongPathFrom(n.loc, - n.length), u = r.pointOnLine(a, l, n.length), -1 == i) {
                        var h = u;
                        u = a, a = h
                    }
                } else if (0 == n.loc) {
                    if (u = t.pointOnPath(n.loc), l = t.pointAlongPathFrom(n.loc, n.length), a = r.pointOnLine(u, l, n.length), -1 == i) {
                        var h = u;
                        u = a, a = h
                    }
                } else a = t.pointAlongPathFrom(n.loc, i * n.length / 2), l = t.pointOnPath(n.loc), u = r.pointOnLine(a, l, n.length);
                c = r.perpendicularLineTo(a, u, n.width), d = r.pointOnLine(a, u, s * n.length);
                var f = {
                    hxy: a, tail: c, cxy: d
                },
                m = o.strokeStyle || e.strokeStyle, g = o.fillStyle || e.strokeStyle, v = o.lineWidth || e.lineWidth, y = {
                    component: t, d: f, lineWidth: v, strokeStyle: m, fillStyle: g, minX: Math.min(a.x, c[0].x, c[1].x), maxX: Math.max(a.x, c[0].x, c[1].x), minY: Math.min(a.y, c[0].y, c[1].y), maxY: Math.max(a.y, c[0].y, c[1].y)
                };
                return y
            }
            return {
                component: t, minX: 0, maxX: 0, minY: 0, maxY: 0
            }
        }
    },
    jsPlumb.Overlays.PlainArrow = function (t) {
        t = t || {
        };
        var n = jsPlumb.extend(t, {
            foldback: 1
        });
        jsPlumb.Overlays.Arrow.call(this, n), this.type = "PlainArrow"
    },
    jsPlumb.Overlays.Diamond = function (t) {
        t = t || {
        };
        var n = t.length || 40, e = jsPlumb.extend(t, {
            length: n / 2, foldback: 2
        });
        jsPlumb.Overlays.Arrow.call(this, e), this.type = "Diamond"
    };
    var r = function (t) {
        jsPlumb.DOMElementComponent.apply(this, arguments), e.apply(this, arguments);
        var n = this, r = ! 1, i = jsPlumb.CurrentLibrary;
        t = t || {
        },
        this.id = t.id;
        var o, s = function () {
            o = t.create(t.component), o = i.getDOMElement(o), o.style.position = "absolute";
            var e = t._jsPlumb.overlayClass + " " +(n.cssClass ? n.cssClass: t.cssClass ? t.cssClass: "");
            o.className = e, t._jsPlumb.appendElement(o, t.component.parent), t._jsPlumb.getId(o), n.attachListeners(o, n), n.canvas = o
        };
        this.getElement = function () {
            return null == o && s(), o
        },
        this.getDimensions = function () {
            return i.getSize(i.getElementObject(n.getElement()))
        };
        var a = null, l = function (t) {
            return null == a &&(a = n.getDimensions()), a
        };
        this.clearCachedDimensions = function () {
            a = null
        },
        this.computeMaxSize = function () {
            var t = l();
            return Math.max(t[0], t[1])
        };
        var u = n.setVisible;
        n.setVisible = function (t) {
            u(t), o.style.display = t ? "block": "none"
        },
        this.cleanup = function () {
            null != o && i.removeElement(o)
        },
        this.paint = function (t, e) {
            r ||(n.getElement(), t.component.appendDisplayElement(o), n.attachListeners(o, t.component), r = ! 0), o.style.left = t.component.x + t.d.minx + "px", o.style.top = t.component.y + t.d.miny + "px"
        },
        this.draw = function (t, e) {
            var r = l();
            if (null != r && 2 == r.length) {
                var i = {
                    x: 0, y: 0
                };
                if (t.pointOnPath) {
                    var o = n.loc, s = ! 1;
                    (jsPlumbUtil.isString(n.loc) || n.loc < 0 || n.loc > 1) &&(o = parseInt(n.loc), s = ! 0), i = t.pointOnPath(o, s)
                } else {
                    var a = n.loc. constructor == Array ? n.loc: n.endpointLoc;
                    i = {
                        x: a[0] * t.w, y: a[1] * t.h
                    }
                }
                var u = i.x - r[0] /2,c=i.y-r[1]/ 2;
                return {
                    component: t, d: {
                        minx: u, miny: c, td: r, cxy: i
                    },
                    minX: u, maxX: u + r[0], minY: c, maxY: c + r[1]
                }
            }
            return {
                minX: 0, maxX: 0, minY: 0, maxY: 0
            }
        },
        this.reattachListeners = function (t) {
            o && n.reattachListenersForElement(o, n, t)
        }
    };
    jsPlumb.Overlays.Custom = function (t) {
        this.type = "Custom", r.apply(this, arguments)
    },
    jsPlumb.Overlays.GuideLines = function () {
        var t = this;
        t.length = 50, t.lineWidth = 5, this.type = "GuideLines", e.apply(this, arguments), jsPlumb.jsPlumbUIComponent.apply(this, arguments), this.draw = function (n, e) {
            var r = n.pointAlongPathFrom(t.loc, t.length / 2), i = n.pointOnPath(t.loc), o = jsPlumbUtil.pointOnLine(r, i, t.length), s = jsPlumbUtil.perpendicularLineTo(r, o, 40), a = jsPlumbUtil.perpendicularLineTo(o, r, 20);
            return {
                connector: n, head: r, tail: o, headLine: a, tailLine: s, minX: Math.min(r.x, o.x, a[0].x, a[1].x), minY: Math.min(r.y, o.y, a[0].y, a[1].y), maxX: Math.max(r.x, o.x, a[0].x, a[1].x), maxY: Math.max(r.y, o.y, a[0].y, a[1].y)
            }
        },
        this.cleanup = function () {
        }
    },
    jsPlumb.Overlays.Label = function (t) {
        var n = this;
        this.labelStyle = t.labelStyle || jsPlumb.Defaults.LabelStyle, this.cssClass = null != this.labelStyle ? this.labelStyle.cssClass: null, t.create = function () {
            return document.createElement("div")
        },
        jsPlumb.Overlays.Custom.apply(this, arguments), this.type = "Label";
        var e = t.label || "", n = this, r = null;
        this.setLabel = function (t) {
            e = t, r = null, n.clearCachedDimensions(), i(), n.component.repaint()
        };
        var i = function () {
            if ("function" == typeof e) {
                var t = e(n);
                n.getElement().innerHTML = t.replace(/\r\n/g, "<br/>")
            } else null == r &&(r = e, n.getElement().innerHTML = r.replace(/\r\n/g, "<br/>"))
        };
        this.getLabel = function () {
            return e
        };
        var o = this.getDimensions;
        this.getDimensions = function () {
            return i(), o()
        }
    }
}
(), function () {
    var t = function (t, n, e, r) {
        return e >= t && n >= r ? 1: e >= t && r >= n ? 2: t >= e && r >= n ? 3: 4
    },
    n = function (t, n, e, r, i, o, s, a, l) {
        return l >= a ?[t, n]: 1 === e ? r[3] <= 0 && i[3] >= 1 ?[t +(r[2] < .5 ? -1 * o: o), n]: r[2] >= 1 && i[2] <= 0 ?[t, n +(r[3] < .5 ? -1 * s: s)]:[t + -1 * o, n + -1 * s]: 2 === e ? r[3] >= 1 && i[3] <= 0 ?[t +(r[2] < .5 ? -1 * o: o), n]: r[2] >= 1 && i[2] <= 0 ?[t, n +(r[3] < .5 ? -1 * s: s)]:[t + 1 * o, n + -1 * s]: 3 === e ? r[3] >= 1 && i[3] <= 0 ?[t +(r[2] < .5 ? -1 * o: o), n]: r[2] <= 0 && i[2] >= 1 ?[t, n +(r[3] < .5 ? -1 * s: s)]:[t + -1 * o, n + -1 * s]: 4 === e ? r[3] <= 0 && i[3] >= 1 ?[t +(r[2] < .5 ? -1 * o: o), n]: r[2] <= 0 && i[2] >= 1 ?[t, n +(r[3] < .5 ? -1 * s: s)]:[t + 1 * o, n + -1 * s]: void 0
    };
    jsPlumb.Connectors.StateMachine = function (e) {
        e = e || {
        },
        this.type = "StateMachine";
        var r = jsPlumb.Connectors.AbstractConnector.apply(this, arguments), i = e.curviness || 10, o = e.margin || 5, s = e.proximityLimit || 80, a = e.orientation && "clockwise" === e.orientation, l = e.loopbackRadius || 25, u = e.showLoopback !== ! 1;
        this._compute = function (e, c) {
            var d = Math.abs(c.sourcePos[0] - c.targetPos[0]), p = Math.abs(c.sourcePos[1] - c.targetPos[1]), h = Math.min(c.sourcePos[0], c.targetPos[0]), f = Math.min(c.sourcePos[1], c.targetPos[1]);
            if (u && c.sourceEndpoint.elementId === c.targetEndpoint.elementId) {
                var m = c.sourcePos[0], g =(c.sourcePos[0], c.sourcePos[1] - o), v =(c.sourcePos[1] - o, m), y = g - l;
                d = 2 * l, p = 2 * l, h = v - l, f = y - l, e.points[0] = h, e.points[1] = f, e.points[2] = d, e.points[3] = p, r.addSegment("Arc", {
                    x1: m - h + 4, y1: g - f, startAngle: 0, endAngle: 2 * Math.PI, r: l, ac: ! a, x2: m - h -4, y2: g - f, cx: v - h, cy: y - f
                })
            } else {
                var b = c.sourcePos[0] < c.targetPos[0] ? 0: d, P = c.sourcePos[1] < c.targetPos[1] ? 0: p, x = c.sourcePos[0] < c.targetPos[0] ? d: 0, C = c.sourcePos[1] < c.targetPos[1] ? p: 0;
                0 === c.sourcePos[2] &&(b -= o), 1 === c.sourcePos[2] &&(b += o), 0 === c.sourcePos[3] &&(P -= o), 1 === c.sourcePos[3] &&(P += o), 0 === c.targetPos[2] &&(x -= o), 1 === c.targetPos[2] &&(x += o), 0 === c.targetPos[3] &&(C -= o), 1 === c.targetPos[3] &&(C += o);
                var E =(b + x) / 2, j =(P + C) / 2, S = -1 * E / j, D = Math.atan(S), I =(S == 1 / 0 || S == -(1 / 0) ? 0: Math.abs(i / 2 * Math.sin(D)), S == 1 / 0 || S == -(1 / 0) ? 0: Math.abs(i / 2 * Math.cos(D)), t(b, P, x, C)), A = Math.sqrt(Math.pow(x - b, 2) + Math.pow(C - P, 2)), w = n(E, j, I, c.sourcePos, c.targetPos, i, i, A, s);
                r.addSegment("Bezier", {
                    x1: x, y1: C, x2: b, y2: P, cp1x: w[0], cp1y: w[1], cp2x: w[0], cp2y: w[1]
                })
            }
        }
    }
}
(), function () {
    jsPlumb.Connectors.Flowchart = function (params) {
        this.type = "Flowchart", params = params || {
        },
        params.stub = params.stub || 30;
        var lastOrientation, _super = jsPlumb.Connectors.AbstractConnector.apply(this, arguments), midpoint = params.midpoint || .5, segments =[], alwaysRespectStubs =(params.grid, params.alwaysRespectStubs), userSuppliedSegments = null, lastx = null, lasty = null, cornerRadius = null != params.cornerRadius ? params.cornerRadius: 0, sgn = function (t) {
            return 0 > t ? -1: 0 == t ? 0: 1
        },
        addSegment = function (t, n, e, r) {
            if (lastx != n || lasty != e) {
                var i = null == lastx ? r.sx: lastx, o = null == lasty ? r.sy: lasty, s = i == n ? "v": "h", a = sgn(n - i), l = sgn(e - o);
                lastx = n, lasty = e, t.push([i, o, n, e, s, a, l])
            }
        },
        segLength = function (t) {
            return Math.sqrt(Math.pow(t[0] - t[2], 2) + Math.pow(t[1] - t[3], 2))
        },
        _cloneArray = function (t) {
            var n =[];
            return n.push.apply(n, t), n
        },
        writeSegments = function (t, n) {
            for (var e, r, i = 0; i < t.length -1; i++) {
                if (e = e || _cloneArray(t[i]), r = _cloneArray(t[i + 1]), cornerRadius > 0 && e[4] != r[4]) {
                    var o = Math.min(cornerRadius, segLength(e), segLength(r));
                    e[2] -= e[5] * o, e[3] -= e[6] * o, r[0] += r[5] * o, r[1] += r[6] * o;
                    var s = e[6] == r[5] && 1 == r[5] || e[6] == r[5] && 0 == r[5] && e[5] != r[6] || e[6] == r[5] && -1 == r[5], a = r[1] > e[3] ? 1: -1, l = r[0] > e[2] ? 1: -1, u = a == l, c = u && s || ! u && ! s ? r[0]: e[2], d = u && s || ! u && ! s ? e[3]: r[1];
                    _super.addSegment("Straight", {
                        x1: e[0], y1: e[1], x2: e[2], y2: e[3]
                    }), _super.addSegment("Arc", {
                        r: o, x1: e[2], y1: e[3], x2: r[0], y2: r[1], cx: c, cy: d, ac: s
                    })
                } else {
                    var p = e[2] == e[0] ? 0: e[2] > e[0] ? n.lw / 2: -(n.lw / 2), h = e[3] == e[1] ? 0: e[3] > e[1] ? n.lw / 2: -(n.lw / 2);
                    _super.addSegment("Straight", {
                        x1: e[0] - p, y1: e[1] - h, x2: e[2] + p, y2: e[3] + h
                    })
                }
                e = r
            }
            _super.addSegment("Straight", {
                x1: r[0], y1: r[1], x2: r[2], y2: r[3]
            })
        };
        this.setSegments = function (t) {
            userSuppliedSegments = t
        },
        this.isEditable = function () {
            return ! 0
        },
        this.getOriginalSegments = function () {
            return userSuppliedSegments || segments
        },
        this._compute = function (paintInfo, params) {
            if (params.clearEdits &&(userSuppliedSegments = null), null != userSuppliedSegments) return void writeSegments(userSuppliedSegments, paintInfo);
            segments =[], lastx = null, lasty = null, lastOrientation = null;
            var midx = paintInfo.startStubX +(paintInfo.endStubX - paintInfo.startStubX) * midpoint, midy = paintInfo.startStubY +(paintInfo.endStubY - paintInfo.startStubY) * midpoint, orientations = {
                x:[0, 1], y:[1, 0]
            },
            commonStubCalculator = function (t) {
                return[paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY]
            },
            stubCalculators = {
                perpendicular: commonStubCalculator, orthogonal: commonStubCalculator, opposite: function (t) {
                    var n = paintInfo, e = "x" == t ? 0: 1, r = {
                        x: function () {
                            return 1 == n.so[e] &&(n.startStubX > n.endStubX && n.tx > n.startStubX || n.sx > n.endStubX && n.tx > n.sx) || -1 == n.so[e] &&(n.startStubX < n.endStubX && n.tx < n.startStubX || n.sx < n.endStubX && n.tx < n.sx)
                        },
                        y: function () {
                            return 1 == n.so[e] &&(n.startStubY > n.endStubY && n.ty > n.startStubY || n.sy > n.endStubY && n.ty > n.sy) || -1 == n.so[e] &&(n.startStubY < n.endStubY && n.ty < n.startStubY || n.sy < n.endStubY && n.ty < n.sy)
                        }
                    };
                    return ! alwaysRespectStubs && r[t]() ? {
                        x:[(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY,(paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY], y:[paintInfo.startStubX,(paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX,(paintInfo.sy + paintInfo.ty) / 2]
                    }[t]:[paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY]
                }
            },
            lineCalculators = {
                perpendicular: function (axis, ss, oss, es, oes) {
                    with (paintInfo) {
                        var sis = {
                            x:[[[1, 2, 3, 4], null,[2, 1, 4, 3]], null,[[4, 3, 2, 1], null,[3, 4, 1, 2]]], y:[[[3, 2, 1, 4], null,[2, 3, 4, 1]], null,[[4, 1, 2, 3], null,[1, 4, 3, 2]]]
                        },
                        stubs = {
                            x:[[startStubX, endStubX], null,[endStubX, startStubX]], y:[[startStubY, endStubY], null,[endStubY, startStubY]]
                        },
                        midLines = {
                            x:[[midx, startStubY],[midx, endStubY]], y:[[startStubX, midy],[endStubX, midy]]
                        },
                        linesToEnd = {
                            x:[[endStubX, startStubY]], y:[[startStubX, endStubY]]
                        },
                        startToEnd = {
                            x:[[startStubX, endStubY],[endStubX, endStubY]], y:[[endStubX, startStubY],[endStubX, endStubY]]
                        },
                        startToMidToEnd = {
                            x:[[startStubX, midy],[endStubX, midy],[endStubX, endStubY]], y:[[midx, startStubY],[midx, endStubY],[endStubX, endStubY]]
                        },
                        otherStubs = {
                            x:[startStubY, endStubY], y:[startStubX, endStubX]
                        },
                        soIdx = orientations[axis][0], toIdx = orientations[axis][1], _so = so[soIdx] + 1, _to = to[toIdx] + 1, otherFlipped = -1 == to[toIdx] && otherStubs[axis][1] < otherStubs[axis][0] || 1 == to[toIdx] && otherStubs[axis][1] > otherStubs[axis][0], stub1 = stubs[axis][_so][0], stub2 = stubs[axis][_so][1], segmentIndexes = sis[axis][_so][_to];
                        if (segment == segmentIndexes[3] || segment == segmentIndexes[2] && otherFlipped) return midLines[axis];
                        if (segment == segmentIndexes[2] && stub1 > stub2) return linesToEnd[axis];
                        if (segment == segmentIndexes[2] && stub2 >= stub1 || segment == segmentIndexes[1] && ! otherFlipped) return startToMidToEnd[axis];
                        if (segment == segmentIndexes[0] || segment == segmentIndexes[1] && otherFlipped) return startToEnd[axis]
                    }
                },
                orthogonal: function (t, n, e, r, i) {
                    var o = paintInfo, s = {
                        x: -1 == o.so[0] ? Math.min(n, r): Math.max(n, r), y: -1 == o.so[1] ? Math.min(n, r): Math.max(n, r)
                    }[t];
                    return {
                        x:[[s, e],[s, i],[r, i]], y:[[e, s],[i, s],[i, r]]
                    }[t]
                },
                opposite: function (t, n, e, r, i) {
                    var o = paintInfo, s = {
                        x: "y", y: "x"
                    }[t], a = {
                        x: "height", y: "width"
                    }[t], l = o[ "is" + t.toUpperCase() + "GreaterThanStubTimes2"];
                    if (params.sourceEndpoint.elementId == params.targetEndpoint.elementId) {
                        var u = e +(1 - params.sourceEndpoint.anchor[s]) * params.sourceInfo[a] + _super.maxStub;
                        return {
                            x:[[n, u],[r, u]], y:[[u, n],[u, r]]
                        }[t]
                    }
                    return ! l || 1 == o.so[idx] && n > r || -1 == o.so[idx] && r > n ? {
                        x:[[n, midy],[r, midy]], y:[[midx, n],[midx, r]]
                    }[t]: 1 == o.so[idx] && r > n || -1 == o.so[idx] && n > r ? {
                        x:[[midx, o.sy],[midx, o.ty]], y:[[o.sx, midy],[o.tx, midy]]
                    }[t]: void 0
                }
            },
            stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis), idx = "x" == paintInfo.sourceAxis ? 0: 1, oidx = "x" == paintInfo.sourceAxis ? 1: 0, ss = stubs[idx], oss = stubs[oidx], es = stubs[idx + 2], oes = stubs[oidx + 2];
            addSegment(segments, stubs[0], stubs[1], paintInfo);
            var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);
            if (p) for (var i = 0; i < p.length; i++) addSegment(segments, p[i][0], p[i][1], paintInfo);
            addSegment(segments, stubs[2], stubs[3], paintInfo), addSegment(segments, paintInfo.tx, paintInfo.ty, paintInfo), writeSegments(segments, paintInfo)
        },
        this.getPath = function () {
            for (var t = null, n = null, e =[], r = userSuppliedSegments || segments, i = 0; i < r.length; i++) {
                var o = r[i], s = o[4], a = "v" == s ? 3: 2;
                null != t && n === s ? t[a] = o[a]:(o[0] != o[2] || o[1] != o[3]) &&(e.push({
                    start:[o[0], o[1]], end:[o[2], o[3]]
                }), t = o, n = o[4])
            }
            return e
        },
        this.setPath = function (t) {
            userSuppliedSegments =[];
            for (var n = 0; n < t.length; n++) {
                var e = t[n].start[0], r = t[n].start[1], i = t[n].end[0], o = t[n].end[1], s = e == i ? "v": "h", a = sgn(i - e), l = sgn(o - r);
                userSuppliedSegments.push([e, r, i, o, s, a, l])
            }
        }
    }
}
(), function () {
    var t = {
        "stroke-linejoin": "joinstyle", joinstyle: "joinstyle", endcap: "endcap", miterlimit: "miterlimit"
    },
    n = null;
    if (document.createStyleSheet && document.namespaces) {
        var e =[ ".jsplumb_vml", "jsplumb\\:textbox", "jsplumb\\:oval", "jsplumb\\:rect", "jsplumb\\:stroke", "jsplumb\\:shape", "jsplumb\\:group"], r = "behavior:url(#default#VML);position:absolute;";
        n = document.createStyleSheet();
        for (var i = 0; i < e.length; i++) n.addRule(e[i], r);
        document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml")
    }
    jsPlumb.vml = {
    };
    var o = 1e3, s = function (t, n) {
        for (var e in n) t[e] = n[e]
    },
    a = function (t, n, e, r, i, o) {
        e = e || {
        };
        var a = document.createElement("jsplumb:" + t);
        return o ? i.appendElement(a, r): jsPlumb.CurrentLibrary.appendElement(a, r), a.className =(e[ "class"] ? e[ "class"] + " ": "") + "jsplumb_vml", l(a, n), s(a, e), a
    },
    l = function (t, n, e) {
        t.style.left = n[0] + "px", t.style.top = n[1] + "px", t.style.width = n[2] + "px", t.style.height = n[3] + "px", t.style.position = "absolute", e &&(t.style.zIndex = e)
    },
    u = jsPlumb.vml.convertValue = function (t) {
        return Math.floor(t * o)
    },
    c = function (t, n, e, r) {
        "transparent" === n ? r.setOpacity(e, "0.0"): r.setOpacity(e, "1.0")
    },
    d = function (t, n, e, r) {
        var i = {
        };
        if (n.strokeStyle) {
            i.stroked = "true";
            var o = jsPlumbUtil.convertStyle(n.strokeStyle, ! 0);
            i.strokecolor = o, c(i, o, "stroke", e), i.strokeweight = n.lineWidth + "px"
        } else i.stroked = "false";
        if (n.fillStyle) {
            i.filled = "true";
            var l = jsPlumbUtil.convertStyle(n.fillStyle, ! 0);
            i.fillcolor = l, c(i, l, "fill", e)
        } else i.filled = "false";
        if (n.dashstyle) null == e.strokeNode ? e.strokeNode = a("stroke",[0, 0, 0, 0], {
            dashstyle: n.dashstyle
        },
        t, r): e.strokeNode.dashstyle = n.dashstyle; else if (n[ "stroke-dasharray"] && n.lineWidth) {
            for (var u = -1 == n[ "stroke-dasharray"].indexOf(",") ? " ": ",", d = n[ "stroke-dasharray"].split(u), p = "", h = 0; h < d.length; h++) p += Math.floor(d[h] /n.lineWidth)+u;null==e.strokeNode?e.strokeNode=a("stroke",[0,0,0,0],{dashstyle:p},t,r):e.strokeNode.dashstyle=p}s(t,i)},p=function(){var t=this;jsPlumb.jsPlumbUIComponent.apply(this,arguments),this.opacityNodes={stroke:null,fill:null},this.initOpacityNodes=function(n){t.opacityNodes.stroke=a("stroke",[0,0,1,1],{opacity:"0.0"},n,t._jsPlumb),t.opacityNodes.fill=a("fill",[0,0,1,1],{opacity:"0.0"},n,t._jsPlumb)},this.setOpacity=function(n,e){var r=t.opacityNodes[n];r&&(r.opacity=""+e)};var n=[];this.getDisplayElements=function(){return n},this.appendDisplayElement=function(e,r){r||t.canvas.parentNode.appendChild(e),n.push(e)}},h=(jsPlumb.ConnectorRenderers.vml=function(n){var e=this;e.strokeNode=null,e.canvas=null;var r=(p.apply(this,arguments),e._jsPlumb.connectorClass+(n.cssClass?" "+n.cssClass:""));this.paint=function(i){if(null!==i){for(var u=e.getSegments(),c={path:""},p=[e.x,e.y,e.w,e.h],h=0;h<u.length;h++)c.path+=jsPlumb.Segments.vml.SegmentRenderer.getPath(u[h]),c.path+=" ";if(i.outlineColor){var f=i.outlineWidth||1,m=i.lineWidth+2*f,g={strokeStyle:jsPlumbUtil.convertStyle(i.outlineColor),lineWidth:m};for(var v in t)g[v]=i[v];null==e.bgCanvas?(c["class"]=r,c.coordsize=p[2]*o+","+p[3]*o,e.bgCanvas=a("shape",p,c,n.parent,e._jsPlumb,!0),l(e.bgCanvas,p),e.appendDisplayElement(e.bgCanvas,!0),e.attachListeners(e.bgCanvas,e),e.initOpacityNodes(e.bgCanvas,["stroke"])):(c.coordsize=p[2]*o+","+p[3]*o,l(e.bgCanvas,p),s(e.bgCanvas,c)),d(e.bgCanvas,g,e)}null==e.canvas?(c["class"]=r,c.coordsize=p[2]*o+","+p[3]*o,e.canvas=a("shape",p,c,n.parent,e._jsPlumb,!0),e.appendDisplayElement(e.canvas,!0),e.attachListeners(e.canvas,e),e.initOpacityNodes(e.canvas,["stroke"])):(c.coordsize=p[2]*o+","+p[3]*o,l(e.canvas,p),s(e.canvas,c)),d(e.canvas,i,e,e._jsPlumb)}},this.reattachListeners=function(){e.canvas&&e.reattachListenersForElement(e.canvas,e)}},window.VmlEndpoint=function(t){p.apply(this,arguments);var n=null,e=this;e.canvas=document.createElement("div"),e.canvas.style.position="absolute";var r=e._jsPlumb.endpointClass+(t.cssClass?" "+t.cssClass:"");t._jsPlumb.appendElement(e.canvas,t.parent),this.paint=function(t,i){var o={};jsPlumb.sizeCanvas(e.canvas,e.x,e.y,e.w,e.h),null==n?(o["class"]=r,n=e.getVml([0,0,e.w,e.h],o,i,e.canvas,e._jsPlumb),e.attachListeners(n,e),e.appendDisplayElement(n,!0),e.appendDisplayElement(e.canvas,!0),e.initOpacityNodes(n,["fill"])):(l(n,[0,0,e.w,e.h]),s(n,o)),d(n,t,e)},this.reattachListeners=function(){n&&e.reattachListenersForElement(n,e)}});jsPlumb.Segments.vml={SegmentRenderer:{getPath:function(t){return{Straight:function(t){var n=t.params;return"m"+u(n.x1)+","+u(n.y1)+" l"+u(n.x2)+","+u(n.y2)+" e"},Bezier:function(t){var n=t.params;return"m"+u(n.x1)+","+u(n.y1)+" c"+u(n.cp1x)+","+u(n.cp1y)+","+u(n.cp2x)+","+u(n.cp2y)+","+u(n.x2)+","+u(n.y2)+" e"},Arc:function(t){var n=t.params,e=Math.min(n.x1,n.x2),r=(Math.max(n.x1,n.x2),Math.min(n.y1,n.y2)),i=(Math.max(n.y1,n.y2),t.anticlockwise?1:0),o=t.anticlockwise?"at ":"wa ",s=function(){var o=[null,[function(){return[e,r]},function(){return[e-n.r,r-n.r]}],[function(){return[e-n.r,r]},function(){return[e,r-n.r]}],[function(){return[e-n.r,r-n.r]},function(){return[e,r]}],[function(){return[e,r-n.r]},function(){return[e-n.r,r]}]][t.segment][i]();return u(o[0])+","+u(o[1])+","+u(o[0]+2*n.r)+","+u(o[1]+2*n.r)};return o+s()+","+u(n.x1)+","+u(n.y1)+","+u(n.x2)+","+u(n.y2)+" e"}}[t.type](t)}}},jsPlumb.Endpoints.vml.Dot=function(){jsPlumb.Endpoints.Dot.apply(this,arguments),h.apply(this,arguments),this.getVml=function(t,n,e,r,i){return a("oval",t,n,r,i)}},jsPlumb.Endpoints.vml.Rectangle=function(){jsPlumb.Endpoints.Rectangle.apply(this,arguments),h.apply(this,arguments),this.getVml=function(t,n,e,r,i){return a("rect",t,n,r,i)}},jsPlumb.Endpoints.vml.Image=jsPlumb.Endpoints.Image,jsPlumb.Endpoints.vml.Blank=jsPlumb.Endpoints.Blank,jsPlumb.Overlays.vml.Label=jsPlumb.Overlays.Label,jsPlumb.Overlays.vml.Custom=jsPlumb.Overlays.Custom;var f=function(t,n){t.apply(this,n),p.apply(this,n);var e=this;e.canvas=null,e.isAppendedAtTopLevel=!0;var r=function(t){return"m "+u(t.hxy.x)+","+u(t.hxy.y)+" l "+u(t.tail[0].x)+","+u(t.tail[0].y)+" "+u(t.cxy.x)+","+u(t.cxy.y)+" "+u(t.tail[1].x)+","+u(t.tail[1].y)+" x e"};this.paint=function(t,i){var u={},c=t.d,d=t.component;t.strokeStyle&&(u.stroked="true",u.strokecolor=jsPlumbUtil.convertStyle(t.strokeStyle,!0)),t.lineWidth&&(u.strokeweight=t.lineWidth+"px"),t.fillStyle&&(u.filled="true",u.fillcolor=t.fillStyle);var p=Math.min(c.hxy.x,c.tail[0].x,c.tail[1].x,c.cxy.x),h=Math.min(c.hxy.y,c.tail[0].y,c.tail[1].y,c.cxy.y),f=Math.max(c.hxy.x,c.tail[0].x,c.tail[1].x,c.cxy.x),m=Math.max(c.hxy.y,c.tail[0].y,c.tail[1].y,c.cxy.y),g=Math.abs(f-p),v=Math.abs(m-h),y=[p,h,g,v];if(u.path=r(c),u.coordsize=d.w*o+","+d.h*o,y[0]=d.x,y[1]=d.y,y[2]=d.w,y[3]=d.h,null==e.canvas){var b=d._jsPlumb.overlayClass||"",P=n&&1==n.length?n[0].cssClass||"":"";u["class"]=P+" "+b,e.canvas=a("shape",y,u,d.canvas.parentNode,d._jsPlumb,!0),d.appendDisplayElement(e.canvas,!0),e.attachListeners(e.canvas,d),e.attachListeners(e.canvas,e)}else l(e.canvas,y),s(e.canvas,u)},this.reattachListeners=function(){e.canvas&&e.reattachListenersForElement(e.canvas,e)},this.cleanup=function(){null!=e.canvas&&jsPlumb.CurrentLibrary.removeElement(e.canvas)}};jsPlumb.Overlays.vml.Arrow=function(){f.apply(this,[jsPlumb.Overlays.Arrow,arguments])},jsPlumb.Overlays.vml.PlainArrow=function(){f.apply(this,[jsPlumb.Overlays.PlainArrow,arguments])},jsPlumb.Overlays.vml.Diamond=function(){f.apply(this,[jsPlumb.Overlays.Diamond,arguments])}}(),function(){var t={joinstyle:"stroke-linejoin","stroke-linejoin":"stroke-linejoin","stroke-dashoffset":"stroke-dashoffset","stroke-linecap":"stroke-linecap"},n="stroke-dasharray",e="dashstyle",r="linearGradient",i="radialGradient",o="fill",s="stop",a="stroke",l="stroke-width",u="style",c="none",d="jsplumb_gradient_",p="lineWidth",h={svg:"http:/ /www.w3.org/ 2000 / svg ",xhtml:" http://www.w3.org/1999/xhtml"},f=function(t,n){for(var e in n)t.setAttribute(e,""+n[e])},m=function(t,n){var e=document.createElementNS(h.svg,t);return n=n||{},n.version="1.1",n.xmlns=h.xhtml,f(e,n),e},g=function(t){return"position:absolute;left:"+t[0]+"px;top:"+t[1]+"px"},v=function(t){for(var n=0;n<t.childNodes.length;n++)(t.childNodes[n].tagName==r||t.childNodes[n].tagName==i)&&t.removeChild(t.childNodes[n])},y=function(t,n,e,l,c){var p=d+c._jsPlumb.idstamp();v(t);var h;h=e.gradient.offset?m(i,{id:p}):m(r,{id:p,gradientUnits:"userSpaceOnUse"}),t.appendChild(h);for(var f=0;f<e.gradient.stops.length;f++){var g=1==c.segment||2==c.segment?f:e.gradient.stops.length-1-f,y=jsPlumbUtil.convertStyle(e.gradient.stops[g][1],!0),b=m(s,{offset:Math.floor(100*e.gradient.stops[f][0])+"%","stop-color":y});h.appendChild(b)}var P=e.strokeStyle?a:o;n.setAttribute(u,P+":url(#"+p+")")},b=function(r,i,s,d,h){if(s.gradient?y(r,i,s,d,h):(v(r),i.setAttribute(u,"")),i.setAttribute(o,s.fillStyle?jsPlumbUtil.convertStyle(s.fillStyle,!0):c),i.setAttribute(a,s.strokeStyle?jsPlumbUtil.convertStyle(s.strokeStyle,!0):c),s.lineWidth&&i.setAttribute(l,s.lineWidth),s[e]&&s[p]&&!s[n]){var f=-1==s[e].indexOf(",")?" ":",",m=s[e].split(f),g="";m.forEach(function(t){g+=Math.floor(t*s.lineWidth)+f}),i.setAttribute(n,g)}else s[n]&&i.setAttribute(n,s[n]);for(var b in t)s[b]&&i.setAttribute(t[b],s[b])},P=function(t,n,e){for(var r=e.split(" "),i=t.className,o=i.baseVal.split(" "),s=0;s<r.length;s++)if(n)-1==o.indexOf(r[s])&&o.push(r[s]);else{var a=o.indexOf(r[s]);-1!=a&&o.splice(a,1)}t.className.baseVal=o.join(" ")},x=function(t,n){P(t,!0,n)},C=function(t,n){P(t,!1,n)},E=function(t,n,e){t.childNodes.length>e?t.insertBefore(n,t.childNodes[e]):t.appendChild(n)};jsPlumbUtil.svg={addClass:x,removeClass:C,node:m,attr:f,pos:g};var j=function(t){var n=this,e=t.pointerEventsSpec||"all",r={};jsPlumb.jsPlumbUIComponent.apply(this,t.originalArgs),n.canvas=null,n.path=null,n.svg=null;var i=t.cssClass+" "+(t.originalArgs[0].cssClass||""),o={style:"",width:0,height:0,"pointer-events":e,position:"absolute"};n.svg=m("svg",o),t.useDivWrapper?(n.canvas=document.createElement("div"),n.canvas.style.position="absolute",jsPlumb.sizeCanvas(n.canvas,0,0,1,1),n.canvas.className=i):(f(n.svg,{"class":i}),n.canvas=n.svg),t._jsPlumb.appendElement(n.canvas,t.originalArgs[0].parent),t.useDivWrapper&&n.canvas.appendChild(n.svg);var s=[n.canvas];return this.getDisplayElements=function(){return s},this.appendDisplayElement=function(t){s.push(t)},this.paint=function(e,i,o){if(null!=e){var s,a=[n.x,n.y],l=[n.w,n.h];null!=o&&(o.xmin<0&&(a[0]+=o.xmin),o.ymin<0&&(a[1]+=o.ymin),l[0]=o.xmax+(o.xmin<0?-o.xmin:0),l[1]=o.ymax+(o.ymin<0?-o.ymin:0)),t.useDivWrapper?(jsPlumb.sizeCanvas(n.canvas,a[0],a[1],l[0],l[1]),a[0]=0,a[1]=0,s=g([0,0])):s=g([a[0],a[1]]),r.paint.apply(this,arguments),f(n.svg,{style:s,width:l[0],height:l[1]})}},{renderer:r}};jsPlumb.ConnectorRenderers.svg=function(t){var n=this,e=j.apply(this,[{cssClass:t._jsPlumb.connectorClass,originalArgs:arguments,pointerEventsSpec:"none",_jsPlumb:t._jsPlumb}]);e.renderer.paint=function(e,r,i){var o=n.getSegments(),s="",a=[0,0];i.xmin<0&&(a[0]=-i.xmin),i.ymin<0&&(a[1]=-i.ymin);for(var l=0;l<o.length;l++)s+=jsPlumb.Segments.svg.SegmentRenderer.getPath(o[l]),s+=" ";var u={d:s,transform:"translate("+a[0]+","+a[1]+")","pointer-events":t["pointer-events"]||"visibleStroke"},c=null,d=[n.x,n.y,n.w,n.h];if(e.outlineColor){var p=e.outlineWidth||1,h=e.lineWidth+2*p,c=jsPlumb.CurrentLibrary.extend({},e);c.strokeStyle=jsPlumbUtil.convertStyle(e.outlineColor),c.lineWidth=h,null==n.bgPath?(n.bgPath=m("path",u),E(n.svg,n.bgPath,0),n.attachListeners(n.bgPath,n)):f(n.bgPath,u),b(n.svg,n.bgPath,c,d,n)}null==n.path?(n.path=m("path",u),E(n.svg,n.path,e.outlineColor?1:0),n.attachListeners(n.path,n)):f(n.path,u),b(n.svg,n.path,e,d,n)},this.reattachListeners=function(){n.bgPath&&n.reattachListenersForElement(n.bgPath,n),n.path&&n.reattachListenersForElement(n.path,n)}};jsPlumb.Segments.svg={SegmentRenderer:{getPath:function(t){return{Straight:function(){var n=t.getCoordinates();return"M "+n.x1+" "+n.y1+" L "+n.x2+" "+n.y2},Bezier:function(){var n=t.params;return"M "+n.x1+" "+n.y1+" C "+n.cp1x+" "+n.cp1y+" "+n.cp2x+" "+n.cp2y+" "+n.x2+" "+n.y2},Arc:function(){var n=t.params,e=t.sweep>Math.PI?1:0,r=t.anticlockwise?0:1;return"M"+t.x1+" "+t.y1+" A "+t.radius+" "+n.r+" 0 "+e+","+r+" "+t.x2+" "+t.y2}}[t.type]()}}};var S=window.SvgEndpoint=function(t){var n=this,e=j.apply(this,[{cssClass:t._jsPlumb.endpointClass,originalArgs:arguments,pointerEventsSpec:"all",useDivWrapper:!0,_jsPlumb:t._jsPlumb}]);e.renderer.paint=function(t){var e=jsPlumb.extend({},t);e.outlineColor&&(e.strokeWidth=e.outlineWidth,e.strokeStyle=jsPlumbUtil.convertStyle(e.outlineColor,!0)),null==n.node?(n.node=n.makeNode(e),n.svg.appendChild(n.node),n.attachListeners(n.node,n)):null!=n.updateNode&&n.updateNode(n.node),b(n.svg,n.node,e,[n.x,n.y,n.w,n.h],n),g(n.node,[n.x,n.y])},this.reattachListeners=function(){n.node&&n.reattachListenersForElement(n.node,n)}};jsPlumb.Endpoints.svg.Dot=function(){jsPlumb.Endpoints.Dot.apply(this,arguments),S.apply(this,arguments),this.makeNode=function(t){return m("circle",{cx:this.w/2,cy:this.h/2,r:this.radius})},this.updateNode=function(t){f(t,{cx:this.w/2,cy:this.h/2,r:this.radius})}},jsPlumb.Endpoints.svg.Rectangle=function(){jsPlumb.Endpoints.Rectangle.apply(this,arguments),S.apply(this,arguments),this.makeNode=function(t){return m("rect",{width:this.w,height:this.h})},this.updateNode=function(t){f(t,{width:this.w,height:this.h})}},jsPlumb.Endpoints.svg.Image=jsPlumb.Endpoints.Image,jsPlumb.Endpoints.svg.Blank=jsPlumb.Endpoints.Blank,jsPlumb.Overlays.svg.Label=jsPlumb.Overlays.Label,jsPlumb.Overlays.svg.Custom=jsPlumb.Overlays.Custom;var D=function(t,n){t.apply(this,n),jsPlumb.jsPlumbUIComponent.apply(this,n),this.isAppendedAtTopLevel=!1;var e=this,r=null;this.paint=function(t,o){if(t.component.svg&&o){null==r&&(r=m("path",{"pointer-events":"all"
        }), t.component.svg.appendChild(r), e.attachListeners(r, t.component), e.attachListeners(r, e));
        var s = n && 1 == n.length ? n[0].cssClass || "": "", a =[0, 0]; o.xmin < 0 &&(a[0] = - o.xmin), o.ymin < 0 &&(a[1] = - o.ymin), f(r, {
            d: i(t.d), "class": s, stroke: t.strokeStyle ? t.strokeStyle: null, fill: t.fillStyle ? t.fillStyle: null, transform: "translate(" + a[0] + "," + a[1] + ")"
        })
    }
};
var i = function (t) {
    return "M" + t.hxy.x + "," + t.hxy.y + " L" + t.tail[0].x + "," + t.tail[0].y + " L" + t.cxy.x + "," + t.cxy.y + " L" + t.tail[1].x + "," + t.tail[1].y + " L" + t.hxy.x + "," + t.hxy.y
};
this.reattachListeners = function () {
    r && e.reattachListenersForElement(r, e)
},
this.cleanup = function () {
    null != r && jsPlumb.CurrentLibrary.removeElement(r)
}
};
jsPlumb.Overlays.svg.Arrow = function () {
D.apply(this,[jsPlumb.Overlays.Arrow, arguments])
},
jsPlumb.Overlays.svg.PlainArrow = function () {
D.apply(this,[jsPlumb.Overlays.PlainArrow, arguments])
},
jsPlumb.Overlays.svg.Diamond = function () {
D.apply(this,[jsPlumb.Overlays.Diamond, arguments])
},
jsPlumb.Overlays.svg.GuideLines = function () {
var t, n, e = null, r = this; jsPlumb.Overlays.GuideLines.apply(this, arguments), this.paint = function (o, s) {
    null == e &&(e = m("path"), o.connector.svg.appendChild(e), r.attachListeners(e, o.connector), r.attachListeners(e, r), t = m("path"), o.connector.svg.appendChild(t), r.attachListeners(t, o.connector), r.attachListeners(t, r), n = m("path"), o.connector.svg.appendChild(n), r.attachListeners(n, o.connector), r.attachListeners(n, r));
    var a =[0, 0]; s.xmin < 0 &&(a[0] = - s.xmin), s.ymin < 0 &&(a[1] = - s.ymin), f(e, {
        d: i(o.head, o.tail), stroke: "red", fill: null, transform: "translate(" + a[0] + "," + a[1] + ")"
    }), f(t, {
        d: i(o.tailLine[0], o.tailLine[1]), stroke: "blue", fill: null, transform: "translate(" + a[0] + "," + a[1] + ")"
    }), f(n, {
        d: i(o.headLine[0], o.headLine[1]), stroke: "green", fill: null, transform: "translate(" + a[0] + "," + a[1] + ")"
    })
};
var i = function (t, n) {
    return "M " + t.x + "," + t.y + " L" + n.x + "," + n.y
}
}
}
(), function (t) {
var n = function (n) {
return t("string" == typeof n ? "#" + n: n)
};
jsPlumb.CurrentLibrary = {
addClass: function (t, e) {
    t = n(t);
    try {
        t[0].className. constructor == SVGAnimatedString && jsPlumbUtil.svg.addClass(t[0], e)
    }
    catch (r) {
    }
    try {
        t.addClass(e)
    }
    catch (r) {
    }
},
animate: function (t, n, e) {
    t.animate(n, e)
},
appendElement: function (t, e) {
    n(e).append(t)
},
ajax: function (n) {
    n = n || {
    },
    n.type = n.type || "get", t.ajax(n)
},
bind: function (t, e, r) {
    t = n(t), t.bind(e, r)
},
dragEvents: {
    start: "start", stop: "stop", drag: "drag", step: "step", over: "over", out: "out", drop: "drop", complete: "complete"
},
extend: function (n, e) {
    return t.extend(n, e)
},
getAttribute: function (t, n) {
    return t.attr(n)
},
getClientXY: function (t) {
    return[t.clientX, t.clientY]
},
getDragObject: function (t) {
    return t[1].draggable || t[1].helper
},
getDragScope: function (t) {
    return t.draggable("option", "scope")
},
getDropEvent: function (t) {
    return t[0]
},
getDropScope: function (t) {
    return t.droppable("option", "scope")
},
getDOMElement: function (t) {
    return "string" == typeof t ? document.getElementById(t): t.context || null != t.length ? t[0]: t
},
getElementObject: n, getOffset: function (t) {
    return t.offset()
},
getOriginalEvent: function (t) {
    return t.originalEvent
},
getPageXY: function (t) {
    return[t.pageX, t.pageY]
},
getParent: function (t) {
    return n(t).parent()
},
getScrollLeft: function (t) {
    return t.scrollLeft()
},
getScrollTop: function (t) {
    return t.scrollTop()
},
getSelector: function (e, r) {
    return 2 == arguments.length ? n(e).find(r): t(e)
},
getSize: function (t) {
    return[t.outerWidth(), t.outerHeight()]
},
getTagName: function (t) {
    var e = n(t);
    return e.length > 0 ? e[0].tagName: null
},
getUIPosition: function (t, n) {
    if (n = n || 1, 1 == t.length) ret = {
        left: t[0].pageX, top: t[0].pageY
    }; else {
        var e = t[1], r = e.offset; ret = r || e.absolutePosition, e.position.left / = n, e.position.top / = n
    }
    return {
        left: ret.left / n, top: ret.top / n
    }
},
hasClass: function (t, n) {
    return t.hasClass(n)
},
initDraggable: function (t, n, e, r) {
    n = n || {
    },
    n.doNotRemoveHelper ||(n.helper = null), e &&(n.scope = n.scope || jsPlumb.Defaults.Scope), t.draggable(n)
},
initDroppable: function (t, n) {
    n.scope = n.scope || jsPlumb.Defaults.Scope, t.droppable(n)
},
isAlreadyDraggable: function (t) {
    return n(t).hasClass("ui-draggable")
},
isDragSupported: function (t, n) {
    return t.draggable
},
isDropSupported: function (t, n) {
    return t.droppable
},
removeClass: function (t, e) {
    t = n(t);
    try {
        if (t[0].className. constructor == SVGAnimatedString) return void jsPlumbUtil.svg.removeClass(t[0], e)
    }
    catch (r) {
    }
    t.removeClass(e)
},
removeElement: function (t) {
    n(t).remove()
},
setAttribute: function (t, n, e) {
    t.attr(n, e)
},
setDragFilter: function (t, n) {
    jsPlumb.CurrentLibrary.isAlreadyDraggable(t) && t.draggable("option", "cancel", n)
},
setDraggable: function (t, n) {
    t.draggable("option", "disabled", ! n)
},
setDragScope: function (t, n) {
    t.draggable("option", "scope", n)
},
setOffset: function (t, e) {
    n(t).offset(e)
},
trigger: function (t, e, r) {
    var i = jQuery._data(n(t)[0], "handle");
    i(r)
},
unbind: function (t, e, r) {
    t = n(t), t.unbind(e, r)
}
},
t(document).ready(jsPlumb.init)
}
(jQuery), function () {
"undefined" == typeof Math.sgn &&(Math.sgn = function (t) {
return 0 == t ? 0: t > 0 ? 1: -1
});
var t = {
subtract: function (t, n) {
    return {
        x: t.x - n.x, y: t.y - n.y
    }
},
dotProduct: function (t, n) {
    return t.x * n.x + t.y * n.y
},
square: function (t) {
    return Math.sqrt(t.x * t.x + t.y * t.y)
},
scale: function (t, n) {
    return {
        x: t.x * n, y: t.y * n
    }
}
},
n = Math.pow(2, -65), e = function (n, e) {
for (var o =[], s = e.length -1, a = 2 * s -1, l =[], u =[], c =[], d =[], p =[[1, .6, .3, .1],[.4, .6, .6, .4],[.1, .3, .6, 1]], h = 0;
s >= h;
h++) l[h] = t.subtract(e[h], n);
for (h = 0;
s -1 >= h;
h++) u[h] = t.subtract(e[h + 1], e[h]), u[h] = t.scale(u[h], 3);
for (h = 0;
s -1 >= h;
h++) for (var f = 0;
s >= f;
f++) c[h] ||(c[h] =[]), c[h][f] = t.dotProduct(u[h], l[f]);
for (h = 0;
a >= h;
h++) d[h] ||(d[h] =[]), d[h].y = 0, d[h].x = parseFloat(h) / a; for (a = s -1, l = 0;
s + a >= l;
l++) for (h = Math.max(0, l - a), u = Math.min(l, s);
u >= h;
h++) j = l - h, d[h + j].y += c[j][h] * p[j][h]; for (s = e.length -1, d = r(d, 2 * s -1, o, 0), a = t.subtract(n, e[0]), c = t.square(a), h = p = 0;
d > h;
h++) a = t.subtract(n, i(e, s, o[h], null, null)), a = t.square(a), c > a &&(c = a, p = o[h]);
return a = t.subtract(n, e[s]), a = t.square(a), c > a &&(c = a, p = 1), {
    location: p, distance: c
}
},
r = function (t, e, o, s) {
var a, l, u =[], c =[], d =[], p =[], h = 0; l = Math.sgn(t[0].y);
for (var f = 1;
e >= f;
f++) a = Math.sgn(t[f].y), a != l && h++, l = a; switch (h) {
    case 0: return 0; case 1: if (s >= 64) return o[0] =(t[0].x + t[e].x) / 2, 1; var m, g, h = t[0].y - t[e].y; for (l = t[e].x - t[0].x, f = t[0].x * t[e].y - t[e].x * t[0].y, a = max_distance_below = 0, m = 1;
    e > m;
    m++) g = h * t[m].x + l * t[m].y + f, g > a ? a = g: g < max_distance_below &&(max_distance_below = g);
    if (g = l, m = 0 * g -1 * h, a =(1 *(f - a) -0 * g) *(1 / m), g = l, l = f - max_distance_below, m = 0 * g -1 * h, h =(1 * l -0 * g) *(1 / m), l = Math.min(a, h), Math.max(a, h) - l < n) return d = t[e].x - t[0].x, p = t[e].y - t[0].y, o[0] = 0 + 1 *(d *(t[0].y -0) - p *(t[0].x -0)) *(1 /(0 * d -1 * p)), 1
}
for (i(t, e, .5, u, c), t = r(u, e, d, s + 1), e = r(c, e, p, s + 1), s = 0;
t > s;
s++) o[s] = d[s]; for (s = 0;
e > s;
s++) o[s + t] = p[s]; return t + e
},
i = function (t, n, e, r, i) {
for (var o =[[]], s = 0;
n >= s;
s++) o[0][s] = t[s]; for (t = 1;
n >= t;
t++) for (s = 0;
n - t >= s;
s++) o[t] ||(o[t] =[]), o[t][s] ||(o[t][s] = {
}), o[t][s].x =(1 - e) * o[t -1][s].x + e * o[t -1][s + 1].x, o[t][s].y =(1 - e) * o[t -1][s].y + e * o[t -1][s + 1].y; if (null != r) for (s = 0;
n >= s;
s++) r[s] = o[s][0]; if (null != i) for (s = 0;
n >= s;
s++) i[s] = o[n - s][s]; return o[n][0]
},
o = {
},
s = function (t, n) {
var e, r = t.length -1; if (e = o[r], ! e) {
    e =[]; var i = function (t) {
        return function () {
            return t
        }
    },
    s = function () {
        return function (t) {
            return t
        }
    },
    a = function () {
        return function (t) {
            return 1 - t
        }
    },
    l = function (t) {
        return function (n) {
            for (var e = 1, r = 0;
            r < t.length;
            r++) e *= t[r](n);
            return e
        }
    };
    e.push(new function () {
        return function (t) {
            return Math.pow(t, r)
        }
    });
    for (var u = 1;
    r > u;
    u++) {
        for (var c =[ new i(r)], d = 0;
        r - u > d;
        d++) c.push(new s);
        for (d = 0;
        u > d;
        d++) c.push(new a);
        e.push(new l(c))
    }
    e.push(new function () {
        return function (t) {
            return Math.pow(1 - t, r)
        }
    }), o[r] = e
}
for (a = s = i = 0;
a < t.length;
a++) i += t[a].x * e[a](n), s += t[a].y * e[a](n);
return {
    x: i, y: s
}
},
a = function (t, n) {
return Math.sqrt(Math.pow(t.x - n.x, 2) + Math.pow(t.y - n.y, 2))
},
l = function (t) {
return t[0].x == t[1].x && t[0].y == t[1].y
},
u = function (t, n, e) {
if (l(t)) return {
    point: t[0], location: n
};
for (var r = s(t, n), i = 0, o = e > 0 ? 1: -1, u = null;
i < Math.abs(e);) n += .005 * o, u = s(t, n), i += a(u, r), r = u; return {
    point: u, location: n
}
},
c = function (t, n) {
var e = s(t, n), r = s(t.slice(0, t.length -1), n), i = r.y - e.y, e = r.x - e.x; return 0 == i ? 1 / 0: Math.atan(i / e)
};
window.jsBezier = {
distanceFromCurve: e, gradientAtPoint: c, gradientAtPointAlongCurveFrom: function (t, n, e) {
    return n = u(t, n, e), 1 < n.location &&(n.location = 1), 0 > n.location &&(n.location = 0), c(t, n.location)
},
nearestPointOnCurve: function (t, n) {
    var r = e(t, n);
    return {
        point: i(n, n.length -1, r.location, null, null), location: r.location
    }
},
pointOnCurve: s, pointAlongCurveFrom: function (t, n, e) {
    return u(t, n, e).point
},
perpendicularToCurveAt: function (t, n, e, r) {
    return n = u(t, n, null == r ? 0: r), t = c(t, n.location), r = Math.atan(-1 / t), t = e / 2 * Math.sin(r), e = e / 2 * Math.cos(r),[ {
        x: n.point.x + e, y: n.point.y + t
    },
    {
        x: n.point.x - e, y: n.point.y - t
    }]
},
locationAlongCurveFrom: function (t, n, e) {
    return u(t, n, e).location
},
getLength: function (t) {
    if (l(t)) return 0; for (var n = s(t, 0), e = 0, r = 0, i = null;
    1 > r;) r += .005, i = s(t, r), e += a(i, n), n = i; return e
}
}
}
();
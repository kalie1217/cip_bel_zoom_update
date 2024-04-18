function Exception(e, t) {
    e &&(this.name = e), t &&(this.message = t)
}
function FlashTag(e, t, a, i, s) {
    this.src = e, this.width = t, this.height = a, this.version = "7,0,14,0", this.id = s, this.bgcolor = i, this.flashVars = null
}
function FlashSerializer(e) {
    this.useCdata = e
}
function FlashProxy(e, t) {
    this.uid = e, this.proxySwfName = t, this.flashSerializer = new FlashSerializer(! 1)
}
Exception.prototype.setName = function (e) {
    this.name = e
},
Exception.prototype.getName = function () {
    return this.name
},
Exception.prototype.setMessage = function (e) {
    this.message = e
},
Exception.prototype.getMessage = function () {
    return this.message
},
FlashTag.prototype.setVersion = function (e) {
    this.version = e
},
FlashTag.prototype.setId = function (e) {
    this.id = e
},
FlashTag.prototype.setBgcolor = function (e) {
    this.bgcolor = e
},
FlashTag.prototype.setFlashvars = function (e) {
    this.flashVars = e
},
FlashTag.prototype.toString = function () {
    var e = -1 != navigator.appName.indexOf("Microsoft") ? 1: 0, t = new String;
    return e ?(t += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ', null != this.id &&(t += 'id="' + this.id + '" '), t += 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + this.version + '" ', t += 'width="' + this.width + '" ', t += 'height="' + this.height + '">', t += '<param name="movie" value="' + this.src + '"/>', t += '<param name="quality" value="high"/>', t += '<param name="bgcolor" value="#' + this.bgcolor + '"/>', null != this.flashVars &&(t += '<param name="flashvars" value="' + this.flashVars + '"/>'), t += "</object>"):(t += '<embed src="' + this.src + '" ', t += 'quality="high" ', t += 'bgcolor="#' + this.bgcolor + '" ', t += 'width="' + this.width + '" ', t += 'height="' + this.height + '" ', t += 'type="application/x-shockwave-flash" ', null != this.flashVars &&(t += 'flashvars="' + this.flashVars + '" '), null != this.id &&(t += 'name="' + this.id + '" '), t += 'pluginspage="http://www.macromedia.com/go/getflashplayer">', t += "</embed>"), t
},
FlashTag.prototype.write = function (e) {
    e.write(this.toString())
},
FlashTag.prototype.insert = function (e) {
    var t = document.getElementById(e);
    t.innerHTML = this.toString()
},
FlashSerializer.prototype.serialize = function (e) {
    for (var t = new String, a = 0; a < e.length;++ a) {
        switch (typeof e[a]) {
            case "undefined": t += "t" + a + "=undf";
            break;
            case "string": t += "t" + a + "=str&d" + a + "=" + escape(e[a]);
            break;
            case "number": t += "t" + a + "=num&d" + a + "=" + escape(e[a]);
            break;
            case "boolean": t += "t" + a + "=bool&d" + a + "=" + escape(e[a]);
            break;
            case "object": if (null == e[a]) t += "t" + a + "=null"; else if (e[a] instanceof Date) t += "t" + a + "=date&d" + a + "=" + escape(e[a].getTime()); else try {
                t += "t" + a + "=xser&d" + a + "=" + escape(this._serializeXML(e[a]))
            }
            catch (i) {
                throw new Exception("FlashSerializationException", "The following error occurred during complex object serialization: " + i.getMessage())
            }
            break;
            default: throw new Exception("FlashSerializationException", "You can only serialize strings, numbers, booleans, dates, objects, arrays, nulls, and undefined.")
        }
        a != e.length -1 &&(t += "&")
    }
    return t
},
FlashSerializer.prototype._serializeXML = function (e) {
    var t = new Object;
    return t.xml = "<fp>", this._serializeNode(e, t, null), t.xml += "</fp>", t.xml
},
FlashSerializer.prototype._serializeNode = function (e, t, a) {
    switch (typeof e) {
        case "undefined": t.xml += "<undf" + this._addName(a) + "/>";
        break;
        case "string": t.xml += "<str" + this._addName(a) + ">" + this._escapeXml(e) + "</str>";
        break;
        case "number": t.xml += "<num" + this._addName(a) + ">" + e + "</num>";
        break;
        case "boolean": t.xml += "<bool" + this._addName(a) + ' val="' + e + '"/>';
        break;
        case "object": if (null == e) t.xml += "<null" + this._addName(a) + "/>"; else if (e instanceof Date) t.xml += "<date" + this._addName(a) + ">" + e.getTime() + "</date>"; else if (e instanceof Array) {
            t.xml += "<array" + this._addName(a) + ">";
            for (var i = 0; i < e.length;++ i) this._serializeNode(e[i], t, null);
            t.xml += "</array>"
        } else {
            t.xml += "<obj" + this._addName(a) + ">";
            for (var s in e) "function" != typeof e[s] && this._serializeNode(e[s], t, s);
            t.xml += "</obj>"
        }
        break;
        default: throw new Exception("FlashSerializationException", "You can only serialize strings, numbers, booleans, objects, dates, arrays, nulls and undefined")
    }
},
FlashSerializer.prototype._addName = function (e) {
    return null != e ? ' name="' + e + '"': ""
},
FlashSerializer.prototype._escapeXml = function (e) {
    return this.useCdata ? "<![CDATA[" + e + "]]>": e.replace(/&/g, "&amp;").replace(/</g, "&lt;")
},
FlashProxy.prototype.call = function () {
    if (0 == arguments.length) throw new Exception("Flash Proxy Exception", "The first argument should be the function name followed by any number of additional arguments.");
    var e = "lcId=" + escape(this.uid) + "&functionName=" + escape(arguments[0]);
    if (arguments.length > 1) {
        for (var t = new Array, a = 1; a < arguments.length;++ a) t.push(arguments[a]);
        e += "&" + this.flashSerializer.serialize(t)
    }
    var i = "_flash_proxy_" + this.uid;
    if (! document.getElementById(i)) {
        var s = document.createElement("div");
        s.id = i, document.body.appendChild(s)
    }
    var n = document.getElementById(i), r = new FlashTag(this.proxySwfName, 1, 1);
    r.setVersion("6,0,65,0"), r.setFlashvars(e), n.innerHTML = r.toString()
},
FlashProxy.callJS = function () {
    for (var functionToCall = eval(arguments[0]), argArray = new Array, i = 1; i < arguments.length;++ i) argArray.push(arguments[i]);
    functionToCall.apply(functionToCall, argArray)
};
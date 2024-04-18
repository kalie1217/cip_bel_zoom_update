// JavaScript Document
function getInternetExplorerVersion () {
    var rv = -1 // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent
        var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})')
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1)
        }
    }
    return rv
}

function loadCourseProgressTables () {
    DB.executeQuery('CREATE TABLE IF NOT EXISTS user (userID string unique, pw string)')
    DB.executeQuery('CREATE TABLE IF NOT EXISTS module (userID STRING, moduleTitle STRING, complete INTEGER DEFAULT 0)')
    DB.executeQuery('CREATE TABLE IF NOT EXISTS moduleTasks (userID STRING, moduleTitle STRING, taskID STRING, taskTitle STRING, completionCode STRING DEFAULT 0)')
}

function toProperCase (strval) {
    var pieces = strval.split('-')
    for (var i = 0; i < pieces.length; i++) {
        var j = pieces[i].charAt(0).toUpperCase()
        pieces[i] = j + pieces[i].substr(1).toLowerCase()
    }
    return pieces.join('-')
}

function randomNumbers () {
    this.inhat = function (n) {
        return (this.ff[n])
    }
    this.remove = function (n) {
        if (this.ff[n]) {
            this.ff[n] = false;
            this.count--
        }
    }
    this.fill = function (n) {
        this.ff =[]
        for (var i = 0; i < n; i++) {
            this.ff[i] = true
        }
        this.count = n
    }
    this. get = function () {
        var n, k, r
        r = this.count
        if (r > 0) {
            n = Math.ceil(Math.random() * r)
            r = k = 0
            do {
                if (this.ff[r++]) {
                    k++
                }
            }
            while (k < n)
            this.ff[r - 1] = false
            this.count--
        }
        return r - 1
    }
    if (arguments.length > 0) {
        this.fill(arguments[0])
    }
}
// randomNumbers

function showLogin (file) {
    $('#div_login').load(file, function () {
        globalize_id('txt_userID')
        globalize_id('txt_pw')
    })
}

function showMainBody (file) {
    $('#div_mainBody').load(file, function () {
        if (typeof load_afg === 'function') {
            load_afg()
        }
        // loading initialization for CO
    })
}

function importHTML (filename, divName) // <-- replaced with JQuery.load()
{
    var request = getHTTPObject()
    request.onreadystatechange = function () {
        parseResponse(request, divName)// this is what happens once complete
    }
    request.open('GET', filename, true)
    request.send(null)
}

/* Once the request state is complete and the file exists, it grabs the results
 * div, and inserts the response text and innerHTML.
 */
function parseResponse (request, divID) // <-- replaced with JQuery.load()
{
    if (request.readyState == 4) {
        if (request.status == 200 || request.status == 304) {
            // get only the <body>
            var results = request.responseText
            eval("setAndExecute('" + divID + "', results)")
            
            if (divID == 'div_login') {
                globalize_id('txt_userID')
                globalize_id('txt_pw')
                loginLoadTest()
            }
        }
        
        return 'Error loading file'
    }
}

var validateOnEnter = function (event) {
    if (event.keyCode == 32 || event.keyCode == 39 || event.keyCode == 34) {
        event.returnValue = false
    }
    
    if (event.keyCode == 13) {
        validateUser(txt_userID.value, txt_pw.value)
    }
}

function getHTTPObject () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest()
    }
    try {
        return new ActiveXObject('Msxml2.XMLHTTP')
    }
    catch (e) {
        try {
            return new ActiveXObject('Microsoft.XMLHTTP')
        }
        catch (e) {
        }
    }
    return false
}

function validateUser (userID, pw, callback) {
    if (userID == '') {
        alert('Please provide a user name.')
    } else if (pw == '') {
        alert('Please provide a password')
    } else {
        FW.signIn(userID, pw)
    }
    
    function verifyPassword (tx, result) {
        if (result.rows.length > 0) {
            // user and password match... validated
            var row = result.rows.item(0)
            logged_in_UserID = row[ 'userID']
            setSimpleCookie('logged_in_UserID', logged_in_UserID)
            if (typeof callback === 'function') callback()
        } else {
            // invalid password
            txt_pw.value = ''
            txt_pw.focus()
            alert('Login Failed: Invalid Password')
        }
    }
    
    function verifyUser (tx, result) {
        if (result.rows.length > 0) {
            // valid user... now verify password
            var row = result.rows.item(0)
            
            DB.getResult("SELECT * FROM user WHERE userID='" + userID + "' AND pw='" + pw + "'", verifyPassword)
        } else {
            // invalid login
            if (confirm("User '" + userID + "' does not exist.  Would you like to create this new user?")) {
                addUser(userID, pw, callback)
                return userID
            }
        }
    }
    
    function addUserCookie (UserID, pw) {
        if (confirm("User '" + userID + "' does not exist.  Would you like to create this new user?")) {
            setSimpleCookie('logged_in_UserID', userID + ':' + pw)
            if (typeof callback === 'function') callback()
            return userID
        }
    }
}

function addUser (userID, pw, callback) {
    logged_in_UserID = userID
    setSimpleCookie('logged_in_UserID', logged_in_UserID)
    var query = "INSERT INTO user (userID, pw) VALUES ('" + userID + "', '" + pw + "')"
    DB.executeQuery(query, callback)
}

function setSimpleCookie (cookieName, cookieValue, hours) {
    if (typeof hours === 'undefined') {
        hours = 2
    }
    
    var expires = new Date((new Date()).getTime() + hours * 3600000)
    document.cookie = cookieName + '=' + cookieValue + '; path=/; expires=' + expires.toGMTString()
}

function getSimpleCookie (check_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';')
    var a_temp_cookie = ''
    var cookie_name = ''
    var cookie_value = ''
    var b_cookie_found = false // set boolean t/f default f
    
    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=')
        
        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '')
        
        // if the extracted name matches passed check_name
        if (cookie_name == check_name) {
            b_cookie_found = true
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''))
            }
            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value
            break
        }
        a_temp_cookie = null
        cookie_name = ''
    }
    if (! b_cookie_found) {
        return false
    }
}

// Cookie Class
function cookie_class () {
    var _this = this
    function init () {
        var the_fn = document.location.href
        var nn = the_fn.lastIndexOf('/') + 1
        the_fn = the_fn.substr(nn)
        var mm = the_fn.lastIndexOf('.')
        the_fn = the_fn.substr(0, mm)
        _this._name = the_fn
        var hours = 1
        _this._expiration = new Date((new Date()).getTime() + hours * 3600000)
        var x = window.document.cookie
        var r = x != ''
        if (r) {
            var st = x.indexOf(_this._name + '=')
            r = st >= 0
        }
        if (r) {
            st += _this._name.length + 1
            var en = x.indexOf(';', st)
            if (en == -1) {
                en = x.length
            }
            var v = x.substring(st, en)
            var a = v.split('&')
            for (var i = 0, len = a.length; i < len; i++) {
                a[i] = a[i].split(':')
            }
            for (var i = 0, len = a.length; i < len; i++) {
                _this[a[i][0]] = unescape(a[i][1])
            }
        }
    }
    init()
    this.clear = function () {
        document.cookie = _this._name + '=; expires=' + _this._expiration.toGMTString()
    }
    this. get = function (aa) {
        return this[aa]
    }
    this. set = function (aa, vv) {
        this[aa] = vv
        var v = ''
        for (var p in this) {
            if (typeof this[p] !== 'function' && p.charAt(0) != '_') {
                if (v != '') {
                    v += '&'
                }
                v += p + ':' + escape(this[p])
            }
        }
        document.cookie = _this._name + '=' + v + '; expires=' + _this._expiration.toGMTString()
    }
    this.rm = function (aa) {
        if (this[aa]) {
            delete this[aa]
        }
    }
}
// cookie_class

// Output Helper Functions
function w_source () {
    var wr = ''
    function ws () {
        wr += ''.concat.apply('', arguments)
    }
    function wl () {
        wr += ''.concat.apply('', arguments) + '\r\n'
    }
    function wx (AA, BB) {
        wl(spf(AA, BB))
    }
    wl("var wr = ''")
    wl(ws)
    wl(wl)
    wl(wx)
    return wr
}

function spf (s, t) {
    var n = 0
    function F () {
        return t[n++]
    }
    return s.replace(/~/g, F)
}

function xid (a) {
    return window.document.getElementById(a)
}

function globalize_id (the_id) {
    window[the_id] = xid(the_id)
}

function signIn (usr, pw) {
    result = validateUser(usr, pw, reloadParent)
}

function reloadParent () {
    self.parent.location.reload()
}

function getURL_Parameter (param) {
    var urlQuery = location.href.split('?')
    if (typeof urlQuery === 'undefined') {
        return 'undefined'
    }
    
    if (urlQuery.length < 2) {
        return ''
    }
    
    var urlItems = urlQuery[1].split('&')
    var paramCount = urlItems.length
    for (i = 0; i < paramCount; i++) {
        paramItem = urlItems[i].split('=')
        paramName = paramItem[0]
        paramValue = paramItem[1]
        
        if (param == paramName) {
            return paramValue
        }
    }
    return 'undefined'
}
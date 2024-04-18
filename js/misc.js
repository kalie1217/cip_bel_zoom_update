String.prototype.L_Trim = new Function ("return this.replace(/^\\s+/,'')")
String.prototype.R_Trim = new Function ("return this.replace(/\\s+$/,'')")
String.prototype.Trim = new Function ('return this.L_Trim().R_Trim()')

function xid (i) {
    return document.getElementById(i)
}

function xtn (tn) {
    return document.getElementsByTagName(tn)
}

function xxtn (frm, tn) {
    return frm.getElementsByTagName(tn)
}

function result (str) {
    $('#id_result_div > p').html(str.join(''))
}

function msg (t) {
    xid('id_massage').innerHTML = t
    $('#id_massage').fadeIn('slow')
}

function xidVal (id) {
    var R = ''
    var i = xid(id)
    var nn = i.nodeName // node name
    
    if ((nn == 'INPUT' && (i.type == 'text' || i.type == 'password' || i.type == 'file')) || nn == 'TEXTAREA') {
        R = i.value
    }
    /*
    else if (nn == 'INPUT' && (i.type == 'radio' || i.type == 'checkbox'))
    {
    var x = document.getElementsByName(i.name)
    if (x.length == 1 && (! x[0].checked))
    return alertNFocus(i)
    else if (x.length > 1 && x[0].checked)
    return alertNFocus(i)
    }
     */
    
    return R.Trim()
}
// xidVal

function create_qs (s) {
    var ss =[]
    for (var x = 0; x < s.length;) {
        ss.push(s[x] + '=' + s[x + 1])
        x = x + 2
    }
    
    return ss.join('&')
}
// create_qs
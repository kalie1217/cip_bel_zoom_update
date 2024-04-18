
function JXml (outputfn, pth, t, ns, args) // path, tag, nameSpace status)
{
    var ignoreNameSpace = false
    var Data =[]
    var xxml
    
    // browser detect
    var ff = navigator.userAgent.indexOf('Firefox') > 0
    var ie = navigator.userAgent.indexOf('IE') > 0
    var crm = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
    
    function pXML (fff) {
        var xml
        
        function fn (ax) {
            if (ie) {
                xml = new ActiveXObject('Microsoft.XMLDOM')
                xml.async = 'false'
                xml.loadXML(ax.responseText)
                // fff(xml)
            } else {
                xml =[]
                xml = ax.responseXML
                // alert(xml.responseXML)
                // alert(xml)
                // fff(xml)
            }
            fff(xml.documentElement)
        }
        // fn
        
        load_XML(pth, fn)
    }
    // pXML
    
    function load_XML (url, f) {
        var activexmodes =[ 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'] // activeX versions to check for in IE
        // Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        var axtf = ! ! window.ActiveXObject
        var ax = null
        
        if (! axtf && window.XMLHttpRequest) {
            ax = new XMLHttpRequest()
        } else if (axtf) {
            for (var i = 0; i < activexmodes.length; i++) {
                try {
                    ax = new ActiveXObject(activexmodes[i])
                }
                catch (e) {
                    // suppress error
                }
            }
            // ax = new ActiveXObject("MSXML2.XMLHTTP.3.0")//'Microsoft.XMLHTTP')
        }
        if (ax) {
            ax.onreadystatechange = function () {
                if (ax.readyState == 4) {
                    if (ax.status == 200 || ax.status == 0) {
                        // alert(ax.responseText)
                        f(ax)
                    } else if (ax.status == 404) {
                        alert(url + ' not fuond!')
                    }
                }
            }
            try {
                ax.open('GET', url, true)
            }
            catch (e) {
                alert(e)
            }
            try {
                ax.send(null)
            }
            catch (e) {
                alert(e)
            }
            // alert(ax.responseText)
        }
        
        return ax
    }
    // load_xml
    
    function d (nn) {
        var rA =[] // repeat array
        var e = nn.childNodes
        var s =[]
        
        for (var x = 0; x < e.length; x++) {
            if (e[x].nodeType == 3 || e[x].nodeType == 4) {
                if (e[x].nodeValue.length > 0) {
                    s.txt = e[x].nodeValue
                }
                // else
                // return
            } else {
                if (ignoreNameSpace) {
                    var nm = e[x].nodeName.substr(e[x].nodeName.indexOf(':') + 1)
                } else {
                    var nm = e[x].nodeName.replace(':', '')
                }
                
                if (ff || ie) {
                    var len = e[x].parentNode.getElementsByTagName(e[x].nodeName).length
                } else {
                    var len = e[x].parentNode.getElementsByTagNameNS('*', e[x].nodeName.substr(e[x].nodeName.indexOf(':') + 1)).length// nodeName.substr(e[x].nodeName.indexOf(':')+1)).length
                }
                
                nm = nm.toLowerCase()
                if (len > 1) {
                    if (undefined == eval('rA.' + nm)) {
                        eval('rA.' + nm + ' = true')
                        eval('rA.' + nm + '_C = 0')
                        eval('s.' + nm + ' = []')
                    } else {
                        eval('rA.' + nm + '_C = ' + 'rA.' + nm + '_C + 1')
                    }
                    
                    var cc = eval('rA.' + nm + '_C')
                    eval('s.' + nm + '[' + cc + '] = d(e[x])')
                    
                    // get attributes
                    var aa = e[x].attributes
                    var aL = aa.length
                    if (aL > 0) {
                        for (var a = 0; a < aL; a++) {
                            eval('s.' + nm + '[' + cc + '].' + aa[a].name.toLowerCase() + ' = \"' + aa[a].value + '\"')
                        }
                    }
                } else // if it is single in that level
                {
                    eval('s.' + nm + ' = d(e[x])')
                    
                    // get attributes
                    var aa = e[x].attributes
                    var aL = aa.length
                    if (aL > 0) {
                        for (var a = 0; a < aL; a++) {
                            eval('s.' + nm + '.' + aa[a].name.toLowerCase() + ' = \"' + aa[a].value + '\"')
                        }
                    }
                }
            }
        }
        
        var aa = nn.attributes
        var aL = aa.length
        if (aL > 0) {
            for (var a = 0; a < aL; a++) {
                eval('s.' + aa[a].name.toLowerCase().replace(':', '') + ' = \"' + aa[a].value + '\"')
            }
        }
        
        return s
    }
    // d
    
    function init () {
        function initWithTag (xxx) {
            if (ie || ff) {
                xxml = xxx.getElementsByTagName(t)
            } else {
                xxml = xxx.getElementsByTagName(t.substr(t.indexOf(':') + 1))
            }
            
            for (var x = 0; x < xxml.length; x++) {
                Data.push(d(xxml[x]))
            }
            
            outputfn(Data, args)
        }
        // initWithTag
        
        function ffn (doc) {
            if (t && t.length > 0) {
                initWithTag(doc)
            } else {
                Data = d(doc)
                outputfn(Data)
            }
        }
        // ffn
        
        if (ns == false) {
            ignoreNameSpace = true
        }
        
        pXML(ffn)// processs xml
    }
    // init
    
    function isChromStandAlone () {
        var R = false
        if (crm) {
            if (document.location.href.toLowerCase().indexOf('file') > -1) {
                R = true
            }
        }
        
        return R
    }
    // isChromStandAlone
    
    if (! isChromStandAlone()) {
        init()
    } else {
        alert('JXml doesn\'t support Chrome in a stand Alone Mode\nIt works on Firefox, Opera, Safari, IE7\/8!')
    }
}
// JXml
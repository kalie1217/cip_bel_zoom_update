// JavaScript Document
var xmlDoc = null;
function load_XML(URX) {
    
    var browser = {
        name: '', firefox3: null
    };
    var XML_DOM = null;
    var XML_HTTP = null;
    var complete = 4;
    
    //check browser
    function checkBrowser() {
        if (window.ActiveXObject) {
            browser.name = 'ie';
        } else if (window.XMLHttpRequest) {
            browser.name = 'safari';
            if (navigator.userAgent.match("rv:1\.9"))
            browser.firefox3 = true;
        } else if (document.implementation && document.implementation.createDocument) {
            browser.name = 'moz';
            if (navigator.userAgent.match("rv:1\.9"))
            browser.firefox3 = true;
        } else {
            alert('Browser not supported.');
            return null;
        }
        return browser;
    }
    
    
    //This Function will load the xml file if browser is IE
    function AA() {
        XML_DOM = new ActiveXObject('Microsoft.XMLDOM')
        XML_DOM.async = false;
        XML_DOM.load(URX);
        xmlDoc = XML_DOM;
    }
    //This Function will load the xml file if browser is Safari
    function AB() {
        XML_HTTP = new window.XMLHttpRequest();
        XML_HTTP.open('GET', URX, false);
        XML_HTTP.send(null);
        xmlDoc = XML_HTTP.responseXML;
    }
    //This Function will load the xml file if browser is not Safari and IE
    function AC() {
        
        XML_DOM = document.implementation.createDocument('', '', null)
        XML_DOM.async = true;
        XML_DOM.load(URX);
        xmlDoc = XML_DOM;
    }
    // if browser is IE, then it call the AA() Function
    if (window.ActiveXObject)
    AA();
    // if browser is Safari, then it call the AB() Function
    else if (window.XMLHttpRequest)
    AB();
    // if browser is  not Safari and IE, then it call the AB() Function
    else if (document.implementation && document.implementation.createDocument)
    AC();
    // if those functions above is not regconized, then it will throw a error.
    else
    alert('XML not supported.')
    
    // tagNameElement Function uses to get all tag names by given the specific tag name for both IE and Safari
    this.tagNameElement = function (name, root) {
        var rootElem = root ? root: xmlDoc;
        
        var nodes = rootElem.getElementsByTagName(name).length > 0 ? rootElem.getElementsByTagName(name): tagNameElementSafari(rootElem, name);
        
        return nodes;
    }
}
// end class load_XML

// tagNameElement Function uses to get all tag names by given the specific tag name only for Safari browser
function tagNameElementSafari(rootElem, tagName) {
    var R =[];
    for (var w = 0, z = rootElem.childNodes.length; w < z; w++)
    if (rootElem.childNodes[w].nodeName == tagName)
    R.push(rootElem.childNodes[w]);
    
    return R
}
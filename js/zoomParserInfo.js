// Copyright (c) 2012 Thomas Tran
// Date: 06/06/2012

var xmlZoom = new Object();
var zoomRegionNames = new Array();
var zoomRegionIndex = 0;
var zoomInstructionOKClick = false;
var setTimeoutSliceShowRegionOn;
var setTimeoutSliceShowRegionOff;
var cancelSliceShowRegion = false;
var zoomliceShowOn;

function loadZoom_HTML5() {
    if (document.getElementById('initZoomHTML5')) {
        if (zoomRegionSelected != "")
        document.getElementById(zoomRegionSelected + "_Div").style.display = "none";
        document.getElementById("zoomTextDisplayRegionDiv").style.display = "none";
        document.getElementById('HTML5').appendChild(document.getElementById('initZoomHTML5'));
        document.getElementById('initZoomHTML5').style.display = "block";
        document.getElementById('zoomInstructions').style.display = "none";
        sliceZoomShowRegionOn();
    } else {
    var initZoomHTML5 = ce('div');
        initZoomHTML5.id = "initZoomHTML5";
        document.getElementById('HTML5').appendChild(initZoomHTML5);
        initloadZoom_HTML5();
        document.getElementById('initZoomHTML5').style.display = "block";
        document.getElementById('zoomInstructions').style.display = "none";
        sliceZoomShowRegionOn();
    }
}

function initloadZoom_HTML5() {
zoomXML_Parser();
    initLoadingZoom();
    zoomMapsXMLParse();
    var idNameTemp = zoomRegionNames[zoomRegionIndex] + "_Div";
    document.getElementById(idNameTemp).style.display = 'block';
    sliceZoomShowRegionOn();
}

function sliceZoomShowRegionOn() {
    if (! cancelSliceShowRegion) {
        zoomliceShowOn = true;
        if (zoomRegionIndex < zoomRegionNames.length) {
            var idNameTemp = zoomRegionNames[zoomRegionIndex] + "_Div";
            document.getElementById(idNameTemp).style.display = 'block';
            zoomRegionIndex = zoomRegionIndex + 1;
            if (zoomRegionIndex < zoomRegionNames.length) {
                var idNameTemp = zoomRegionNames[zoomRegionIndex] + "_Div";
                document.getElementById(idNameTemp).style.display = 'block';
            }
            if (zoomRegionIndex > 1)
            setTimeoutSliceShowRegionOn = setTimeout('sliceZoomShowRegionOff()', 1000);
        } else {
            setTimeoutSliceShowRegionOff = setTimeout('sliceZoomShowRegionOffEnd()', 1000);
        }
    } else
    clearTimeout(setTimeoutSliceShowRegionOn);
}

function sliceZoomShowRegionOff() {
    var idNameTemp = zoomRegionNames[zoomRegionIndex -2] + "_Div";
    document.getElementById(idNameTemp).style.display = 'none';
    sliceZoomShowRegionOn();
}

function sliceZoomShowRegionOffEnd() {
    var idNameTemp = zoomRegionNames[zoomRegionIndex -1] + "_Div";
    document.getElementById(idNameTemp).style.display = 'none';
    if (zoomRegionIndex < zoomRegionNames.length) {
        var idNameTemp = zoomRegionNames[zoomRegionIndex] + "_Div";
        document.getElementById(idNameTemp).style.display = 'none';
    }
    zoomWelcomeIntruction();
}

function initLoadingZoom() {
    var zoomHTML5 = ce('div');
    zoomHTML5.id = "zoomHTML5";
    var zoomTitleDiv = document.createElement("div");
    zoomTitleDiv.id = "zoomTitleDiv";
    // build title and subtitle
    //				 zoomTitleDiv.innerHTML = xmlZoom.subtitle;
    zoomTitleDiv.innerHTML = "<div class=mainTitle>" + xmlZoom.title + " | </div> <div id=zoomSubHeader>Zoom</div>";
    zoomHTML5.appendChild(zoomTitleDiv);
    //instruction block
    var zoomInstrDiv = document.createElement("div");
    zoomInstrDiv.id = "zoomInstrDiv";
    zoomInstrDiv.innerHTML = xmlZoom.instructions.title;
    zoomInstrDiv.onmouseover = function () {
        this.style.cursor = "pointer";
        this.style.color = "#F00000";
    }
    zoomInstrDiv.onmouseout = function () {
        this.style.color = "#EFEFEF";
    }
    zoomInstrDiv.onclick = function () {
        zoomWelcomeIntruction();
    }
    zoomHTML5.appendChild(zoomInstrDiv);
    var zoomDisplayInfo = document.createElement("div");
    zoomDisplayInfo.id = "zoomDisplayInfo";
    zoomHTML5.appendChild(zoomDisplayInfo);
    var zoomInstructions = document.createElement("div");
    zoomInstructions.id = "zoomInstructions";
    zoomHTML5.appendChild(zoomInstructions);
    document.getElementById('initZoomHTML5').appendChild(zoomHTML5);
}

function zoomXML_Parser() {
    var file = "xml/co_" + projCode + "_zoomHTML5.xml"
    var xmlObj = new load_XML(file);
    // function in XML_Loader_class.js
    var objElements = xmlObj.tagNameElement("xmlData");
    xmlZoom.title = objElements[0].getAttribute('title');
    xmlZoom.subtitle = "<div class=mainTitle>" + xmlZoom.title + " | </div> <div id=zoomSubHeader>Zoom</div>";
    var instrObj = new Object();
    objElements = xmlObj.tagNameElement("instructions");
    instrObj.title = objElements[0].getAttribute('title');
    instrObj.content = "TEST: Navigate the buttons below to learn about Angola's geographic location.";
    xmlZoom.instructions = instrObj;
    instrObj = new Object();
    objElements = xmlObj.tagNameElement("background");
    xmlZoom.background = instrObj;
    instrObj = new Object();
    objElements = xmlObj.tagNameElement("timeline");
    var textBoxObj = new Object();
    textBoxObj.textBoxAlign = objElements[0].getAttribute('textBoxAlign');
    textBoxObj.textBoxWidth = objElements[0].getAttribute('textBoxWidth');
    xmlZoom.button = instrObj;
    xmlZoom.textBox = textBoxObj;
    var eventArray = new Array();
    var eventXMLObj = xmlObj.tagNameElement("event");
    xmlZoom.totalEvents = eventXMLObj.length;
    for (var i = 0; i < eventXMLObj.length; i++) {
        var obj = new Object();
        obj.totalEvents = eventXMLObj.length;
        obj.title = eventXMLObj[i].getAttribute('title');
        obj.graphic = eventXMLObj[i].getAttribute('graphic');
        obj.buttonName = eventXMLObj[i].getAttribute('buttonName');
        obj.buttonWidth = eventXMLObj[i].getAttribute('buttonWidth');
        var xmlEventContentObj = xmlObj.tagNameElement("content", eventXMLObj[i]);
        obj.textBoxX = xmlEventContentObj[0].getAttribute('textBoxX');
        obj.textBoxY = xmlEventContentObj[0].getAttribute('textBoxY');
        obj.content = xmlEventContentObj[0];
        var name = obj.title;
        name = name.split(",");
        name = $.trim(name[0]).replace(/[" "]/g, "_");
        obj.mapID = name;
        zoomRegionNames[i] = name;
        eventArray[name] = obj;
    }
    xmlZoom.timeline = eventArray;
}

function ce(name) {
    var dn = document.createElement(name);
    return dn;
}

function ctn(from) {
    var tn = document.createTextNode(from);
    return tn;
}

function parseInlineNodes(xmlNode) {
    var inlPart = ce('span');
    for (var i = 0; i < xmlNode.childNodes.length; i++) {
        var hPart;
        var xPart = xmlNode.childNodes[i];
        if (xPart.nodeName == '#text') {
            hPart = ce('span');
            hPart.appendChild(ctn(xPart.data));
        } else {
            hPart = ce(xPart.nodeName);
            //html tags (b, u, i etc.)
            if (xPart.firstChild)
            hPart.appendChild(ctn(xPart.firstChild.data));
        }
        inlPart.appendChild(hPart);
    }
    return inlPart;
}

function zoomWelcomeIntruction() {
    document.getElementById('zoomHTML5').style.opacity = 0.8;
    document.getElementById('zoomInstructions').innerHTML = "";
    document.getElementById('zoomInstructions').style.display = "block";
    var string = '<div class="zoomInstrTitle">Instructions</div><div id="zoomInstrCloseX">X</div><div id="zoomInstrContent"></div>';
    document.getElementById('zoomInstructions').innerHTML = string;
    if (isMobile())
    document.getElementById('zoomInstrContent').innerHTML = "Touch a date to highlight the corresponding zoom for that era.<br/><br/>Touch the date a second time for a historical narrative associated with the era."; else
    document.getElementById('zoomInstrContent').innerHTML = "Navigate the buttons below to learn about " + xmlZoom.title + "'s geographic location.";
    document.getElementById('zoomInstrCloseX').onmouseover = function () {
        this.style.cursor = "pointer";
        this.style.color = "#F00000";
    }
    document.getElementById('zoomInstrCloseX').onmouseout = function () {
        this.style.color = "#000000";
    }
    document.getElementById('zoomInstrCloseX').onclick = function () {
        zoomInstructionOKClick = true;
        document.getElementById('zoomHTML5').style.opacity = 1;
        document.getElementById('zoomInstructions').style.display = "none";
    }
}

function isMobile() {
    var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
    if (mobile)
    return true; else
    return false;
}
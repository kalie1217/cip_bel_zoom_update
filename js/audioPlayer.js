function newSoundPlay(e) {
    var a = "audio/" + e, i = document.getElementsByTagName("audio")[0];
    if (i || null != i) {
        var n = i.canPlayType("audio/mpeg"), t = i.canPlayType("audio/mp3");
        "maybe" == n || "probably" == n || "maybe" == t || "probably" == t ?(i.src = a, i.load(), i.play()): quickTime ? QT_Init(a): Win_Init(a)
    } else {
        var i = document.createElement("audio"), n = i.canPlayType("audio/mpeg"), t = i.canPlayType("audio/mp3");
        "maybe" == n || "probably" == n || "maybe" == t || "probably" == t ?(i.src = a, i.load(), i.play()): quickTime ? QT_Init(a): Win_Init(a)
    }
}
function xid(e) {
    return window.document.getElementById(e)
}
function QT_Init(e) {
    var a = document.getElementById("mp3AudioPlayer");
    a.innerHTML = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" width="1" height="1" id="sound" style="position:absolute;left:-1000px;top:-1000px" codebase="http://www.apple.com/qtactivex/qtplugin.cab"><param name="SRC" value="' + e + '"><param name="AUTOPLAY" value="true"><param name="CONTROLLER" value="false"><param name="VOLUME" value="100"><param name="ENABLEJAVASCRIPT" value="true"><param name="TYPE" value="audio/mpeg"><embed classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" name="sound" id="sound" src="' + e + '" pluginspage="http://www.apple.com/quicktime/download/" volume="100" enablejavascript="true" type="audio/mpeg" height="16" width="200" autostart="true"> </embed></object>'
}
function Win_Init(e) {
    var a = document.getElementById("mp3AudioPlayer");
    a.innerHTML = '<object id="sound" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701" standby="Loading Microsoft® Windows® Media Player components..." type="application/x-oleobject" width="1" height="1"><param name="url" value="' + e + '"><param name="volume" value="100"><embed id="sound" type="application/x-mplayer2" src="' + e + '" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" type="application/x-mplayer2" url="' + e + '" volume="100" width="1" height="1"></embed></object>'
}
function QT_Installed() {
    var e = ! 1;
    if (navigator.plugins && navigator.plugins.length) for (var a = 0; a < navigator.plugins.length; a++) navigator.plugins[a].name.indexOf("QuickTime") > -1 &&(e = ! 0); else {
        var i = ! 1;
        "MSIE" == detect_browser() && execScript('on error resume next: obj=IsObject(CreateObject("QuickTimeCheckObject.QuickTimeCheck.1"))', "VBScript"), e = i ? ! 0: ! 1
    }
    return e
}
function initLoad(e) {
    quickTime = QT_Installed();
    var a = xid("mp3AudioPlayer"), i = document.createElement("audio");
    if (a.appendChild(i), i = document.getElementsByTagName("audio")[0], document.createElement("audio").canPlayType) {
        var n = i.canPlayType("audio/mpeg"), t = i.canPlayType("audio/mp3");
        "maybe" == n || "probably" == n || "maybe" == t || "probably" == t ?(i.src = e, i.load(), i.play()): quickTime ? QT_Init(e): Win_Init(e)
    } else quickTime ? QT_Init(e): Win_Init(e)
}
function detect_browser() {
    var e = navigator.userAgent;
    return -1 != e.indexOf("Opera") ? e = "Opera": -1 != e.indexOf("Firefox") ? e = "Firefox": -1 != e.indexOf("MSIE") ? e = "MSIE": -1 != e.indexOf("Netscape") ? e = "Netscape": -1 != e.indexOf("Safari") &&(e = "Safari"), e
}
var quickTime;
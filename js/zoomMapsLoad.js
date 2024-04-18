var zoomRegionSelected = "";
var zoomMouseEventMobile = new Object();
var totalWidthButtons = 0;
function zoomMapsXMLParse() {
    $(function () {
        var eventArray = xmlZoom.timeline;
        var numBtn = 0;
        var zoomBackGroundDiv = document.createElement("div");
        zoomBackGroundDiv.id = "zoomBackGroundDiv";
        document.getElementById('zoomDisplayInfo').appendChild(zoomBackGroundDiv);
        var zoomTextDisplayRegionDiv = document.createElement("div");
        zoomTextDisplayRegionDiv.id = "zoomTextDisplayRegionDiv";
        zoomTextDisplayRegionDiv.style.display = "none";
        document.getElementById('zoomDisplayInfo').appendChild(zoomTextDisplayRegionDiv);
        for (var reg in eventArray) {
            zoomDiv = document.createElement("div");
            zoomDiv.id = reg + "_Div";
            zoomDiv.className = "zoomMaps";
            document.getElementById('zoomDisplayInfo').appendChild(zoomDiv);
        }
        var zInd = 5;
        var zoomTextBGDiv = document.createElement("div");
        zoomTextBGDiv.id = "zoomTextBGDiv";
        zoomTextBGDiv.className = "zoomMaps";
        zoomTextBGDiv.style.zIndex = 200;
        document.getElementById('zoomDisplayInfo').appendChild(zoomTextBGDiv);
        var zoomOutSideButtonDiv = document.createElement("div");
        zoomOutSideButtonDiv.id = "zoomOutSideButtonDiv";
        zoomOutSideButtonDiv.style.zIndex = 200;
        document.getElementById('zoomDisplayInfo').appendChild(zoomOutSideButtonDiv);
        var zoomWidth = 624;
        var zoomBtnWidth = Math.round(zoomWidth / parseFloat(xmlZoom.totalEvents));
        for (var reg in eventArray) {
            var zoomDivObj = document.getElementById(reg + "_Div");
            zoomDivObj.style.display = "none";
            zoomDivObj.style.zIndex = zInd;
            zInd = zInd + 5;
            var graphics = eventArray[reg].graphic.split(",");
            // placed graphics
            for (var i = 0; i < graphics.length; i++) {
                var zoomImg = document.createElement("img")
                zoomImg.setAttribute('src', $.trim(graphics[i]));
                if (i == 4) {
                    zoomImg.setAttribute('src', 'images/zoom/' + $.trim(graphics[i]));
                }
                var zoomDiv = document.createElement("div");
                zoomDiv.appendChild(zoomImg);
                zoomDivObj.appendChild(zoomDiv);
                zoomDiv.style.height = parseFloat(zoomDiv.offsetHeight) + 'px';
                zoomDiv.style.width = parseFloat(zoomDiv.offsetWidth) + 'px';
                zoomDiv.className = "zoomGraphics";
                zoomDiv.style.left = "0px";
                zoomDiv.style.top = "0px";
            }
            numBtn++;
            var zoomDiv = document.createElement("div");
            zoomOutSideButtonDiv.appendChild(zoomDiv);
            zoomDiv.id = reg;
            zoomDiv.innerHTML = eventArray[reg].buttonName;
            if (numBtn == zoomRegionNames.length)
            zoomDiv.className = "zoomButtonsName zoomButtonsNameEnd"; else
            zoomDiv.className = "zoomButtonsName";
            if (parseFloat(zoomDiv.offsetWidth) > zoomBtnWidth) {
                if (numBtn == zoomRegionNames.length) {
                    zoomDiv.style.width = (zoomBtnWidth -2) + "px";
                    totalWidthButtons += (zoomBtnWidth);
                    if (totalWidthButtons > 625) {
                        zoomDiv.style.width = (parseFloat(zoomDiv.style.width) -(totalWidthButtons -625)) + "px";
                        totalWidthButtons = 625;
                    }
                } else {
                    zoomWidth = zoomWidth - (parseFloat(zoomDiv.offsetWidth) + 3);
                    zoomBtnWidth = Math.round(zoomWidth /(parseFloat(xmlzoom.totalEvents) - numBtn));
                    zoomDiv.style.width = (parseFloat(zoomDiv.offsetWidth) + 3) + "px";
                    totalWidthButtons += (parseFloat(zoomDiv.offsetWidth) + 4);
                }
            } else {
                if (numBtn < zoomRegionNames.length) {
                    zoomDiv.style.width = (zoomBtnWidth -1) + "px";
                    totalWidthButtons += zoomBtnWidth;
                } else {
                    zoomDiv.style.width = (zoomBtnWidth -2) + "px";
                    totalWidthButtons += (zoomBtnWidth);
                    if (totalWidthButtons > 625) {
                        zoomDiv.style.width = (parseFloat(zoomDiv.style.width) -(totalWidthButtons -625)) + "px";
                        totalWidthButtons = 625;
                    }
                }
                zoomWidth = zoomWidth - zoomBtnWidth;
            }
            zoomDiv.style.height = zoomDiv.offsetHeight + "px";
            zoomDivObj.style.display = "none";
            zoomDiv.style.paddingTop = "2px";
            zoomDiv.style.paddingBottom = "2px";
            zoomDiv.onclick = function () {
                if (zoomliceShowOn) {
                    clearTimeout(setTimeoutSliceShowRegionOn);
                    clearTimeout(setTimeoutSliceShowRegionOff);
                    for (var reg in eventArray) {
                        var idName = reg + "_Div";
                        document.getElementById(idName).style.display = "none";
                    }
                    cancelSliceShowRegion = true;
                    zoomliceShowOn = false;
                }
                zoomInstructionOKClick = true;
                document.getElementById('zoomInstructions').style.display = "none";
                document.getElementById('zoomHTML5').style.opacity = 1;
                if (isMobile()) {
                    if ((zoomMouseEventMobile.targeName && zoomMouseEventMobile.targeName != 'null') && (zoomMouseEventMobile.targeName == this.id)) {
                        zoomMouseEventMobile.targeName = this.id;
                        zoomMouseEventMobile.mouseOver += 1;
                    } else {
                        zoomMouseEventMobile.targeName = this.id;
                        zoomMouseEventMobile.mouseOver = 1;
                    }
                }
                if ((! isMobile()) || ((zoomMouseEventMobile.mouseOver) && (zoomMouseEventMobile.mouseOver != 'null') && (zoomMouseEventMobile.mouseOver > 1))) {
                    var eventArray = xmlZoom.timeline;
                    var st = eventArray[ this.id].title.replace("Year", "");
                    st = st.replace("Colon", ":");
                    document.getElementById("zoomSubHeader").innerHTML = st;
                    document.getElementById("zoomTextDisplayRegionDiv").innerHTML = "";
                    var zoomTextObj = document.createElement("div");
                    zoomTextObj.className = "zoomTextDisplayContent";
                    zoomTextObj.style.width = xmlZoom.textBox.textBoxWidth + "px";
                    zoomTextObj.appendChild(parseInlineNodes(eventArray[ this.id].content));
                    document.getElementById("zoomTextDisplayRegionDiv").appendChild(zoomTextObj);
                    document.getElementById("zoomTextDisplayRegionDiv").style.display = "block";
                    document.getElementById("zoomTextDisplayRegionDiv").style.width = xmlZoom.textBox.textBoxWidth + "px";
                    document.getElementById("zoomTextDisplayRegionDiv").style.height = zoomTextObj.offsetHeight + "px";
                    if (xmlZoom.textBox.textBoxAlign.toLowerCase() == "topright") {
                        document.getElementById("zoomTextDisplayRegionDiv").style.left =(624 -(parseFloat(document.getElementById("zoomTextDisplayRegionDiv").style.width) + 11)) + "px";
                        document.getElementById("zoomTextDisplayRegionDiv").style.top = "0px";
                    } else if (xmlZoom.textBox.textBoxAlign.toLowerCase() == "bottomleft") {
                        document.getElementById("zoomTextDisplayRegionDiv").style.left = "0px";
                        document.getElementById("zoomTextDisplayRegionDiv").style.top =(340 -(parseFloat(document.getElementById("zoomTextDisplayRegionDiv").style.height) + parseFloat(this.style.height) + 16)) + "px";
                    } else if (xmlZoom.textBox.textBoxAlign.toLowerCase() == "bottomright") {
                        document.getElementById("zoomTextDisplayRegionDiv").style.left =(624 -(parseFloat(document.getElementById("zoomTextDisplayRegionDiv").style.width) + 11)) + "px";
                        document.getElementById("zoomTextDisplayRegionDiv").style.top =(340 -(parseFloat(document.getElementById("zoomTextDisplayRegionDiv").style.height) + parseFloat(this.style.height) + 16)) + "px";
                    } else {
                        document.getElementById("zoomTextDisplayRegionDiv").style.left = "0px";
                        document.getElementById("zoomTextDisplayRegionDiv").style.top = "0px";
                    }
                    var idName = this.id + "_Div";
                    document.getElementById(idName).style.display = "block";
                    if (zoomRegionSelected != "" && (zoomRegionSelected != this.id)) {
                        document.getElementById(zoomRegionSelected + "_Div").style.display = "none";
                    }
                    zoomRegionSelected = this.id;
                }
            }
        }
        zoomOutSideButtonDiv.style.width = totalWidthButtons + "px";
        zoomOutSideButtonDiv.style.height = parseFloat(zoomOutSideButtonDiv.offsetHeight) + "px";
        zoomOutSideButtonDiv.style.top = (340 - parseFloat(zoomOutSideButtonDiv.offsetHeight)) + "px";
        zoomOutSideButtonDiv.style.zIndex = 999;
    });
    //end jquery
}
//end zoomMapsXMLParse()
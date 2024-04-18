var totalLessonPage;
var index = 1;
var toggleParagragh;
var contentHeight;
function XmlContent() {
    var lessonNumber;
    var xLoader_obj;
    var display_obj;
    var note_obj;
    var scorm_obj;
    var xLoader_ob;
    var display_ob;
    var note_ob;
    var scorm_ob;
    var chapTitle;
    var chapIndex = 0;
    var pgIndex = -1;
    var pageTotals;
    //array of page totals for each chapter
    var pageTotal;
    var doc = document;
    var chapNumber;
    var xmlFeed;
    var _pageDiv;
    var pages = new Array();
    var sections = new Array();
    //first page of each section in chapter
    var _this = this;
    var _fNoteCnt = new Number();
    
    //----
    this.init = function () {
        pageTotals = window.pageTotals;
        scorm_obj = window.scorm ? window.scorm_obj: null;
        display_obj = window.display_obj;
        note_obj = window.note_obj;
        xLoader_obj = window.xLoader_obj;
        
        //---- ADD AUDIO PLAYER
        var fTag = new FlashTag('swf/audioPlayer.swf', 200, 20, 'ffffff');
        fTag.setFlashvars('lcId=' + uid);
        getElemID('fap_container').innerHTML = fTag.toString();
        
        var initChap = parseInt(scorm_obj.getXmlChapIndex());
        //initChap = 'welcome';
        _this.initChapter(initChap, 0);
        footnoteOpenId = "";
    }
    
    this.initChapter = function (chap, page) {
        lessonNumber = 0;
        chapNumber = 0;
        var nodes;
        pgIndex = -1;
        if (chapIndex != chap) {
            chapIndex = chap;
            xLoader_obj = new load_XML('xml/co_' + projCode + '_chap_' + chapIndex + '.xml');
            var nodes = xLoader_obj.tagNameElement("fam:chapter", nodes);
            chapTitle = nodes[0].getAttribute('title');
            pages = xLoader_obj.tagNameElement('fam:page', nodes[0]);
            if (scorm_obj) {
                scorm_obj.onInitXML();
            }
            buildDropDown(pages);
            display_obj.displayChapNav(chap);
            // show intra chapter nav unless welcome page
            _this.loadPage(page);
        } else {
            xLoader_obj = new load_XML('xml/co_' + projCode + '_chap_' + chapIndex + '.xml');
            var nodes = xLoader_obj.tagNameElement("fam:chapter", nodes);
            chapTitle = nodes[0].getAttribute('title');
            pages = xLoader_obj.tagNameElement('fam:page', nodes[0]);
            buildDropDown(pages);
            display_obj.displayChapNav(chap);
            _this.loadPage(page);
        }
        
        
        if (version != 'scorm' && chap == 1 && ! $('.welcome').hasClass('seenIt')) {
            $.ajax({
                type: "GET",
                url: 'xml/co_' + projCode + '_chap_welcome.xml',
                dataType: "xml",
                success: function (xml) {
                    loadWelcome(xml);
                }
            });
            
            function loadWelcome(xml) {
                var welcomeImgObj = xml.getElementsByTagName('paragraph')[0];
                if (! welcomeImgObj || welcomeImgObj == null) {
                    welcomeImgObj = xml.getElementsByTagName('fam:paragraph');
                }
                var wImgPath = $(welcomeImgObj).attr('imgPath');
                var wImgAlt = $(welcomeImgObj).attr('alt');
                var wImgCopy = $(welcomeImgObj).attr('copyright');
                
                var welcomeContent = '<h1 style="color: #' + languageColor + '">' + projTitle + '</h1><span><img alt="' + wImgAlt + '" src="' + wImgPath + '" /><div class="welcomeCopy">' + wImgCopy + '</div><div class="enterSite">Enter Site</div></span>';
                $('.welcome').show();
                $('.welcome').append(welcomeContent);
                $('#div_content').hide();
                $('.welcome').addClass('seenIt');
                $('.welcome span').hover(function () {
                    $('.enterSite').css({
                        'background': '#' + languageColor,
                        'box-shadow': '0 2px 2px rgba(0, 0, 0, 0.5)'
                    });
                },
                function () {
                    $('.enterSite').css({
                        'background': 'none',
                        'box-shadow': 'none'
                    });
                });
                $('.welcome span').click(function () {
                    closeWelcome();
                });
            }
        }
    }
    
    this.lessonChapter = function (chap, page) {
        var nodes;
        pgIndex = -1;
        var tempt = chap.split('_');
        chapNumber = tempt[1];
        lessonNumber = tempt[3];
        xLoader_obj1 = new load_XML('xml/co_' + projCode + '_' + chap + '.xml');
        var nodes = xLoader_obj.tagNameElement("fam:chapter", nodes);
        chapTitle = nodes[0].getAttribute('title');
        pages = xLoader_obj.tagNameElement('fam:page', nodes[0]);
        totalLessonPage = pages.length;
        if (scorm_obj) {
            scorm_obj.onInitXML();
        }
        buildDropDown(pages);
        _this.loadPage(page);
    }
    
    this.loadPage = function (direct, infer) {
        toggleParagragh = false;
        var ok = getNewPageIndex(direct, infer);
        if (ok) {
            var page = pages[pgIndex].childNodes;
            _pageDiv = ce('div');
            _fNoteCnt = 0;
            note_obj.resetNotes();
            for (var i = 0; i < page.length; i++) {
                var xmlNode = page[i];
                if (xmlNode.nodeName != '#text') {
                    var htmlNode = ce('div');
                    var htmlResult;
                    htmlNode.className = removePrefix(xmlNode.nodeName);
                    switch (xmlNode.nodeName) {
                        case 'fam:title':
                        htmlResult = parseTitleNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:subtitle':
                        htmlResult = parseTitleNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:subhead':
                        htmlResult = parseTitleNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:paragraph':
                        htmlResult = parseParagraphNode(xmlNode);
                        htmlNode.appendChild(htmlResult.img);
                        htmlNode.appendChild(htmlResult.pg);
                        break;
                        case 'fam:flash':
                        htmlResult = parseFlashNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:html5':
                        htmlResult = parseHTML5Node(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:video':
                        htmlResult = parseVideoNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:exchange':
                        htmlResult = parseExchangeNode(xmlNode);
                        $(htmlNode).append(htmlResult);
                        break;
                        case 'fam:table':
                        htmlResult = parseTableNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:ul':
                        htmlResult = parseBulletNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:blockquote':
                        htmlResult = parseBlockquoteNode(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                        case 'fam:assessment':
                        htmlResult = parseAssessment(xmlNode);
                        htmlNode.appendChild(htmlResult);
                        break;
                    }
                    _pageDiv.appendChild(htmlNode);
                }
            }
            //---- ADD PROXY CONTAINER
            var pc = ce('div');
            pc.setAttribute('id', 'proxy_container');
            _pageDiv.appendChild(pc);
            
            display_obj.display(_pageDiv, pgIndex);
            
            //---- PREVIOUS CHAPTER
        } else if (infer == -1 && chapIndex > 1) {
            if (pgIndex == 0) {
                _this.initChapter(chapIndex -1, pageTotals[chapIndex -2] -1);
            } else {
                _this.initChapter(chapIndex -1, pageTotals[chapIndex -2]);
            }
            //---- NEXT CHAPTER
        } else if (infer == 1 && chapIndex < pageTotals.length) {
            _this.initChapter(chapIndex + 1, 0);
        }
        if ($(htmlResult).attr('id') != "assess_container") {
            if ($('.title p span').text().indexOf('Further Reading') < 0) {
                if ($('.title p span').text() === "Introduction") {
                    $('#div_content hr').before('<div class="clear"></div><div class="nextPage">Next Page<span>&rarr;</span></div>');
                } else {
                    $('#div_content hr').before('<div class="clear"></div><div class="prevPage"><span>&larr;</span>Prev Page</div><div class="nextPage">Next Page<span>&rarr;</span></div>');
                }
            }
        }
        
        $('.nextPage').click(function () {
            $('#feedback').hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            if ((xc_obj.getPageIndex() + 1) == pageTotals[xc_obj.getChapIndex() -1]) {
                xc_obj.initChapter(xc_obj.getChapIndex() + 1, 0);
            } else {
                xc_obj.loadPage(false, 1);
            }
            window.scrollTo(0, 0);
        });
        
        $('.prevPage').click(function () {
            $('#feedback').hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            xc_obj.loadPage(false, -1);
            window.scrollTo(0, 0);
        });
        
        $('.langColor, #subNavTop').css('background', '#' + languageColor);
    }
    
    this.getPageIndex = function () {
        return pgIndex;
    }
    this.getLessonNumber = function () {
        return lessonNumber;
    }
    this.getChapterNumber = function () {
        return chapNumber;
    }
    this.getChapIndex = function () {
        return chapIndex;
    }
    this.getSections = function () {
        return sections;
    }
    this.getChapTitle = function () {
        if (chapTitle === "Resources") {
            $('#div_content').addClass('furtherReading');
        } else {
            $('#div_content').removeClass('furtherReading');
        }
        return chapTitle;
    }
    
    function parseTitleNode(xmlNode) {
        var hPart = parseInlineNodes(xmlNode);
        if (xmlNode.getAttribute('no_clear')) {
            hPart.className = 'no_clear';
        } else {
            //hPart.className = 'clear';
            if ($(xmlNode).text() == 'Further Reading') {
                $('#div_content').addClass('furtherReading');
            }
        }
        return hPart;
    }
    
    function parseParagraphNode(xmlNode) {
        toggleParagragh = true;
        var pgObj = new Object();
        //---- ADD IMAGE
        var ip = xmlNode.getAttribute('imgPath');
        var cssClass = xmlNode.getAttribute('class');
        var ia = xmlNode.getAttribute('imgAlign');
        var alt = xmlNode.getAttribute('alt') ? xmlNode.getAttribute('alt'): '';
        copyright
        var copyright = xmlNode.getAttribute('copyright') ? xmlNode.getAttribute('copyright'): '';
        
        if (copyright.toLowerCase().indexOf("©") === 0) {
            copyright = "credit: " + copyright.substr(1);
        }
        
        var ioc = xmlNode.getAttribute('imgOnClick') ? xmlNode.getAttribute('imgOnClick'): null;
        
        if (ip || ip != null) {
            var ipExt = ip.substr(ip.length -4);
        }
        var imgHold = ce('div');
        
        if (ip && (ip.toLowerCase().indexOf("welcome") < 0)) {
            var copyrightDiv = ce('div');
            copyrightDiv.className = 'copyright';
            $(copyrightDiv).html(alt + "<br>" + copyright);
            $('.floatRight').append(copyrightDiv);
        }
        
        if (ipExt == '.jpg' | ipExt == '.gif' | ipExt == '.png') {
            var imgEl = ce('img');
            imgEl.setAttribute('src', ip);
            imgEl.setAttribute('alt', alt);
            imgEl.setAttribute('title', alt);
            if (ioc) {
                imgEl.onclick = function () {
                    eval(ioc);
                };
                imgEl.className = 'button';
            } else {
                $(imgEl).addClass('smallImage');
                if (cssClass == 'flipped') {
                    $(imgEl).addClass('flipped');
                }
                imgEl.onerror = function () {
                    $(this).replaceWith('<div class="brokeImg"></div>');
                }
                imgEl.onload = function () {
                    if (this.width < this.height) {
                        $('.smallImage, .copyright').addClass('portrait');
                    }
                }
                
                //no longer supporting image align - MR
                switch (ia) {
                    case 'center':
                    imgHold.className = 'floatRight';
                    break;
                    case 'left':
                    imgHold.className = 'floatRight';
                    break;
                    default:
                    imgHold.className = 'floatRight';
                    break;
                }
                
                var zoomImg = ce('div');
                zoomImg.className = 'zoomImg';
                imgHold.appendChild(zoomImg);
                zoomImg.appendChild(imgEl);
                var zoomIcon = ce('div');
                zoomIcon.className = "zoomIcon";
                zoomImg.appendChild(zoomIcon);
                if (ip && (ip.toLowerCase().indexOf("welcome") < 0)) {
                    imgHold.appendChild(copyrightDiv);
                }
                pgObj.img = imgHold;
                zoomImg.onclick = function () {
                    var thisImg = $(this).children('.smallImage').attr('src');
                    var thisFlipped = $(this).children('.flipped');
                    showBigImage(thisImg, alt, copyright, thisFlipped);
                };
            }
        }
        
        //---- PARSE PARAGRAPH NODES
        var hPart = parseInlineNodes(xmlNode);
        if (cssClass || cssClass != null) {
            var divHold = ce('div');
            divHold.appendChild(hPart);
            if (cssClass != 'flipped') {
                divHold.className = cssClass;
            }
        } else {
            var divHold = ce('div');
            divHold.appendChild(hPart);
            divHold.className = "paragraphContent";
        }
        pgObj = {
            img: imgHold, pg: divHold
        };
        return pgObj;
    }
    //end parseParagraphNode
    
    function parseHTML5Node(xmlNode) {
        var html5;
        if (xmlNode.getAttribute('isFlashAvailable') == "true") {
            if (DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision)) {
                html5 = parseFlashNode(xmlNode);
            } else {
                if (! document.getElementById("HTML5")) {
                    html5 = ce('div');
                    html5.id = "HTML5";
                } else {
                    html5 = document.getElementById("HTML5");
                }
                html5ProjectName = xmlNode.getAttribute('name');
            }
        } else {
            if (! document.getElementById("HTML5")) {
                html5 = ce('div');
                html5.id = "HTML5";
            } else {
                html5 = document.getElementById("HTML5");
            }
            html5ProjectName = xmlNode.getAttribute('name');
        }
        return html5;
    }
    
    function parseVideoNode(xmlNode) {
        if (xmlNode.getAttribute('isFlashAvailable') == "true") {
            if (DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision)) {
                xmlNode.setAttribute("src", xmlNode.getAttribute('src').replace("video", "swf"));
                xmlNode.setAttribute("src", xmlNode.getAttribute('src').replace("mp4", "swf"));
                return parseFlashNode(xmlNode);
            } else {
                var src = xmlNode.getAttribute('src');
                var video = ce('video');
                video.id = "videoPlayer";
                video.setAttribute('controls', 'controls');
                if (src != "" || src != 'null') {
                    video.setAttribute('src', src);
                }
                return video;
            }
        } else {
            var src = xmlNode.getAttribute('src');
            var video = ce('video');
            video.id = "videoPlayer";
            video.setAttribute('controls', 'controls');
            if (src != "" || src != 'null') {
                video.setAttribute('src', src);
            }
            return video;
        }
    }
    
    function parseAssessment(xmlNode) {
        var assessmentContainer = ce('div');
        var xmlPath = xmlNode.getAttribute('xmlPath')
        var certificate = xmlNode.getAttribute('certificate')
        if (certificate || certificate != null) {
            assessmentContainer.setAttribute('certificate', certificate);
        } else {
            assessmentContainer.setAttribute('certificate', 'false');
        }
        if (xmlPath || xmlPath != null) {
            assessmentContainer.setAttribute('xmlPath', xmlPath);
            assessmentContainer.id = 'assess_container';
        }
        return assessmentContainer;
    }
    
    function parseExchangeNode(xmlNode) {
        var exTable;
        
        /*Exchange tables could come in two flavors: The old format relies heavily on JavaScript regex to pull out, reorder, and reformat parts of the exchange. Not very reliable, as any deviation from the exact text pattern will break the layout. The new way uses more XML tags to delineate the parts and will not break the layout. Both ways are handled below - MR Apr 2017*/
        
        if ($(xmlNode).find('fam\\:exTitle, exTitle').text()) {
            //new way
            var exNum = $(xmlNode).find('fam\\:exNum, exNum').text();
            var exTitle = $(xmlNode).find('fam\\:exTitle, exTitle').text();
            var exCount = $(xmlNode).find('fam\\:exSpeaker, exSpeaker').length;
            
            exTable = '<table class="exchangeTable"><tr><td class="exHead" colspan="3"><a class="chap_exchange_play" id="' + exNum + '"></a>' + exTitle + '</td></tr>';
            
            for (i = 0; i < exCount; i++) {
                var speaker =[$(xmlNode).find('fam\\:exSpeaker, exSpeaker')[i]];
                var transLit =[$(xmlNode).find('fam\\:exXlit, exXlit')[i]];
                var translate =[$(xmlNode).find('fam\\:exXlate, exXlate')[i]];
                
                exTable += '<tr><td><strong>' + $(speaker).text() + '</strong></td><td>' + $(transLit).text() + '</td><td>' + $(translate).text() + '</td></tr>';
            }
            
            exTable += '</table><div class="exNum">Exchange ' + exNum + '</div>';
        } else {
            //old way
            //welcome to regex hell - this is hacky, but it is only a temporary patch until everyone gets on the new XML structure for exchanges
            
            //start by pulling out all the pieces of the exchange
            var exchangeString = $(xmlNode).text();
            exchangeString = exchangeString.replace(/(\r\n|\n|\r)/gm, "");
            var exNumber = exchangeString.match('\.*?[\:]');
            exchangeString = exchangeString.replace(exNumber, '');
            var exTitle = exchangeString.match(/.*?\.[A-Z]|.*?\?[A-Z]|.*?\![A-Z]/);
            exTitle = exTitle.toString();
            exTitle = exTitle.substring(0, exTitle.length - 1);
            exchangeString = exchangeString.replace(exTitle, '');
            //get just the exchange number
            var exNum = exNumber.toString().replace(/[^0-9]/g, '');
            //start outputting the pieces to a table, this is just the header
            exTable = '<table class="exchangeTable"><tr><td class="exHead" colspan="3"><a class="chap_exchange_play" id="' + exNum + '"></a>' + exTitle + '</td></tr>';
            
            var speaker =[];
            var transLit =[];
            var translate =[];
            var count = (exchangeString.match(/: /g) ||[]).length;
            //loop through and build the table body, supports any number of  exchanges
            for (var i = 0; i < count; i++) {
                speaker[i] = exchangeString.match('\.*?[\:]');
                exchangeString = exchangeString.replace(speaker[i], '');
                transLit[i] = exchangeString.match('\.*?\\(');
                exchangeString = exchangeString.replace(transLit[i], '');
                translate[i] = exchangeString.match('\.*?\\)');
                exchangeString = exchangeString.replace(translate[i], '');
                
                //clean up data - remove whitespace
                if (speaker[i].toString().indexOf(' ') === 0) {
                    speaker[i] = speaker[i].toString().substr(1);
                }
                if (transLit[i].toString().indexOf(' ') === 0) {
                    transLit[i] = transLit[i].toString().substr(1);
                }
                if (translate[i].toString().indexOf(' ') === 0) {
                    translate[i] = translate[i].toString().substr(1);
                }
                
                //clean up data - remove parentheses
                transLit[i] = transLit[i].toString();
                transLit[i] = transLit[i].substr(0, transLit[i].length -1);
                translate[i] = translate[i].toString();
                translate[i] = translate[i].substr(0, translate[i].length -1);
                
                //dump it into the table body
                if (speaker[i] != null && transLit[i] != null && translate[i] != null) {
                    exTable += '<tr><td><strong>' + speaker[i] + '</strong></td><td>' + transLit[i] + '</td><td>' + translate[i] + '</td></tr>';
                }
            }
            //end for loop
            
            //remove the ":" and tack on the exchange number to the end of the whole thing
            exNumber = exNumber.toString();
            exNumber = exNumber.substr(0, exNumber.length -1);
            exTable += '</table><div class="exNum">' + exNumber + '</div>';
        }
        
        return exTable;
    }
    // end parseExchangeNode
    
    function parseBlockquoteNode (xmlNode) {
        var htmlT = ce('blockquote');
        htmlT.className = 'quote';
        htmlT.appendChild(parseInlineNodes(xmlNode));
        return htmlT;
    }
    
    //do we even use this?
    function parseTableNode(xmlNode) {
        var htmlT = ce('table');
        var tBorder = xmlNode.getAttribute('border');
        var tWidth = xmlNode.getAttribute('width');
        var tHeight = xmlNode.getAttribute('height');
        var tBordercolor = xmlNode.getAttribute('bordercolor');
        var tCellpadding = xmlNode.getAttribute('cellpadding');
        var tCellspacing = xmlNode.getAttribute('cellspacing');
        var tAlign = xmlNode.getAttribute('align');
        var cssClass = xmlNode.getAttribute('class');
        
        if ((tBorder != "") && (tBorder != null)) {
            htmlT.setAttribute('border', tBorder);
        }
        if ((tWidth != "") && (tWidth != null)) {
            htmlT.setAttribute('width', tWidth);
        }
        if ((tHeight != "") && (tHeight != null)) {
            htmlT.setAttribute('height', tHeight);
        }
        if ((tBordercolor != "") && (tBordercolor != null)) {
            htmlT.setAttribute('bordercolor', tBordercolor);
        }
        if ((tCellpadding != "") && (tCellpadding != null)) {
            htmlT.setAttribute('cellpadding', tCellpadding);
        } else {
            htmlT.setAttribute('cellpadding', '0');
        }
        
        if ((tCellspacing != "") && (tCellspacing != null)) {
            htmlT.setAttribute('cellspacing', tCellspacing);
        } else {
            htmlT.setAttribute('cellspacing', '0');
        }
        if ((tAlign != "") && (tAlign != null)) {
            htmlT.setAttribute('align', tAlign);
        }
        if ((cssClass != "") && (cssClass != null)) {
            htmlT.className = cssClass;
        } else {
            htmlT.className = 'generic';
        }
        
        //var rowNodes = xLoader_obj.tagNameElement('tr', xmlNode);
        for (var j = 0; j < xmlNode.childNodes.length; j++) {
            var xmlTr = xmlNode.childNodes[j];
            var htmlTr = htmlT.insertRow(j);
            var i = 0;
            for (var k = 0; k < xmlTr.childNodes.length; k++) {
                var xmlTd = xmlTr.childNodes[k];
                if (xmlTd.nodeName == 'th') {
                    var cssClassTH = xmlTd.getAttribute('class');
                    var widthTH = xmlTd.getAttribute('width');
                    var newTH = document.createElement('th');
                    var colspanTH = xmlTd.getAttribute('colspan');
                    if ((colspanTH != "") && (colspanTH != null)) {
                        newTH.setAttribute('colspan', colspanTH);
                    }
                    //set width for td
                    if ((widthTH != "") && (widthTH != null)) {
                        newTH.setAttribute('width', widthTH);
                    }
                    //add css class for th
                    if ((cssClassTH != "") && (cssClassTH != null)) {
                        newTH.className = cssClassTH;
                    } else {
                        newTH.className = "tableHead";
                    }
                    htmlTr.appendChild(newTH);
                    newTH.appendChild(parseInlineNodes(xmlTd));
                    i++;
                }
                if (xmlTd.nodeName == 'td') {
                    var cssClassTD = xmlTd.getAttribute('class');
                    var widthTD = xmlTd.getAttribute('width');
                    var htmlTd = htmlTr.insertCell(i);
                    //set width for td
                    if ((widthTD != "") && (widthTD != null)) {
                        htmlTd.setAttribute('width', widthTD);
                    }
                    //add css class for td
                    if ((cssClassTD != "") && (cssClassTD != null)) {
                        htmlTd.className = cssClassTD;
                    } else {
                        htmlTd.className = "tableBody";
                    }
                    htmlTd.appendChild(parseInlineNodes(xmlTd));
                    i++;
                }
            }
        }
        return htmlT;
    }
    
    
    function parseBulletNode(xmlNode) {
        var temp = getBrowserName();
        if ((temp == "safari") || (temp == "firefox")) {
            var htmlUL = ce('ul');
            htmlUL.className = 'bullet';
            for (var j = 1; j < xmlNode.childNodes.length -1; j++) {
                var xml = xmlNode.childNodes[j];
                if (xml.nodeName == "li") {
                    var htmlLI = ce('li');
                    htmlUL.appendChild(htmlLI);
                    htmlLI.appendChild(parseInlineNodes(xml));
                }
            }
        } else {
            var htmlUL = ce('ul');
            htmlUL.className = 'bullet';
            for (var j = 0; j < xmlNode.childNodes.length; j++) {
                var xml = xmlNode.childNodes[j];
                var htmlLI = ce('li');
                htmlUL.appendChild(htmlLI);
                htmlLI.appendChild(parseInlineNodes(xml));
            }
        }
        return htmlUL;
    }
    
    function trim(stringToTrim) {
        return stringToTrim.replace(/^\s+|\s+$/g, "");
    }
    
    function parseInlineNodes(xmlNode) {
        var inlPart = ce('p');
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var hPart;
            var xPart = xmlNode.childNodes[i];
            if (xPart.nodeName == '#text') {
                hPart = ce('span');
                hPart.appendChild(ctn(xPart.data));
            } else if (xPart.nodeName == 'fam:footnote') {
                //---- LOAD DATA INTO NOTE_OBJ
                var fn = xPart.firstChild;
                note_obj.loadNote(fn.data);
                //---- BUILD FOOTNOTE REFERENCE LINKS
                _fNoteCnt++;
                var prevNode1 = inlPart.childNodes[Math.max(0, i -1)];
                var prevNode2 = inlPart.childNodes[Math.max(0, i -2)];
                if ((trim(prevNode1.firstChild.data) == ',') && (prevNode2.className == 'footnote')) {
                    //if last node was ',' and 2nd to last has 'footnote' class name
                    prevNode1.className = "footnoteComma";
                    //removePrefix(xPart.nodeName); //set comma's node class to 'footnote';
                }
                hPart = ce('span');
                hPart.appendChild(ctn(_fNoteCnt));
                var id = "footnote" + _fNoteCnt;
                hPart.setAttribute('id', id);
                $(hPart).click(function () {
                    note_obj.displayNote(this);
                });
                hPart.className = removePrefix(xPart.nodeName);
            } else if (xPart.nodeName == 'a') {
                hPart = ce('a');
                var href = xPart.getAttribute('href');
                var targ = xPart.getAttribute('target');
                var idLesson = xPart.getAttribute('id');
                if (idLesson) {
                    hPart.className = 'lesson_click';
                    hPart.setAttribute('id', idLesson);
                    if (href) {
                        hPart.setAttribute('href', href);
                        hPart.setAttribute('target', '_blank');
                    } else {
                        hPart.setAttribute('href', '#');
                    }
                } else {
                    if (href) {
                        hPart.setAttribute('href', href);
                    }
                    if (targ != 'self') {
                        hPart.setAttribute('target', '_blank');
                    }
                }
                hPart.appendChild(ctn(xPart.firstChild.data));
            } else {
                hPart = ce(xPart.nodeName);
                //html tags (b, u, i etc.)
                if (xPart.firstChild) {
                    hPart.appendChild(ctn(xPart.firstChild.data));
                }
            }
            inlPart.appendChild(hPart);
        }
        return inlPart;;
    }
    
    function getNewPageIndex(direct, infer) {
        var nInd = (typeof (direct) == 'number') ? direct: pgIndex + infer;
        nInd = (nInd <= 0) ? 0: (nInd >= pages.length -1) ? pages.length -1: nInd;
        if (nInd == pgIndex) {
            return false;
        } else {
            pgIndex = nInd;
            return true;
        }
    }
    
    function ce(name) {
        var dn = doc.createElement(name);
        return dn;
    }
    
    function ctn(from) {
        var tn = doc.createTextNode(from);
        return tn;
    }
    
    function removePrefix(nodeName) {
        //removes "fam:" namespace prefix from xml node name
        var str = nodeName.toString();
        var newStr = str.substr(4);
        return newStr;
    }
    
    function buildDropDown(pgs) {
        var ddDiv = ce('select');
        sections =[];
        for (var i = 0; i < pgs.length; i++) {
            var pg = pgs[i];
            var s = pg.getAttribute('section');
            if ((s && s != '-------') && (s != "null") && (chapTitle.toLowerCase() != "resources") && (chapTitle.toLowerCase() != "assessment")) {
                var option = ce('option');
                option.style.fontSize = "11px";
                sections.push(i);
                if (sections.length == 1) {
                    option.setAttribute('defaultSelected', true);
                }
                option.appendChild(ctn(s));
                ddDiv.appendChild(option);
            }
        }
        display_obj.displayDropDown(ddDiv);
    }
    
    function doubleDigitize(n) {
        if (n.length > 1) {
            return n;
        }
        var dd = '0' + n;
        return dd;
    }
}
//end XmlContent()

function getBrowserName() {
    var browserName = "";
    var name = navigator.userAgent.toLowerCase();
    if (name.indexOf("opera") != -1)
    browserName = "opera"; else if (name.indexOf("msie") != -1)
    browserName = "msie"; else if (name.indexOf("safari") != -1)
    browserName = "safari"; else if (name.indexOf("mozilla") != -1) {
        if (name.indexOf("firefox") != -1)
        browserName = "firefox"; else {
            browserName = "mozilla";
        }
    }
    return browserName;
}

function showBigImage(url, alt, copyright, thisFlipped) {
    $('.bigImage img').remove();
    $('.bigImage').prepend('<img src="' + url + '" alt="' + alt + '" title="' + alt + '" />');
    if (($('.bigImage img').prop('naturalHeight') + 153) > $(window).height()) {
        $('.bigImage img').height(($(window).height() - 200));
    }
    if (thisFlipped.length == 1) {
        $('.bigImage img').addClass('flipped');
    }
    $('.bigCaption').text(alt);
    $('.bigCopyright').text(copyright.replace("©", "credit:"));
    $('.overlay').fadeIn('fast');
    
    $('.imgCloser, .overlay').click(function () {
        $('.overlay').fadeOut('fast');
    }).children().click(function (e) {
        return false;
    });
}
function closeWelcome() {
    $('.welcome').hide();
    $('#div_content').fadeIn('fast');
}
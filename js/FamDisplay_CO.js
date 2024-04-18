//Thomas Tran at DLIFLC

function FamDisplay() {
    
    var scorm_obj;
    var langCode;
    var chapTitles;
    var pageTotals;
    //array of chapter page totals
    var cPageSpans;
    var tPageSpans;
    var chapInfoSpans;
    var upBtns;
    var prevBtns;
    var nextBtns;
    var navImgs;
    var flashTag;
    var totalPages;
    var lengthButton;
    var language;
    
    this.init = function (scorm_wrapper) {
        
        scorm_obj = window.scorm ? window.scorm_obj: null;
        langCode = window.langCode;
        chapTitles = window.chapTitles;
        pageTotals = window.pageTotals;
    }
    // end this.init ()
    
    this.display = function (content, pageIndex) {
        updateNumberPages();
        //---- CLEAR OLD CONTENT
        $('#div_content').html('');
        footnoteOpenId = "";
        
        //---- ADD NEW CONTENT
        getElemID('div_content').appendChild(content);
        var elem = getElemID('f_container');
        if (elem || elem != null) {
            elem.style.display = "block";
        }
        //---- Show Certificate
        var assess_container = getElemID('assess_container');
        if (assess_container || (assess_container != null)) {
            var certificate = assess_container.getAttribute('certificate');
            var xmlPath = assess_container.getAttribute('xmlPath');
            xmlAssessment_obj.initChapterTest(xmlPath, certificate);
        }
        //---- Add HTML5
        var html5 = getElemID('HTML5');
        if (html5 || (html5 != null)) {
            //if (isSVG_Support()) {
            if (html5ProjectName != "") {
                try {
                    html5.innerHTML = "";
                    var string = "load" + html5ProjectName + "_HTML5()";
                    eval(string);
                    html5ProjectName = "";
                }
                catch (err) {
                    errorMessage();
                }
            }
            /*}
            else {
            if (scorm) {
            //var conName =  projTitle.split(" ")[0].toLowerCase();
            //    conName = conName +"/" + projType + "_" + projCode   + "/default.html";
            var conName =  projTitle.split(" ")[0];
            html5.style.backgroundImage ="none";
            var string = '<div class="errorHTML5"><div class="errorHTML5Title">Incompatible Software!!!</div><div style="margin:20px auto 20px auto; font-size:14px;">Sorry that you can\'t view this page on this software';
            string += ' because it does not support the Scalable Vector Graphics (SVG). Please use the navigation above or bottom of the page to skip this page.'
            string += ' If you really want to view this page, please click on <a href="http://famdliflc.lingnet.org" target="_blank">FAMiliarization Home Page</a> and enter the <b>';
            string += conName + '</b> on the search box on the top right of FAMiliarization Home Page. Then select <b>' +conName + '</b> Language from drop box and then select the <b>' +projTitle;
            string += '</b> in there. However, You still need to finish all <b>' +projTitle + '</b> on this software to allow you to get credit. <br/><br/>Sorry for inconvenience.</div></div>';
            html5.innerHTML= string;
            }
            else {
            html5.style.backgroundImage ="none";
            html5.innerHTML= errorMessage();
            }
            
            } */
        }
        
        //Set project title
        if (version === "famWeb") {
            $('.headerTitle h1').text('Cultural Orientation');
            $('.headerTitle h1').addClass('COTitle');
        } else {
            $('.headerTitle h1').text('Rapport');
        }
        
        ///add video
        if (getElemID("videoPlayer") || getElemID("videoPlayer") != null) {
            var myVideo = getElemID("videoPlayer");
            var videoType = checkPlaylist();
            if (videoType || videoType != null) {
                var urlVideo = myVideo.getAttribute('src');
                if (urlVideo || urlVideo != null) {
                    urlVideo = urlVideo.split(".")[0] + videoType;
                    myVideo.setAttribute('src', urlVideo);
                    myVideo.load();
                    myVideo.play();
                }
            } else {
                getElemID('div_content').innerHTML = errorMessage();
            }
        }
        
        updateDropDown();
        dynamicPage();
        
        if (document.getElementById("footnoteDiv")) {
            document.getElementById("div_content").removeChild(document.getElementById("footnoteDiv"));
        }
        
        $("#imageContainer").css({
            "display": "none"
        });
        
        $('#div_content').append('<hr class="langColor"><div id="dliflcInfo">' + completeDate + '</div><div id="DLIlogo"><a href="http://www.dliflc.edu/" target="_blank" title="DLIFLC Home Page"><img src="images/dliflc-crest.png" alt="DLIFLC Home Page" title="DLIFLC Home Page" /></a></div>');
        
        if (scorm_obj) scorm_obj.onPageDisplay();
    }
    //end this.display function
    
    this.getIEVersion = function () {
        var name = navigator.userAgent.toLowerCase();
        if (name.indexOf("msie") != -1) {
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                var ieVersion = new Number (RegExp.$1);
                if (ieVersion > 7) {
                    return false;
                } else {
                    return true;
                }
            }
        } else if (name.indexOf("safari") != -1) {
            return false;
        } else {
            return true;
        }
    }
    
    this.getPrevBtns = function () {
        return prevBtns;
    }
    
    this.getNextBtns = function () {
        return nextBtns;
    }
    
    this.getUpBtns = function () {
        return upBtns;
    }
    
    this.getNavImgs = function () {
        return navImgs;
    }
    
    this.displayChapNav = function (chap) {
        getElemID('nav_intra_1').style.display = (typeof (chap) != 'string') ? 'block': 'none';
        
        if (chap == 'welcome') {
            $('.container_2').addClass('welcome');
        } else {
            $('.container_2').removeClass('welcome');
        }
    }
    
    this.displayDropDown = function (ddMenu) {
        //title, drop down, chapter name/number
        $('.langTitle, .headerTitle h2 span').text(toProperCase(courseLanguage));
        $('.langTitle').click(function () {
            if (version != 'famWeb') {
                FW.showHomePage();
            } else {
                window.location.href = "../website/default.html?type=chapter%index=1&amp;moduleID=0&amp;taskID=0";
            }
        });
        var chapIndex = xc_obj.getChapIndex();
        var chapTitle = xc_obj.getChapTitle();
        var dd = getElemID('drop_down');
        if ((chapTitle.toLowerCase() != "resources") && (chapTitle.toLowerCase() != "assessment")) {
            $('.dropLeft').html('Chapter ' + chapIndex + ':');
            $('.dropRight').html(chapTitle);
        } else {
            $('.dropLeft').html();
            $('.dropRight').html(chapTitle);
        }
        
        if (ddMenu.hasChildNodes()) {
            if ((chapTitle.toLowerCase() != "resources") && (chapTitle.toLowerCase() != "assessment")) {
                $('.dropLeft').html('Chapter ' + chapIndex + ':');
                $('.dropRight').html(chapTitle);
            } else {
                $('.dropLeft').html();
                $('.dropRight').html(chapTitle);
            }
            
            if (dd.lastChild.nodeName != "SELECT") {
                dd.appendChild(ddMenu);
            } else {
                dd.replaceChild(ddMenu, dd.lastChild);
            }
            
            nav_obj.initDDMenu();
        } else if (dd.lastChild.nodeName == "SELECT") {
            dd.removeChild(dd.lastChild);
        }
    }
    //end this.displayDropDown function
    
    this.showCert = function () {
        var flag = window.open('flag.html', '', 'width=750,height=650', false);
    }
    
    //---- SMALL UTILITY USED BY CERTIFICATE HTML
    this.innerHTML = function (element, str) {
        element.innerHTML = str;
    }
    
    function dynamicPage() {
        var aList = document.getElementsByTagName('a');
        for (var i = 0; i < aList.length; i++) {
            var tag = aList[i];
            if (tag.className == 'chap_exchange_play') {
                tag = exchangeButton(tag);
            } else if (tag.className == 'lesson_click') {
                linkTagsOnClick(tag);
            }
        }
    }
    
    function exchangeButton(btn) {
        btn.onclick = function () {
            newSoundPlay(projCode + '_xch_' + doubleDigitize(this.id) + '.mp3');
        }
        return btn;
    }
    
    function updateDropDown() {
        var ddm = getElemID('drop_down').lastChild;
        if (ddm.nodeName == "SELECT") {
            if (ddm.nodeName == "SELECT") {
                var pi = xc_obj.getPageIndex();
                //page index
                var mi = ddm.options.length -1;
                //menu index
                var s = xc_obj.getSections();
                while (pi < s[mi]) {
                    mi--;
                }
                ddm.selectedIndex = mi;
            }
        }
    }
    
    function moveAudioPlayer(obj) {
        var target = obj.parentNode.parentNode.childNodes[1].lastChild;
        var node = getElemID('fap_container');
        target.appendChild(node);
    }
    
    function getPageTotal(num_chaps, num_pages) {
        var total = 0;
        for (var i = 0; i < num_chaps; i++) {
            total += pageTotals[i];
        }
        if (num_pages) {
            total += num_pages;
        }
        return total;
    }
    
    function doubleDigitize(n) {
        if (n.length > 1) {
            return n;
        }
        var dd = '0' + n;
        return dd;
    }
    
    function getElemID(a) {
        var b = document.getElementById(a);
        return b;
    }
    
    function linkTagsOnClick(linkObj) {
        linkObj.onclick = function () {
            lessonToggle = true;
            var te = linkObj.getAttribute('id')
            var hrefLink = linkObj.getAttribute('href')
            if (hrefLink != "#") {
                window.document.location = hrefLink;
            } else {
                xc_obj.lessonChapter(te, 0);
            }
            closeWelcome();
        }
    }
    
    function detect_browser() {
        var browser_name = navigator.userAgent;
        // We have to check for Opera first because
        // at the beginning of the userAgent variable
        // Opera claims it is MSIE.
        if (browser_name.indexOf("Opera") != -1) {
            browser_name = "Opera";
        } else if (browser_name.indexOf("Firefox") != -1) {
            browser_name = "Firefox";
        } else if (browser_name.indexOf("MSIE") != -1) {
            browser_name = "MSIE";
        } else if (browser_name.indexOf("Netscape") != -1) {
            browser_name = "Netscape";
        } else if (browser_name.indexOf("Safari") != -1) {
            browser_name = "Safari";
        }
        return browser_name;
    }
    // end function detect_browser()
    
    function updateNumberPages() {
        //document.getElementById("topNavigation").style.display="block";
        //document.getElementById("topNavPage").style.display="block";
        if (xc_obj.getChapIndex() != 0) {
            if (version == 'famWeb') {
                totalPages = getPageTotal(pageTotals.length);
                getElemID('topTotalPageNumber').innerHTML = totalPages;
                getElemID('topTotalPageNumber').onclick = function () {
                    showPageNumberFromTotalPages(parseFloat(getElemID('topTotalPageNumber').innerHTML) -1);
                    closeWelcome();
                }
                getElemID('topNav_first').onclick = function () {
                    xc_obj.initChapter(1, 0);
                    closeWelcome();
                }
            } else {
                totalPages = pageTotals[xc_obj.getChapIndex() -1];
                getElemID('topTotalPageNumber').innerHTML = totalPages;
                getElemID('topTotalPageNumber').onclick = function () {
                    showPageNumberFromTotalPages(parseFloat(getElemID('topTotalPageNumber').innerHTML) -1);
                    closeWelcome();
                }
                getElemID('topNav_first').onclick = function () {
                    xc_obj.initChapter(xc_obj.getChapIndex(), 0);
                    closeWelcome();
                }
            }
            
            //Top Input for pages
            showInputPagesForElementByName("topNavPage");
            
            var num_chaps = xc_obj.getChapIndex() -1;
            var total = 0;
            if (version == 'famWeb') {
                //not scorm total page of previous chapters
                for (var i = 0; i < num_chaps; i++) {
                    total += pageTotals[i];
                }
            }
            
            if (xc_obj.getPageIndex()) {
                total += xc_obj.getPageIndex();
            }
            
            //setup prev arrows and border-radii
            if (total === 0) {
                $('#topNav_back').hide();
                $('#topNav_first').hide();
            } else if (total === 1) {
                $('#topNav_back').show().addClass('cornersLeft');
                $('#topNav_first').hide();
                $('.currentPageNumber').removeClass('cornersLeft');
            } else {
                $('#topNav_back').show().removeClass('cornersLeft');
                $('#topNav_first').show();
            }
            //setup next arrow and border-radii
            if (total > totalPages -2) {
                $('#topNav_forward').hide();
                $('#topTotalPageNumber').addClass('cornersRight');
            } else {
                $('#topNav_forward').show();
                $('#topTotalPageNumber').removeClass('cornersRight');
            }
            
            //$('.progressBar').length(totalPages/total);
            $('.progressBar').css('width', Math.round(((total + 1) * 100) / totalPages) + "%");
            $('.progressBar').attr('title', "Progress: Page " + (total + 1) + " of " + totalPages);
            
            if ((total > 1) && (total < totalPages)) {
                getElemID('topPageNumbers').innerHTML = '';
                if (total == (totalPages -1)) {
                    total--;
                    for (var i = total -2; i < total + 2; i++) {
                        var pageDiv = document.createElement("div");
                        if (i == (total + 1)) {
                            pageDiv.className = "currentPageNumber";
                        } else {
                            pageDiv.className = "pageNumber";
                        }
                        pageDiv.innerHTML = i + 1;
                        pageDiv.id = "topPage_" +(i);
                        getElemID('topPageNumbers').appendChild(pageDiv);
                        pageDiv.onclick = function () {
                            showPageNumberFromTotalPages(this.id.split("_")[1]);
                            closeWelcome();
                        }
                    }
                    // end for
                } else {
                    for (var i = total -2; i < total + 2; i++) {
                        var pageDiv = document.createElement("div");
                        if (i == total) {
                            pageDiv.className = "currentPageNumber";
                        } else {
                            pageDiv.className = "pageNumber";
                        }
                        pageDiv.innerHTML = i + 1;
                        pageDiv.id = "topPage_" +(i);
                        getElemID('topPageNumbers').appendChild(pageDiv);
                        lengthButton = pageDiv.offsetWidth;
                        pageDiv.onclick = function () {
                            showPageNumberFromTotalPages(this.id.split("_")[1]);
                            closeWelcome();
                        }
                    }
                }
            } else {
                if (totalPages > 3) {
                    getElemID('topPageNumbers').innerHTML = '';
                    for (var i = 0; i < 4; i++) {
                        var pageDiv = document.createElement("div");
                        if (i == total) {
                            pageDiv.className = "currentPageNumber";
                        } else {
                            pageDiv.className = "pageNumber";
                        }
                        pageDiv.innerHTML = i + 1;
                        pageDiv.id = "topPage_" +(i);
                        getElemID('topPageNumbers').appendChild(pageDiv);
                        pageDiv.onclick = function () {
                            showPageNumberFromTotalPages(this.id.split("_")[1]);
                            closeWelcome();
                        }
                    }
                } else {
                    if (totalPages > 1) {
                        getElemID('topPageNumbers').innerHTML = '';
                        for (var i = 0; i < totalPages; i++) {
                            var pageDiv = document.createElement("div");
                            if (i == total) {
                                pageDiv.className = "currentPageNumber";
                            } else {
                                pageDiv.className = "pageNumber";
                            }
                            pageDiv.innerHTML = i + 1;
                            pageDiv.id = "topPage_" +(i);
                            getElemID('topPageNumbers').appendChild(pageDiv);
                            pageDiv.onclick = function () {
                                showPageNumberFromTotalPages(this.id.split("_")[1]);
                                closeWelcome();
                            }
                        }
                    } else {
                        getElemID('topPageNumbers').innerHTML = '';
                        var pageDiv = document.createElement("div");
                        pageDiv.className = "currentPageNumber";
                        pageDiv.innerHTML = 1;
                        getElemID('topPageNumbers').appendChild(pageDiv);
                        document.getElementById("topNavPage").style.display = "none";
                    }
                }
                //else
            }
            //end else
            
            if (total === 0) {
                $('#topPage_0').addClass('cornersLeft');
            } else {
                $('#topPage_0').removeClass('cornersLeft');
            }
        }
        
        $('.pageInput').hover(function () {
            $('.inputTip').fadeIn('fast');
        },
        function () {
            $('.inputTip').fadeOut('fast');
        });
    }
    //end updateNumberPages()
    
    
    function showPageNumberFromTotalPages(pageNumber) {
        var total = 0;
        var prevChaptersTotal = 0;
        var chapterNumber = 0;
        var chapterPageNumber = 0;
        
        if (version == 'famWeb') {
            for (var i = 0; i < pageTotals.length; i++) {
                if (i > 0) {
                    prevChaptersTotal += pageTotals[i -1];
                }
                total += pageTotals[i];
                if (total > pageNumber) {
                    chapterNumber = i + 1;
                    chapterPageNumber = pageNumber - prevChaptersTotal;
                    break;
                }
            }
            if (chapterNumber == 1) {
                chapterPageNumber = pageNumber;
            }
        } else {
            if (xc_obj.getChapIndex() != 0) {
                chapterNumber = xc_obj.getChapIndex();
                chapterPageNumber = pageNumber;
            }
        }
        
        xc_obj.initChapter(parseInt(chapterNumber), parseInt(chapterPageNumber));
    }
    //end showPageNumberFromTotalPages
    
    function showInputPagesForElementByName(name) {
        document.getElementById(name).onkeydown = function (e) {
            if (! e) {
                var e = window.event;
            }
            if (e.keyCode == 13) {
                var valueInput = parseFloat(document.getElementById(name).value);
                if (valueInput > 0) {
                    if (version == 'famWeb') {
                        if ((valueInput < 1) || (valueInput > getPageTotal(pageTotals.length))) {
                            alert ("your input must be a valid number page.\n Also, it must be less than the total number pages.");
                            document.getElementById(name).value = "";
                            document.getElementById(name).focus();
                        } else {
                            document.getElementById(name).value = "";
                            showPageNumberFromTotalPages(valueInput -1);
                            closeWelcome();
                        }
                    } else {
                        if ((valueInput < 1) || (valueInput > pageTotals[xc_obj.getChapIndex() -1])) {
                            alert ("your input must be a valid number page.\n Also, it must be less than the total number pages.");
                            document.getElementById(name).value = "";
                            document.getElementById(name).focus();
                        } else {
                            document.getElementById(name).value = "";
                            showPageNumberFromTotalPages(valueInput -1);
                            closeWelcome();
                        }
                    }
                } else {
                    alert ("your input must be a valid number page.");
                    document.getElementById(name).value = "";
                    document.getElementById(name).focus();
                }
            }
        }
        //end onkeyup()
    }
    //end showInputPagesForElementByName(name)
    
    function checkPlaylist() {
    var myVideo = getElemID("videoPlayer");
        if (myVideo) {
            if (myVideo.canPlayType) {
                var html5VideoMimeTypes = new Array ("video/mp4", "video/webm");
                var html5VideoTypes = new Array (".mp4", ".webm");
                for (var i = 0; i < html5VideoMimeTypes.length; i++) {
                    var canPlay = myVideo.canPlayType(html5VideoMimeTypes[i]);
                    if ((canPlay == "maybe") || (canPlay == "probably"))
                    return html5VideoTypes[i];
                }
            } else {
                return null;
            }
        }
        return null;
    }
    
    function errorMessage() {
        var string = '<div class="errorHTML5"><div id="errorHTML5Title">Incompatible Browser!!!</div><div>Oops!  Your browser, <font color="red"><b>' + detectBrowserVersion() + '</b></font>, is unable to support this page. ';
        string += 'In order to access this page, you will need one of the following browsers: Internet Explorer 9(or above), Firefox, Chrome, Safari, or Opera.</div>';
        string += '<div>The following are free downloads of an updated browser:</div>';
        string += '<div>Internet Explorer 9:<br/>';
        string += '<a href="http://windows.microsoft.com/en-us/internet-explorer/ie-9-worldwide-languages" target="_blank">Click here to download Internet Explorer 9 browser.</a></div>';
        string += '<div>Firefox:<br/>';
        string += '<a href="http://www.mozilla.org/en-US/firefox/new/?utm_id=Q406&utm_source=google&utm_medium=ppc&utm_campaign=postlaunch&gclid=COyLrsGPzJACFQkxgwoddjU5XA"';
        string += ' target="_blank">Click here to download current version of Firefox browser.</a></div>';
        string += '<div>Chrome:<br/>';
        string += '<a href="https://www.google.com/chrome/index.html?hl=en&brand=CHMA&utm_campaign=en&utm_source=en-ha-na-us-sk&utm_medium=ha&utm_term=chrome" target="_blank">';
        string += 'Click here to download current version of Chrome browser.</a></div>';
        string += '<div>Safari:<br/>';
        string += '<a href="http://www.apple.com/safari/download/" target="_blank">Click here to download current version of Safari browser.</a></div>';
        string += '<div>Opera:<br/>';
        string += '<a href="http://www.opera.com/" target="_blank">Click here to download current version of Opera browser.</a></div>';
        string += '<div>If you continue having problems viewing this page after updating your browser, please contact dliflc\'s tech support at: <a href="mailto:pres.FamProject@dliflc.edu">pres.FamProject@dliflc.edu.</a></div>';
        string += '<div>The download list above does not imply endorsement by the U.S. Army, DoD, or Federal Government.</div></div>';
        return string;
    }
    
    function detectBrowserVersion() {
        var userAgent = navigator.userAgent.toLowerCase();
        $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
        var version = "";
        
        // Is this a version of IE?
        if ($.browser.msie) {
            userAgent = $.browser.version;
            userAgent = userAgent.substring(0, userAgent.indexOf('.'));
            version = "Internet Explorer Version: " + userAgent;
        }
        
        // Is this a version of Chrome?
        if ($.browser.chrome) {
            userAgent = userAgent.substring(userAgent.indexOf('chrome/') + 7);
            userAgent = userAgent.substring(0, userAgent.indexOf('.'));
            //version = userAgent;
            version = "Chrome Version: " + userAgent;
            // If it is chrome then jQuery thinks it's safari so we have to tell it it isn't
            $.browser.safari = false;
        }
        
        // Is this a version of Safari?
        if ($.browser.safari) {
            userAgent = userAgent.substring(userAgent.indexOf('safari/') + 7);
            userAgent = userAgent.substring(0, userAgent.indexOf('.'));
            // version = userAgent;
            version = "Safari Version: " + userAgent;
        }
        
        // Is this a version of Mozilla?
        if ($.browser.mozilla) {
            //Is it Firefox?
            if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
                userAgent = userAgent.substring(userAgent.indexOf('firefox/') + 8);
                userAgent = userAgent.substring(0, userAgent.indexOf('.'));
                // version = userAgent;
                version = "Mozilla Firefox Version: " + userAgent;
            } else {
                // If not then it must be another Mozilla
            }
        }
        
        // Is this a version of Opera?
        if ($.browser.opera) {
            userAgent = userAgent.substring(userAgent.indexOf('version/') + 8);
            userAgent = userAgent.substring(0, userAgent.indexOf('.'));
            //version = userAgent;
            version = "Opera Version: " + userAgent;
        }
        return version;
    }
    //end detectBrowserVersion function
    
    $(document).ready(function () {
        if (version != 'scorm') {
            $('.langTitle').addClass('hoverer');
        }
    });
}
//end FamDisplay function

function isSVG_Support() {
    return ! ! document.createElementNS && ! ! document.createElementNS("http://www.w3.org/2000/svg", 'svg').createSVGRect;
}
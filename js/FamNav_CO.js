//Thomas Tran at DLIFLC

var lessonToggle;
function FamNav() {
    var display_obj;
    var prevBtns;
    var nextBtns;
    var upBtns;
    var pageTotals;
    //----
    this.init = function () {
        pageTotals = window.pageTotals;
        display_obj = window.display_obj;
        //---- MAKE DYNAMIC CHAPTER BTNS
        if (! window.scorm) {
            var navImgs = display_obj.getNavImgs();
            var btnCount = 0;
            for (var i = 1; i < navImgs.length; i++) {
                if (navImgs[i].className == 'button') {
                    btnCount++;
                    dynamic_c_btn(navImgs[i], btnCount);
                }
            }
        }
        //---- MAKE DYNAMIC PAGE BUTTONS
        dynamic_n_btn(getElemID("topNav_forward"));
        dynamic_p_btn(getElemID("topNav_back"))
    }
    
    //call change content if the box is change.
    this.initDDMenu = function () {
        
        var ddm = getElemID('drop_down').lastChild;
        ddm.onchange = function () {
            $("#feedback").hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            var lessonNum = "";
            var s = ddm.options[ddm.selectedIndex].text;
            if (s.indexOf(" ") != -1) {
                lessonNum = s.substr((s.indexOf(" ") + 1));
                var num = parseInt(lessonNum);
            }
            // if the drop box is selected the Lesson
            if ((s.toLowerCase() == "lesson") || ((s.substr(0, (s.indexOf(" "))).toLowerCase() == "lesson") && (num > 0))) {
                lessonToggle = true;
                //var lessonNum = s.substr((s.indexOf(" ")+1))
                var urlHTML = 'lessons/chapter' + xc_obj.getChapIndex() + '/lesson' + lessonNum + '/default.html'
                //alert('chap_'+ xc_obj.getChapIndex() +'_lesson_'+text);
                //window.open(textHTML,'Lesson','width=800,height=750,menubar=no,status=no,scrollbars=yes');
                window.open(urlHTML, 'Lesson');
                xc_obj.initChapter(xc_obj.getChapIndex() + 1, 0);
                //text = 'chap_' + xc_obj.getChapIndex() + '_lesson_'+text;
                //xc_obj.lessonChapter(text, 0);
            } else {
                var index = ddm.selectedIndex;
                xc_obj.loadPage(xc_obj.getSections()[index]);
            }
            closeWelcome();
        }
    }
    
    function dynamic_c_btn(btn, chapIndex) {
        btn.onclick = function () {
            $("#feedback").hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            lessonToggle = false;
            xc_obj.initChapter(chapIndex, 0);
            //xc_obj.setNumLesson(0);
        }
    }
    
    function dynamic_p_btn(btn) {
        // prev btn
        btn.onclick = function () {
            $("#feedback").hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            xc_obj.loadPage(false, -1);
        }
    }
    
    function dynamic_n_btn(btn) {
        // next btn
        btn.onclick = function () {
            $("#feedback").hide();
            //hide feedback for assessment if the chapter is clicked. added 05/11/2010
            
            if ((xc_obj.getPageIndex() + 1) == pageTotals[xc_obj.getChapIndex() -1]) {
                
                //if (lessonToggle)
                //	xc_obj.loadPage(false, 1);
                // else {
                
                xc_obj.initChapter(xc_obj.getChapIndex() + 1, 0);
                //}
            } else
            xc_obj.loadPage(false, 1);
            
            closeWelcome();
        }
    }
    
    function dynamic_up_btn(btn) {
        btn.onclick = function () {
            window.document.location = "#";
        }
    }
    
    function getElemID(a) {
        var b = document.getElementById(a);
        return b;
    }
}

function xmlLoaded(data) {
    FW = new Framework_class();
    var xml;
    if (typeof data == "string") {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.loadXML(data);
    } else {
        xml = data;
    }
    
    var userID = FW.getUserID();
    $('.user').html("User: " + userID);
    
    var successCount = 0;
    var totalCount = 0;
    var loadSuccess = getURL_Parameter('loadSuccess');
    var clearSuccess = getURL_Parameter('clearSuccess');
    
    $(xml).find('Module').each(function () {
        var title = $(this).attr('title');
        var xmlPath = $(this).attr('xmlPath');
        var mediaPath = $(this).attr('mediaPath');
        var mainPage = $(this).attr('mainPage');
        var id = $(this).attr('id');
        
        if (version == 'famWeb') {
            if (id == 0) {
                $('.subNav').append("<hr class='langColor'><ul class='module'><span>" + title + "</span><li class='m" + id + "'></li></ul>");
            }
        } else {
            $('.subNav').append("<hr class='langColor'><ul class='module'><span>" + title + "</span><li class='m" + id + "'></li></ul>");
        }
        
        $(this).find('task').each(function (index) {
            var name = $(this).text();
            var taskID = $(this).attr('id');
            var taskPage = $(this).attr('taskPage');
            if (version == 'famWeb') {
                statusClass = "famNavNone";
            } else {
                statusClass = "ready";
            }
            var completionCode = FW.getProgress(id, taskID);
            if (typeof taskPage == 'undefined') {
                return true// continue
            }
            if (completionCode) {
                if (completionCode == FW.progressStatus.success) {
                    statusClass = "statPass";
                    successCount++;
                } else if (completionCode == FW.progressStatus.inProgress) {
                    statusClass = "statProgress";
                } else if (completionCode == FW.progressStatus.failed) {
                    statusClass = "statFail";
                }
            }
            
            totalCount++;
            
            var urlParamDelimiter = (taskPage.indexOf('?') >= 0) ? '&': '?';
            var taskPage = '../' + taskPage + urlParamDelimiter + "moduleID=" + id + "&taskID=" + taskID;
            
            $('<a class="langTextColor" href="' + taskPage + '" style="color:#' + textColor + '">' + name + '<span class=' + statusClass + '></span></a>"').appendTo('.m' + id);
        });
        // end each task
    });
    // end each module
    
    //handle navigation show/hide
    var delay = 100, setTimeoutConst;
    $('#subNavTop').hover(function () {
        updateNav();
        setTimeoutConst = setTimeout(function () {
            $('.subNav').fadeIn('fast');
        },
        delay);
    },
    function () {
        clearTimeout(setTimeoutConst);
        $('.subNav').fadeOut('fast');
    });
    
    function updateNav() {
        var url = window.location.href;
        var chapter = url.charAt(url.length - 1);
        $('.module:eq(0) a span').each(function (index) {
            if (chapter == 6) {
                if ($('.module a span:eq(7)').attr('class') == 'ready') {
                    $('.module a span:eq(7)').removeClass();
                    $('.module a span:eq(7)').addClass('statProgress');
                }
            } else if (chapter == 7) {
                if ($('.module a span:eq(6)').attr('class') == 'ready') {
                    $('.module a span:eq(6)').removeClass();
                    $('.module a span:eq(6)').addClass('statProgress');
                }
            } else if ($(this).attr('class') == 'ready' && chapter == index) {
                $(this).removeClass();
                $(this).addClass('statProgress');
            }
        });
    }
    
    if (totalCount == successCount) {
        //DOTO: Make a dialog for this
        /*alert("Congratulations: This course has been completed.\n\nPlease click the certificate button at the top of this page to print your certificate.");
        $('#id_cert_button').show();*/
    }
}
// end xmlLoaded

$(document).ready(function () {
    if (version != "scorm") {
        var xmlfilename = '../xml/modules.xml';
        
        $.ajax({
            type: "GET",
            url: xmlfilename,
            dataType: ($.browser.msie) ? "text": "xml",
            success: xmlLoaded,
            error: function (XMLHttpRequest, status, error) {
                //alert('fail: ' + error);
            }
        });
        if (version != 'famWeb') {
            $('.scormHide').show();
        }
    }
    
    
    
    //show/hide About page
    $('.loadAbout').click(function (event) {
        event.preventDefault();
        $('.aboutDialog').animate({
            'left': 0
        },
        500, 'easeInOutQuad');
    });
    $('.aboutCloser, .aboutBack').click(function () {
        window.parent.$('.aboutDialog').animate({
            'left': '-100%'
        },
        200);
    });
});
//Thomas Tran @copyRight 2012
//At DLIFLC

function XmlAssessment() {
    var passingScore = 79;
    var display_obj;
    var assessment_obj;
    var assessmentTitle;
    var questions;
    var ques;
    var feedback;
    var correctAns;
    var totalPageAss;
    var totalTableAss;
    var currentPageAss;
    var userAnswer;
    var scorePercent;
    var certificate;
    var assPages_obj;
    var url = window.location.href;
    var currentChapter = + url.charAt(url.length - 1);
    var loc = location.protocol + '//' + location.host + location.pathname;
    
    this.initChapterTest = function (file, cert) {
        certificate = cert;
        scorePercent = 0;
        currentPageAss = 0;
        var string;
        var nodes;
        userAnswer = new Array();
        questions = new Array();
        ques = new Array();
        feedback = new Array();
        correctAns = new Array();
        display_obj = window.display_obj;
        assessment_obj = new load_XML(file);
        nodes = assessment_obj.tagNameElement("section", nodes);
        assessmentTitle = nodes[0].getAttribute('title');
        questions = assessment_obj.tagNameElement('question', nodes[0]);
        var quesTemp = assessment_obj.tagNameElement('label', nodes[0]);
        var whyTemp = assessment_obj.tagNameElement('why', nodes[0]);
        for (var i = 0; i < quesTemp.length; i++) {
            ques[i] = parseInlineNodes(quesTemp[i]);
            feedback[i] = parseInlineNodes(whyTemp[i]);
            correctAns[i] = questions[i].getAttribute('value');
        }
        
        string = '<div id="assessment">' +
        '<table class="assOuterTable" border="0">' +
        '<tr>' +
        '<td colspan="2" align="left" class="assHead">' +
        '<div id="assTitle"></div>' +
        '</td>' +
        '<td align="right" class="assHead">' +
        '<div id="assPages"></div>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td colspan="3" id="tablePageAss">';
        
        for (var i = 0; i < ques.length; i++) {
            var numQues = i + 1
            if ((numQues % 5) == 1) {
                string += '<table class="assInnerTable" border="0" style="display:none" cellspacing="0" cellpadding="0">';
            }
            string += '<tr>' +
            '<td class="tdRightWrong">' +
            '<img src="images/rightAns.jpg" border="0" hspace="0" vspace="0" class="imgRightWrong" id="qImg_' + i + '"/>' +
            '</td>' +
            '<td class="tdQuesNum">(' + numQues + ')</td>' +
            '<td class="tdQuestion">' + ques[i] + '</td>' +
            '<td class="tdWhy">' +
            '<span class="why assBtn" id="' + i + '">Why?</span>' +
            '</td>' +
            '<td class="tdTrue">' +
            '<img src="images/radiobtn.gif" alt="True" title="True" class="button assBtn" id="True_' + i + '"/><span> T</span>' +
            '</td>' +
            '<td class="tdFalse">' +
            '<img src="images/radiobtn.gif" alt="False" title="False" class="button assBtn" id="False_' + i + '"/><span> F</span>' +
            '</td>' +
            '</tr>';
            
            if ((numQues % 5) == 0 || (numQues == ques.length)) {
                string += "</table>";
            }
        }
        
        string += '</tr>';
        string += '<tr><td colspan="4"><div id="boxOutsideAssessment"><div id="scorePercent"></div><div style="float:right;height:30px;"><span class="retakeAss assBtn" id="retake_Ass">Retake</span>';
        string += '<span class="assCert assBtn" id="getCert"/>Print Certificate</span>';
        string += '<span class="assPrevPage assBtn" id="prevBtn">&lt;Prev</span><span class="assNextPage assBtn" id="nextBtn">Next&gt;</span><span class="assSubmit assBtn" id="submitBtn">Submit</span><span class="assNextChapter assBtn">Next Chapter &rarr;</span></div></div><div style="clear:both;height:1px;"></div></td>';
        string += '</tr></table></div>';
        
        getElemID('assess_container').innerHTML = string;
        var assTitle_obj = document.getElementById('assTitle');
        if (assessmentTitle != "Final Assessment") {
            assTitle_obj.innerHTML = "Chapter Assessment- " + assessmentTitle;
        } else {
            assTitle_obj.innerHTML = assessmentTitle;
        }
        var trueFalseImg = $('.assBtn');
        totalTableAss = xid('tablePageAss').getElementsByTagName('table');
        $(totalTableAss[currentPageAss]).show();
        assPages_obj = document.getElementById('assPages');
        assPages_obj.innerHTML = "Page 1 of " + totalTableAss.length;
        $(xid("feedback")).hide();
        $(xid("prevBtn")).addClass('disabledBtn');
        $(xid("getCert")).hide();
        $(xid("retake_Ass")).hide();
        $(".assNextChapter").hide();
        
        var btnCount = 0;
        var feedbtnCount = 0;
        for (var i = 0; i < trueFalseImg.length; i++) {
            if ($(trueFalseImg[i]).hasClass('button')) {
                dynamic_c_btn(trueFalseImg[i]);
            }
            if ($(trueFalseImg[i]).hasClass('why')) {
                feedback_click(trueFalseImg[i]);
            }
            if ($(trueFalseImg[i]).hasClass('assNextPage')) {
                trueFalseImg[i].onclick = nxt_pg;
            }
            if ($(trueFalseImg[i]).hasClass('assPrevPage')) {
                trueFalseImg[i].onclick = prv_pg;
            }
            if ($(trueFalseImg[i]).hasClass('assSubmit')) {
                trueFalseImg[i].onclick = checkAnswer;
            }
            if ($(trueFalseImg[i]).hasClass('retakeAss')) {
                trueFalseImg[i].onclick = retake;
            }
            if ($(trueFalseImg[i]).hasClass('assNextChapter')) {
                trueFalseImg[i].onclick = nextChap;
            }
            if ($(trueFalseImg[i]).hasClass('assCert')) {
                trueFalseImg[i].onclick = showCOCert;
            }
        }
        
        if (totalTableAss.length === 1) {
            $('#nextBtn').hide();
            $('#prevBtn').hide();
        } else {
            $('#topNavigation').hide();
        }
    }
    function dynamic_c_btn(btn) {
        btn.onclick = function () {
            this.setAttribute("src", "images/selectedBtn.gif")
            var id_split = "";
            var idName = this.getAttribute('id');
            var id_split = idName.split("_");
            if (id_split[0] == "True") {
                var index = parseFloat(id_split[1]);
                userAnswer[index] = 1;
                var temp = "False_" + id_split[1];
                var objTemp = document.getElementById(temp);
                objTemp.setAttribute("src", "images/radiobtn.gif");
            } else {
                if (id_split[0] == "False") {
                    var index = parseFloat(id_split[1]);
                    userAnswer[index] = 0;
                    var temp = "True_" + id_split[1];
                    var objTemp = document.getElementById(temp);
                    objTemp.setAttribute("src", "images/radiobtn.gif");
                }
            }
            if ($('.tdTrue').length === userAnswer.length) {
                $('#submitBtn').show('fast');
            }
        }
    }
    
    function feedback_click(btn) {
        btn.onclick = showContents;
    }
    
    function convertFloat(a) {
        return parseFloat(a) || 0
    }
    
    //show feedback for why
    function showContents(evt) {
        //evt = window.event || evt;
        var num = parseFloat(this.getAttribute('id'));
        var trueFalse;
        var feedbackAss = $("#feedback");
        
        if (correctAns[num] === '0') {
            trueFalse = 'false';
        } else {
            trueFalse = 'true';
        }
        
        $(feedbackAss).css('top', ($(this).offset().top - 20) + 'px');
        
        $(feedbackAss).html('<div class="feedbackTitle">FeedBack<span>X</span></div><div class="feedbackBody"><p><i>True or False:</i> ' + ques[num] + '</p><p>This is <strong>' + trueFalse + '</strong>.</p><p><i>Why?</i> ' + feedback[num] + '</p></div>');
        
        $(feedbackAss).fadeIn("fast");
        $(".feedbackTitle span").click(function () {
            $("#feedback").fadeOut('fast');
        });
    }
    
    
    function ce(name) {
        var dn = document.createElement(name);
        return dn;
    }
    function ctn(from) {
        var tn = document.createTextNode(from);
        return tn;
    }
    
    function xid(a) {
        return document.getElementById(a)
    }
    //xid
    
    
    //method call when next button is clicked
    function nxt_pg() {
        if (currentPageAss < totalTableAss.length -1) {
            $(xid("feedback")).hide();
            $(xid("prevBtn")).removeClass('disabledBtn');
            $(totalTableAss[currentPageAss]).hide();
            currentPageAss++;
            assPages_obj.innerHTML = "Page " + (currentPageAss + 1) + " of " + totalTableAss.length;
            $(totalTableAss[currentPageAss]).show();
            
            if (currentPageAss == (totalTableAss.length -1)) {
                $(xid("nextBtn")).addClass('disabledBtn');
            }
        }
    }
    
    function prv_pg() {
        if (currentPageAss > 0) {
            
            $(xid("feedback")).hide();
            $(totalTableAss[currentPageAss]).hide();
            currentPageAss--;
            assPages_obj.innerHTML = "Page " + (currentPageAss + 1) + " of " + totalTableAss.length;
            $(totalTableAss[currentPageAss]).show();
            $(xid("nextBtn")).removeClass('disabledBtn');
        }
        
        if (currentPageAss == 0) {
            $(xid("prevBtn")).addClass('disabledBtn');
        }
    }
    function checkAnswer() {
        var numQuesCorrect = 0;
        for (var i = 0; i < correctAns.length; i++) {
            var rightWrong = "qImg_" + i;
            var objRightWrong = document.getElementById(rightWrong);
            var tempTrue = "True_" + i;
            var tempFalse = "False_" + i;
            var objTempTrue = document.getElementById(tempTrue);
            var objTempFalse = document.getElementById(tempFalse);
            
            if (userAnswer[i] == correctAns[i]) {
                numQuesCorrect++;
                objRightWrong.setAttribute("src", "images/rightAns.jpg");
                $(objRightWrong).parent().siblings('.tdQuestion').css('color', 'green');
            } else {
                objRightWrong.setAttribute("src", "images/wrongAns.jpg");
                $(objRightWrong).parent().siblings('.tdQuestion').css('color', 'red');
            }
            objTempTrue.onclick = null;
            //disable True button
            objTempTrue.style.cursor = 'default';
            objTempFalse.onclick = null;
            //disable False button
            objTempFalse.style.cursor = 'default';
            $(xid(rightWrong)).fadeTo('fast', 1);
            $(xid(i)).fadeIn('fast');
            // display "why" button;
        }
        //end for loop
        
        $(xid("submitBtn")).hide();
        
        scorePercent = Math.round((numQuesCorrect /(parseFloat(correctAns.length))) * 100);
        $("#scorePercent").text("Your score is: " + scorePercent + "%");
        
        $("#scorePercent").show();
        
        onScore(scorePercent);
        if (scorePercent > passingScore) {
            if (certificate == "true") {
                //if final assesment
                if (version != 'scorm') {
                    showCongrat(scorePercent);
                    if (version == 'famWeb') {
                        $(xid("getCert")).show();
                    }
                } else {
                    showCongrat(scorePercent);
                    //window.localStorage.student_id = LMSGetValue("cmi.core.student_id");
                }
            } else if (version != 'scorm') {
                $('.assNextChapter').delay(1000).fadeIn('fast');
            }
        } else {
            //show retake button if failed
            $("#scorePercent").append(' - you must score ' + (passingScore + 1) + '% or higher to pass.');
            $("#retake_Ass").show();
        }
    }
    
    function nextChap() {
        //window.location.replace(loc + '?type=chapter%index='+ (currentChapter+2) +'&moduleID=0&taskID='+ (currentChapter+1));
        currentChapter = getCurrentChapter();
        navigateCO(currentChapter + 1);
    }
    
    function retake() {
        //var chapterLink = loc + '?type=chapter%index=' + (currentChapter+1) + '&moduleID=0&taskID=' + currentChapter;
        var currentChapter = getCurrentChapter();
        var chapterLink = {
            href: 'javascript:void(0);', onclick: currentChapter
        };
        $('.retake').remove();
        $('.bigImage img, .bigCaption, .bigCopyright').remove();
        var retakeText = '<div class="retake"><p>This assessment requires a score of <b>' + (passingScore + 1) + '%</b> or better in order for you to receive a certificate of completion. Your score was <b>' + scorePercent + '%</b>.</p>';
        
        if (certificate == "true") {
            //this is the final assessment
            retakeText += '<p>You are encouraged to go through the program again and retake the final assessment.</p>'
        } else {
            //this is a chapter assessment
            retakeText += '<p>Please go back to the <a class="assessmentFailLink" href="' + chapterLink.href + '">beginning of the chapter ' + (currentChapter + 1) + '</a> and begin again.</p>'
        }
        
        if (version != 'scorm') {
            retakeText += '<p>You may take the assessment as many times as needed. '
        } else {
            retakeText += '<p>You may take the assessment as many times as needed. However, once you exit the Learning Management System, you must re-enroll in order to try again. Upon exit, your score is recorded on your transcript. '
        }
        
        if (certificate == "true") {
            //this is the final assessment
            //retakeText += '<p>Please navigate to the <a href="../website/default.html?type=chapter%index=1&amp;moduleID=0&amp;taskID=0">Profile chapter</a> and begin again.</p><p>Read each chapter carefully before attempting to retake the assessment.</p><a class="redo" href="../website/default.html?type=chapter%index=1&amp;moduleID=0&amp;taskID=0">&larr; Back to Profile Chapter</a></div>'
            chapterLink.onclick = 0;
            if (version == 'scorm')
            retakeText += '<p>Please click on the &quot;Profile&quot; chapter and begin again.</p><p>Read each chapter carefully before attempting to retake the assessment.</p></div>'; else
            retakeText += '<p>Please navigate to the <a class="assessmentFailLink" href="' + chapterLink.href + '">Profile chapter</a> and begin again.</p><p>Read each chapter carefully before attempting to retake the assessment.</p><a class="redo assessmentFailLink" href="' + chapterLink.href + '">&larr; Back to Profile Chapter</a></div>';
        } else {
            //this is a chapter assessment
            retakeText += '<p>Read the chapter carefully before attempting to retake the assessment.</p><a class="redo assessmentFailLink" href="' + chapterLink.href + '">&larr; Back to Chapter&nbsp;' + (currentChapter + 1) + '</a></div>'
        }
        
        $('.bigImage').append(retakeText);
        
        // added for event handler
        $('.bigImage .assessmentFailLink').on('click', function () {
            navigateCO(chapterLink.onclick);
        });
        
        $('.overlay').fadeIn('fast');
        $('.imgCloser').click(function () {
            $('.overlay').fadeOut('fast');
        });
    }
    
    function quoteReplace(string) {
        var lsRegExp = /'/g;
        return String(string).replace(lsRegExp, "&#39;");
    }
    
    function showCongrat(scorePercent) {
        var congratsText;
        if (version == 'famWeb') {
            congratsText = '<p>Print your certificate of completion.<br><br><span class="assCertPop assBtn">Print Certificate</span></p>';
        } else {
            congratsText = '<p>Please go to the next unit and finish the rest of the course.';
            if (version != 'scorm')
            congratsText += '<br><br><span class="assBtn" onclick="FW.showHomePage();">Home</span>';
            congratsText += '</p>';
        }
        $('.congrats').remove();
        $('.bigImage').append('<div class="congrats"><h2>Congratulations!</h2><p> </p><p>You have completed the ' + projTitle + ' Final Assessment.</p><p>Your score: ' + scorePercent + '%</p>' + congratsText + '</div>');
        
        $('.overlay').fadeIn('fast');
        
        $('.assCertPop').click(function () {
            showCOCert();
        });
        
        $('.imgCloser').click(function () {
            $('.overlay').fadeOut('fast');
        });
    }
    
    function showCOCert() {
        var newWindow = window.open("", "", "status,height=565,width=712, menubar=yes,status=no,toolbar=no,resizable=no,scrollbars=no,directories=no,copyhistory=no");
        var newContent = '<HTML><HEAD><TITLE>' + projTitle + ' Certificate</TITLE><script src="js/assessmentCert.js"></script><script src="js/jquery.min.js"></script>';
        newContent += '<link href="css/styles.css" rel="stylesheet" type="text/css"/></HEAD>';
        newContent += '<BODY><div id="COCert"><img src="images/fam_cert.gif" width="712" height="568"  border="0"/><div id="language"></div><div id="name"></div> <div id="date"></div> <span class="assBtn" id="printCert">Print This Certificate</span></div><div id="inputname"><div class="inputHolder"><div id="CoCertlabel">';
        newContent += 'Please type your full name below as you wish it<br> To appear on your certificate.</div><div id="formAssmnt">';
        newContent += '<form name="formInput"><input name="fullname" type="text" value="Mr. John Doe" id="textInput"/><span class="assBtn" onclick=\'showCertificate(';
        newContent += "\"" + quoteReplace(projTitle) + "\"";
        newContent += ');\'>Submit</span></form></div></div></div>';
        newContent += "</BODY></HTML>";
        // write HTML to new window document
        newWindow.document.write(newContent);
        newWindow.document.close();
        // close layout stream
    }
    //show certificate
    
    function parseInlineNodes(xmlNode) {
        var string = "";
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var xPart = xmlNode.childNodes[i];
            //alert('node name: '+xPart.nodeName+'\nnode value: '+xPart.data);
            if (xPart.nodeName == '#text') {
                string += xPart.data;
                //  alert(xPart.data);
            } else {
                if (xPart.nodeName == "" || xPart.nodeName == null || xPart.nodeName == 'null') {
                    string += "";
                } else {
                    string += "<" + xPart.nodeName + ">";
                    //html tags (b, u, i etc.)
                    if (xPart.firstChild) {
                        string += xPart.firstChild.data;
                    }
                    string += "</" + xPart.nodeName + ">"
                }
            }
        }
        return string;
    }
    
    function findPosX(obj) {
        var curleft = 0;
        if (obj.offsetParent) {
            while (1) {
                curleft += obj.offsetLeft;
                if (! obj.offsetParent) {
                    break;
                }
                obj = obj.offsetParent;
            }
        } else if (obj.x) {
            curleft += obj.x;
        }
        return curleft;
    }
    
    function findPosY(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            while (1) {
                curtop += obj.offsetTop;
                if (! obj.offsetParent)
                break;
                obj = obj.offsetParent;
            }
        } else if (obj.y) {
            curtop += obj.y;
        }
        return curtop;
    }
}
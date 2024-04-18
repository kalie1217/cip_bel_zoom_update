// JavaScript Document
function Framework_class () {
    var courseProgressArray = new Array() // [moduleID][task:step]
    var logged_in_UserID
    var cookieDuration = 24 * 30 // default to 30 days
    var pth = window.location.pathname
    var applicationPath = pth.indexOf('home') >= 0 || pth.indexOf('mil') >= 0 || pth.indexOf('website') >= 0 ? '../': ''
    var Apple = {
    }
    var debugSuccess = 0
    this.currentStep = 1
    this.stepTitle = 'Step 1: Key Terms '
    this.progressStatus = {
        'noAttempt': 0, 'success': 1, 'inProgress': 2, 'failed': 3
    }
    this.language = getSimpleCookie('courseLanguage')
    
    if (this.language != courseLanguage) {
        var hours = 24 * 30
        this.language = courseLanguage
        setSimpleCookie('courseLanguage', courseLanguage, hours)
    }
    
    // alert( window.location.protocol );
    if (version == 'sa') {
        this.standalone = true
    }
    
    this.getUserID = function () {
        return logged_in_UserID
    }
    
    /*  -----------------------------------------------------------------------
    loadCourseProgress()
    
    Read the progress cookie and load up the internal progress array.
    
    -----------------------------------------------------------------------
     */
    
    this.loadCourseProgress = function () {
        if (version != 'famWeb') {
            if (typeof logged_in_UserID === 'undefined') return
            var progress
            
            // load array from cookie and/or database
            var cookieKey = logged_in_UserID.toLowerCase() + '_progress_' + this.language
            if (version == 'sa') {
                progress = getSimpleCookie(cookieKey)
            } else {
                var XML_HTTP = new XML_HTTP_class()
                var qs = create_qs([ 'email', logged_in_UserID.toLowerCase(), 'lang', this.language]) + '&cmd=6'
                //			alert( applicationPath + 'asp/engine.aspx' + ' --- ' + qs );
                XML_HTTP.post_form(applicationPath + 'asp/engine.aspx', qs)
                progress = XML_HTTP.get_response()
                //			alert('progress read from db --> ' + progress);
            }
            
            if (progress) {
                var tasks = progress.split('~')
                var taskCount = tasks.length
                for (i = 0; i < taskCount; i++) {
                    if (tasks[i] != '') {
                        taskDetails = tasks[i].split('-')
                        var moduleID = taskDetails[0]
                        var taskID = taskDetails[1]
                        var progress = taskDetails[2]
                        
                        var step = null
                        if (taskID.indexOf('steps') > 0) {
                            // ex: taskID = "2:steps"  <-- task is 2 --and-- setting progress for all steps in the format 100100
                            idx = taskID.indexOf(':')
                            taskID = taskID.substr(0, idx)
                            this.setStepStatus(moduleID, taskID, progress)
                        } else if (taskID.indexOf(':') > 0) {
                            // ex: taskID = "2:1"  <-- task is 2 --and-- setting progress for step #1
                            idx = taskID.indexOf(':')
                            step = taskID.substr(idx + 1)
                            taskID = taskID.substr(0, idx)
                            this.setProgress(progress, moduleID, taskID, step)
                        } else {
                            this.setProgress(progress, moduleID, taskID)
                        }
                    }
                }
            }
        }
    }
    
    /*  -----------------------------------------------------------------------
    showFrameworkToolbar([title])
    
    Build the contents of the framework toolbar.  This will include the
    title passed in (such as 'Task5: Translation Match'), the logged in
    user name, a logout button, and a home button.
    
    -----------------------------------------------------------------------
     */
    this.showFrameworkToolbar = function (title, showFullToolbar) {
        loc = document.location.href
        eval(w_source())
        var logoutLink = "<a href='javascript:FW.logout()'>Log Out</a>"
        var homeLink = loc.indexOf('home.html') == -1 ? "<a href='javascript:FW.showHomePage()'>Home</a>": ''
        
        var stepClassArray = new Array()
        for (var i = 1; i <= 6; i++) {
            stepClassArray[i] = i <= this.currentStep ? ' class=" boxed"': ''
        }
        
        var isHeadstart = loc.indexOf('headstart') > 0
        if (isHeadstart && ! this.debug) {
            var nextStep = parseInt(this.currentStep) + 1
            var parameters = '?moduleID=' + moduleID + '&taskID=' + taskID
            var nextStepURL = applicationPath + 'step' + this.currentStep + '.html' + parameters + '&step=' + nextStep
        }
        
        wl('<div id="toolbar_container">')
        wl('   <table>')
        wl('  <tr>')
        // wl('	<td colspan="7">');
        wl('	<td align="left" style="width:50%"><a id="TopTitle_left">Rapport:</a> <a id="TopTitle_right" style="color:#' + languageColor + '"> ' + toProperCase(courseLanguage) + ' </a></td>')
        wl('	<td class="b6" id="td_b6_1">&nbsp;</td>')
        wl('	<td align="right" class="home_logout">' + homeLink + '</td>')
        wl('	<td align="right">&nbsp;</td>')
        wl('	<td align="center"><img src="' + applicationPath + 'js/toolbar/images/dps/bar.jpg"></td>')
        wl('	<td align="left">&nbsp;</td>')
        wl('	<td align="left" class="home_logout">' + logoutLink + '</td>')
        wl('  </tr>')
        wl('</table>')
        wl('<tr>')
        if (isHeadstart) {
            wl('  <td colspan="7"><table class="sel1" style="background: url(' + applicationPath + 'js/toolbar/images/dps/head_toolbar2.jpg)">')
        } else {
            wl('  <td colspan="7"><table class="sel1" style="background: url(' + applicationPath + 'js/toolbar/images/dps/head_toolbar.jpg)">')
        }
        wl('	  <tr>')
        wl('		<td class="c3">&nbsp;</td>')
        wl('		<td nowrap id="taskTitle">' + title + '</td>')
        wl('		<td class="b6" id="td_b6_2">&nbsp;</td>')
        wl('		<td nowrap id="userArea">User: ' + logged_in_UserID + '</td>')
        wl('		<td class="c4" id="td_c4_1">&nbsp;</td>')
        wl('	</table></td>')
        wl('</tr>')
        
        showFullToolbar = typeof showFullToolbar === 'undefined' ? true: showFullToolbar
        
        if (showFullToolbar) {
            wl('<tr>')
            wl('  <td colspan="7"><table class="sel2">')
            wl('	  <tr>')
            wl('		<td class="c4">&nbsp;</td>')
            wl('		<td valign="top" align="left" nowrap><a><font color="#4f5e87" font size="1"><strong>' + this.stepTitle + '</strong></a></td>')
            wl('		<td class="b7">&nbsp;</td>')
            wl('		<td nowrap valign="top" align="left" class="step_numbers">STEPS &nbsp; ')
            wl('			<a href="' + applicationPath + 'headstart/step1.html' + parameters + '&step=1" ' + stepClassArray[1] + '>1</a>')
            wl('			<a href="' + applicationPath + 'headstart/step2.html' + parameters + '&step=2" ' + stepClassArray[2] + '>2</a>')
            wl('			<a href="' + applicationPath + 'headstart/step3.html' + parameters + '&step=3" ' + stepClassArray[3] + '>3</a>')
            wl('			<a href="' + applicationPath + 'headstart/step4.html' + parameters + '&step=4" ' + stepClassArray[4] + '>4</a>')
            wl('			<a href="' + applicationPath + 'headstart/step5.html' + parameters + '&step=5" ' + stepClassArray[5] + '>5</a>')
            wl('			<a href="' + applicationPath + 'headstart/step6.html' + parameters + '&step=6" ' + stepClassArray[6] + '>6</a> ')
            wl('		</td>')
            wl('		<td class="c5">&nbsp;</td>')
            wl('		<td nowrap class="step_numbers" id="standards_numbers">STANDARDS &nbsp; ')
            wl('		<a href="1_1.html">1</a>')
            wl('		<a href="1_1.html">2</a>')
            wl('		<a href="1_1.html">3</a>')
            wl('		<a href="1_1.html">4</a>')
            wl('		<a href="1_1.html"><<</a>')
            wl('		<a href="' + nextStepURL + '">>></a>')
            wl('		</td>')
            wl('		<td class="c4">&nbsp;</td>')
            wl('	</table></td>')
            wl('</tr>')
        }
        
        wl('</table></div>')
        
        function Framework_class () {
            var courseProgressArray = new Array() // [moduleID][task:step]
            var logged_in_UserID
            var cookieDuration = 24 * 30 // default to 30 days
            var pth = window.location.pathname
            // alert('hi from FW ' + pth)
            var applicationPath = pth.indexOf('home') >= 0 || pth.indexOf('mil') >= 0 || pth.indexOf('website') >= 0 ? '../': ''
            var Apple = {
            }
            var debugSuccess = 0
            this.currentStep = 1
            this.stepTitle = 'Step 1: Key Terms '
            this.progressStatus = {
                'noAttempt': 0, 'success': 1, 'inProgress': 2, 'failed': 3
            }
            this.language = getSimpleCookie('courseLanguage')
            
            if (this.language != courseLanguage) {
                var hours = 24 * 30
                this.language = courseLanguage
                setSimpleCookie('courseLanguage', courseLanguage, hours)
            }
            
            // alert( window.location.protocol );
            if (version == 'sa') {
                this.standalone = true
            }
            
            this.getUserID = function () {
                return logged_in_UserID
            }
            
            /*  -----------------------------------------------------------------------
            loadCourseProgress()
            
            Read the progress cookie and load up the internal progress array.
            
            -----------------------------------------------------------------------
             */
            this.loadCourseProgress = function () {
                if (typeof logged_in_UserID === 'undefined') return
                var progress
                
                // load array from cookie and/or database
                var cookieKey = logged_in_UserID.toLowerCase() + '_progress_' + this.language
                if (this.standalone) {
                    progress = getSimpleCookie(cookieKey)
                } else {
                    var XML_HTTP = new XML_HTTP_class()
                    var qs = create_qs([ 'email', logged_in_UserID.toLowerCase(), 'lang', this.language]) + '&cmd=6'
                    //			alert( applicationPath + 'asp/engine.aspx' + ' --- ' + qs );
                    XML_HTTP.post_form(applicationPath + 'asp/engine.aspx', qs)
                    progress = XML_HTTP.get_response()
                    //			alert('progress read from db --> ' + progress);
                }
                
                if (progress) {
                    var tasks = progress.split('~')
                    var taskCount = tasks.length
                    for (i = 0; i < taskCount; i++) {
                        if (tasks[i] != '') {
                            taskDetails = tasks[i].split('-')
                            var moduleID = taskDetails[0]
                            var taskID = taskDetails[1]
                            var progress = taskDetails[2]
                            
                            var step = null
                            if (taskID.indexOf('steps') > 0) {
                                // ex: taskID = "2:steps"  <-- task is 2 --and-- setting progress for all steps in the format 100100
                                idx = taskID.indexOf(':')
                                taskID = taskID.substr(0, idx)
                                this.setStepStatus(moduleID, taskID, progress)
                            } else if (taskID.indexOf(':') > 0) {
                                // ex: taskID = "2:1"  <-- task is 2 --and-- setting progress for step #1
                                idx = taskID.indexOf(':')
                                step = taskID.substr(idx + 1)
                                taskID = taskID.substr(0, idx)
                                this.setProgress(progress, moduleID, taskID, step)
                            } else {
                                this.setProgress(progress, moduleID, taskID)
                            }
                        }
                    }
                }
            }
            
            /*  -----------------------------------------------------------------------
            showFrameworkToolbar([title])
            
            Build the contents of the framework toolbar.  This will include the
            title passed in (such as 'Task5: Translation Match'), the logged in
            user name, a logout button, and a home button.
            
            -----------------------------------------------------------------------
             */
            this.showFrameworkToolbar = function (title, showFullToolbar) {
                loc = document.location.href
                eval(w_source())
                var logoutLink = "<a href='javascript:FW.logout()'>Log Out</a>"
                var homeLink = loc.indexOf('home.html') == -1 ? "<a href='javascript:FW.showHomePage()'>Home</a>": ''
                
                var stepClassArray = new Array()
                for (var i = 1; i <= 6; i++) {
                    stepClassArray[i] = i <= this.currentStep ? ' class=" boxed"': ''
                }
                
                var isHeadstart = loc.indexOf('headstart') > 0
                if (isHeadstart && ! this.debug) {
                    var nextStep = parseInt(this.currentStep) + 1
                    var parameters = '?moduleID=' + moduleID + '&taskID=' + taskID
                    var nextStepURL = applicationPath + 'step' + this.currentStep + '.html' + parameters + '&step=' + nextStep
                }
                
                wl('<div id="toolbar_container">')
                wl('   <table>')
                wl('  <tr>')
                // wl('	<td colspan="7">');
                wl('	<td align="left" style="width:50%;"><a id="TopTitle_left">Rapport:</a> <a id="TopTitle_right" style="color:#' + languageColor + '"> ' + toProperCase(courseLanguage) + ' </a></td>')
                wl('	<td class="b6" id="td_b6_1">&nbsp;</td>')
                wl('	<td align="right" class="home_logout">' + homeLink + '</td>')
                wl('	<td align="right">&nbsp;</td>')
                wl('	<td align="center"><img src="' + applicationPath + 'js/toolbar/images/dps/bar.jpg"></td>')
                wl('	<td align="left">&nbsp;</td>')
                wl('	<td align="left" class="home_logout">' + logoutLink + '</td>')
                wl('  </tr>')
                wl('</table>')
                wl('<tr>')
                if (isHeadstart) {
                    wl('  <td colspan="7"><table class="sel1" style="background: url(' + applicationPath + 'js/toolbar/images/dps/head_toolbar2.jpg)">')
                } else {
                    wl('  <td colspan="7"><table class="sel1" style="background: url(' + applicationPath + 'js/toolbar/images/dps/head_toolbar.jpg)">')
                }
                wl('	  <tr>')
                wl('		<td class="c3">&nbsp;</td>')
                wl('		<td nowrap id="taskTitle">' + title + '</td>')
                wl('		<td class="b6" id="td_b6_2">&nbsp;</td>')
                wl('		<td nowrap id="userArea">User: ' + logged_in_UserID + '</td>')
                wl('		<td class="c4" id="td_c4_1">&nbsp;</td>')
                wl('	</table></td>')
                wl('</tr>')
                
                showFullToolbar = typeof showFullToolbar === 'undefined' ? true: showFullToolbar
                
                if (showFullToolbar) {
                    wl('<tr>')
                    wl('  <td colspan="7"><table class="sel2">')
                    wl('	  <tr>')
                    wl('		<td class="c4">&nbsp;</td>')
                    wl('		<td valign="top" align="left" nowrap><a><font color="#4f5e87" font size="1"><strong>' + this.stepTitle + '</strong></a></td>')
                    wl('		<td class="b7">&nbsp;</td>')
                    wl('		<td nowrap valign="top" align="left" class="step_numbers">STEPS &nbsp; ')
                    wl('			<a href="' + applicationPath + 'headstart/step1.html' + parameters + '&step=1" ' + stepClassArray[1] + '>1</a>')
                    wl('			<a href="' + applicationPath + 'headstart/step2.html' + parameters + '&step=2" ' + stepClassArray[2] + '>2</a>')
                    wl('			<a href="' + applicationPath + 'headstart/step3.html' + parameters + '&step=3" ' + stepClassArray[3] + '>3</a>')
                    wl('			<a href="' + applicationPath + 'headstart/step4.html' + parameters + '&step=4" ' + stepClassArray[4] + '>4</a>')
                    wl('			<a href="' + applicationPath + 'headstart/step5.html' + parameters + '&step=5" ' + stepClassArray[5] + '>5</a>')
                    wl('			<a href="' + applicationPath + 'headstart/step6.html' + parameters + '&step=6" ' + stepClassArray[6] + '>6</a> ')
                    wl('		</td>')
                    wl('		<td class="c5">&nbsp;</td>')
                    wl('		<td nowrap class="step_numbers" id="standards_numbers">STANDARDS &nbsp; ')
                    wl('		<a href="1_1.html">1</a>')
                    wl('		<a href="1_1.html">2</a>')
                    wl('		<a href="1_1.html">3</a>')
                    wl('		<a href="1_1.html">4</a>')
                    wl('		<a href="1_1.html"><<</a>')
                    wl('		<a href="' + nextStepURL + '">>></a>')
                    wl('		</td>')
                    wl('		<td class="c4">&nbsp;</td>')
                    wl('	</table></td>')
                    wl('</tr>')
                }
                
                wl('</table></div>')
                
                xid('container_0').innerHTML = wr
                if (isHeadstart) {
                    xid('toolbar_container').style.width = '894px'
                    xid('td_b6_1').style.width = '550px'
                    xid('td_b6_2').style.width = '500px'
                    xid('toolbar_container').style.marginLeft = '0px'
                }
                // $('body').prepend(wr);
                
                // $('table.sell').attr('background', 'images/dps/head_toolbar.jpg');
            }
            
            /*  -----------------------------------------------------------------------
            signIn(userID, pw)
            
            Accepts the userID/pw submitted by the user and verifies against
            browser cookies.  If the user doesn't exist then the student is
            prompted to create a new user.
            
            -----------------------------------------------------------------------
             */
            this.signIn = function (userID, pw) {
                function addUserCookie (UserID, pw) {
                    if (confirm("User '" + userID + "' does not exist.  Would you like to create this new user?")) {
                        setSimpleCookie('logged_in_UserID', userID.toLowerCase(), cookieDuration)
                        setSimpleCookie(userID.toLowerCase(), pw.toLowerCase(), cookieDuration)
                        return true
                    }
                    return false
                }
                
                // on login, take the opportunity to get the root path of the course application.  This
                // is needed for navigating to login or home page when this class is used in subdirectories.
                pth = window.location.pathname
                idx = window.location.pathname.toString().lastIndexOf('/') + 1
                pth = pth.substring(0, idx)
                // setSimpleCookie('applicationPath', pth);
                
                // verify user in the cookie
                var cookiePW = getSimpleCookie(userID)
                if (cookiePW) {
                    if (cookiePW == pw) {
                        this.establishUser(userID, pw)
                    } else {
                        alert('Incorrect Password')
                    }
                } else {
                    if (addUserCookie(userID, pw)) this.showHomePage()
                }
            }
            
            this.establishUser = function (userID, pw) {
                logged_in_UserID = userID
                setSimpleCookie('logged_in_UserID', userID.toLowerCase(), cookieDuration)
                setSimpleCookie(userID.toLowerCase(), pw.toLowerCase(), cookieDuration)
                this.showHomePage()
            }
            
            /*  -----------------------------------------------------------------------
            logout()
            
            Write process, clear local user variable, clear cookie, show login
            
            -----------------------------------------------------------------------
             */
            this.logout = function () {
                this.writeProgress()
                logged_in_UserID = null
                setSimpleCookie('logged_in_UserID', '')
                this.showLogin()
            }
            
            this.showLogin = function () {
                if (version != 'famWeb') {
                    window.location = applicationPath + 'login.html'
                }
            }
            
            /*  -----------------------------------------------------------------------
            showHomePage()
            
            Simply links to the frameworks home page with the course outline.
            
            -----------------------------------------------------------------------
             */
            this.showHomePage = function () {
                // check our path
                window.location = applicationPath + 'home/toc.html'
            }
            
            /*  -----------------------------------------------------------------------
            getProgress(module, task, step)
            
            If only module is passed in, return status of module
            If module, task is passed in, return status of task
            If module, task, and step are all passed in... return status of step
            
            -----------------------------------------------------------------------
             */
            
            this.getProgress = function (module, task, step) {
                if (typeof courseProgressArray[module] === 'object') {
                    if (typeof courseProgressArray[module][task] !== 'undefined') {
                        // step not pssed in... give module status
                        return courseProgressArray[module][task]
                    }
                    
                    if (typeof courseProgressArray[module][task + ':' + step] !== 'undefined') {
                        // module, task, and step passed in
                        return courseProgressArray[module][task + ':' + step]
                    }
                    
                    if (typeof courseProgressArray[module][ 'status'] !== 'undefined') {
                        // step not pssed in... give module status
                        return courseProgressArray[module][ 'status']
                    }
                }
                
                return false
            }
            
            /*  -----------------------------------------------------------------------
            getStepStatus(moduleID, taskID, stepPosition)
            
            Assumes step values were stored using the setStepStatus() method.  Step
            values would look be six digits such as: 011011.  Each position indicates
            the success or failure/incomplete of a step in a task.
            
            The stepPosition is optional and will return just the specific value
            for the step passed in.
            
            Given this call:
            FW.setStepStatus(moduleID, taskID, '0001111');
            
            getStepStatus(moduleID, taskID); 		// returns 0001111
            getStepStatus(moduleID, taskID, 4); 	// returns 1 since 1 is in the 4th position
            
            -----------------------------------------------------------------------
             */
            this.getStepStatus = function (moduleID, taskID, stepPosition) {
                if (typeof courseProgressArray === 'undefined') return -1
                if (typeof courseProgressArray[moduleID] === 'undefined') return -1
                if (typeof moduleID === 'undefined' || typeof taskID === 'undefined') return -1
                
                if (typeof stepPosition !== 'undefined') {
                    // get specific step value
                    var stepValues = courseProgressArray[moduleID][taskID + ':steps']
                    if (stepPosition > stepValues.length) return -1
                    
                    // return the character at the stepPosition
                    return stepValues.charAt(stepPosition - 1)
                }
                
                // get the full set of step progress values
                if (typeof courseProgressArray[moduleID][taskID + ':steps'] === 'undefined') return -1
                // alert("courseProgressArray[moduleID][taskID + ':steps']: " + courseProgressArray[moduleID][taskID + ':steps'])
                return courseProgressArray[moduleID][taskID + ':steps']
            }
            
            this.setStepStatus = function (moduleID, taskID, stepValues) {
                if (typeof moduleID === 'undefined' || typeof taskID === 'undefined' || typeof stepValues === 'undefined') return false
                
                if (typeof courseProgressArray[moduleID] === 'undefined') {
                    courseProgressArray[moduleID] = new Array()
                }
                // alert('from setStepStatus stepValues: ' + stepValues)
                courseProgressArray[moduleID][taskID + ':steps'] = stepValues
            }
            
            /*  -----------------------------------------------------------------------
            setProgress(progress, module, task, step)
            
            If only module is passed in, set status of module
            If module, task is passed in, set status of task
            If module, task, and step are all passed in... set status of step
            
            -----------------------------------------------------------------------
             */
            this.setProgress = function (progress, module, task, step) {
                if (typeof courseProgressArray[module] === 'undefined') {
                    courseProgressArray[module] = new Array()
                }
                
                if (typeof step !== 'undefined') {
                    courseProgressArray[module][task + ':' + step] = progress
                } else if (typeof task !== 'undefined') {
                    courseProgressArray[module + ''][task + ''] = progress
                } else {
                    courseProgressArray[module][ 'status'] = progress
                }
            }
            
            /*  -----------------------------------------------------------------------
            writeProgress()
            
            Serialize the courseProgressArray and all it's contents, then write
            to a cookie identified with the currently logged in user.
            
            -----------------------------------------------------------------------
             */
            this.writeProgress = function () {
                if (logged_in_UserID) {
                    var output = ''
                    for (var module in courseProgressArray) {
                        for (var task in courseProgressArray[module]) {
                            if (typeof courseProgressArray[module][task] !== 'function') {
                                output += (module + '-' + task + '-' + courseProgressArray[module][task] + '~')
                            }
                        }
                    }
                    
                    if (output != '') {
                        if (this.standalone) {
                            setSimpleCookie(logged_in_UserID.toLowerCase() + '_progress_' + this.language, output, cookieDuration)
                        } else {
                            var XML_HTTP = new XML_HTTP_class()
                            var qs = create_qs([ 'email', logged_in_UserID.toLowerCase(), 'lang', this.language, 'progress', output]) + '&cmd=5'
                            //					alert( applicationPath + 'asp/engine.aspx' + ' --- ' + qs );
                            XML_HTTP.post_form(applicationPath + 'asp/engine.aspx', qs)
                            //					alert(XML_HTTP.get_response())
                            //					alert('write to db complete');
                        }
                    }
                }
            }
            
            // ----------------------------------------------------------------------
            // initialization
            // 		if userID is set the we look for the cookie.  If found, parse it
            //		and load up the progress array with all modules, tasks, steps
            // ----------------------------------------------------------------------
            {
                loc = document.location.href
                if (loc.indexOf('login.html') == -1) // don't try and launch the login if we're already there
                {
                    logged_in_UserID = getSimpleCookie('logged_in_UserID')
                    if (! logged_in_UserID) {
                        this.showLogin()
                    }
                }
                
                // Read progress in cookies into class array
                this.loadCourseProgress()
                
                // Ensure that when the page is unloaded that the progress is written
                if (typeof $(window) === 'object') {
                    // alert('unloading');
                    window.onunload = function () {
                        FW.writeProgress()
                    }
                    // $(window).unload(function() {
                    //		FW.writeProgress();
                    //	});
                }
                
                // Detect Flash Support, Local Database, iPhone/iPad
                Apple.UA = navigator.userAgent
                Apple.Device = false
                Apple.Types =[ 'iPhone', 'iPod', 'iPad']
                for (var d = 0; d < Apple.Types.length; d++) {
                    var t = Apple.Types[d]
                    Apple[t] = ! ! Apple.UA.match(new RegExp(t, 'i'))
                    Apple.Device = Apple.Device || Apple[t]
                }
                this.flashSupport = window.ActiveXObject
                this.localDatabaseSupport = window.openDatabase
                this.iPhone = Apple.iPhone
                this.iPad = Apple.iPad
                
                step = getURL_Parameter('step')
                if (step != 'undefined') {
                    this.currentStep = step
                }
                
                var debug = getURL_Parameter('debugSuccess')
                if (debug != 'undefined') {
                    this.debugSuccess = debug
                }
            }
        }
        
        if (isHeadstart) {
            xid('container_0').innerHTML = wr
            xid('toolbar_container').style.width = '894px'
            xid('td_b6_1').style.width = '550px'
            xid('td_b6_2').style.width = '500px'
            xid('toolbar_container').style.marginLeft = '0px'
        }
        // $('body').prepend(wr);
        
        // $('table.sell').attr('background', 'images/dps/head_toolbar.jpg');
    }
    
    /*  -----------------------------------------------------------------------
    signIn(userID, pw)
    
    Accepts the userID/pw submitted by the user and verifies against
    browser cookies.  If the user doesn't exist then the student is
    prompted to create a new user.
    
    -----------------------------------------------------------------------
     */
    this.signIn = function (userID, pw) {
        function addUserCookie (UserID, pw) {
            if (userID != '') {
                if (confirm("User '" + userID + "' does not exist.  Would you like to create this new user?")) {
                    setSimpleCookie('logged_in_UserID', userID.toLowerCase(), cookieDuration)
                    setSimpleCookie(userID.toLowerCase(), pw.toLowerCase(), cookieDuration)
                    return true
                }
            } else {
                alert('Please enter a user name.')
            }
            return false
        }
        
        // on login, take the opportunity to get the root path of the course application.  This
        // is needed for navigating to login or home page when this class is used in subdirectories.
        pth = window.location.pathname
        idx = window.location.pathname.toString().lastIndexOf('/') + 1
        pth = pth.substring(0, idx)
        // setSimpleCookie('applicationPath', pth);
        
        // verify user in the cookie
        var cookiePW = getSimpleCookie(userID)
        if (cookiePW) {
            if (cookiePW == pw) {
                this.establishUser(userID, pw)
            } else {
                alert('Incorrect Password')
            }
        } else {
            if (addUserCookie(userID, pw)) this.showHomePage()
        }
    }
    
    this.establishUser = function (userID, pw) {
        logged_in_UserID = userID
        setSimpleCookie('logged_in_UserID', userID.toLowerCase(), cookieDuration)
        setSimpleCookie(userID.toLowerCase(), pw.toLowerCase(), cookieDuration)
        this.showHomePage()
    }
    
    /*  -----------------------------------------------------------------------
    logout()
    
    Write process, clear local user variable, clear cookie, show login
    
    -----------------------------------------------------------------------
     */
    this.logout = function () {
        this.writeProgress()
        logged_in_UserID = null
        setSimpleCookie('logged_in_UserID', '')
        this.showLogin()
    }
    
    this.showLogin = function () {
        if (version != 'famWeb') {
            window.location = applicationPath + 'login.html'
        }
    }
    
    /*  -----------------------------------------------------------------------
    showHomePage()
    
    Simply links to the frameworks home page with the course outline.
    
    -----------------------------------------------------------------------
     */
    this.showHomePage = function () {
        // check our path
        window.location = applicationPath + 'home/toc.html'
    }
    
    /*  -----------------------------------------------------------------------
    getProgress(module, task, step)
    
    If only module is passed in, return status of module
    If module, task is passed in, return status of task
    If module, task, and step are all passed in... return status of step
    
    -----------------------------------------------------------------------
     */
    this.getProgress = function (module, task, step) {
        if (typeof courseProgressArray[module] === 'object') {
            if (typeof courseProgressArray[module][task] !== 'undefined') {
                // step not pssed in... give module status
                return courseProgressArray[module][task]
            }
            
            if (typeof courseProgressArray[module][task + ':' + step] !== 'undefined') {
                // module, task, and step passed in
                return courseProgressArray[module][task + ':' + step]
            }
            
            if (typeof courseProgressArray[module][ 'status'] !== 'undefined') {
                // step not pssed in... give module status
                return courseProgressArray[module][ 'status']
            }
        }
        return false
    }
    
    /*  -----------------------------------------------------------------------
    getStepStatus(moduleID, taskID, stepPosition)
    
    Assumes step values were stored using the setStepStatus() method.  Step
    values would look be six digits such as: 011011.  Each position indicates
    the success or failure/incomplete of a step in a task.
    
    The stepPosition is optional and will return just the specific value
    for the step passed in.
    
    Given this call:
    FW.setStepStatus(moduleID, taskID, '0001111');
    
    getStepStatus(moduleID, taskID); 		// returns 0001111
    getStepStatus(moduleID, taskID, 4); 	// returns 1 since 1 is in the 4th position
    
    -----------------------------------------------------------------------
     */
    this.getStepStatus = function (moduleID, taskID, stepPosition) {
        if (typeof courseProgressArray === 'undefined') return -1
        if (typeof courseProgressArray[moduleID] === 'undefined') return -1
        if (typeof moduleID === 'undefined' || typeof taskID === 'undefined') return -1
        
        if (typeof stepPosition !== 'undefined') {
            // get specific step value
            var stepValues = courseProgressArray[moduleID][taskID + ':steps']
            if (stepPosition > stepValues.length) return -1
            
            // return the character at the stepPosition
            return stepValues.charAt(stepPosition - 1)
        }
        
        // get the full set of step progress values
        if (typeof courseProgressArray[moduleID][taskID + ':steps'] === 'undefined') return -1
        // alert("courseProgressArray[moduleID][taskID + ':steps']: " + courseProgressArray[moduleID][taskID + ':steps'])
        return courseProgressArray[moduleID][taskID + ':steps']
    }
    
    this.setStepStatus = function (moduleID, taskID, stepValues) {
        if (typeof moduleID === 'undefined' || typeof taskID === 'undefined' || typeof stepValues === 'undefined') return false
        
        if (typeof courseProgressArray[moduleID] === 'undefined') {
            courseProgressArray[moduleID] = new Array()
        }
        // alert('from setStepStatus stepValues: ' + stepValues)
        courseProgressArray[moduleID][taskID + ':steps'] = stepValues
    }
    
    /*  -----------------------------------------------------------------------
    setProgress(progress, module, task, step)
    
    If only module is passed in, set status of module
    If module, task is passed in, set status of task
    If module, task, and step are all passed in... set status of step
    
    -----------------------------------------------------------------------
     */
    this.setProgress = function (progress, module, task, step) {
        if (typeof courseProgressArray[module] === 'undefined') {
            courseProgressArray[module] = new Array()
        }
        
        if (typeof step !== 'undefined') {
            courseProgressArray[module][task + ':' + step] = progress
        } else if (typeof task !== 'undefined') {
            courseProgressArray[module + ''][task + ''] = progress
        } else {
            courseProgressArray[module][ 'status'] = progress
        }
    }
    
    /*  -----------------------------------------------------------------------
    writeProgress()
    
    Serialize the courseProgressArray and all it's contents, then write
    to a cookie identified with the currently logged in user.
    
    -----------------------------------------------------------------------
     */
    this.writeProgress = function () {
        if (logged_in_UserID) {
            var output = ''
            for (var module in courseProgressArray) {
                for (var task in courseProgressArray[module]) {
                    if (typeof courseProgressArray[module][task] !== 'function') {
                        output += (module + '-' + task + '-' + courseProgressArray[module][task] + '~')
                    }
                }
            }
            
            if (output != '') {
                if (this.standalone) {
                    setSimpleCookie(logged_in_UserID.toLowerCase() + '_progress_' + this.language, output, cookieDuration)
                } else {
                    var XML_HTTP = new XML_HTTP_class()
                    var qs = create_qs([ 'email', logged_in_UserID.toLowerCase(), 'lang', this.language, 'progress', output]) + '&cmd=5'
                    //					alert( applicationPath + 'asp/engine.aspx' + ' --- ' + qs );
                    XML_HTTP.post_form(applicationPath + 'asp/engine.aspx', qs)
                    //					alert(XML_HTTP.get_response())
                    //					alert('write to db complete');
                }
            }
        }
    }
    
    // ----------------------------------------------------------------------
    // initialization
    // 		if userID is set the we look for the cookie.  If found, parse it
    //		and load up the progress array with all modules, tasks, steps
    // ----------------------------------------------------------------------
    {
        loc = document.location.href
        if (loc.indexOf('login.html') == -1) // don't try and launch the login if we're already there
        {
            logged_in_UserID = getSimpleCookie('logged_in_UserID')
            if (! logged_in_UserID) {
                this.showLogin()
            }
        }
        
        // Read progress in cookies into class array
        this.loadCourseProgress()
        
        // Ensure that when the page is unloaded that the progress is written
        if (typeof $(window) === 'object') {
            // alert('unloading');
            window.onunload = function () {
                FW.writeProgress()
            }
            // $(window).unload(function() {
            //		FW.writeProgress();
            //	});
        }
        
        // Detect Flash Support, Local Database, iPhone/iPad
        Apple.UA = navigator.userAgent
        Apple.Device = false
        Apple.Types =[ 'iPhone', 'iPod', 'iPad']
        for (var d = 0; d < Apple.Types.length; d++) {
            var t = Apple.Types[d]
            Apple[t] = ! ! Apple.UA.match(new RegExp(t, 'i'))
            Apple.Device = Apple.Device || Apple[t]
        }
        this.flashSupport = window.ActiveXObject
        this.localDatabaseSupport = window.openDatabase
        this.iPhone = Apple.iPhone
        this.iPad = Apple.iPad
        
        step = getURL_Parameter('step')
        if (step != 'undefined') {
            this.currentStep = step
        }
        
        var debug = getURL_Parameter('debugSuccess')
        if (debug != 'undefined') {
            this.debugSuccess = debug
        }
    }
}
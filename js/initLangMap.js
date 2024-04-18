function loadlangMap_HTML5() {
    
    //add support message for interactives on mobile
    if (! $('.AIsupport').length) {
        $('#div_content').prepend('<div class="IAsupport">The Language Map is not available on mobile devices.</div>');
    }
    
    $('#HTML5').append('<div id="langMap"><div class="langHeader"><div class="mainTitle"></div><div class="langMapInstImg">?</div></div><div class="langMapMap"></div><div class="langMapList"><ul></ul></div><div class="langMapInfo"><div></div></div><div class="langMapInst"><div class="langMapInstTitle"></div><div class="langCloseX">X</div><div class="langMapInstContent"></div></div></div>')
    
    //use XMLHttpRequest below to build the Language Map functionality
    function parseIt() {
        
        //assign variables from the XML to use in the interface
        var langData = this.responseText;
        var title = $(langData).find('title').text();
        var subtitle = $(langData).find('subtitle').text();
        var backgroundImage = $(langData).find('backgroundImage').text();
        var overlayImage = $(langData).find('overlayImage').text();
        var instructionsTitle = $(langData).find('instructions').attr('title');
        var instructionsText = $(langData).find('instructions').text();
        var items = $(langData).find('item').length;
        
        //build out the interface pieces
        
        $('.langMapInstTitle').text(instructionsTitle);
        $('.langMapInstContent').text(instructionsText);
        $('.mainTitle').html(title + ' | <span>' + subtitle + '</span>');
        $('.langMapMap').append('<img src="images/langMap/' + backgroundImage + '" /><div class="langOverlay" style="background:url(images/langMap/' + overlayImage + ');"></div>');
        
        //populate the list with the languages from the xml
        for (var i = 0; i < items; i++) {
            $('.langMapList ul').append('<li>' + $(langData).find('item').eq(i).attr('title') + '</li>');
        }
        
        //mouseover language to move the overlay map to the corresponding
        //position. If the languages are in the same order as the overlay
        //this works automagically.
        $('.langMapList ul li').hover(function () {
            var ypos = $(this).index() + 1;
            $('.langOverlay').css('background-position', '-10px -' + ypos * 360 + 'px');
        });
        
        //show/hide info about each language
        $('.langMapList ul li').hover(function () {
            $('.langMapInfo div').stop(true, true).fadeOut('fast');
            var langText = $(langData).find('item').eq($(this).index()).text();
            $('.langMapInfo div').html(langText);
            $('.langMapInfo div').stop(true, true).fadeIn('fast');
        });
    }
    //end parseIt()
    
    // XMLHttpRequest grabs the XML and sends it to the parseIt() function
    var getXML = new XMLHttpRequest();
    getXML.addEventListener("load", parseIt);
    getXML.open("GET", "xml/co_" + projCode + "_langMapHTML5.xml");
    getXML.send();
    
    //toggle Language Map instructions
    function instructions() {
        if ($('.langMapInst').is(':visible')) {
            $('.langMapInst').fadeOut('fast');
        } else {
            $('.langMapInst').fadeIn('fast');
        }
    }
    
    //assign things to open/close instructions
    $('.langCloseX, .langMapInstImg').click(function () {
        instructions();
    });
}
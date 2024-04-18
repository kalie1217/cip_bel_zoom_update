var footnoteOpenId;
function FamNote() {
    
    var notes = new Array();
    var _window;
    
    this.loadNote = function (note) {
        notes.push(note);
    }
    
    this.displayNote = function (elem) {
        //elem is the clicked note
        var index = parseInt($(elem).attr("id").replace("footnote", ""));
        loadFootnote(elem, $(elem).attr("id"), notes[index -1], index, top);
    }
    
    this.resetNotes = function () {
        notes =[];
    }
}

function hyperLinkFootNote(note, index) {
    if (note.indexOf("http") != -1) {
        var array = note.split("http");
        note = '<span>' + index + ". " + array[0] + '</span><span> <a href="http' + array[1] + '\" target="_blank">View source here.</a></span>';
    } else if (note.indexOf("ftp://") != -1) {
        var array = note.split("ftp://");
        note = '<span>' + index + ". " + array[0] + '</span><span> <a href="ftp://' + array[1] + '\" target="_blank">View source here.</a></span>';
    } else if (note.indexOf("www.") != -1) {
        var array = note.split("www.");
        note = '<span>' + index + ". " + array[0] + '</span><span> <a href="http://www.' + array[1] + '\" target="_blank">View source here.</a></span>';
    } else {
        note = index + ". " + note;
    }
    return note;
}

function loadFootnote(elem, id, text, index) {
    if ((footnoteOpenId != "") && (footnoteOpenId == id)) {
        if ($("#footnoteDiv").length) {
            $("#footnoteDiv, .chuck").remove();
        }
        footnoteOpenId = "";
    } else {
        footnoteOpenId = id;
        
        if ($("#footnoteDiv").length) {
            $("#footnoteDiv, .chuck").remove();
        }
        
        var string = "<div id='footnoteDiv'><div id='footnoteBody'></div></div><div class='chuck downChuck'><div class='innerChuck'></div></div>";
        
        $(elem).parent($('.paragraphContent')).append(string);
        
        $("#footnoteBody").html("<div class='footnoteTitle'>Footnote: <span id='footnoteCloseBtn'>X</span></div><hr>");
        
        $('#footnoteDiv').append("<div class='footnoteText'>" + hyperLinkFootNote(text, index) + "</div>");
        
        //position footnote on page
        var top = $(elem).position().top;
        var left = $(elem).position().left;
        if (left > $('#footnoteDiv').width()) {
            $('#footnoteDiv').css('left', left - $('#footnoteDiv').width() + 15 + 'px');
        } else if (left <= 15) {
            $('#footnoteDiv').css('left', '-10px');
        }
        
        if ($(elem).position().top < $('#footnoteDiv').height() + 50) {
            $('#footnoteDiv').css('top', top + 28 + 'px');
            $('.chuck').removeClass('downChuck').css('top', top + 12 + 'px');
        } else {
            $('#footnoteDiv').css('top', top - $('#footnoteDiv').height() - 12 + 'px');
            $('.chuck').css('top', $(elem).position().top - 11 + 'px');
        }
        
        $('.chuck').css('left', left - 6 + 'px');
        
        $("#footnoteBody, #footnoteCloseBtn").click(function () {
            $("#footnoteDiv, .chuck").fadeOut('fast').promise().done(function () {
                $("#footnoteDiv, .chuck").remove();
            });
            footnoteOpenId = "";
        });
    }
}
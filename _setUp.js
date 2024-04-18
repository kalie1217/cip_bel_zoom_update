// Follow the steps below to create new languages and versions
var HS2testMode = false;

// 1. Set the course language (lowercase)
var courseLanguage = "Portuguese-Brazil";

// 2. set the project title for the CO (this appears in the CO certificate among other places)
var projTitle = "Portuguese-Brazil Cultural Orientation";

// 3. set the 2 character language code (example: Thai is "th")
var projCode  = "pq";

// 4. set version for Rapport Web, Fam Web, Standalone, or SCORM
var version = 'famWeb'; // 'rapportWeb' | 'famWeb' | 'sa' | 'scorm'

// 5. set the hexidecimal color code for this language
var languageColor = "1db778"; 

// 6. set the text color (for words that appear with the language color as background)
var textColor = "ffffff";

// 7. footer text: set the date that the content was completed
var completeDate = "2018 DLIFLC";

// 8. set the number of pages in each chapter
var pageTotals  = [25,23,15,14,21,17,1,1];

/*PAGETOTAL HELP: This is an array of the Rapport CO chapters, with each value being the number of pages in that chapter.

Like this: [Profile,Religion,Traditions,Urban Life,Rural Life,Family Life,Resources,Assessment]

Once you have your xml files in place, you can automatically generate the array by opening the project in firefox, pasting the line below into the browser's console:

getPageTotals();

*/





//if you want to test the Rapport certificate, set to true
var testCert = false;

//creates a button that automatically passes HeadStart modules for testing
var HS2testMode = false;


//run this with getPageTotals(); in your console
var chapterCount = 0;
var themTotals = [];
var getPageTotals = function() {
  if(chapterCount < 8){
    if(window.location.pathname.split("/").pop() == 'login.html'){
      var tempPath = './website/xml/co_'+ projCode +'_chap_'+ (chapterCount+1) +'.xml';
    } else {
      var tempPath = '../website/xml/co_'+ projCode +'_chap_'+ (chapterCount+1) +'.xml';
    }
    $.ajax({
      type: "GET",
      url: tempPath,
      dataType: "xml",
      success: function(xml) {
        var next = xml.getElementsByTagName('fam:page').length;
        themTotals.push(next);
        chapterCount++;
        getPageTotals();
      }
    });
  } else {
    console.log('var pageTotals = ['+ themTotals +'];');
  }
}

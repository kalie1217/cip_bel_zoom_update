//MJR 2017
function zoomInit() {

  var pauseLevelOne = false;
  var pauseLevelTwo = false;


  //add support message for interactives on mobile
	if(!$('.AIsupport').length){
		$('#div_content').prepend('<div class="IAsupport">The Zoom Map is not available on mobile devices.</div>');
	}

  var zoomData = this.responseText;
  var title = $(zoomData).find('title').text();
  var subtitle = $(zoomData).find('subtitle').text();
  var country = $(zoomData).find('targetCountry').text().toLowerCase();
  var contArr = ['northAmerica', 'southAmerica', 'africa', 'europe', 'asia', 'oceania'];
  var whichCont;
  var whichRegion;
  var whichContCap;
  var whichRegionCap;

  //make some arrays and push the XML data to them for later use
  var countriesArr = [];
  var dropXArr = [];
  var dropYArr = [];
  var coordsArr = [];
  $(zoomData).find('country').each(function(){
    var countryFormat = $(this).text().replace(/\s+/g, '_');
    countryFormat = countryFormat.toLowerCase();
    countriesArr.push(countryFormat);
    dropXArr.push($(this).attr('dropX'));
    dropYArr.push($(this).attr('dropY'));
    coordsArr.push($(this).attr('coords'));
  });

  //since we have to support old browsers, we need to use image maps
  var continentsMap = '<area class="cont" id="northAmerica" shape="poly" alt="North America" coords="117,184, 120,177, 120,174, 121,169, 124,166, 132,165, 142,163, 147,161, 151,154, 134,149, 117,140, 117,132, 129,116, 139,111, 158,104, 165,104, 172,104, 172,88, 153,71, 154,59, 162,59, 179,74, 196,70, 238,47, 253,21, 211,16, 93,22, 26,37, 21,46, 3,50, 3,82, 17,100, 19,106, 20,123, 49,154, 55,154, 61,162, 106,184, 117,184"><area class="cont" id="southAmerica" shape="poly" alt="South America" coords="122,174, 116,185, 109,196, 105,208, 113,231, 127,240, 127,261, 121,275, 118,298, 119,312, 131,320, 144,320, 148,316, 140,307, 145,297, 180,263, 183,253, 198,247, 201,228, 211,216, 209,205, 186,196, 140,168, 127,168, 122,174"><area class="cont" id="africa" shape="poly" alt="Africa" coords="322,278, 341,272, 354,255, 358,240, 366,240, 366,250, 366,256, 375,256, 383,247, 389,225, 383,218, 376,218, 363,236, 366,218, 361,210, 383,187, 389,168, 371,172, 362,162, 344,127, 322,125, 301,120, 297,115, 280,115, 272,120, 258,121, 238,147, 238,176, 254,189, 274,192, 281,188, 291,194, 299,218, 298,237, 306,261, 322,278"><area class="cont" id="europe" shape="poly" alt="Europe" coords="344,44, 342,47, 343,56, 342,60, 339,64, 339,66, 337,68, 341,71, 341,74, 344,76, 344,78, 348,82, 351,82, 353,85, 352,88, 353,91, 357,93, 357,95, 359,97, 339,109, 335,109, 335,112, 335,117, 338,120, 349,120, 349,122, 347,124, 328,124, 311,121, 300,116, 291,114, 282,115, 275,118, 269,119, 259,120, 256,117, 254,102, 256,100, 272,100, 265,95, 254,87, 254,78, 274,64, 285,80, 292,74, 284,62, 306,48, 331,36, 340,39, 344,44"><area class="cont" id="asia" shape="poly" alt="Asia" coords="353,139, 349,139, 345,128, 353,120, 349,119, 336,119, 335,117, 335,109, 339,109, 359,97, 357,95, 357,93, 353,91, 352,87, 353,85, 351,82, 348,82, 344,78, 344,76, 341,74, 341,71, 337,68, 339,66, 339,64, 342,60, 343,56, 342,47, 344,44, 350,42, 366,45, 378,44, 382,42, 385,36, 397,27, 424,25, 427,30, 468,25, 465,20, 479,15, 484,18, 491,19, 502,20, 504,25, 522,25, 522,30, 564,31, 569,25, 613,27, 604,34, 650,38, 650,64, 634,67, 618,84, 611,86, 604,70, 579,71, 588,77, 587,95, 590,100, 580,122, 552,131, 548,126, 541,126, 538,139, 541,160, 549,180, 548,186, 534,191, 547,193, 554,201, 560,195, 585,201, 602,219, 598,226, 588,218, 578,221, 568,215, 569,210, 544,203, 542,211, 553,216, 540,225, 527,221, 500,216, 477,188, 475,180, 485,184, 480,168, 473,165, 471,156, 462,157, 451,166, 450,172, 453,182, 450,187, 443,186, 438,182, 428,157, 418,147, 402,145, 405,150, 403,159, 391,166, 369,172, 353,144, 353,139"><area class="cont" id="oceania" shape="poly" alt="Oceania" coords="594,298, 588,298, 585,288, 567,277, 556,272, 546,272, 530,277, 525,277, 522,276, 521,272, 521,267, 515,255, 515,248, 520,241, 532,238, 541,230, 549,222, 552,224, 562,219, 571,223, 572,229, 576,231, 581,221, 586,220, 597,238, 606,249, 610,255, 609,270, 604,280, 598,298, 594,298">';
//northAmerica
  var northAmericaMap ='<map name="northAmerica_Map"><area class="region" id="___" shape="poly" alt="___ North America" coords="___"></map>';
//southAmerica
  var southAmericaMap ='<map name="southAmerica_Map"><area class="region" id="caribbeanSouthAmerica" shape="poly" alt="Caribbean South America" coords="362,55, 360,51, 356,50, 351,49, 342,46, 337,43, 327,34, 322,28, 316,22, 308,25, 300,27, 290,25, 282,21, 276,21, 273,25, 270,31, 268,28, 267,25, 265,23, 263,25, 262,32, 266,39, 273,41, 279,44, 286,47, 286,48, 288,58, 289,68, 290,72, 293,73, 303,70, 308,64, 303,59, 301,57, 305,57, 311,58, 316,55, 318,53, 320,53, 323,58, 322,62, 322,69, 329,72, 341,68, 346,66, 352,67, 357,66, 360,60, 361,59, 362,57, 362,55"><area class="region" id="easternSouthAmerica" shape="poly" alt="Eastern South America" coords="448,108, 445,103, 440,101, 435,98, 418,90, 406,87, 396,82, 391,80, 385,74, 381,67, 375,63, 370,59, 361,55, 357,57, 356,61, 355,63, 352,64, 342,62, 333,66, 329,68, 325,68, 322,65, 321,58, 322,51, 322,48, 321,47, 317,49, 310,54, 302,53, 298,54, 300,57, 303,59, 305,63, 302,66, 296,69, 293,70, 290,69, 286,67, 281,67, 276,71, 275,75, 277,78, 278,81, 276,93, 273,96, 269,97, 260,105, 258,116, 262,124, 271,126, 273,128, 274,131, 277,131, 291,127, 295,125, 297,129, 299,136, 304,140, 316,145, 320,150, 321,156, 326,160, 331,164, 331,170, 328,174, 323,175, 317,176, 312,178, 309,185, 309,191, 317,198, 325,203, 329,206, 328,211, 327,216, 332,218, 340,217, 345,212, 349,210, 348,215, 342,220, 333,229, 329,240, 327,247, 327,251, 328,254, 337,254, 340,252, 349,246, 357,242, 364,236, 376,221, 381,214, 383,207, 384,202, 389,199, 400,194, 412,189, 415,187, 423,172, 427,156, 428,148, 431,140, 438,130, 446,121, 449,115, 448,108"> <area class="region" id="southernPeninsula" shape="poly" alt="Southern Peninsula" coords="349,247, 344,246, 335,253, 333,255, 330,254, 327,249, 332,233, 343,218, 345,216, 346,213, 343,213, 338,217, 332,219, 327,216, 326,212, 328,209, 327,204, 318,199, 310,193, 300,189, 289,191, 284,192, 281,187, 280,178, 278,172, 275,169, 273,173, 273,184, 271,207, 268,230, 266,239, 260,260, 259,282, 260,287, 262,289, 261,291, 258,301, 256,311, 255,322, 254,332, 254,335, 257,339, 267,349, 281,349, 290,346, 293,346, 295,344, 293,342, 290,342, 285,341, 284,337, 284,332, 288,328, 292,327, 293,324, 289,317, 286,314, 289,310, 294,307, 297,302, 301,300, 305,297, 301,293, 298,291, 301,290, 308,288, 308,281, 309,277, 313,277, 326,275, 335,265, 341,257, 348,251, 349,249, 349,247"><area class="region" id="andeanSouthAmerica" shape="poly" alt="Andean South America" coords="330,164, 324,158, 321,156, 320,154, 318,146, 312,142, 303,138, 297,130, 294,126, 289,127, 277,131, 274,131, 273,129, 272,125, 268,125, 261,123, 258,117, 261,106, 269,98, 278,89, 276,76, 276,72, 278,69, 280,69, 286,68, 288,63, 288,55, 287,49, 284,45, 273,39, 266,33, 263,25, 260,20, 255,19, 248,24, 241,33, 238,41, 237,59, 228,74, 224,83, 223,93, 221,101, 221,104, 224,108, 235,123, 241,139, 248,151, 259,158, 269,165, 274,169, 279,173, 280,179, 285,196, 286,196, 291,193, 296,193, 304,192, 308,186, 314,178, 324,176, 331,172, 330,164"></map>';
//africa
  var africaMap = '<map name="africa_Map"><area class="region" id="westAfrica" shape="poly" alt="West Africa" coords="301,87, 299,82, 295,75, 289,72, 281,71, 274,74, 249,90, 244,92, 237,89, 202,64, 183,53, 181,53, 179,57, 175,59, 171,59, 165,60, 164,66, 163,70, 160,73, 158,77, 158,81, 155,81, 143,81, 140,82, 140,86, 143,96, 142,107, 138,114, 138,115, 140,118, 140,122, 141,128, 147,132, 153,137, 158,144, 163,150, 176,160, 184,164, 193,162, 200,160, 207,161, 217,161, 227,157, 241,155, 245,157, 248,161, 252,165, 257,165, 264,163, 268,158, 271,155, 275,155, 278,154, 280,152, 286,141, 293,132, 293,125, 290,116, 295,108, 299,98, 301,91, 301,87"><area class="region" id="northAfrica" shape="poly" alt="North Africa" coords="394,67, 388,53, 387,52, 388,51, 392,46, 391,40, 388,35, 383,34, 374,33, 365,35, 363,35, 336,27, 329,26, 322,28, 320,33, 318,37, 314,37, 302,34, 299,32, 294,27, 287,26, 280,24, 274,21, 273,20, 274,18, 276,15, 275,11, 275,10, 273,6, 268,5, 243,6, 216,13, 207,15, 197,13, 192,14, 183,23, 177,28, 175,34, 172,44, 165,48, 156,55, 150,64, 140,79, 140,82, 155,82, 159,81, 159,77, 161,73, 164,71, 165,67, 166,61, 172,60, 177,59, 182,56, 184,55, 187,57, 226,82, 236,89, 239,94, 243,94, 258,86, 272,76, 278,73, 284,72, 301,73, 308,75, 335,89, 341,90, 344,85, 346,82, 349,81, 381,80, 393,76, 396,72, 394,67"><area class="region" id="eastAfrica" shape="poly" alt="East Africa" coords="468,128, 454,131, 440,134, 435,132, 432,128, 433,125, 431,123, 424,116, 420,113, 418,109, 414,108, 413,105, 412,102, 409,97, 404,92, 403,85, 402,79, 396,74, 389,76, 383,78, 357,79, 348,79, 344,79, 343,83, 341,88, 338,91, 338,94, 338,103, 335,109, 329,117, 330,127, 336,140, 340,146, 353,160, 357,164, 362,165, 367,166, 376,170, 385,168, 396,166, 406,169, 411,170, 416,168, 420,168, 423,169, 423,171, 421,180, 421,190, 423,194, 426,192, 435,183, 444,175, 456,165, 469,141, 471,131, 471,128, 468,128"><area class="region" id="southeastAfrica" shape="poly" alt="South East Africa" coords="467,256, 462,246, 461,249, 459,251, 452,259, 446,263, 439,266, 420,260, 420,256, 420,252, 420,242, 416,233, 414,229, 414,223, 414,220, 413,213, 416,205, 420,199, 422,191, 422,173, 423,171, 423,169, 417,169, 412,171, 408,169, 396,165, 389,165, 383,169, 376,169, 372,171, 372,175, 370,181, 367,186, 366,191, 366,194, 369,195, 372,196, 371,199, 369,206, 363,211, 363,213, 370,226, 374,231, 381,235, 384,239, 383,248, 380,255, 373,259, 370,260, 369,263, 374,267, 381,271, 382,280, 380,289, 375,296, 374,299, 375,303, 378,308, 378,315, 379,320, 381,320, 382,318, 384,311, 390,308, 395,305, 395,300, 393,289, 394,282, 402,275, 412,269, 419,263, 437,269, 437,278, 437,285, 434,293, 434,302, 436,308, 441,311, 448,310, 453,305, 460,286, 465,266, 466,264, 468,265, 468,261, 467,256"><area class="region" id="southAfrica" shape="poly" alt="South Africa" coords="382,266, 379,263, 363,263, 355,271, 346,274, 336,273, 327,275, 312,273, 310,272, 294,271, 278,271, 278,273, 290,294, 292,301, 293,309, 295,318, 301,326, 309,342, 309,347, 311,351, 316,355, 319,355, 327,353, 336,352, 355,348, 369,335, 378,326, 380,322, 378,318, 377,314, 377,308, 374,302, 373,297, 376,294, 379,290, 382,285, 382,266"><area class="region" id="centralAfrica" shape="poly" alt="Central Africa" coords="376,229, 371,224, 368,218, 366,212, 368,208, 371,205, 370,200, 370,198, 372,195, 369,193, 367,192, 367,190, 368,185, 371,181, 374,176, 373,171, 370,167, 366,165, 357,163, 352,157, 345,150, 336,138, 330,123, 331,116, 336,110, 340,103, 339,93, 336,88, 327,83, 315,78, 303,71, 298,71, 296,77, 297,83, 298,96, 293,108, 289,116, 293,124, 294,127, 293,129, 287,138, 282,148, 279,152, 277,154, 271,153, 267,156, 264,161, 264,165, 269,168, 269,174, 268,182, 266,189, 267,194, 270,199, 280,210, 285,224, 289,242, 288,245, 283,253, 280,263, 279,269, 286,271, 300,272, 313,274, 321,276, 354,276, 360,269, 368,264, 380,257, 383,252, 384,245, 385,240, 385,236, 376,229"></map>';
//europe
  var europeMap ='<map name="europe_Map"><area class="region" id="westernEurope" shape="poly" alt="Western Europe" coords="367,224, 361,224, 355,226, 350,227, 341,222, 333,215, 332,213, 333,210, 344,206, 354,204, 358,202, 357,199, 355,194, 353,190, 352,185, 352,178, 346,174, 344,174, 344,172, 343,169, 340,170, 325,175, 322,175, 320,174, 319,172, 317,171, 313,170, 311,166, 309,165, 298,165, 295,169, 297,172, 296,174, 290,177, 269,180, 263,182, 261,187, 257,192, 248,199, 237,202, 235,203, 232,199, 234,193, 235,188, 229,185, 223,184, 222,183, 218,175, 211,170, 205,165, 199,158, 191,155, 200,144, 201,142, 198,141, 188,140, 185,141, 182,140, 184,137, 187,135, 189,133, 186,132, 173,132, 171,132, 167,138, 163,144, 160,141, 156,143, 159,146, 160,152, 160,154, 160,157, 159,159, 162,159, 165,157, 165,160, 165,163, 168,162, 170,160, 171,159, 173,159, 173,163, 171,167, 175,168, 179,168, 182,168, 184,168, 187,173, 189,177, 186,181, 180,181, 177,180, 176,182, 176,182, 161,181, 161,180, 161,176, 164,173, 167,171, 165,168, 154,163, 141,164, 138,166, 137,169, 137,172, 134,172, 128,172, 126,172, 125,174, 124,178, 127,182, 130,184, 128,187, 124,191, 122,193, 123,196, 128,198, 133,198, 143,195, 153,192, 160,189, 162,184, 175,184, 175,186, 178,186, 180,188, 178,191, 172,193, 170,194, 170,196, 173,197, 179,197, 184,200, 174,205, 166,211, 169,212, 175,209, 182,209, 188,206, 193,206, 201,206, 208,205, 216,205, 225,204, 231,210, 224,213, 220,215, 213,218, 206,216, 201,216, 201,217, 202,219, 203,222, 201,224, 197,225, 193,225, 184,223, 176,225, 174,227, 176,230, 180,233, 196,238, 198,241, 201,244, 205,248, 206,253, 206,263, 203,273, 201,276, 203,278, 210,281, 218,281, 225,282, 235,287, 238,287, 241,285, 246,284, 247,279, 250,275, 256,273, 268,275, 276,276, 283,274, 285,272, 284,269, 281,264, 282,260, 289,253, 298,251, 306,251, 313,248, 315,247, 338,247, 341,249, 343,251, 344,248, 345,244, 349,244, 355,244, 360,241, 365,240, 370,240, 373,236, 375,234, 378,234, 378,233, 374,227, 367,224"><area class="region" id="northernEurope" shape="poly" alt="Northern Europe" coords="506,24, 504,22, 495,19, 484,20, 483,19, 478,16, 472,19, 470,21, 469,22, 467,19, 465,18, 461,18, 459,15, 457,15, 450,18, 444,18, 441,19, 436,20, 431,20, 427,20, 425,23, 423,24, 420,23, 418,26, 416,27, 414,26, 410,25, 410,30, 404,25, 397,25, 394,26, 388,29, 382,31, 378,32, 377,36, 374,38, 373,37, 370,36, 368,34, 367,33, 365,34, 358,37, 355,37, 354,40, 353,42, 350,42, 340,46, 360,43, 353,51, 344,56, 339,59, 334,63, 333,64, 330,71, 322,73, 320,73, 320,76, 318,78, 310,83, 306,86, 301,85, 299,85, 284,93, 269,99, 266,101, 265,105, 264,108, 262,109, 262,110, 265,115, 266,121, 268,126, 273,126, 272,128, 270,131, 272,134, 286,139, 300,134, 309,131, 317,126, 318,127, 322,132, 327,141, 335,149, 337,153, 334,155, 330,157, 326,158, 323,159, 322,161, 325,165, 327,166, 322,167, 319,164, 317,161, 313,160, 318,155, 320,153, 318,152, 315,150, 316,147, 316,142, 312,142, 299,147, 296,148, 294,154, 295,161, 297,165, 303,166, 311,166, 318,170, 324,171, 331,168, 334,163, 336,161, 337,158, 343,163, 350,163, 351,162, 355,156, 362,156, 371,153, 377,146, 375,147, 373,147, 373,145, 374,143, 375,138, 377,133, 383,131, 394,123, 394,119, 384,114, 379,111, 380,105, 386,95, 395,90, 406,86, 417,80, 418,77, 418,72, 422,70, 434,66, 447,67, 451,68, 453,72, 452,73, 450,73, 447,74, 431,84, 417,92, 416,97, 418,105, 416,113, 416,118, 420,119, 441,120, 462,117, 471,116, 478,113, 481,105, 485,82, 485,78, 482,75, 480,70, 480,69, 478,63, 479,57, 479,52, 479,49, 476,46, 474,40, 477,34, 490,31, 498,31, 503,29, 498,28, 492,26, 506,24"><area class="region" id="easternEurope" shape="poly" alt="Eastern Europe" coords="582,218, 570,214, 557,213, 549,209, 548,207, 540,200, 531,194, 519,193, 515,193, 514,189, 516,187, 519,187, 522,185, 524,183, 523,180, 520,178, 514,175, 510,172, 509,166, 507,159, 500,157, 490,156, 482,151, 478,140, 479,128, 479,123, 477,122, 475,123, 468,123, 462,121, 455,121, 447,123, 438,125, 435,128, 437,132, 443,137, 445,140, 443,144, 441,147, 436,146, 434,143, 428,140, 421,141, 415,147, 414,154, 413,161, 408,164, 402,169, 398,171, 394,169, 390,166, 386,166, 368,171, 356,174, 354,174, 353,175, 352,182, 353,188, 357,200, 355,203, 343,206, 331,210, 331,213, 338,221, 347,227, 355,226, 363,224, 371,225, 375,229, 373,235, 370,240, 372,246, 382,252, 393,252, 398,250, 404,249, 410,252, 421,261, 426,263, 428,266, 427,271, 428,274, 430,278, 427,280, 426,281, 427,284, 429,287, 430,291, 435,293, 445,292, 455,294, 458,294, 464,288, 472,287, 474,287, 477,286, 476,282, 477,278, 480,275, 485,268, 487,263, 492,261, 494,258, 499,251, 506,245, 512,245, 518,249, 526,249, 528,250, 525,252, 522,255, 528,258, 530,261, 532,264, 537,264, 554,259, 557,256, 556,254, 553,255, 548,255, 544,251, 545,247, 568,241, 585,238, 590,236, 591,231, 594,225, 594,224, 588,220, 582,218"><area class="region" id="southEasternEurope" shape="poly" alt="Souteastern Europe" coords="431,271, 431,267, 428,264, 418,259, 411,250, 405,248, 397,249, 387,252, 377,247, 368,240, 355,240, 349,240, 345,241, 344,245, 344,251, 345,254, 346,257, 348,260, 352,259, 356,258, 358,261, 365,271, 376,276, 388,283, 398,290, 399,294, 398,299, 401,303, 407,304, 412,302, 424,298, 428,296, 432,293, 432,276, 430,274, 431,271"><area class="region" id="southernEurope" shape="poly" alt="Southern Europe" coords="538,345, 529,347, 521,350, 520,351, 462,351, 452,348, 443,347, 440,347, 433,337, 434,334, 432,332, 432,329, 434,330, 436,330, 438,326, 443,326, 444,324, 449,324, 445,320, 443,318, 436,313, 431,306, 429,304, 430,302, 432,302, 434,303, 439,305, 441,301, 443,298, 447,299, 449,299, 452,297, 456,297, 458,296, 457,293, 449,292, 427,295, 406,304, 405,304, 391,304, 390,303, 384,298, 370,293, 368,292, 368,290, 368,287, 365,288, 356,285, 349,279, 345,272, 339,269, 335,266, 334,261, 334,257, 336,254, 339,253, 342,252, 343,251, 339,247, 334,247, 326,246, 316,246, 302,251, 294,252, 287,255, 282,261, 281,267, 286,271, 293,272, 294,272, 300,281, 299,285, 300,289, 303,292, 303,294, 296,298, 229,296, 233,295, 245,290, 247,289, 248,287, 246,285, 243,285, 234,285, 226,281, 220,280, 212,281, 205,278, 194,274, 182,273, 149,270, 143,272, 136,274, 134,275, 133,279, 136,289, 137,301, 132,311, 131,315, 133,318, 137,324, 136,330, 136,332, 137,333, 146,333, 155,332, 161,339, 164,342, 168,342, 179,337, 192,336, 196,336, 200,334, 207,331, 214,330, 222,328, 217,328, 213,326, 214,322, 218,320, 220,317, 219,314, 217,310, 220,306, 226,299, 227,298, 295,298, 295,300, 296,309, 297,313, 301,316, 307,313, 309,307, 310,301, 309,297, 305,294, 304,294, 304,292, 304,292, 307,289, 308,283, 307,281, 305,279, 301,280, 295,271, 298,270, 296,269, 296,267, 305,265, 313,270, 323,282, 336,292, 343,294, 350,297, 356,302, 364,306, 367,309, 367,315, 365,320, 355,323, 345,323, 339,322, 336,323, 335,325, 338,328, 353,335, 359,336, 361,333, 360,330, 361,326, 366,325, 369,323, 376,316, 379,313, 376,310, 374,308, 374,305, 376,302, 380,302, 384,303, 387,306, 390,306, 391,305, 404,305, 406,309, 412,316, 417,325, 421,334, 423,335, 431,337, 433,337, 439,347, 438,348, 438,350, 439,352, 444,355, 448,352, 451,353, 456,354, 460,352, 519,352, 520,354, 525,356, 539,347, 538,345"></map>';
//asia
  var asiaMap = '<map name="asia_Map"><area class="region" shape="poly" id="northernAsia" alt="Northern Asia" coords="122,161, 103,152, 87,150, 72,137, 75,133, 75,127, 81,122, 58,118, 36,94, 32,77, 47,63, 37,43, 43,33, 90,43, 132,33, 128,27, 151,11, 200,6, 206,10, 199,16, 169,20, 154,28, 188,36, 202,20, 279,10, 279,8, 376,6, 389,12, 386,18, 436,19, 457,23, 464,24, 458,6, 484,6, 561,16, 561,22, 536,23, 581,30, 594,35, 600,32, 600,23, 622,19, 629,13, 646,12, 646,69, 640,67, 611,79, 601,77, 591,79, 584,94, 556,115, 548,95, 552,87, 571,76, 564,71, 551,76, 553,79, 547,84, 531,84, 500,81, 479,94, 493,98, 502,95, 510,124, 502,122, 500,134, 492,131, 492,115, 472,143, 453,148, 452,139, 455,136, 461,138, 467,125, 452,126, 429,103, 408,104, 410,109, 398,119, 383,115, 370,121, 342,115, 321,107, 318,111, 317,116, 313,118, 291,113, 273,120, 269,117, 262,116, 245,115, 231,101, 220,104, 208,97, 171,102, 169,115, 162,117, 156,113, 145,116, 133,111, 123,112, 121,119, 115,118, 113,125, 121,132, 117,137, 118,144, 126,156, 122,162" href="#test"><area class="region" id="centralAsia" shape="poly" alt="Central Asia" coords="141,168, 149,165, 156,167, 165,169, 171,174, 177,180, 191,169, 204,168, 213,165, 213,170, 223,168, 223,165, 218,157, 226,154, 245,150, 245,136, 255,132, 259,128, 266,128, 266,124, 271,121, 271,117, 262,117, 259,114, 243,114, 231,99, 222,104, 210,103, 209,99, 201,99, 174,102, 174,106, 169,109, 172,114, 161,118, 156,115, 145,117, 132,112, 119,119, 113,121, 120,133, 129,128, 135,130, 132,136, 128,140, 135,145, 141,160, 140,169"><area shape="poly" class="region" id="southWesternAsia" alt="Southwestern Asia" coords="90,150, 106,153, 120,160, 120,163, 129,170, 138,170, 145,170, 145,166, 156,166, 165,170, 170,173, 170,180, 173,193, 173,198, 179,209, 174,214, 158,214, 154,209, 152,208, 148,209, 137,208, 132,203, 126,195, 118,198, 129,211, 132,211, 135,217, 145,217, 152,211, 153,217, 160,220, 166,226, 162,234, 153,243, 145,248, 119,260, 102,265, 99,262, 97,251, 90,236, 82,231, 82,222, 75,216, 67,202, 60,203, 55,192, 63,189, 70,169, 41,171, 32,163, 30,156, 39,153, 54,150, 60,148, 75,151, 90,150"><area shape="poly" class="region" id="easternAsia" alt="Eastern Asia" coords="501,136, 498,134, 496,136, 490,144, 489,147, 490,151, 489,156, 485,164, 478,167, 471,172, 468,172, 451,179, 450,179, 448,175, 447,172, 446,166, 441,160, 440,157, 442,155, 450,149, 452,140, 453,136, 457,135, 464,132, 466,125, 463,124, 458,126, 454,126, 451,124, 447,120, 442,118, 436,113, 432,106, 425,102, 424,102, 420,103, 414,103, 410,108, 406,113, 400,118, 397,118, 394,118, 385,116, 376,118, 367,120, 358,118, 349,116, 338,115, 329,110, 324,108, 320,111, 314,117, 306,117, 301,115, 293,114, 272,122, 266,128, 258,131, 254,134, 250,136, 248,141, 247,148, 242,151, 232,155, 221,156, 221,159, 225,164, 228,170, 234,174, 241,178, 242,186, 242,191, 246,194, 267,203, 276,204, 286,204, 294,205, 302,201, 307,200, 313,203, 319,206, 322,211, 320,217, 319,219, 320,222, 325,228, 327,231, 331,230, 336,227, 342,226, 350,225, 356,230, 360,230, 363,229, 367,231, 367,234, 365,237, 364,240, 365,243, 367,243, 371,239, 371,233, 371,231, 374,229, 392,223, 403,217, 411,206, 417,198, 418,189, 416,180, 413,178, 409,177, 407,175, 408,173, 418,167, 414,165, 410,165, 406,164, 404,161, 405,159, 406,157, 411,155, 414,153, 414,157, 415,159, 417,159, 423,157, 427,157, 430,161, 431,163, 435,168, 434,174, 434,177, 438,177, 444,175, 447,177, 450,180, 448,184, 449,188, 452,191, 455,188, 456,184, 456,180, 459,182, 463,183, 466,181, 468,177, 470,180, 473,181, 480,177, 488,176, 492,172, 497,159, 497,154, 495,149, 494,147, 497,146, 502,147, 506,145, 515,139, 515,137, 508,139, 501,136"><area shape="poly" class="region" id="southEasternAsia" alt="Southeastern Asia" coords="572,345, 569,346, 549,336, 540,333, 542,332, 540,329, 529,322, 528,324, 533,326, 536,332, 532,336, 525,336, 519,338, 514,335, 510,331, 499,326, 486,322, 479,320, 473,324, 471,326, 469,326, 465,321, 462,316, 457,315, 451,318, 452,319, 457,322, 460,328, 462,329, 468,331, 466,336, 456,343, 434,345, 410,346, 408,336, 410,332, 409,328, 410,325, 412,327, 415,331, 418,335, 420,334, 419,331, 417,326, 417,321, 418,319, 419,317, 417,316, 414,317, 411,318, 409,315, 407,313, 407,313, 403,310, 404,310, 400,304, 400,298, 403,293, 415,285, 416,285, 418,285, 422,283, 424,287, 429,291, 431,289, 431,287, 431,286, 434,282, 433,278, 433,277, 431,267, 415,254, 415,251, 418,247, 417,246, 417,245, 416,241, 413,239, 412,240, 412,227, 415,222, 415,216, 414,215, 409,219, 409,224, 411,227, 411,240, 409,243, 407,249, 408,254, 411,258, 410,262, 418,281, 416,283, 415,284, 402,291, 399,288, 398,287, 394,287, 388,293, 382,298, 376,302, 370,306, 368,307, 364,308, 363,313, 366,319, 369,325, 372,326, 379,327, 387,330, 390,330, 393,328, 398,315, 402,310, 406,315, 406,315, 405,320, 403,325, 406,330, 406,332, 406,335, 407,346, 402,346, 399,346, 390,346, 382,341, 380,341, 367,339, 355,337, 353,337, 350,334, 354,323, 353,320, 348,320, 345,319, 344,316, 341,310, 335,306, 336,305, 340,308, 345,310, 342,300, 339,291, 331,285, 329,283, 326,274, 328,265, 328,263, 329,261, 331,262, 342,271, 346,275, 346,279, 349,279, 355,275, 360,271, 364,267, 365,263, 364,254, 358,248, 353,242, 351,238, 353,234, 353,230, 349,227, 344,227, 337,228, 333,233, 330,233, 325,231, 322,226, 318,223, 315,220, 317,215, 318,206, 312,206, 304,217, 298,230, 299,235, 304,240, 305,248, 305,251, 309,251, 317,252, 320,259, 321,267, 320,276, 319,279, 321,282, 326,285, 328,292, 334,305, 334,305, 320,295, 316,293, 312,292, 309,292, 310,296, 313,299, 322,309, 332,325, 338,331, 344,336, 347,337, 349,336, 351,340, 351,341, 351,341, 351,341, 353,342, 362,344, 366,345, 381,348, 395,349, 399,349, 403,349, 405,355, 412,355, 409,351, 427,349, 422,353, 422,355, 425,357, 437,349, 437,347, 451,345, 455,347, 457,343, 465,341, 467,343, 468,337, 467,337, 468,331, 479,336, 482,340, 479,345, 477,347, 481,348, 484,347, 488,347, 491,350, 491,352, 493,352, 498,350, 504,347, 509,345, 514,348, 520,354, 524,355, 528,354, 527,351, 524,349, 520,340, 519,338, 523,338, 529,341, 536,338, 539,333, 547,338, 568,355, 571,355, 576,353, 572,345"><area shape="poly" class="region" id="southernAsia" alt="Southern Asia" coords="298,206, 295,207, 271,207, 267,206, 256,200, 244,196, 239,192, 239,187, 239,182, 236,178, 227,174, 218,170, 215,168, 214,164, 211,164, 205,168, 198,167, 194,168, 186,173, 179,180, 177,180, 174,181, 172,183, 172,188, 175,191, 175,195, 175,198, 176,201, 180,207, 180,209, 179,210, 177,212, 180,214, 189,214, 195,216, 203,224, 205,224, 205,225, 205,229, 209,231, 213,233, 217,236, 226,263, 234,279, 237,282, 241,280, 244,276, 247,279, 246,286, 249,292, 250,292, 254,290, 255,286, 251,278, 247,278, 245,275, 248,264, 250,254, 256,248, 267,240, 276,230, 280,229, 294,228, 297,227, 302,218, 307,210, 310,206, 310,203, 304,203, 298,206"></map>';
//oceania
  var oceaniaMap;
  //TODO: fill this in

//countries text
  var countryList = '<br><br>AFRICA<br><ul><li>Algeria</li><li>Angola</li><li>Benin</li><li>Botswana</li><li>Burkina</li><li>Burundi</li><li>Cameroon</li><li>Cape Verde</li><li>Central African Republic</li><li>Chad</li><li>Comoros</li><li>Congo</li><li>Cote d\'Ivoire</li><li>Democratic Republic of Congo</li><li>Djibouti</li><li>Egypt</li><li>Equatorial Guinea</li><li>Eritrea</li><li>Ethiopia</li><li>Gabon</li><li>Gambia</li><li>Ghana</li><li>Guinea</li><li>Guinea-Bissau</li><li>Kenya</li><li>Lesotho</li><li>Liberia</li><li>Libya</li><li>Madagasear</li><li>Malawi</li><li>Mali</li><li>Mauritania</li><li>Mauritius<eli><li>Morocco</li><li>Mozambique</li><li>Namibia</li><li>Niger</li><li>Nigeria</li><li>Rwanda</li><li>Sao Tome and Principe</li><li>Senegal</li><li>Seychelles</li><li>Sierra Leone</li><li>Somalia</li><li>South Africa</li><li>South Sudan</li><li>Sudan</li><li>Swaziland</li><li>Tanzania</li><li>Togo</li><li>Tunisia</li><li>Uganda</li><li>Zambia</li><li>Zimbabwe</li></ul>ASIA<br><ul><li>Afghanistan</li><li>Bahrain</li><li>Bangladesh</li><li>Bhutan</li><li>Brunei</li><li>Myanmar</li><li>Cambodia</li><li>China</li><li>East Timor</li><li>India</li><li>Indonesia</li><li>Iran</li><li>Iraq</li><li>Israel</li><li>Japan</li><li>Jordan</li><li>Kazakhstan</li><li>North Korea</li><li>South Korea</li><li>Kuwait</li><li>Kyrgyzstan</li><li>Laos</li><li>Lebanon</li><li>Malaysia</li><li>Maldives</li><li>Mongolia</li><li>Nepal</li><li>Oman</li><li>Pakistan</li><li>Philippines</li><li>Qatar</li><li>Russian Federation</li><li>Saudi Arabia</li><li>Singapore</li><li>Sri Lanka</li><li>Syria</li><li>Tajikistan</li><li>Thailand</li><li>Turkey</li><li>Turkmenistan</li><li>United Arab Emirates</li><li>Uzbekistan</li><li>Vietnam</li><li>Yemen</li></ul>EUROPE<br><ul><li>Albania</li><li>Andorra</li><li>Armenia</li><li>Austria</li><li>Azerbaijan</li><li>Belarus</li><li>Belgium</li><li>Bosnia and Herzegovina</li><li>Bulgaria</li><li>Croatia</li><li>Cyprus</li><li>Czec Republic</li><li>Denmark</li><li>Estonia</li><li>Finland</li><li>France</li><li>Georgia</li><li>Germany</li><li>Greece</li><li>Hungary</li><li>Iceland</li><li>Ireland</li><li>Italy</li><li>Latvia</li><li>Liechtenstein</li><li>Lithuania</li><li>Luxembourg</li><li>Macedonia</li><li>Malta</li><li>Moldova</li><li>Monaco</li><li>Montenegro</li><li>Netherlands</li><li>Norway</li><li>Poland</li><li>Portugal</li><li>Romania</li><li>San Marino</li><li>Serbia</li><li>Slovakia</li><li>Slovenia</li><li>Spain</li><li>Sweden</li><li>Switzerland</li><li>Ukraine</li><li>United Kingdom</li><li>Vatican City</li></ul>NORTH AMERICA<br><ul><li>Antigua and Barbuda</li><li>Bahamas</li><li>Barbados</li><li>Belize</li><li>Canada</li><li>Costa Rica</li><li>Cuba</li><li>Dominica</li><li>Dominican Republic</li><li>El Salvador</li><li>Grenada</li><li>Guatemala</li><li>Haiti</li><li>Honduras</li><li>Jamaica</li><li>Mexico</li><li>Nicaragua</li><li>Panama</li><li>Saint Kitts and Nevis</li><li>Saint Lucia</li><li>Saint Vincent and the Grenadines</li><li>Trinidad and Tobago</li><li>United States</li></ul>OCEANIA<br><ul><li>Australia</li><li>Fiji</li><li>Kiribati</li><li>Marshall Islands</li><li>Micronesia</li><li>Nauru</li><li>New Zealand</li><li>Palau</li><li>Papua New Guinea</li><li>Samoa</li><li>Solomon Islands</li><li>Tonga</li><li>Tuvalu</li><li>Vanuatu</li></ul>SOUTH AMERICA<br><ul><li>Argentina</li><li>Bolivia</li><li>Brazil</li><li>Chile</li><li>Colombia</li><li>Ecuador</li><li>Guyana</li><li>Paraguay</li><li>Peru</li><li>Suriname</li><li>Uruguay</li><li>Venezuela</li></ul>';

  //this giant switch statement tells the program which continent and region the county is in so that we can automate the first two stages
    switch(country){
//africa
      case 'benin':
      case 'burkina':
    case 'cape verde':
      case 'côte d’ivoire':
      case 'gambia':
      case 'ghana':
      case 'guinea':
      case 'guinea-bissau':
      case 'liberia':
      case 'mali':
      case 'niger':
      case 'nigeria':
      case 'senegal':
      case 'sierra leone':
      case 'togo':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "westAfrica";
        whichRegionCap = "West Africa";
        break;
      case 'algeria':
      case 'egypt':
      case 'libya':
      case 'mauritania':
      case 'morocco':
      case 'tunisia':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "northAfrica";
        whichRegionCap = "North Africa";
        break;
      case 'djibouti':
      case 'ethiopia':
      case 'eritrea':
      case 'somalia':
      case 'south sudan':
      case 'sudan':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "eastAfrica";
        whichRegionCap = "East Africa";
        break;
      case 'comoros':
      case 'kenya':
      case 'madagascar':
      case 'malawi':
      case 'mauritius':
      case 'mozambique':
      case 'seychelles':
      case 'tanzania':
      case 'uganda':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "southeastAfrica";
        whichRegionCap = "Southeast Africa";
        break;
      case 'botswana':
      case 'lesotho':
      case 'namibia':
      case 'south africa':
      case 'swaziland':
      case 'zambia':
      case 'zimbabwe':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "southAfrica";
        whichRegionCap = "South Africa";
        break;
      case 'angola':
      case 'burundi':
      case 'cameroon':
      case 'central african republic':
      case 'chad':
      case 'congo':
      case 'democratic republic of congo':
      case 'equatorial guinea':
      case 'gabon':
      case 'rwanda':
      case 'são tomé and príncipe':
        var whichCont = "africa";
        var whichContCap = "Africa";
        whichRegion = "centralAfrica";
        whichRegionCap = "Central Africa";
        break;
//asia
      case 'afghanistan':
      case 'bangladesh':
      case 'bhutan':
      case 'india':
      case 'nepal':
      case 'maldives':
      case 'pakistan':
      case 'sri lanka':
        var whichCont = "asia";
        var whichContCap = "Asia";
        whichRegion = "southernAsia";
        whichRegionCap = "Southern Asia";
        break;
      case 'china':
      case 'japan':
      case 'mongolia':
      case 'north korea':
      case 'south korea':
      case 'taiwan':
        whichCont = "asia";
        whichContCap = "Asia";
        whichRegion = "easternAsia";
        whichRegionCap = "Eastern Asia";
        break;
      case 'indonesia':
      case 'singapore':
      case 'philippines':
      case 'east timor':
      case 'brunei':
      case 'vietnam':
      case 'laos':
      case 'cambodia':
      case 'yhailand':
      case 'myanmar':
      case 'malaysia':
        var whichCont = "asia";
        var whichContCap = "Asia";
        whichRegion = "southEasternAsia";
        whichRegionCap = "Southeastern Asia";
        break;
      case 'kazakhstan':
      case 'kyrgyzstan':
      case 'tajikistan':
      case 'turkmenistan':
      case 'uzbekistan':
        var whichCont = "asia";
        var whichContCap = "Asia";
       whichRegion = "centralAsia";
       whichRegionCap = "Central Asia";
       break;
      case 'russia':
        var whichCont = "asia";
        var whichContCap = "Asia";
        whichRegion = "northernAsia";
        whichRegionCap = "Northern Asia";
        break;
      case  'armenia':
      case  'azerbaijan':
      case  'bahrain':
      case  'cyprus':
      case  'georgia':
      case  'iran':
      case  'iraq':
      case  'israel':
      case  'jordan':
      case  'kuwait':
      case  'lebanon':
      case  'oman':
      case  'palestine':
      case  'qatar':
      case  'saudi arabia':
      case  'syria':
      case  'turkey':
      case  'united arab emirates':
      case  'yemen':
        whichCont = "asia";
        whichContCap = "Asia";
        whichRegion = "southWesternAsia";
        whichRegionCap = "Southwestern Asia";
        break;
//europe
      case 'andorra':
      case 'austria':
      case 'belgium':
      case 'denmark':
      case 'france':
      case 'germany':
      case 'ireland':
      case 'liechtenstein':
      case 'luxembourg':
      case 'monaco':
      case 'netherlands':
      case 'portugal':
      case 'spain':
      case 'switzerland':
      case 'united kingdom':
        whichCont = 'europe';
        whichContCap = 'Europe';
        whichRegion = "westernEurope";
        whichRegionCap = "Western Europe";
        break;
      case 'finland':
      case 'iceland':
      case 'norway':
      case 'sweden':
        whichCont = 'europe';
        whichContCap = 'Europe';
        whichRegion = "northernEurope";
        whichRegionCap = "Northern Europe";
        break;
      case 'armenia':
      case 'azerbaijan':
      case 'belarus':
      case 'bulgaria':
      case 'czech republic':
      case 'estonia':
      case 'georgia':
      case 'hungary':
      case 'kosovo':
      case 'latvia':
      case 'lithuania':
      case 'moldova':
      case 'poland':
      case 'romania':
      case 'slovakia':
      case 'ukraine':
        whichCont = 'europe';
        whichContCap = 'Europe';
        whichRegion = "easternEurope";
        whichRegionCap = "Eastern Europe";
        break;
      case 'albania':
      case 'bosnia and Herzegovina':
      case 'croatia':
      case 'macedonia':
      case 'montenegro':
      case 'serbia':
      case 'slovenia':
        whichCont = 'europe';
        whichContCap = 'Europe';
        whichRegion = "southEasternEurope";
        whichRegionCap = "Southeastern Europe";
        break;
      case 'cyprus':
      case 'greece':
      case 'italy':
      case 'malta':
      case 'san marino':
      case 'vatican city':
        whichCont = 'europe';
        whichContCap = 'Europe';
        whichRegion = "southernEurope";
        whichRegionCap = "Southern Europe";
        break;
//northAmerica
      case 'canada':
      case 'united states':
        whichCont = 'northAmerica';
        whichContCap = 'North America';
        whichRegion = "northernNorthAmerica";
        whichRegionCap = "Northern North America";
        break;
      case 'bahamas':
      case 'cuba':
      case 'dominican republic':
      case 'haiti':
      case 'jamaica':
      case 'mexico':
      case 'puerto rico':
        whichCont = 'northAmerica';
        whichContCap = 'North America';
        whichRegion = "centralNorthAmerica";
        whichRegionCap = "Central North America";
        break;
      case 'antigua and barbuda':
    	case 'barbados':
    	case 'belize':
    	case 'costa rica':
    	case 'dominica':
    	case 'el salvador':
    	case 'grenada':
    	case 'guatemala':
    	case 'honduras':
    	case 'nicaragua':
    	case 'panama':
    	case 'saint kitts and nevis':
    	case 'saint lucia':
    	case 'saint vincent and the grenadines':
    	case 'trinidad and tobago':
        whichCont = 'northAmerica';
        whichContCap = 'North America';
        whichRegion = "southernNorthAmerica";
        whichRegionCap = "Southern North America";
        break;
  //oceania
      case 'australia':
      case 'new zealand':
        whichCont = 'oceania';
        whichContCap = 'Oceania';
        whichRegion = "contientalAustralia";
        whichRegionCap = "Continental Australia";
        break;
      case 'fiji':
      case 'nauru':
      case 'papua new guinea':
      case 'vanuatu':
      case 'solomon islands':
        whichCont = 'oceania';
        whichContCap = 'Oceania';
        whichRegion = "melanesia";
        whichRegionCap = "Melanesia";
        break;
      case 'kiribati':
      case 'marshall islands':
      case 'micronesia':
      case 'palau':
        whichCont = 'oceania';
        whichContCap = 'Oceania';
        whichRegion = "micronesia";
        whichRegionCap = "Micronesia";
        break;
      case 'samoa':
      case 'tonga':
      case 'tuvalu':
        whichCont = 'oceania';
        whichContCap = 'Oceania';
        whichRegion = "polynesia";
        whichRegionCap = "Polynesia";
        break;
  //southAmerica
      case 'colombia':
      case 'guyana':
      case 'suriname':
      case 'venezuela':
        whichCont = 'southAmerica';
        whichContCap = 'South America';
        whichRegion = 'caribbeanSouthAmerica';
        whichRegionCap = 'Caribbean South America';
        break;
      case 'brazil':
      case 'paraguay':
      case 'uruguay':
        whichCont = 'southAmerica';
        whichContCap = 'South America';
        whichRegion = 'easternSouthAmerica';
        whichRegionCap = 'Eastern South America';
        break;
      case 'chile':
      case 'argentina':
        whichCont = 'southAmerica';
        whichContCap = 'South America';
        whichRegion = 'southernPeninsula';
        whichRegionCap = 'Southern Peninsula';
        break;
      case 'bolivia':
      case 'ecuador':
      case 'peru':
        whichCont = 'southAmerica';
        whichContCap = 'South America';
        whichRegion = 'andeanSouthAmerica';
        whichRegionCap = 'Andean South America';
        break;
      default:
        $('#zoomMap').html('<div style="padding:60px;color:white;">ERROR: \''+ country.toUpperCase() +'\' is not a country handled by the Zoom Map.<br><br>Please check the spelling or update your country in the <b>initZoom.js</b> file.<br><br>The following coutries are supported:'+ countryList +' </div>');
        break;
    }

    //get an array of the regions in the continent - this has to be in the same order as your continentBG image, from top to bottom
    switch(whichCont){
      case 'africa':
        var regionArr = ['westAfrica', 'northAfrica', 'eastAfrica', 'southeastAfrica', 'southAfrica', 'centralAfrica']
        break;
      case 'asia':
        var regionArr = ['northernAsia', 'centralAsia', 'southWesternAsia', 'easternAsia', 'southEasternAsia', 'southernAsia'];
        break;
      case 'europe':
        var regionArr = ['westernEurope', 'northernEurope', 'easternEurope', 'southEasternEurope', 'southernEurope'];
        break;
      case 'northAmerica':
        var regionArr = ['northernNorthAmerica', 'centralNorthAmerica', 'southernNorthAmerica'];
        break;
      case 'oceania':
        var regionArr = ['continentalAustralia', 'melanesia', 'micronesia', 'polynesia'];
        break;
      case 'southAmerica':
        var regionArr = ['caribbeanSouthAmerica', 'easternSouthAmerica', 'southernPeninsula', 'andeanSouthAmerica'];
        break;
    }

    //$('#HTML5').append('<div id="zoomMap"><div class="zoomHeader"><div class="mainTitle"></div></div><div class="zoomMapMap"><div class="skip">skip</div><video id="globe" width="650" autoplay><source src="images/zoom/zoomMap.mp4" type="video/mp4">Your browser does not support HTML5 video.</video><div id="clickMap"><div class="loadOverlay" style="display: none;"><div id="imgLoader">Loading Maps...<div id="imgProgress"></div></div></div><img class="useMap" src="images/zoom/blank.png" width="650" height="360" border="0" alt="" usemap="#mainMap"><map class="mainMap" name="mainMap"></map></div></div><div class="zoomMapList"><ul></ul></div><div class="zoomMapInfo"><div></div></div></div>');
    $('#HTML5').append('<div id="zoomMap"><div class="zoomHeader"><div class="mainTitle"></div></div><div class="zoomMapMap"><div class="skip">skip</div><video id="globe" width="650" autoplay controls muted><source src="images/zoom/zoomMap.mp4" type="video/mp4">Your browser does not support HTML5 video.</video><div id="clickMap"><div class="loadOverlay" style="display: none;"><div id="imgLoader">Loading Maps...<div id="imgProgress"></div></div></div><img class="useMap" src="images/zoom/blank.png" width="650" height="360" border="0" alt="" usemap="#mainMap"><map class="mainMap" name="mainMap"></map></div></div><div class="zoomMapList"><ul></ul></div><div class="zoomMapInfo"><div></div></div></div>');

    //preload the images for slow connections
    $.preloadImages = function() {
      var preCount = arguments.length;
      $('#imgPre').remove();
      $('body').append('<div id="imgPre" style="display:none;"></div>');
      for (var i = 0; i < arguments.length; i++) {
        $('#imgPre').append('<img src="'+ arguments[i] +'" />').ready(function(){
          if(preCount === (i+1)){
            var imgCount = 0;
            $('#imgPre img').load(function(){
              imgCount++;
              var progressWidth = (imgCount/preCount) * 100;
              $('#imgProgress').animate({
                width: progressWidth + '%'
              }, 200 );
              if(imgCount === $('#imgPre img').length){
                $('.loadOverlay').delay(300).fadeOut('fast').promise().done(function(){
                  $('.loadOverlay').remove();
                });
              }
            });
          }
        });
      }
    }
    $.preloadImages(
      'images/zoom/zoomBG.jpg',
      'images/zoom/'+ whichCont +'BG.jpg',
      'images/zoom/'+ whichRegion +'BG.jpg',
      'images/zoom/done.jpg'
    );

  $('.mainTitle').html(title + ' | <span>' + subtitle + '</span>');
  $('.mainMap').append(continentsMap);
  //hide html5 video and swap it for the interactive map
  document.getElementById('globe').addEventListener('ended',showMap,false);
  var fired = false;
  function showMap(){
    if(fired == false){
      $('.loadOverlay').show();
      //set initial map background here so it doesn't flash before video loads
      $('#clickMap').css('background', 'url(images/zoom/zoomBG.jpg) 0 0 no-repeat');
      //nice, slow fade out prevents flashing
      $("#globe").fadeOut('10000');
      $('.skip').remove();
      levelOne();
    }
  }

  function levelOne(){
    $('.zoomMapInfo').html('<span><strong>1</strong>Click on '+ whichContCap +'.');
    $('.zoomMapInfo span').hide();
    $('.zoomMapInfo span').fadeIn('slow');

    for(var i=0; i < contArr.length; i++){
      $('#clickMap').append('<div class="levelOne" id="'+ contArr[i] +'Box"></div><div class="levelOne" id="'+ contArr[i] +'Box2"></div>')
    }

    $('.cont').hover(function(){
      var thisHover = contArr.indexOf($(this).attr('id')) + 1;
      $('#clickMap').css('background-position', '0 -'+ (thisHover * 360) +'px');
    }, function(){
      $('#clickMap').css('background-position', '0 0');
    });

    $('.cont').click(function(e){
      $('.zoomTip').remove();
      var thisCont = $(this).attr('id');
      if(thisCont === whichCont){
        $('.zoomMapInfo span').fadeOut('fast');
        //zoom to next level
        $('#'+ thisCont +'Box').fadeIn(500).promise().done(function(){
          if(pauseLevelOne == false){
            var boxPos = $('#'+ thisCont +'Box').position();
            $('#'+ thisCont +'Box').animate({
            'width': '650px',
            'height': '360px',
            'margin-top': '-' + boxPos.top,
            'margin-left': '-' + boxPos.left,
            }, 500, function(){
              $('#'+ thisCont +'Box').fadeOut(500);
              $('#'+ thisCont +'Box2').fadeIn(500).promise().done(function(){
                levelTwo();
                $('#'+ thisCont +'Box').remove();
                $('.useMap').css('background', 'url(images/zoom/'+ whichCont +'BG.jpg) 0 0 no-repeat');
                $('.levelOne').fadeOut('slow');
              });
            });
          }
        });
      } else {
        //show continent label
        var offset = $('#zoomMap').offset();
        var X = (e.pageX - offset.left) - 17;
        var Y = (e.pageY - offset.top) - 25;
        $('#zoomMap').append('<div class="zoomTip" style="top:'+ Y +'px;left:'+ X +'px;">'+ $(this).attr('alt') +'</div>')
      }
    });
  } //end levelOne();

  function levelTwo(){
    $('.mainMap area').remove();
    var thisCont2;
    switch (whichCont){
      case 'northAmerica':
        thisCont2 = northAmericaMap;
        break;
      case 'southAmerica':
        thisCont2 = southAmericaMap;
        break;
      case 'africa':
        thisCont2 = africaMap;
        break;
      case 'europe':
        thisCont2 = europeMap;
        break;
      case 'asia':
        thisCont2 = asiaMap;
        break;
      case 'oceania':
        thisCont2 = oceaniaMap;
        break;
    }
    $('.mainMap').append(thisCont2);

    for(var i=0; i < contArr.length; i++){
      $('#clickMap').append('<div class="levelTwo" id="'+ regionArr[i] +'Box"></div><div class="levelTwo" id="'+ regionArr[i] +'Box2"></div>');
    }

    $('.zoomMapInfo').html('<span><strong>2</strong>Next, find '+ whichRegionCap +'.');
    $('.zoomMapInfo span').hide();
    $('.zoomMapInfo span').fadeIn('slow');

    $('.region').hover(function(){
      var thisHover = regionArr.indexOf($(this).attr('id')) + 1;
      $('.useMap').css('background-position', '0 -'+ (thisHover * 360) +'px');
    }, function(){
      $('.useMap').css('background-position', '0 0');
    });

    $('.region').click(function(e){
      $('.zoomTip').remove();
      var thisRegion = $(this).attr('id');
        if(thisRegion === whichRegion){
          $('.zoomMapInfo span').fadeOut('fast');
          //zoom to next level
          $('#'+ thisRegion +'Box').fadeIn(500).promise().done(function(){
            if(pauseLevelTwo == false){
              $('#'+ thisRegion +'Box').animate({
              'width': '650px',
              'height': '360px',
              'top': 0,
              'left': 0,
              }, 500, function(){
                $('#'+ thisRegion +'Box').fadeOut(500);
                $('#'+ thisRegion +'Box2').fadeIn(500).promise().done(function(){
                  levelThree();
                  $('#'+ country +'Box').remove();

                  $('.useMap').css('background', 'url(images/zoom/'+ thisRegion +'BG.jpg) 0 0 no-repeat');

                  $('.levelTwo').fadeOut('slow');
                });
              });
            }
          });
        } else {
          //show continent label
          var offset = $('#zoomMap').offset();
          var X = (e.pageX - offset.left) - 17;
          var Y = (e.pageY - offset.top) - 25;
          $('#zoomMap').append('<div class="zoomTip" style="top:'+ Y +'px;left:'+ X +'px;">'+ $(this).attr('alt') +'</div>');
        }
    });
  } //end levelTwo();

  //this is the drag and drop, find-the-countries part
  function levelThree(){
    var draggingTarget;
    $('.zoomMapInfo').html('<span><strong>3</strong>Now drag the countries on the right into their proper places on the map.');
    $('.zoomMapInfo span').hide();
    $('.zoomMapInfo span').fadeIn('slow');
    $('.mainMap area').remove();

    //make drag list
    for(i=0; i < countriesArr.length; i++){
      $('.zoomMapList ul').append('<li class="dragFlag" id="'+ countriesArr[i] +'_drag">'+ countriesArr[i].replace(/_/g, ' ') +'</li>');
    }

    //randomize the drag list
    var ul = $('.zoomMapList ul');
    for (var i = $(ul).children().length; i >= 0; i--) {
        $(ul).append($(ul).children()[Math.random() * i | 0]);
    }

    $('.dragFlag').draggable({
      containment: '.zoomMapMap',
      revert: true,
      start: function(){
        draggingTarget = $(this).html();
      },
      stop: function(){
        $('.useMap').css('background-position', '0 0');
      }
    });

    //make drops
    for(var  i=0; i < dropXArr.length; i++){
      $('#clickMap').append('<div class="zoomDrop" id="'+ countriesArr[i] +'_drop" style="left: '+ dropXArr[i] +'px; top: '+ dropYArr[i] +'px;"></div>')
    }

    $('.zoomDrop').droppable({
      tolerance: 'touch',
      over: function(){
        var thisDragOver = countriesArr.indexOf($(this).attr('id').replace('_drop', '')) + 1;
        $('.useMap').css('background-position', '0 -'+ (thisDragOver * 360) +'px');
      },
      out: function(){
        $('.useMap').css('background-position', '0 0');
      },
      hoverClass: "zoomTargetHover",
      drop: function(){
        var dropTargetID = $(this).attr("id").replace('_drop', '');
        dropClean = dropTargetID.replace(/_/g, ' ');
        if(dropClean == draggingTarget){
          $('#'+ dropTargetID +'_drag').remove();
          $(this).html(dropClean);
          $(this).addClass('correct');
          $(this).removeClass('ui-droppable');
          if(!$('.dragFlag').length){
            $('.zoomMapInfo span').fadeOut('fast');
            $('.zoomMapInfo').html('<span style="text-align:center">Well done! You have completed this activity.');
            $('.zoomMapInfo span').hide();
            $('.zoomMapInfo span').fadeIn('slow');
            $('#clickMap').css('background', 'url(images/zoom/done.jpg) 0 0 no-repeat')
            $('.zoomMapList').fadeOut('slow');
            $('.zoomDrop').fadeOut('slow');
            $('.useMap').fadeOut('slow');
          }
        }
        $('.useMap').css('background-position', '0 0');
      }
    });

    $('.zoomMapList').fadeIn('slow');

  } //end levelThree()

  $('.skip').click(function(){
    showMap();
    fired = true;
  });

} //end zoomInit();

//this kicks the whole thing off
function loadZoom_HTML5(){
  //XMLHttpRequest grabs the XML and sends it to the zoomInit() function
var getXML = new XMLHttpRequest();
  getXML.addEventListener("load", zoomInit);
  getXML.open("GET", "xml/co_"+ projCode +"_zoomHTML5.xml");
  getXML.send();
}

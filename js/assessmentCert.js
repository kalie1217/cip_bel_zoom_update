function showCertificate(countryLanguage) {
    var now = new Date();
    var thisMonth = now.getMonth() + 1;
    var dtString = thisMonth + "-" + now.getDate() + "-" + now.getFullYear();
    $('#inputname').fadeOut('fast');
    document.getElementById("COCert").style.visibility = "visible";
    var fullName = document.formInput.fullname.value;
    document.getElementById("language").innerHTML = countryLanguage;
    document.getElementById("name").innerHTML = fullName;
    document.getElementById("date").innerHTML = dtString;
    document.getElementById('printCert').onmouseover = function () {
        this.setAttribute("src", "images/print over.png");
    }
    document.getElementById('printCert').onmouseout = function () {
        this.setAttribute("src", "images/print.png");
    }
    document.getElementById("printCert").onclick = printCertificate
}

function printCertificate() {
    $('#printCert').remove();
    window.print();
    window.close();
}
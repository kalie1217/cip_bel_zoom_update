function XML_HTTP_class () {
    var ns = ! document.all
    var ax = null
    do_init()
    function do_init () {
        function err (e) {
            program_abort('foundation_download_class:  Cannot create XMLHTTP: ', e)
        }
        if (ns) {
            try {
                ax = new XMLHttpRequest()
            }
            catch (e) {
                err(e)
            }
        } else if (window.ActiveXObject) {
            try {
                ax = new ActiveXObject('Microsoft.XMLHTTP')
            }
            catch (e) {
                err(e)
            }
        } else {
            program_abort('Your browser does not support XMLHTTP')
        }
    }
    this.get_responseText = function () {
        return ax.responseText
    }
    this.get_response = function () {
        return ax.responseText
    }
    this.XML_HTTP_GET = function (url) {
        ax.open('get', url, false)
        if (ns) {
            ax.send(null)
        } else {
            ax.send()
        }
    }
    this.post_form = function (url, sss) {
        ax.open('post', url, false)
        ax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        ax.setRequestHeader('Content-length', sss.length)
        ax.send(sss)
    }
    this.post_XML = function (url, sss) {
        ax.open('post', url, false)
        ax.setRequestHeader('Content-Type', 'text/xml')
        ax.send(sss)
    }
}
// XML_HTTP_class
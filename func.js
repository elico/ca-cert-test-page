function processCaTestRequest(e) {
    if (caTest.readyState == 4 && caTest.status == 200) {
        document.getElementById("test-img").innerHTML = '<img id="result" src="https://' + randomDom + '.cert.ngtech.home/ca-cert-test-page/success.gif" style="max-width: 130px; display: block; margin: 0 auto">';
    } else {
        console.log("caTest else");

        if (caTest.readyState == 4) {
            console.log("caTest else ready");

            document.getElementById("test-img").innerHTML = '<img id="result" src="https://cert.ngtech.home/ca-cert-test-page/failure.jpg" style="max-width: 130px; display: block; margin: 0 auto">';

            // The next line is optional and is to show a link to a special certificate download link\page
            //document.getElementById("cert-download").innerHTML = '<a href="https://www.ngtech.co.il/ca-cert-test-page/#download"><img id="result" src="https://www.ngtech.co.il/ca-cert-test-page/download_button.gif" style="max-width: 130px; display: block; margin: 0 auto"></a>';
        }
    }
}

function processNetRequest(e) {
    if (netTest.readyState == 4 && netTest.status == 200) {
        caTest.onreadystatechange = processCaTestRequest;
        caTest.send(encodeURI('date=' + d.toLocaleString()));
        console.log("sent caTest");
    } else {
        document.getElementById("result").src = "";
    }
}

var d = new Date();

var randomDom = Math.random().toString(36).substring(2, 8);

var netTest = new XMLHttpRequest();

netTest.open('POST', "https://www.ngtech.co.il/ca-cert-test-page/index.html", true);

netTest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

var caTest = new XMLHttpRequest();

caTest.open('POST', "https://" + randomDom + ".cert.ngtech.home/ca-cert-test-page/index.html", true);

caTest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

netTest.onreadystatechange = processNetRequest;

function testSSL() {
    document.getElementById("test-img").innerHTML = '<img id="result" src="https://www.ngtech.co.il/ca-cert-test-page/Loading2.gif" style="max-width: 130px; display: block; margin: 0 auto">'
    netTest.send(encodeURI('date=' + d.toLocaleString()));
}

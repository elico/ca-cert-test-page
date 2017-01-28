function processCaTestRequest(e) {
    document.getElementById("catest").innerText = "STARTED CA TEST";
    if (caTest.readyState == 4 && caTest.status == 200) {
        document.getElementById("catest").innerText = "Finished CA TEST SUCCESFULLY";
        document.getElementById("test-img").innerHTML = '<img id="result" src="https://moodle.ngtech.co.il/ca-test/success.gif" style="max-width: 130px; display: block; margin: 0 auto">'
        a
    } else {
        document.getElementById("catest").innerText = "ERROR on CA TEST";
        document.getElementById("test-img").innerHTML = '<img id="result" src="http://moodle.ngtech.co.il/ca-test/failure.jpg" style="max-width: 130px; display: block; margin: 0 auto">';

    }
}


function processNetRequest(e) {
    if (netTest.readyState == 4 && netTest.status == 200) {

        // var response = JSON.parse(xhr.responseText);

        // alert(response.ip);
        // alert(response.date);
        // setInterval(function(){document.getElementById("nettest").innerText = "Finished NET TEST"; },3000);
        document.getElementById("nettest").innerText = "Finished NET TEST SUCCESFULLY";

        caTest.onreadystatechange = processCaTestRequest;
        caTest.send(encodeURI('date=' + d.toLocaleString()));
    } else {
        document.getElementById("nettest").innerText = "ERROR on NET TEST";
        document.getElementById("result").src = "";
    }
}

var d = new Date();

var netTest = new XMLHttpRequest();
netTest.open('POST', "http://moodle.ngtech.co.il/ca-test/index.html", true);

netTest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

var caTest = new XMLHttpRequest();
caTest.open('POST', "https://moodle.ngtech.co.il/ca-test/index.html", true);

caTest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

netTest.onreadystatechange = processNetRequest;

function testSSL() {
    document.getElementById("test-img").innerHTML = '<img id="result" src="http://moodle.ngtech.co.il/ca-test/Loading2.gif" style="max-width: 130px; display: block; margin: 0 auto">'
    netTest.send(encodeURI('date=' + d.toLocaleString()));
}

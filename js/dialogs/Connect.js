let ipAddr = "localhost";
let port = "8080";



let ipElem = document.getElementById("ipAddr");
let portElem = document.getElementById('port');

ipElem.value = ipAddr;
portElem.value = port;

ipElem.addEventListener('change', readIpAddr, false);

portElem.addEventListener('change', readPort, false);

let modalConnect = document.getElementById('modalConnect');

connectDialog();

function connectDialog()
{
    if (!localStorage.connected)
    {
        modalConnect.style.display = "block";
    }
    else
    {
        loadAndDrawLayout();
    }
}

function readIpAddr(e) {
    ipAddr = e.target.value;
}

function readPort(e)
{
    port = e.target.value;
}

function closeConnectDialog()
{
    modalConnect.style.display = "none";
}

$('#connectButton')
    .on("click", function()
    {
        loadAndDrawLayout();
    });
function showHttpError(msg, response)
{
    let error = msg + ": Could not reach backend (is it running on " + ipAddr + ":" + port + "?)";
    localStorage.removeItem("connected");
    connectDialog();
    alert(error);
    console.log(error);
}

function showGeneralError(msg, response) {
    if (response.status === 1) {
        alert(msg + ": " + response.statusMessage);
        console.log(response.status, response.statusMessage);
    }
}
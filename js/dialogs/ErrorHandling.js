function showHttpError(msg, response)
{
    let error = msg + ": Could not reach backend (is it running ?)";
    alert(error);
    console.log(error);
}

function showGeneralError(msg, response) {
    if (response.status === 1) {
        alert(msg + ": " + "Warning: " + response.statusMessage);
        console.log(response.status, response.statusMessage);
    }
    else if (response.status === 2) {
        alert(msg + ": " + "Error: " + response.statusMessage);
        console.log(response.status, response.statusMessage);
    }
}
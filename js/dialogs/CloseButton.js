// Get the <span> element that closes the modal
let modalCloseButton = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
modalCloseButton.onclick = function() {
    modalAddIntersection.style.display = "none";
    modalShowLastResponse.style.display = "none";
};

let modalShowLastResponse = document.getElementById('modalShowLastResponse');

// Get the button that opens the modal
let showLastResponseButton = document.getElementById("showLastResponseButton");



// When the user clicks the button, open the modal
showLastResponseButton.onclick = function() {
    modalShowLastResponse.style.display = "block";
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modalShowLastResponse) {
        modalShowLastResponse.style.display = "none";
    }
};
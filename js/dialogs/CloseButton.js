// Get the <span> element that closes the modal
let modalCloseButtons = document.getElementsByClassName("close");

// When the user clicks on <span> (x), close the modal
for (let i = 0; i < modalCloseButtons.length; i++)
{
    let modalCloseButton = modalCloseButtons[i];
    modalCloseButton.onclick = function() {
        modalAddIntersection.style.display = "none";
        modalAddLane.style.display = "none";
        modalChangeLane.style.display = "none";
    };
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modalAddIntersection) {
        modalAddIntersection.style.display = "none";
    }
    if (event.target === modalAddLane) {
        modalAddLane.style.display = "none";
    }
    if (event.target === modalChangeLane) {
        modalChangeLane.style.display = "none";
    }
};

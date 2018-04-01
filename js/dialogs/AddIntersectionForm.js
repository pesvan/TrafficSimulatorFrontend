let readFile;
let angle;
let position = "left";


document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);

document.getElementById('angle-input')
    .addEventListener('change', readAngle, false);

document.getElementById('position-input')
    .addEventListener('change', readPosition, false);


let modalAddIntersection = document.getElementById('modalAddIntersection');

// Get the button that opens the modal
let addIntersectionButton = document.getElementById("addIntersectionButton");



// When the user clicks the button, open the modal
addIntersectionButton.onclick = function() {
    modalAddIntersection.style.display = "block";
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modalAddIntersection) {
        modalAddIntersection.style.display = "none";
    }
};

function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
        readFile = e.target.result;
    };
    reader.readAsText(file);

}

function readAngle(e) {
    angle = e.target.value;
}

function readPosition(e)
{
    position = e.target.value;
}

$('#sendConfiguration')
    .on("click", postConfiguration);

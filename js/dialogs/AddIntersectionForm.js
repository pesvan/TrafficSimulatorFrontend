let readFile;
let angle;
let position = "left";

let allowCar = document.getElementById('allowCar');
let allowVan = document.getElementById('allowVan');
let allowBusPublic = document.getElementById('allowBusPublic');
let allowBusPrivate = document.getElementById('allowBusPrivate');
let allowTruck = document.getElementById('allowTruck');

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);

document.getElementById('angle-input')
    .addEventListener('change', readAngle, false);

document.getElementById('position-input')
    .addEventListener('change', readPosition, false);


let modalAddIntersection = document.getElementById('modalAddIntersection');

// Get the button that opens the modal
let addIntersectionButton = document.getElementById("addIntersectionButton");
let addFirstIntersectionButton = document.getElementById("addIntersectionButtonFirst");



// When the user clicks the button, open the modal
addIntersectionButton.onclick = openAddIntersectionDialog;
addFirstIntersectionButton.onclick = openAddIntersectionDialog;

function openAddIntersectionDialog()
{
    modalAddIntersection.style.display = "block";
}


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

function closeAddIntersectionForm()
{
    modalAddIntersection.style.display = "none";
}

$('#sendConfiguration')
    .on("click", function()
    {
        simulation.stopVisualisation();
        postConfiguration();
    });

$('#deleteIntersectionButton')
    .on("click", function()
    {
        simulation.stopVisualisation();
        deleteIntersection();
    });
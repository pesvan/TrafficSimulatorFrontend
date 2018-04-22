let addLaneLeft;
let addLaneRight;
let addLaneStraight;


document.getElementById('addLaneLeft')
    .addEventListener('change', readDirectionLeft, false);

document.getElementById('addLaneRight')
    .addEventListener('change', readDirectionRight, false);

document.getElementById('addLaneStraight')
    .addEventListener('change', readDirectionStraight, false);


let modalAddLane = document.getElementById('modalAddLane');

// Get the button that opens the modal
let addLaneButton = document.getElementById("addLaneButton");



// When the user clicks the button, open the modal
addLaneButton.onclick = openAddLaneDialog;

function openAddLaneDialog()
{
    modalAddLane.style.display = "block";
}

function readDirectionLeft(e) {
    addLaneLeft = e.target.value;
}

function readDirectionRight(e) {
    addLaneRight = e.target.value;
}

function readDirectionStraight(e) {
    addLaneStraight = e.target.value;
}

function closeAddLaneForm()
{
    modalAddLane.style.display = "none";
}

$('#addLaneFinalButton')
    .on("click", function()
    {
        addLane();
    });
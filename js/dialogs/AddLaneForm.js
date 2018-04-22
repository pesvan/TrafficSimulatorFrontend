let addLaneLeft = document.getElementById('addLaneLeft');
let addLaneRight = document.getElementById('addLaneRight');
let addLaneStraight = document.getElementById('addLaneStraight');


let modalAddLane = document.getElementById('modalAddLane');

// Get the button that opens the modal
let addLaneButton = document.getElementById("addLaneButton");



// When the user clicks the button, open the modal
addLaneButton.onclick = openAddLaneDialog;

function openAddLaneDialog()
{
    modalAddLane.style.display = "block";
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
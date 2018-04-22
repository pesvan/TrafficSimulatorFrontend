let changeLaneLeft = document.getElementById('changeLaneLeft');
let changeLaneRight = document.getElementById('changeLaneRight');
let changeLaneStraight = document.getElementById('changeLaneStraight');

let modalChangeLane = document.getElementById('modalChangeLane');

// Get the button that opens the modal
let changeLaneButton = document.getElementById("changeLaneButton");



// When the user clicks the button, open the modal
changeLaneButton.onclick = openChangeLaneDialog;

function openChangeLaneDialog()
{
    modalChangeLane.style.display = "block";
}

function closeChangeLaneForm()
{
    modalChangeLane.style.display = "none";
}

$('#changeLaneFinalButton')
    .on("click", function()
    {
        changeLane();
    });
$('#runSimulationButton').on("click", function () {
    runSimulation();
    simulation.startVisualisation();
});
$('#pauseSimulationButton').on("click", function () {
    simulation.pauseVisualisation();
});
$('#stopSimulationButton').on("click", function () {
    simulation.stopVisualisation();
});

$('#myRange').on("change", readRange);


$('#signalProgramSelection').on("change", readSignalProgram);

function readSignalProgram()
{
    if(situation.isSelectedIntersection())
    {
        let value = $('#signalProgramSelection').val();
        setSignalProgram(value);
        situation.selectedIntersection.setSelectedSignalProgram(value);
    }
}

function readRange(e)
{
    simulation.setDensity(e.target.value);
}

$(window).on("blur focus", function(e) {
    let prevType = $(this).data("prevType");

    if (prevType !== e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
                simulation.pauseVisualisation();
                break;
            case "focus":
                break;
        }
    }

    $(this).data("prevType", e.type);
})
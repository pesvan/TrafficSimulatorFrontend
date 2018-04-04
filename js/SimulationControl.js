$('#runSimulationButton').on("click", function () {
    runSimulation();
    simulation.startVisualisation();
});
$('#pauseSimulationButton').on("click", function () {
    simulation.pauseVisualisation();
});
$('#stopSimulationButton').on("click", function () {
    simulation = new Simulation();
});

$('#myRange').on("change", readRange);

function readRange(e)
{
    simulation.setDensity(e.target.value);
}
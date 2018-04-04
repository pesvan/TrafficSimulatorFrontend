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
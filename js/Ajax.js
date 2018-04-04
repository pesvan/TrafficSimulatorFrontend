function loadSituationLayout()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getMap",
        dataType: "json",
        async: false
    })
    .done(function( msg ) {
        $('#response').html(JSON.stringify(msg, null, 2));
        jsonToMapDtos(msg);
    });
}

function getSimulationData()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getData",
        dataType: "json"
    })
    .done(function( msg ) {
        $('#response').html(JSON.stringify(msg, null, 2));
        jsonToSimulationDtos(msg);
    });
}

function postConfiguration()
{
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/sendConfiguration",
        dataType: "json",
        contentType: "application/json",

        data: JSON.stringify({
            firstIntersection: situation.intersectionCount === 0,
            selectedIntersectionId: situation.selectedIntersection !== undefined ? situation.selectedIntersection.id : undefined,
            conf:  readFile,
            angle: angle,
            position: position
        })
    })
    .done(function(){
        closeAddIntersectionForm();
        loadAndDrawLayout();
    })
    .fail(function(msg){
        console.log(msg);
    });
}

function resetAll()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/resetSimulation",
        dataType: "json",
    })
    .done(function( msg ) {
        loadAndDrawLayout();
    })
    .fail(function(msg)
    {
        console.log(msg);
    });
}

function runSimulation()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/initSimulation",
        dataType: "json",
    })
    .done(function( msg ) {
        simulation.startAcquisition();
        doSimulationStep(2);
    })
    .fail(function(msg)
    {
        console.log(msg);
    });
}

function doSimulationStep(noOfSteps)
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getDataMultipleStep?noOfSteps=" + noOfSteps,
        dataType: "json",
    })
    .done(function( msg ) {
        jsonToSimulationDtos(msg);
    })
    .fail(function(msg)
    {
        console.log(msg);
    });
}

function stopAcquisition()
{
    simulation.stopAcquisition();
}
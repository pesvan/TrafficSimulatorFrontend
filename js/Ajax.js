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
        loadAndDrawLayout();
    })
    .fail(function(msg){
        alert( JSON.stringify(msg));
        loadAndDrawLayout();
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
        alert(msg);
    })
    .fail(function(msg)
    {
        loadAndDrawLayout();
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
        alert(msg);
    })
    .fail(function(msg)
    {
        simulation.startAcquisition();
    });
}

function doSimulationStep()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getDataMultipleStep?noOfSteps=5",
        dataType: "json",
    })
        .done(function( msg ) {
            //jsonToSimulationDtos(msg);
            console.log(msg)
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
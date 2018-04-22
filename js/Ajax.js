function loadSituationLayout() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getMap",
        dataType: "json",
        async: false
    })
        .done(function (msg) {
            $('#response').html(JSON.stringify(msg, null, 2));
            jsonToMapDtos(msg);
        })
        .fail(function () {
            $('#selectedIntersection').html("Cannot connect to the backend!")
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

function addLane()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/laneOperation",
        dataType: "json",
        contentType: "application/json",

        data:
            {
                legId: situation.selectedLane.legId,
                intersectionId: situation.selectedLane.intersectionId,
                left: addLaneLeft.checked,
                right: addLaneRight.checked,
                straight: addLaneStraight.checked,
                laneId: situation.selectedLane.id,
                operation: "add"
            }
    })
        .done(function(){
            closeAddLaneForm();
            loadAndDrawLayout();
        })
        .fail(function(msg){
            console.log(msg);
        });
}

function changeLane()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/laneOperation",
        dataType: "json",
        contentType: "application/json",

        data:
            {
                legId: situation.selectedLane.legId,
                intersectionId: situation.selectedLane.intersectionId,
                left: changeLaneLeft.checked,
                right: changeLaneRight.checked,
                straight: changeLaneStraight.checked,
                laneId: situation.selectedLane.id,
                operation: "change"
            }
    })
        .done(function(){
            closeChangeLaneForm();
            loadAndDrawLayout();
        })
        .fail(function(msg){
            console.log(msg);
        });
}

function deleteLane()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/laneOperation",
        dataType: "json",
        contentType: "application/json",

        data:
            {
                legId: situation.selectedLane.legId,
                intersectionId: situation.selectedLane.intersectionId,
                laneId: situation.selectedLane.id,
                operation: "delete"
            }
    })
        .done(function(){
            loadAndDrawLayout();
        })
        .fail(function(msg){
            console.log(msg);
        });
}

function deleteIntersection()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/deleteIntersection?intersectionId=" + situation.selectedIntersection.id,
        dataType: "json",
    })
    .done(function(){
        loadAndDrawLayout();
    })
    .fail(function(msg)
    {
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

function setTrafficDensity(density)
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/setTrafficDensity?density=" + density,
        dataType: "json",
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
        async: false
    })
    .done(function( msg ) {
        let status = msg.status;

        if (status===0)
        {
            doSimulationStep(5);
            simulation.startVisualisation();
        }


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

function stopSimulation()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/stopSimulation",
        dataType: "json",
    })
        .fail(function(msg)
        {
            console.log(msg);
        });
}

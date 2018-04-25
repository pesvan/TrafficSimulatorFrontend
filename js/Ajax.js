function loadSituationLayout() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getMap",
        dataType: "json",
        async: false
    })
    .done(function (response) {
        $('#response').html(JSON.stringify(response, null, 2));
        showGeneralError("Loading simulation layout", response);
        jsonToMapDtos(response);
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Loading simulation layout");
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
            position: position,
            carsAllowed: allowCar.checked,
            vanAllowed: allowVan.checked,
            busPublicAllowed: allowBusPublic.checked,
            busPrivateAllowed: allowBusPrivate.checked,
            trucksAllowed: allowTruck.checked
        })
    })
    .done(function(response){
        showGeneralError("Adding intersection", response);
        if(response.status===0) {
            closeAddIntersectionForm();
            loadAndDrawLayout();
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Adding intersection");
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
    .done(function(response){
        showGeneralError("Adding lane", response);
        if(response.status===0) {
            closeAddLaneForm();
            loadAndDrawLayout();
        }

    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Adding lane");
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
    .done(function(response){
        showGeneralError("Changing lane directions", response);
        if(response.status===0) {
            closeChangeLaneForm();
            loadAndDrawLayout();
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Changing lane directions");
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
    .done(function(response){
        showGeneralError("Deleting lane", response);
        loadAndDrawLayout();
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Deleting lane");
    });
}

function deleteIntersection()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/deleteIntersection?intersectionId=" + situation.selectedIntersection.id,
        dataType: "json",
    })
    .done(function(response){
        showGeneralError("Deleting intersection", response);
        loadAndDrawLayout();
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Deleting intersection");
    });
}

function resetAll()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/resetSimulation",
        dataType: "json",
    })
    .done(function( response ) {
        showGeneralError("Reseting everything", response)
        loadAndDrawLayout();
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Reseting everything");
    });
}

function setTrafficDensity(density)
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/setTrafficDensity?density=" + density,
        dataType: "json",
    })
    .done(function( response ) {
        showGeneralError("Setting traffic density", response)
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Setting traffic density");
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
    .done(function( response ) {
        let status = response.status;
        showGeneralError("Initializing simulation", response)

        if (status===0)
        {
            doSimulationStep(5);
            simulation.startVisualisation();
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Initializing simulation");
    });
}

function doSimulationStep(noOfSteps)
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getDataMultipleStep?noOfSteps=" + noOfSteps,
        dataType: "json",
    })
    .done(function( response ) {
        showGeneralError("Getting simulation data", response);
        if(response.status === 0)
        {
            jsonToSimulationDtos(response);
        }
        else
        {
            simulation.stopVisualisation();
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Getting simulation data");
    });
}

function stopSimulation()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/stopSimulation",
        dataType: "json",
    })
    .done(function( response ) {
        showGeneralError("Stopping simulation", response)
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Stopping simulation");
    });
}

function setSignalProgram(programId)
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/setSignalProgram",
        dataType: "json",
        data:
            {
                intersectionNo: situation.selectedIntersection.id,
                programId: programId
            }
    })
    .done(function( response ) {
        showGeneralError("Set signal program", response)
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Set signal program");
    });
}
function loadSituationLayout() {
    $.ajax({
        method: "GET",
        url: "http://" + ipAddr + ":" + port + "/getMap",
        dataType: "json",
        async: false
    })
    .done(function (response) {
        $('#response').html(JSON.stringify(response, null, 2));
        showGeneralError("Loading simulation layout", response);
        jsonToMapDtos(response);
        localStorage.setItem("connected", "yes");
        closeConnectDialog();
        $("#sidebar").show();
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Loading simulation layout");
    });
}

function postConfiguration()
{
    $.ajax({
        method: "POST",
        url: "http://" + ipAddr + ":" + port + "/sendConfiguration",
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
        url: "http://" + ipAddr + ":" + port + "/laneOperation",
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
        url: "http://" + ipAddr + ":" + port + "/laneOperation",
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
        url: "http://" + ipAddr + ":" + port + "/laneOperation",
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
        url: "http://" + ipAddr + ":" + port + "/deleteIntersection?intersectionId=" + situation.selectedIntersection.id,
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
        url: "http://" + ipAddr + ":" + port + "/resetSimulation",
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
        url: "http://" + ipAddr + ":" + port + "/setTrafficDensity?density=" + density,
        dataType: "json",
    })
    .done(function( response ) {
        showGeneralError("Setting traffic density", response)
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Setting traffic density");
    });
}

function doSimulationStep(noOfSteps)
{
    $.ajax({
        method: "GET",
        url: "http://" + ipAddr + ":" + port + "/getDataMultipleStep?noOfSteps=" + noOfSteps,
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
        simulation.setRequestForMoreSent(false);
    })
    .fail(function( jqXHR, textStatus, errorThrown ){
        showHttpError("Getting simulation data");
    });
}

function stopSimulation()
{
    $.ajax({
        method: "GET",
        url: "http://" + ipAddr + ":" + port + "/stopSimulation",
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
        url: "http://" + ipAddr + ":" + port + "/setSignalProgram",
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

function getStatistics()
{
    $.ajax({
        method: "GET",
        url: "http://" + ipAddr + ":" + port + "/getStatistics",
        dataType: "json",
    })
        .done(function( response ) {
            showGeneralError("Getting simulation output", response);
            if(response.status === 0)
            {
                setStatistics(response);
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            showHttpError("Getting simulation output");
        });
}
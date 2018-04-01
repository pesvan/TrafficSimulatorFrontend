function getMapData()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/getMap",
        dataType: "json"
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
            firstIntersection: situation[0].length === 0,
            selectedIntersectionId: drawer.selectedIntersection !== undefined ? drawer.selectedIntersection.id : undefined,
            conf:  readFile,
            angle: angle,
            position: position
        })
    })
        .done(function( msg ) {
            getMapData();
        })
        .fail(function(msg){
            alert( JSON.stringify(msg));
            getMapData();
        });
}

function portStopSimulation()
{
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/resetSimulation",
        dataType: "json",
    })
        .done(function( msg ) {
            alert(msg);
        })
        .fail(function(msg)
        {
            getMapData();
        });
}

function postRunSimulation()
{
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/runSimulation",
        dataType: "json",
    })
        .done(function( msg ) {
            alert(msg);
        })
        .fail(function(msg)
        {

        });
}
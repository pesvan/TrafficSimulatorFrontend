function updateSituationSidebar(situation)
{
    $("#intersectionCount").html(situation.intersectionCount);
    $("#routesCount").html(situation.routesCount);

    if(situation.intersectionCount === 0)
    {
        $('#selectedIntersection').hide();
        $("#tooltip").hide();
        $("#simulation").hide();
        $("#addIntersectionButtonFirst").show();
    }
    else
    {
        $('#selectedIntersection').show();
        $("#tooltip").show();
        $("#simulation").show();
        $("#addIntersectionButtonFirst").hide();
    }

    if(situation.isSelectedIntersection())
    {
        $('#selectedIntersection').show();
        $('#selectedIntersectionValue').html(
            situation.selectedIntersection.id + " " + situation.selectedIntersection.grid.toPolyString());
        $('#modalAddIntersectionPosition').show();
    }
    else
    {
        $('#selectedIntersection').hide();
        $('#modalAddIntersectionPosition').hide();
    }

    if(situation.isSelectedLane())
    {
        $('#selectedLane').show();
        $('#selectedLaneText').html(
            situation.selectedLane.toSelectedString());
    }
    else
    {
        $('#selectedLane').hide();
    }
}

function updateSimulationSidebar(simulation)
{
    let simState = "Not initialized";
    if(!simulation.runningVisualisation() && simulation.firstToDrawSimTime === 0)
    {
        simState = "Stopped";
    } else if (simulation.firstToDrawSimTime > 0)
    {
        simState = simulation.runningVisualisation() ? "Running" : "Paused";
    }

    $('#simState').html(simState);

    $('#simTime').html(simulation.firstToDrawSimTime);

    $('#vehCount').html(simulation.activeVehicles.length === 0 ? "" : simulation.activeVehicles.length);
}
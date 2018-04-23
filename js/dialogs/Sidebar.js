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
        $('#selectedLaneValue').html(
            situation.selectedLane.toSelectedString());

        let changeLaneLeftCheckbox = $("#changeLaneLeft");
        let changeLaneRightCheckbox = $("#changeLaneRight");
        let changeLaneStraightCheckbox = $("#changeLaneStraight");


        situation.selectedLane.left ? changeLaneLeftCheckbox.prop('checked', true) : changeLaneLeftCheckbox.prop('checked', false);
        situation.selectedLane.right ? changeLaneRightCheckbox.prop('checked', true) : changeLaneRightCheckbox.prop('checked', false);
        situation.selectedLane.straight ? changeLaneStraightCheckbox.prop('checked', true) : changeLaneStraightCheckbox.prop('checked', false);

    }
    else
    {
        $('#selectedLane').hide();
    }
}

function updateSimulationSidebar(simulation, selectedIntersection)
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

    if (simulation.firstToDrawSimTime > 0 && selectedIntersection !== undefined)
    {
        $('#selectedIntersectionPhase').show();
        $('#selectedIntersectionPhaseValue').html(selectedIntersection.id + simulation.simulationStepsToDraw[0].phaseStates[selectedIntersection.id].toString());
    }
    else
    {
        $('#selectedIntersectionPhase').hide();
    }

    if(simulation.isSelectedVehicle())
    {
        $('#selectedVehicle').show();
    }
    else {
        $('#selectedVehicle').hide();
    }
}

function updateVehicleInfo(vehicleState)
{
    $('#selectedVehicleValue').html(vehicleState.vehicle.toString() + vehicleState.toString());
}
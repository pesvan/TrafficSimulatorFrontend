

function updateSituationSidebar(situation)
{
    $("#intersectionCount").html(situation.intersectionCount);
    $("#routesCount").html(situation.routesCount);

    $("#getSimOutputButton").hide();

    if(situation.intersectionCount === 0)
    {
        $('#selectedIntersection').hide();
        $("#simulation").hide();
        $("#addIntersectionButtonFirst").show();
        $("#modalAddIntersectionVehicleTypes").show();
    }
    else
    {
        $('#selectedIntersection').show();
        $("#simulation").show();
        $("#addIntersectionButtonFirst").hide();
        $("#modalAddIntersectionVehicleTypes").hide();
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

function updateSimulationSidebar(simulation, userSelectedIntersection)
{
    let simState = "Not initialized";
    if(!simulation.runningVisualisation() && simulation.firstToDrawSimTime === 0)
    {
        simState = "Stopped";
    } else if (simulation.firstToDrawSimTime > 0)
    {
        simState = simulation.runningVisualisation() ? "Running" : "Paused";
        $('#getSimOutputButton').show();
    }

    $('#simState').html(simState);

    $('#simTime').html(simulation.firstToDrawSimTime);

    $('#vehCount').html(simulation.activeVehicles.length === 0 ? "" : simulation.activeVehicles.length);

    if (simulation.firstToDrawSimTime > 0 && userSelectedIntersection !== undefined &&
        userSelectedIntersection !== null && simulation.stepInProgress !== undefined)
    {
        $('#selectedIntersectionPhase').show();
        $('#selectedIntersectionPhaseValue').html(userSelectedIntersection.id + simulation.stepInProgress.phaseStates[userSelectedIntersection.id].toString());

        if(userSelectedIntersection.selectedSignalProgram === undefined)
        {
            userSelectedIntersection.setSelectedSignalProgram(simulation.stepInProgress.phaseStates[userSelectedIntersection.id].programId);
        }

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

function updateSignalProgramSelection(selectedIntersection, actualSignalProgram)
{
    let select = $('#signalProgramSelection');
    select.empty();

    for(let i = 0; i < selectedIntersection.signalPrograms.length; i++)
    {
        let signalProgram = selectedIntersection.signalPrograms[i];

        if(signalProgram === actualSignalProgram)
        {
            select.append($("<option></option>")
                .attr("selected", "selected").attr("value",signalProgram).text(signalProgram));
        }
        else
        {
            select.append($("<option></option>")
                .attr("value",signalProgram).text(signalProgram));
        }
    }
}
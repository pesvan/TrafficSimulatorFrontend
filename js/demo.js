/**
 *
 *
 */

// instance of a layout
let situation;

//instance of a simulation
let simulation;

// instance of a drawer
let drawer;


function loadAndDrawLayout()
{
    situation = new Situation();
    simulation = new Simulation();
    drawer = new Drawer(situation, simulation);
    loadSituationLayout();
    situation.initCanvas();
    drawSituationLayout();
}

function drawSituationLayout()
{
    drawer.drawIntersection(situation.intersectionList);
    drawer.drawConnections(situation.connections);
    drawer.drawConnectionPolygons(situation.connectionPolygons);
}

let totalStepTime = 0;
let totalSidebarTime = 0;
let totalAnimationTime = 0;
let totalRemoveTime = 0;

setInterval(visualization, SIM_STEP);

function setStatistics(json)
{
    $("#placeholderSimTime").html(json.payload.simulationTime);
    $("#placeholderSimStepLength").html(json.payload.simulationStepLength);
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: json.payload.simSteps,
            datasets: [{
                label: '# of vehicles',
                data: json.payload.vehiclesInTime,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
    modalShowStatistics.style.display = "block";
}

function visualization()
{



    let t0 = performance.now();

    updateSimulationSidebar(simulation, situation.selectedIntersection);

    let t1 = performance.now();

    if(simulation.visualizationRunning)
    {
        if(simulation.simulationStepsToDraw.length < 5 && simulation.requestForMoreSent === false)
        {
            simulation.setRequestForMoreSent(true);
            doSimulationStep(5);
        }

        let stepToDo = simulation.getFirstToDraw();
        if(stepToDo !== undefined)
        {

            drawer.simulateSimulationStep(stepToDo, drawer);
            let t2 = performance.now();
            simulation.removeInactiveVehicles();
            let t3 = performance.now();

            totalStepTime +=  (t3-t0);
            totalRemoveTime += (t3-t2);
            totalSidebarTime += (t2-t1);
            totalAnimationTime += (t1-t0);

            console.log("Simulation step ", stepToDo.time, " took ", (t3-t0), " ms (update sidebar ", (t1-t0), ", simulate step", (t2-t1), ", remove inactive", (t3-t2));
        }

    }
    else{
        //do nothing
    }
}

function jsonToSimulationDtos(json)
{

    /**
     * iterate the simulation steps just like in json
     * go through the vehicle states;
     *      if the vehicle in vehicle state exists, move its svg
     *      else init the vehicle (create svg, set it to init position and save svg to vehicles)
     *
     */

    json = json.payload;

    for(let i = 0; i < json.length; i++)
    {
        let simulationStep = json[i].simulationStep;

        let simTimeDto = new SimulationTime(simulationStep);

        let jsonVehiclesToAdd = json[i].vehiclesToAdd;

        for (let v = 0; v < jsonVehiclesToAdd.length; v++) {
            let jsonVehicleToAdd = jsonVehiclesToAdd[v];

            let id = jsonVehicleToAdd.id;
            let length = jsonVehicleToAdd.vehLength;
            let width = jsonVehicleToAdd.vehWidth;
            let color = jsonVehicleToAdd.hexColor;

            let newVehicle = new Vehicle(id, color, length, width);

            simulation.addActiveVehicle(newVehicle);
        }

        let jsonVehiclesInTime = json[i].vehicleState;
        for (let v = 0; v < jsonVehiclesInTime.length; v++) {

            let jsonVehicleStateInTime = jsonVehiclesInTime[v];
            let id = jsonVehicleStateInTime.id;
            let coords = new Coords(
                jsonVehicleStateInTime.coords.x,
                jsonVehicleStateInTime.coords.y
            );
            let angle = jsonVehicleStateInTime.angle;
            let signaling = jsonVehicleStateInTime.signaling;

            let speed = jsonVehicleStateInTime.speed;
            let distance = jsonVehicleStateInTime.distance;
            let waitingTime = jsonVehicleStateInTime.waitingTime;

            let vehicleState = new VehicleState(coords, angle, signaling, speed, distance, waitingTime);


            let existingVehicle = simulation.findActiveVehicle(id);
            if (existingVehicle === null) {
                console.log("vehicle not found");
            }
            else
            {
                vehicleState.setVehicle(existingVehicle, situation.boundaryCoordinates.y);
            }

            simTimeDto.addVehicleState(vehicleState);
        }

        let jsonTlStates = json[i].tlState;

        for (let t = 0; t <jsonTlStates.length; t++)
        {
            let jsonTlStateInTime = jsonTlStates[t];
            let laneId = jsonTlStateInTime.laneId;
            let lane = getLaneById(laneId, situation.intersectionList);
            let state  = jsonTlStateInTime.laneState;

            let tlState = new TlState(lane, state);

            simTimeDto.addTlState(tlState);
        }

        let jsonPhaseStates = json[i].phaseState;

        for (let p = 0; p < jsonPhaseStates.length; p++)
        {
            let jsonPhaseState = jsonPhaseStates[p];
            let programId = jsonPhaseState.programId;
            let tlsId = jsonPhaseState.id;
            let nextSwitch = jsonPhaseState.nextSwitch;
            let phaseId = jsonPhaseState.phaseId;
            let phaseState = new PhaseState(nextSwitch, phaseId, programId);

            simTimeDto.addPhaseState(phaseState, tlsId);
        }

        simulation.addSimulationStep(simTimeDto);
    }

}

function jsonToMapDtos(json)
{
    json = json.payload;

    let jsonMetadata = json.metadata;

    let intersectionCount = jsonMetadata.intersectionCount;
    let routesCount = jsonMetadata.routesCount;

    let boundaryCoordinates = new Coords(jsonMetadata.networkBoundary.x, jsonMetadata.networkBoundary.y);

    situation.setMetadata(
        intersectionCount,
        routesCount,
        boundaryCoordinates);

    for(let i = 0; i < json.intersectionList.length; i++)
    {
        let jsonIntersection = json.intersectionList[i];
        let legList = [];
        let intersectionId = jsonIntersection.id;
        let intersectionGrid = new GridPos(
            jsonIntersection.gridPosition.x, jsonIntersection.gridPosition.y);
        let angle = jsonIntersection.angle;
        let signalPrograms = jsonIntersection.signalProgramList;

        let shapeJson = jsonIntersection.shape.coords;
        let coordinatesList = [];

        for (let s = 0; s < shapeJson.length; s++)
        {
            coordinatesList[s] = new Coords(shapeJson[s].x, shapeJson[s].y);
        }

        let shape = new Shape(coordinatesList, jsonMetadata.networkBoundary.y, undefined, false);

        for(let l = 0; l < jsonIntersection.legList.length; l++)
        {
            let jsonLeg = jsonIntersection.legList[l];
            let legId = jsonLeg.id;
            let legAngle = jsonLeg.angle;
            let inputLaneList = [];
            let outputLaneList = [];

            for(let k = 0; k < jsonLeg.laneList.length; k++)
            {
                let jsonLane = jsonLeg.laneList[k];
                let laneId = jsonLane.id;

                let shapeJson = jsonLane.shape.coords;
                let coordinatesList = [];
                for (let s = 0; s < shapeJson.length; s++)
                {
                    coordinatesList[s] = new Coords(shapeJson[s].x, shapeJson[s].y);
                }

                let laneShape = new Shape(coordinatesList, jsonMetadata.networkBoundary.y, legAngle);

                let isInputLane = jsonLane.inputLane;

                if(isInputLane)
                {
                    let lane = new Lane(laneId, legId, intersectionId, laneShape);
                    inputLaneList.push(lane);
                    lane.setDirections(jsonLane.directions.left, jsonLane.directions.right, jsonLane.directions.straight);
                }
                else
                {
                    outputLaneList[outputLaneList.length] = new Lane(laneId, legId, intersectionId, laneShape, true);
                }

            }

			legList[l] = new Leg(legId, legAngle, inputLaneList, outputLaneList);
        }

        situation.addIntersection(
            new Intersection(intersectionId, intersectionGrid, legList, angle, signalPrograms, shape));
    }

    for(let i = 0; i < json.connectionLegs.length; i++)
    {
        let jsonConnection = json.connectionLegs[i];

        let shapeJson = jsonConnection.shape.coords;
        let coordinatesList = [];
        for (let s = 0; s < shapeJson.length; s++)
        {
            coordinatesList[s] = new Coords(shapeJson[s].x, shapeJson[s].y);
        }

        let laneShape = new Shape(coordinatesList, jsonMetadata.networkBoundary.y);

        situation.addConnection(new ConnectingLeg(jsonConnection.id,
            getLegById(jsonConnection.leg1Id, situation.intersectionList),
            getLegById(jsonConnection.leg2Id, situation.intersectionList), laneShape));
    }

    for(let i = 0; i < json.connectionPolygons.length; i++)
    {
        let jsonConnection = json.connectionPolygons[i];

        let shapeJson = jsonConnection.shape.coords;
        let coordinatesList = [];
        for (let s = 0; s < shapeJson.length; s++)
        {
            coordinatesList[s] = new Coords(shapeJson[s].x, shapeJson[s].y);
        }

        let laneShape = new Shape(coordinatesList, jsonMetadata.networkBoundary.y, undefined, false);

        situation.addConnectionPolygon(laneShape);
    }

    let jsonVehiclesToAdd = json.alreadyExistingVehicles;

    for (let v = 0; v < jsonVehiclesToAdd.length; v++) {
        let jsonVehicleToAdd = jsonVehiclesToAdd[v];

        let id = jsonVehicleToAdd.id;
        let length = jsonVehicleToAdd.vehLength;
        let width = jsonVehicleToAdd.vehWidth;
        let color = jsonVehicleToAdd.hexColor;

        let newVehicle = new Vehicle(id, color, length, width);

        simulation.addActiveVehicle(newVehicle);
    }

}

function getLegById(id, intersectionList)
{
    for (let i = 0; i < intersectionList.length; i++)
    {
        let intersection = intersectionList[i];
        for (let l = 0; l < intersection.legList.length; l++)
        {
            let leg = intersection.legList[l];
            if(leg.id === id)
            {
                return leg;
            }
        }
    }
    return undefined;
}

function getLaneById(id, intersectionList)
{
    for (let i = 0; i < intersectionList.length; i++)
    {
        let intersection = intersectionList[i];
        for (let l = 0; l < intersection.legList.length; l++)
        {
            let leg = intersection.legList[l];
            for (let k = 0; k < leg.inputLaneList.length; k++)
            {
                if(id == leg.inputLaneList[k].id)
                {
                    return leg.inputLaneList[k];
                }
            }
        }
    }
    return undefined;
}


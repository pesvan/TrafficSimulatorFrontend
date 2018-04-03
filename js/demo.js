/**
 *
 *
 */

// instance of a layout
let situation = new Situation();

// instance of a drawer
let drawer = new Drawer(situation);
loadAndDrawLayout();

function loadAndDrawLayout()
{
    loadSituationLayout();
    situation.initCanvas();
    drawer.setOffset();
    drawSituationLayout();
}

function drawSituationLayout()
{
    drawer.drawIntersection(situation.intersectionList);
    drawer.drawConnections(situation.connections);
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

    let vehicles = [];

    let simulationSteps = [];

    for (let i = 0; i < json.length; i++)
    {
        let simulationStep = json[i].simulationStep;

        let simTimeDto = new SimulationTime(simulationStep);

        let jsonVehiclesInTime = json[i].vehicleState;
        for (let v = 0; v < jsonVehiclesInTime.length; v++)
        {

            let jsonVehicleStateInTime = jsonVehiclesInTime[v];
            let id = jsonVehicleStateInTime.id;
            let coords = new Coords(
                jsonVehicleStateInTime.coords.x,
                jsonVehicleStateInTime.coords.y
            );
            let angle = jsonVehicleStateInTime.angle;
            let signaling = jsonVehicleStateInTime.signaling;
            let vehicleState = new VehicleState(coords, angle, signaling);

            let existingVehicle = findVehicleById(vehicles, id);
            if (existingVehicle == null)
            {
                let newVehicle = new Vehicle(id);
                vehicleState.setVehicle(newVehicle);
                vehicles.push(newVehicle);
            }
            else
            {
                vehicleState.setVehicle(existingVehicle);
            }

            simTimeDto.addVehicleState(vehicleState);

        }

        simulationSteps.push(simTimeDto);
    }


    drawer.drawVehicles(simulationSteps);
}

function findVehicleById(vehicles, id)
{
    for(let i = 0; i < vehicles.length; i++)
    {
        if(id===vehicles[i].id)
        {
            return vehicles[i];
        }
    }
    return null;
}



function jsonToMapDtos(json)
{
    let jsonMetadata = json.metadata;

    let intersectionCount = jsonMetadata.intersectionCount;
    let routesCount = jsonMetadata.routesCount;
    let distanceBetweenLegEnds = jsonMetadata.distanceBetweenLegEnds;
    let distanceBetweenIntersections = jsonMetadata.distanceBetweenIntersections;

    let gridDimensions = new GridDimensions(
        jsonMetadata.gridDimensions.minimumX,
        jsonMetadata.gridDimensions.minimumY,
        jsonMetadata.gridDimensions.maximumX,
        jsonMetadata.gridDimensions.maximumY,
    );

    let vehicleBase = new Coords(
        jsonMetadata.vehicleCoordinatesStart.x,
        jsonMetadata.vehicleCoordinatesStart.y);

    situation.setMetadata(
        distanceBetweenLegEnds, distanceBetweenIntersections, intersectionCount,
        routesCount, gridDimensions, vehicleBase);

    for(let i = 0; i < json.intersectionList.length; i++)
    {
        let jsonIntersection = json.intersectionList[i];
        let legList = [];
        let intersectionId = jsonIntersection.id;
        let intersectionCoordinates = new Coords(
			jsonIntersection.coordinates.x, jsonIntersection.coordinates.y);
        let intersectionGrid = new GridPos(
            jsonIntersection.gridPosition.x, jsonIntersection.gridPosition.y);
        let angle = jsonIntersection.angle;

        for(let l = 0; l < jsonIntersection.legList.length; l++)
        {
            let jsonLeg = jsonIntersection.legList[l];
            let legId = jsonLeg.id;
            let legAngle = jsonLeg.angle;
            let legCoordinates = new Coords(
                jsonLeg.coordinates.x, jsonLeg.coordinates.y);
            let outputLanesCount = jsonLeg.outputLanesCount;
            let laneList = [];

            for(let k = 0; k < jsonLeg.laneList.length; k++)
            {
                let jsonLane = jsonLeg.laneList[k];
                let laneId = jsonLane.id;
                laneList[k] = new Lane(laneId,
                    jsonLane.left, jsonLane.right, jsonLane.straight);
            }

			legList[l] = new Leg(legId, legAngle, outputLanesCount, legCoordinates, laneList);
        }

        situation.addIntersection(
            new Intersection(intersectionId, intersectionCoordinates, intersectionGrid, legList, angle));
    }

    for(let i = 0; i < json.connectionLegs.length; i++)
    {
        let jsonConnection = json.connectionLegs[i];

        situation.addConnection(new ConnectingLeg(jsonConnection.id,
            getLegById(jsonConnection.leg1Id, situation.intersectionList),
            getLegById(jsonConnection.leg2Id, situation.intersectionList)));
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


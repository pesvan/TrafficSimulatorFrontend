let readFile;
let angle;
let canvas;
let position = "left";
let header = document.getElementById("header");
let sticky = header.offsetTop;
let drawer;

let situation;

let selectedIntersectionPersistent;

getMapData();

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);

document.getElementById('angle-input')
.addEventListener('change', readAngle, false);

document.getElementById('position-input')
    .addEventListener('change', readPosition, false);

window.onscroll = function() {
    stickToTheTop()
};



function stickToTheTop() {
    if (window.pageYOffset >= sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

let modal = document.getElementById('modalAddIntersection');

// Get the button that opens the modal
let btn = document.getElementById("addIntersectionButton");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function readSingleFile(e) {
	  let file = e.target.files[0];
	  if (!file) {
	    return;
	  }
	  let reader = new FileReader();
	  reader.onload = function(e) {
          readFile = e.target.result;
	  };
	  reader.readAsText(file);
	  
	}

function readAngle(e) {
	angle = e.target.value;
}

function readPosition(e)
{
    position = e.target.value;
}

$('#getSimData').on("click", getSimulationData);
$('#sendConfiguration').on("click", postConfiguration);
$('#resetButton').on("click", portStopSimulation);
$('#runSimulation').on("click", postRunSimulation);


function test(situation)
{
    if(drawer !== null && drawer !== undefined)
    {
        selectedIntersectionPersistent = drawer.selectedIntersection;
    }
    drawer = new Drawer(xOffset, yOffset, selectedIntersectionPersistent);

    drawer.drawIntersection(situation[0]);
    drawer.drawConnections(situation[1]);
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
	let intersectionList = [];
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

        intersectionList[i] = new Intersection(intersectionId, intersectionCoordinates, intersectionGrid, legList, angle)
    }

    let connectionList = [];

    for(let i = 0; i < json.connectionLegs.length; i++)
    {
        let jsonConnection = json.connectionLegs[i];

        connectionList[i] = new ConnectingLeg(jsonConnection.id,
            getLegById(jsonConnection.leg1Id, intersectionList),
            getLegById(jsonConnection.leg2Id, intersectionList));

    }

    situation = [intersectionList, connectionList];


    test(situation);
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


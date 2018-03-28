let readFile;
let angle;
let canvas;
let position = "left";

let drawer;

let situation;

getMapData();

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);

document.getElementById('angle-input')
.addEventListener('change', readAngle, false);

document.getElementById('position-input')
    .addEventListener('change', readPosition, false);

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

		  data: JSON.stringify({
              firstIntersection: situation[0].length === 0,
              selectedIntersectionId: drawer.selectedIntersection,
		      conf:  readFile,
              angle: angle,
              position: position,
              endMark: "qqq"
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
        method: "POST",
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

function readSingleFile(e) {
	  var file = e.target.files[0];
	  if (!file) {
	    return;
	  }
	  var reader = new FileReader();
	  reader.onload = function(e) {
	    var contents = e.target.result;
	    displayContents(contents);
	    readFile = contents;
	    //postConfiguration(contents+"qqq");
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

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

$('#getSimData').on("click", getSimulationData);
$('#sendConf').on("click", postConfiguration);
$('#resetButton').on("click", portStopSimulation);
$('#runSimulation').on("click", postRunSimulation);


function test(situation)
{
    drawer = new Drawer(xOffset, yOffset);

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

        intersectionList[i] = new Intersection(intersectionId, intersectionCoordinates, legList, angle)
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


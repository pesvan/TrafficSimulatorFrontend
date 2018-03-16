let readFile;
let angle;
let canvas;

let drawer;

let situation;

getMapData();

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);

document.getElementById('angle-input')
.addEventListener('change', readAngle, false);

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
		  data: {
			  angle: angle,
				conf:  readFile + "qqq"
		  	}			  
		})
		  .done(function( msg ) {
		    alert(msg);
		  });
}

function postStopSimulation()
{
	$.ajax({
		  method: "POST",
		  url: "http://localhost:8080/stopSimulation",
		  dataType: "json",
			  
		})
		  .done(function( msg ) {
		    alert(msg);
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

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

$('#getSimData').on("click", getSimulationData);
$('#sendConf').on("click", postConfiguration);
$('#stopButton').on("click", postStopSimulation);

function test(situation)
{
    drawer = new Drawer(xOffset, yOffset);

    drawer.drawIntersection(situation[0]);
    drawer.drawConnections(situation[1]);
}

function jsonToSimulationDtos(json)
{
    let vehicleStates = [];


    let iterator = 0;

    for (let i = 0; i < json.length; i++)
    {
        let jsonVehicles = json[i].vehicleState;
        for (let v = 0; v < jsonVehicles.length; v++)
        {
            let jsonVehicleState = jsonVehicles[v];
            let id = jsonVehicleState.id;
            let coords = new Coords(
                jsonVehicleState.coords.x,
                jsonVehicleState.coords.y
            );
            let angle = jsonVehicleState.angle;
            let signaling = jsonVehicleState.signaling;
            vehicleStates[iterator] = new VehicleState(id, coords, angle, signaling);
            iterator++;
        }
    }


    drawer.drawVehicle(vehicleStates);
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


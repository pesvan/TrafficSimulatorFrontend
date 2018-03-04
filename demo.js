
var readFile;
var angle;
var canvas;


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
		    jsonToDtos(msg);
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

$('#buto').on("click", getMapData);
$('#sendConf').on("click", postConfiguration);
$('#stopButton').on("click", postStopSimulation);


function drawCanvas(json)
{
	canvas = SVG('canvas').size(5000, 5000)
	

	 
	console.log(json);
	drawArrowStraight();
	drawArrowRight();
	drawArrowLeft();
}


function drawLane(coordinatesStart, coordinatesEnd, offset, order)
{
    let xSin = parseFloat(coordinatesEnd.xsin);
    let yCos = parseFloat(coordinatesEnd.ycos);

    let l1x = parseFloat(coordinatesStart.x) + xOffset + (offset * (order));
    let l1y = parseFloat(coordinatesStart.y) + yOffset + (offset * (order));

    let l2x = parseFloat(coordinatesEnd.x) + xOffset + (offset * (order));
    let l2y = parseFloat(coordinatesEnd.y) + yOffset + (offset * (order));
	
	
	var l1xo = parseFloat(coordinatesStart.x) + xOffset + (offset * (xSin) * (order+1));
	var l1yo = parseFloat(coordinatesStart.y) + yOffset + (offset * (yCos) * (order+1));
	var l2xo = parseFloat(coordinatesEnd.x) + xOffset + (offset * (xSin) * (order+1));
	var l2yo = parseFloat(coordinatesEnd.y) + yOffset + (offset * (yCos) * (order+1));
	/*
	var l1xo = parseFloat(coordinatesStart.x) + (offset * xSin * (order+1)) + xOffset;
	var l1yo = parseFloat(coordinatesStart.y) + (offset * yCos * (order+1)) + yOffset;
	var l2xo = parseFloat(coordinatesEnd.x) + (offset * xSin * (order+1)) + xOffset;
	var l2yo = parseFloat(coordinatesEnd.y) + (offset * yCos * (order+1)) + yOffset;*/
	
	var polyString = l1x+","+l1y+" "+l2x+","+l2y+" "+l2xo+","+l2yo+" "+l1xo+","+l1yo;
	
	canvas.polygon(polyString).stroke({color:'#ffffff', width: 1}).fill({color:'#000000'});
	
	
	
	console.log(polyString);
}

function drawArrowStraight()
{
	canvas.line(50, 75, 75, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
	canvas.polygon('0,0 15,5 0,10').move(75,70).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
}

function drawArrowRight()
{
	canvas.line(50, 75, 62, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
	canvas.line(62, 75, 75, 88).stroke({ width: 2}).stroke({color:'#ffffff'});

	canvas.polygon('7,0 14,14 0,7').move(70,84).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
}

function drawArrowLeft()
{
	canvas.line(50, 75, 62, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
	canvas.line(62, 75, 75, 62).stroke({ width: 2}).stroke({color:'#ffffff'});

	canvas.polygon('7,14 14,0 0,7').move(70,53).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
}


function jsonToDtos(json)
{
	let intersectionList = [];
    for(let i = 0; i < json.intersectionList.length; i++)
    {
        let jsonIntersection = json.intersectionList[i];
        let legList = [];
        let intersectionId = jsonIntersection.id;
        let intersectionCoordinates = new Coordinates(
			jsonIntersection.coordinates.x, jsonIntersection.coordinates.y,
			jsonIntersection.coordinates.ycos, jsonIntersection.coordinates.xsin);

        for(let l = 0; l < jsonIntersection.legList.length; l++)
        {
            let jsonLeg = jsonIntersection.legList[l];
            let legId = jsonLeg.id;
            let legCoordinates = new Coordinates(
                jsonLeg.coordinates.x, jsonLeg.coordinates.y,
                jsonLeg.coordinates.ycos, jsonLeg.coordinates.xsin);
            let outputLanesCount = jsonLeg.outputLanesCount;
            let laneList = [];

            for(let k = 0; k < jsonLeg.laneList.length; k++)
            {
                let jsonLane = jsonLeg.laneList[k];
                let laneId = jsonLane.id;
                laneList[k] = new Lane(laneId,
                    jsonLane.left, jsonLane.right, jsonLane.straight);
            }

			legList[l] = new Leg(legId, outputLanesCount, legCoordinates, laneList);
        }

        intersectionList[i] = new Intersection(intersectionId, intersectionCoordinates, legList)
    }

    let connectionList = [];

    for(var i = 0; i < json.connectionLegs.length; i++)
    {
        var jsonConnection = json.connectionLegs[i];

        connectionList[i] = new ConnectingLeg(jsonConnection.id,
            getLegById(jsonConnection.leg1Id, intersectionList),
            getLegById(jsonConnection.leg2Id, intersectionList));

    }

    situation = [intersectionList, connectionList];

    console.log(situation);
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


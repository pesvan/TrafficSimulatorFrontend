class Drawer
{
    constructor(xOffset, yOffset)
    {
        $('#canvas').empty();
        this.canvas = SVG('canvas').size(1920, 500);
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.selectedIntersection = null;
    }

    __drawPolygon(coordinatesList, borderColor, borderWidth, fillColor, id)
    {
        let movedCoordinates = this.moveListToOffset(coordinatesList);

        let polyString = "";
        for ( let i = 0; i < movedCoordinates.length; i++)
        {
            polyString += movedCoordinates[i].toPolyString() + " ";
        }
        return this.canvas.polygon(polyString)
            .stroke({
                color: borderColor,
                width: borderWidth
            })
            .fill({
                color: fillColor
            })
            .addClass(id)
            .attr("data-tooltip", "")
            .attr("title", "test");
    }

    __drawPolyline(coordinatesList, borderColor, borderWidth, fillColor, id)
    {
        let movedCoordinates = this.moveListToOffset(coordinatesList);

        let polyString = "";
        for ( let i = 0; i < movedCoordinates.length; i++)
        {
            polyString += movedCoordinates[i].toPolyString() + " ";
        }
        return this.canvas.polyline(polyString)
            .stroke({
                color: borderColor,
                width: borderWidth
            })
            .fill({
                color: fillColor
            })
            .addClass(id)
            .attr("data-tooltip", "")
            .attr("title", "test");
    }

    _drawPoint(coordinates)
    {
        return this.canvas.circle(2)
            .move(coordinates.__x, coordinates.__y)
            .fill({
                    color: redColor
             });


    }

    drawLane(intersectionCoordinates, leg, offset, order)
    {
        let coordinatesList = [];

        let  angle = leg.angle + 90;

        coordinatesList[0] = moveCoordinatesByOffset(intersectionCoordinates, angle, offset * order);
        coordinatesList[1] = moveCoordinatesByOffset(intersectionCoordinates, angle , offset * (order + 1));
        coordinatesList[2] = moveCoordinatesByOffset(leg.coordinates, angle, offset * (order + 1));
        coordinatesList[3] = moveCoordinatesByOffset(leg.coordinates, angle, offset * order);

        return this.__drawPolygon(coordinatesList, whiteColor, 1, blackColor, leg.id);
    }

    drawConnectingLane(leg1, leg2, id)
    {
        let triangleEdge = new Coords(leg1.leftEndPoint.x, leg2.rightEndPoint.y);

        let adjacentLength = getDistance2D(leg2.rightEndPoint, triangleEdge);
        let hypotenuseLength = getDistance2D(leg2.rightEndPoint, leg1.leftEndPoint);

        let radians = adjacentLength / hypotenuseLength;

        let angle = radiansToDegrees(radians);

        let leg2size = getDistance2D(leg2.leftEndPoint, leg2.rightEndPoint);

        let newPoint = moveCoordinatesByOffset(leg2.leftEndPoint, angle + 90, leg2size);

        let triangleEdge2 = new Coords(leg2.rightEndPoint.x, leg1.rightEndPoint.y);
        let adjacentLength2 = getDistance2D(leg1.leftEndPoint, triangleEdge2);
        let hypotenuseLength2 = getDistance2D(leg1.leftEndPoint, leg2.rightEndPoint);
        let radians2 = adjacentLength2 / hypotenuseLength2;
        let angle2 = radiansToDegrees(radians2);
        let leg1size = getDistance2D(leg1.leftEndPoint, leg1.rightEndPoint);

        let newPoint2 = moveCoordinatesByOffset(leg1.leftEndPoint, angle2 - 90, leg1size);



        let corner1 =
            [
                leg1.leftEndPoint,
                leg1.rightEndPoint,
                newPoint2

            ];

        let corner2 =
            [
                leg2.leftEndPoint,
                leg2.rightEndPoint,
                newPoint
            ];


        let midPoint1 = findMiddlePoint(leg1.leftEndPoint, newPoint2);
        let midPoint2 = findMiddlePoint(leg2.leftEndPoint, newPoint);

        this.__drawPolygon(corner1, whiteColor, 1, yellowColor, id);
        this.__drawPolygon(corner2, whiteColor, 1, yellowColor, id);

        let lane1 =
            [
                leg1.leftEndPoint,
                midPoint1,
                midPoint2,
                newPoint
            ];
        let laneSvg1 = this.__drawPolygon(lane1, whiteColor, 1, blackColor, id);

        laneSvg1.on("mouseover", function() {
            this.style("cursor", "pointer");
            $('#tooltip').html(leg2.id + " -> " + leg1.id);
            this.fill({ color: selectedColor })
        });
        laneSvg1.on("mouseout", function() {
            $('#tooltip').html("");
            this.fill({ color: '#000' })
        });

        let lane2 =
            [
                leg2.leftEndPoint,
                newPoint2,
                midPoint1,
                midPoint2
            ];
        let laneSvg2 = this.__drawPolygon(lane2, whiteColor, 1, blackColor, id);

        laneSvg2.on("mouseover", function() {
            this.style("cursor", "pointer");
            $('#tooltip').html(leg1.id + " -> " + leg2.id);
            this.fill({ color: selectedColor })
        });
        laneSvg2.on("mouseout", function() {
            $('#tooltip').html("");
            this.fill({ color: '#000' })
        });
    }

    drawCenter(intersectionBorders, id)
    {
        return this.__drawPolygon(intersectionBorders, redColor, 1, blackColor, id);
    }

    drawVehicle(vehicleStates)
    {
        let coordinatesList = [];

        //get first

        let coords = this.moveToOffset(vehicleStates[0].coords);
        coords.__x -= 1500;
        coords.__y += 250;
        let svg = this._drawPoint(coords);

        for (let i = 1; i < vehicleStates.length; i++)
        {
            let coords = this.moveToOffset(vehicleStates[i].coords);
            coords.__x -= 1500;
            coords.__y += 250;
            coordinatesList[i-1] = coords;
        }

        this.__animate(coordinatesList, svg);
        // this.__drawPolyline(coordinatesList, redColor, 2, null, 0);
    }

    __animate(coordinatesList, svg)
    {
        for (let i = 0; i < coordinatesList.length; i++)
        {
            let coords = coordinatesList[i];
            svg.animate({
                ease: '-',
                duration: 500
            }).move(coords.__x, coords.__y).play();
        }
    }

    drawIntersection(intersectionList)
    {
        let offset = 20;

        for (let i = 0; i < intersectionList.length; i++)
        {
            let intersection = intersectionList[i];
            let intersectionBorders = [];

            for(let l = 0, cnt = 0; l < intersection.legList.length; l++, cnt++)
            {
                let leg = intersection.legList[l];

                let angle = leg.angle;

                let movedIntersectionCoords = moveCoordinatesByOffset(intersection.coordinates, angle , offset+10);

                for(let k = 0; k < leg.laneList.length; k++)
                {
                    let laneSvg = this.drawLane(movedIntersectionCoords, leg, offset, k);

                    laneSvg.on("mouseover", function() {
                        this.style("cursor", "pointer");
                        $('#tooltip').html(leg.toString(leg.laneList[k]));
                        this.fill({ color: selectedColor })
                    });
                    laneSvg.on("mouseout", function() {
                        $('#tooltip').html("");
                        this.fill({ color: '#000' })
                    });
                }

                for(let k = leg.outputLanesCount * (-1); k < 0; k++)
                {
                    let laneSvg = this.drawLane(movedIntersectionCoords, leg, offset, k);

                    laneSvg.on("mouseover", function() {
                        this.style("cursor", "pointer");
                        $('#tooltip').html(leg.toString("Output" + (k+1)));
                        this.fill({ color: selectedColor })
                    });
                    laneSvg.on("mouseout", function() {
                        $('#tooltip').html("");
                        this.fill({ color: '#000' })
                    });
                }

                let leftIntersectionPoint = moveCoordinatesByOffset(movedIntersectionCoords, angle + 90, offset * leg.laneList.length);
                let rightIntersectionPoint = moveCoordinatesByOffset(movedIntersectionCoords, angle + 90, offset * (-1) * leg.outputLanesCount);

                intersectionBorders[cnt] = rightIntersectionPoint;
                cnt++;
                intersectionBorders[cnt] = leftIntersectionPoint;

                let leftEndPoint = moveCoordinatesByOffset(leg.coordinates, angle + 90, offset * leg.laneList.length);
                let rightEndPoint = moveCoordinatesByOffset(leg.coordinates, angle + 90, offset * (-1) * leg.outputLanesCount);

                leg.setIntersectionBorderCoords(leftIntersectionPoint, rightIntersectionPoint);
                leg.setEndBorderCoords(leftEndPoint, rightEndPoint);
            }
            let click = function()
            {
                this.setSelectedIntersection(intersection.id);
            };
            let intersectionCenter = this.drawCenter(intersectionBorders, intersection.id);
            intersectionCenter.on("click", click, this);
            if(this.selectedIntersection !== intersection.id)
            {
                intersectionCenter.on("mouseover", function() {
                    this.style("cursor", "pointer");
                    $('#tooltip').html(intersection.toString());
                    this.fill({ color: '#f06' })
                });




                intersectionCenter.on("mouseout", function() {
                    $('#tooltip').html("");
                    this.fill({ color: '#000' })
                });
            }



        }
    }

    setSelectedIntersection(id)
    {
        this.selectedIntersection = id;
        console.log(this.selectedIntersection);
        $('#selectedIntersection').html("Selected intersection: " + id);
    }

    drawConnections(connectionList)
    {
        for (let i = 0; i < connectionList.length; i++)
        {
            let connection = connectionList[i];

            let leg1 = connection.leg1;
            let leg2 = connection.leg2;
            let id = connection.id;

            let svg = this.drawConnectingLane(leg1, leg2, id);



        }
    }

    moveListToOffset(coordinatesList)
    {
        let newCoordinatesList = [];

        for (let i = 0; i < coordinatesList.length; i++)
        {
            newCoordinatesList[i] = this.moveToOffset(coordinatesList[i]);
        }

        return newCoordinatesList;
    }

    moveToOffset(coordinates)
    {
        return new Coords(coordinates.__x + this.xOffset, coordinates.__y + this.yOffset);
    }

    drawArrowStraight()
    {
        canvas.line(50, 75, 75, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
        canvas.polygon('0,0 15,5 0,10').move(75,70).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
    }

    drawArrowRight()
    {
        canvas.line(50, 75, 62, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
        canvas.line(62, 75, 75, 88).stroke({ width: 2}).stroke({color:'#ffffff'});

        canvas.polygon('7,0 14,14 0,7').move(70,84).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
    }

    drawArrowLeft()
    {
        canvas.line(50, 75, 62, 75).stroke({ width: 2}).stroke({color:'#ffffff'});
        canvas.line(62, 75, 75, 62).stroke({ width: 2}).stroke({color:'#ffffff'});

        canvas.polygon('7,14 14,0 0,7').move(70,53).stroke({ width: 1}).fill({color:'#ffffff'}).stroke({color:'#ffffff'});
    }
}
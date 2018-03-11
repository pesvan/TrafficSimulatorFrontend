class Drawer
{
    constructor(xOffset, yOffset)
    {
        this.canvas = SVG('canvas').size(1920, 500);
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    __drawPolygon(coordinatesList, borderColor, borderWidth, fillColor, id)
    {
        this.moveToOffset(coordinatesList);

        let polyString = "";
        for ( let i = 0; i < coordinatesList.length; i++)
        {
            polyString += coordinatesList[i].toPolyString() + " ";
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

    _drawPoint(coordinates)
    {
        this.canvas.circle(2)
            .move(coordinates.__x + this.xOffset, coordinates.__y + this.yOffset)
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

        let leg1c = leg1.coordinates;
        let leg2c = leg2.coordinates;

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

        let newPoint2 = moveCoordinatesByOffset(leg1.leftEndPoint, angle2 - 90, leg2size);


        console.log(leg2c, leg1c, triangleEdge, triangleEdge2,  radians, angle, angle2 , newPoint);

        let coordinatesList =
            [
                leg1.leftEndPoint,
                leg1.rightEndPoint,
                newPoint2,
                leg2.leftEndPoint,
                leg2.rightEndPoint,
                newPoint




            ];


        let svg = this.__drawPolygon(coordinatesList, whiteColor, 1, blackColor, id);

        let point = this._drawPoint(newPoint2);

        return svg;
    }

    drawCenter(intersectionBorders, id)
    {
        return this.__drawPolygon(intersectionBorders, redColor, 1, blackColor, id);
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


            let intersectionCenter = this.drawCenter(intersectionBorders, intersection.id);
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

    drawConnections(connectionList)
    {
        for (let i = 0; i < connectionList.length; i++)
        {
            let connection = connectionList[i];

            let leg1 = connection.leg1;
            let leg2 = connection.leg2;
            let id = connection.id;

            let svg = this.drawConnectingLane(leg1, leg2, id);

            svg.on("mouseover", function() {
                this.style("cursor", "pointer");
                $('#tooltip').html(connection.toString());
                this.fill({ color: selectedColor })
            });
            svg.on("mouseout", function() {
                $('#tooltip').html("");
                this.fill({ color: '#000' })
            });

        }
    }

    moveToOffset(coordinatesList)
    {
        for (let i = 0; i < coordinatesList.length; i++)
        {
            coordinatesList[i].__x += this.xOffset;
            coordinatesList[i].__y += this.yOffset;
        }
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
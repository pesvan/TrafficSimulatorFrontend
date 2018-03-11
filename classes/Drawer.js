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
                    color: whiteColor
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

        let legElement = this.__drawPolygon(coordinatesList, whiteColor, 1, blackColor, leg.id);



        return legElement;
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

                let movedIntersectionCoords = moveCoordinatesByOffset(intersection.coordinates, angle , offset);

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

                let leftMostPoint = moveCoordinatesByOffset(movedIntersectionCoords, angle + 90, offset * leg.laneList.length);
                let rightMostPoint = moveCoordinatesByOffset(movedIntersectionCoords, angle + 90, offset * (-1) * leg.outputLanesCount);

                intersectionBorders[cnt] = rightMostPoint;+
                cnt++;
                intersectionBorders[cnt] = leftMostPoint;

                leg.setIntersectionBorderCoords(leftMostPoint, rightMostPoint);

                console.log(intersectionBorders);

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
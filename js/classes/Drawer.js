class Drawer
{
    constructor(situation)
    {
        this.situation = situation;
    }

    setOffset()
    {
        this.xOffset = this.situation.getOffsetX() - this.situation.distanceBetweenLegEnds * 5;
        this.yOffset = this.situation.getOffsetY() - this.situation.distanceBetweenLegEnds * 5;
        console.log("Offset is set: ", this.xOffset, this.yOffset);
    }

    _drawLine(coordinatesList){
        let movedCoordinates = this.moveListToOffset(coordinatesList);
        this.situation.canvas.line(movedCoordinates[0].__x, movedCoordinates[0].__y,
            movedCoordinates[1].__x, movedCoordinates[1].__y).stroke({ width: 3, color: selectedColor });
    }

    __drawPolygon(coordinatesList, borderColor, borderWidth, fillColor, id, isVehicle)
    {
        let movedCoordinates = this.moveListToOffset(coordinatesList, isVehicle);

        let polyString = "";
        for ( let i = 0; i < movedCoordinates.length; i++)
        {
            polyString += movedCoordinates[i].toPolyString() + " ";
        }
        return this.situation.canvas.polygon(polyString)
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
        return this.situation.canvas.polyline(polyString)
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

    _drawPoint(coordinates, color = redColor, size = 10)
    {
        return this.situation.canvas.circle(size)
            .move(coordinates.__x, coordinates.__y)
            .fill({
                    color: color
             });
    }

    drawLane(intersectionCoordinates, leg, offset, order, lane = undefined)
    {
        let coordinatesList = [];

        let  angle = leg.angle + 90;

        coordinatesList[0] = moveCoordinatesByOffset(intersectionCoordinates, angle, offset * order);
        coordinatesList[1] = moveCoordinatesByOffset(intersectionCoordinates, angle , offset * (order + 1));
        coordinatesList[2] = moveCoordinatesByOffset(leg.coordinates, angle, offset * (order + 1));
        coordinatesList[3] = moveCoordinatesByOffset(leg.coordinates, angle, offset * order);


        let semaphoreWidth = 7;

        //points which are on the lane outer border
        let outside1 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 75);
        let outside2 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 80);
        let outside3 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 85);
        let outside4 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 90);

        //points inside the lane
        let inner1 = moveCoordinatesByOffset(outside1, leg.angle - 90, semaphoreWidth);
        let inner2 = moveCoordinatesByOffset(outside2, leg.angle - 90, semaphoreWidth);
        let inner3 = moveCoordinatesByOffset(outside3, leg.angle - 90, semaphoreWidth);
        let inner4 = moveCoordinatesByOffset(outside4, leg.angle - 90, semaphoreWidth);

        let laneSvg = this.__drawPolygon(coordinatesList, whiteColor, 1, blackColor, leg.id);

        if(lane !== undefined)
        {
            let redSvg = this.__drawPolygon([outside1, outside2, inner2, inner1], whiteColor, 1, blackColor, leg.id);
            let yellowSvg = this.__drawPolygon([outside2, outside3, inner3, inner2], whiteColor, 1, blackColor, leg.id);
            let greenSvg = this.__drawPolygon([outside3, outside4, inner4, inner3], whiteColor, 1, blackColor, leg.id);

            let semaphore = new Semaphore(greenSvg, yellowSvg, redSvg);
            lane.setSemaphore(semaphore);
        }

        return laneSvg;
    }
        
    getTrianglePointPosition(leg, closestPointToOtherLeg, distanceBetweenClosestPoints, index)
    {
        if(index===0)
        {
            let legSize = getDistance2D(leg.leftEndPoint, leg.rightEndPoint);

            //angle between the
            let cosine = legSize / distanceBetweenClosestPoints;
            let angle = (cosine * 180/Math.PI) + 180  + leg.angle;
            return moveCoordinatesByOffset(closestPointToOtherLeg, angle, legSize);
        }
        else if(index===1)
        {
            if(closestPointToOtherLeg.equals(leg.leftEndPoint))
            {
                console.log("asasd");
            }
            let legSize = getDistance2D(leg.leftEndPoint, leg.rightEndPoint);

            //angle between the
            let cosine = legSize / distanceBetweenClosestPoints;
            let angle = (cosine * 180/Math.PI) + 90   + leg.angle;
            console.log(angle);
            let newPoint = moveCoordinatesByOffset(closestPointToOtherLeg, angle, legSize);
            console.log(closestPointToOtherLeg);
            console.log(newPoint);
            return newPoint;
        }

    }

    drawConnectingLane(leg1, leg2, id)
    {
        console.log(leg1.leftEndPoint, leg1.rightEndPoint, leg2.leftEndPoint, leg2.rightEndPoint);

        let closestPoints = this.getClosestPoints(leg1, leg2);

        console.log(closestPoints);

        let distance = closestPoints[0];
        let point1 = closestPoints[1];
        let point2 = closestPoints[2];
        let index = closestPoints[3];

        let newPoint, newPoint2;
        if(index!==2)
        {
            newPoint = this.getTrianglePointPosition(leg1, point1, distance, index);

            let corner1 =
                [
                    leg1.leftEndPoint,
                    leg1.rightEndPoint,
                    newPoint

                ];
            this.__drawPolygon(corner1, whiteColor, 1, yellowColor, id);

            newPoint2 = this.getTrianglePointPosition(leg2, point2, distance, index);


            let corner2 =
                [
                    leg2.leftEndPoint,
                    leg2.rightEndPoint,
                    newPoint2

                ];

            this.__drawPolygon(corner2, whiteColor, 1, yellowColor, id);

        }
        else
        {
            newPoint = leg1.rightEndPoint;
            newPoint2 = leg2.rightEndPoint;
        }


        let midPoint1 = findMiddlePoint(point1, newPoint);
        let midPoint2 = findMiddlePoint(point2, newPoint2);

        let lane1 =
            [
                point1,
                midPoint1,
                midPoint2,
                newPoint2
            ];
        let laneSvg1 = this.__drawPolygon(lane1, whiteColor, 1, blackColor, id);

        laneSvg1.on("mouseover", function() {
            this.style("cursor", "pointer");
            $('#tooltip').html(index!==1 ? leg2.id + " -> " + leg1.id : leg1.id + " -> " + leg2.id);
            this.fill({ color: selectedColor })
        });
        laneSvg1.on("mouseout", function() {
            $('#tooltip').html("");
            this.fill({ color: '#000' })
        });

        let lane2 =
            [
                point2,
                newPoint,
                midPoint1,
                midPoint2
            ];
        let laneSvg2 = this.__drawPolygon(lane2, whiteColor, 1, blackColor, id);

        laneSvg2.on("mouseover", function() {
            this.style("cursor", "pointer");
            $('#tooltip').html(index!==1 ? leg1.id + " -> " + leg2.id : leg2.id + " -> " + leg1.id);
            this.fill({ color: selectedColor })
        });
        laneSvg2.on("mouseout", function() {
            $('#tooltip').html("");
            this.fill({ color: '#000' })
        });


    }

    getClosestPoints(leg1, leg2){

        let leftsLength = getDistance2D(leg1.leftEndPoint, leg2.leftEndPoint);
        let rightsLength = getDistance2D(leg1.rightEndPoint, leg2.rightEndPoint);

        if(leftsLength < rightsLength){
            return [leftsLength, leg1.leftEndPoint, leg2.leftEndPoint, 0];
        } else if(rightsLength < leftsLength){
            return [rightsLength, leg1.rightEndPoint, leg2.rightEndPoint, 1];
        } else if(leftsLength === rightsLength){
            return [leftsLength, leg1.leftEndPoint, leg2.leftEndPoint, 2];
        }
    }


    drawCenter(intersectionBorders, id)
    {
        return this.__drawPolygon(intersectionBorders, redColor, 1, blackColor, id);
    }

    drawVehicles(simulationStep)
    {
        this.timeout(simulationStep, this.simulateSimulationStep, this);
    }

    timeout(step, callback, context)
    {
        let i = 0;
        callback(step, context);
        loop();
        function loop()
        {
            setTimeout(function ()
            {
                i++;
                if (i < 1){
                    callback(step, context);
                    loop();
                }
            }, 500);
        }
    }

    simulateSimulationStep(step, context)
    {
        let tlStates = step.tlStates;
        for (let ts = 0; ts < tlStates.length; ts++)
        {
            tlStates[ts].setSemaphoreState();
        }

        let vehicleStates = step.vehicleStates;
        for(let vs = 0; vs < vehicleStates.length; vs++)
        {
            let vehicleState = vehicleStates[vs];

            if (vehicleState.vehicle.vehicleIsSet())
            {
                console.log("vehicle", vehicleState.vehicle.id," moved to", vehicleState.polygonCoordinates.getPointsArray());

                let coords = vehicleState.polygonCoordinates.getPointsArray();

                let movedCoords = this.moveListToOffset(coords, true);

                vehicleState.vehicle.svg.animate({
                    ease: '-',
                    duration: 500
                }).plot(
                    [
                        [movedCoords[0].__x, movedCoords[0].__y],
                        [movedCoords[1].__x, movedCoords[1].__y],
                        [movedCoords[2].__x, movedCoords[2].__y],
                        [movedCoords[3].__x, movedCoords[3].__y]
                    ]);

                vehicleState.vehicle.leftBlinkerSvg.animate({ease: '-',duration: 500}).move(movedCoords[0].__x, movedCoords[0].__y);
                vehicleState.vehicle.leftBrakeSvg.animate({ease: '-',duration: 500}).move(movedCoords[1].__x, movedCoords[1].__y);

                vehicleState.vehicle.rightBrakeSvg.animate({ease: '-',duration: 500}).move(movedCoords[2].__x, movedCoords[2].__y);
                vehicleState.vehicle.rightBlinkerSvg.animate({ease: '-',duration: 500}).move(movedCoords[3].__x, movedCoords[3].__y);

                if(vehicleState.isBraking())
                {
                    vehicleState.vehicle.leftBrakeSvg.fill({color: redColor}).show();
                    vehicleState.vehicle.rightBrakeSvg.fill({color: redColor}).show();
                }
                else
                {
                    vehicleState.vehicle.leftBrakeSvg.fill({color: whiteColor}).hide();
                    vehicleState.vehicle.rightBrakeSvg.fill({color: whiteColor}).hide();
                }

                if(vehicleState.isSignallingLeft())
                {
                    vehicleState.vehicle.leftBlinkerSvg.fill({color: orangeColor}).show();
                }
                else
                {
                    vehicleState.vehicle.leftBlinkerSvg.fill({color: whiteColor}).hide();
                }

                if(vehicleState.isSignallingRight())
                {
                    vehicleState.vehicle.rightBlinkerSvg.fill({color: orangeColor}).show();
                }
                else
                {
                    vehicleState.vehicle.rightBlinkerSvg.fill({color: whiteColor}).hide();
                }


            }
            else
            {
                let coords = vehicleState.polygonCoordinates.getPointsArray();

                console.log("init vehicle", vehicleState.vehicle.id, coords);
                let svg = context.__drawPolygon(coords, vehicleState.color, 1, vehicleState.color, vehicleState.vehicle.id, true);

                vehicleState.vehicle.setSvg(svg);

                vehicleState.vehicle.setBlinkers(
                    context._drawPoint(context.moveToVehicleOffset(vehicleState.polygonCoordinates.frontLeft), whiteColor, 3).hide(),
                    context._drawPoint(context.moveToVehicleOffset(vehicleState.polygonCoordinates.frontRight), whiteColor, 3).hide()
                );

                vehicleState.vehicle.setBrakes(
                    context._drawPoint(context.moveToVehicleOffset(vehicleState.polygonCoordinates.backLeft), whiteColor, 3).hide(),
                    context._drawPoint(context.moveToVehicleOffset(vehicleState.polygonCoordinates.backRight), whiteColor, 3).hide()
                );
            }
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

                let movedIntersectionCoords;

                if (intersection.is2Legs180())
                {
                    movedIntersectionCoords =  moveCoordinatesByOffset(intersection.coordinates, angle , (offset/5)*-1);
                }
                else
                {
                    movedIntersectionCoords = moveCoordinatesByOffset(intersection.coordinates, angle , offset*-1);
                }


                for(let k = 0; k < leg.laneList.length; k++)
                {
                    let laneSvg = this.drawLane(movedIntersectionCoords, leg, offset, k, leg.laneList[k]);

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
            intersection.setSvg(intersectionCenter);
            let click = function()
            {
                this.situation.setSelectedIntersection(intersection);
            };

            let mouseover = function()
            {
                if(!this.situation.isSelectedIntersection() || this.situation.selectedIntersection.id !== intersection.id)
                {
                    intersectionCenter.style("cursor", "pointer");
                    $('#tooltip').html(intersection.toString());
                    intersectionCenter.fill({ color: selectedColor })
                }
            };

            let mouseout = function()
            {
                if(!this.situation.isSelectedIntersection() || this.situation.selectedIntersection.id !== intersection.id)
                {
                    $('#tooltip').html("");
                    intersectionCenter.fill({ color: blackColor })
                }
            };

            intersectionCenter.on("click", click, this);

            intersectionCenter.on("mouseover", mouseover, this);

            intersectionCenter.on("mouseout", mouseout, this);
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
        }
    }

    moveListToOffset(coordinatesList, isVehicle = false)
    {
        let newCoordinatesList = [];

        for (let i = 0; i < coordinatesList.length; i++)
        {
            if(isVehicle)
            {
                newCoordinatesList[i] = this.moveToVehicleOffset(coordinatesList[i]);
            }
            else
            {
                newCoordinatesList[i] = this.moveToOffset(coordinatesList[i]);
            }
        }

        return newCoordinatesList;
    }

    moveToOffset(coordinates)
    {
        return new Coords(coordinates.__x + this.xOffset, coordinates.__y + this.yOffset);
    }

    moveToVehicleOffset(coordinates)
    {
        return new Coords(
            coordinates.__x + this.xOffset + this.situation.vehicleBase.__x,
            coordinates.__y + this.yOffset - this.situation.vehicleBase.__y);
    }

}
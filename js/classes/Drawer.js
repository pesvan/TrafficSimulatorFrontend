class Drawer
{
    constructor(situation, simulation)
    {
        this.situation = situation;
        this.simulation = simulation;
    }

    setOffset()
    {
        this.xOffset = this.situation.getOffsetX() - this.situation.distanceBetweenLegEnds * 5;
        this.yOffset = this.situation.getOffsetY() - this.situation.distanceBetweenLegEnds * 5;
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




        let laneSvg = this.__drawPolygon(coordinatesList, whiteColor, 1, blackColor, leg.id);

        if(lane !== undefined)
        {
            let semaphoreWidth = 4;

            //points which are on the lane outer border
            let outside1 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 5);
            let outside2 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 10);
            let outside3 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 15);
            let outside4 = moveCoordinatesByOffset(coordinatesList[1], leg.angle - 180, 20);

            //points inside the lane
            let inner1 = moveCoordinatesByOffset(outside1, leg.angle - 90, semaphoreWidth);
            let inner2 = moveCoordinatesByOffset(outside2, leg.angle - 90, semaphoreWidth);
            let inner3 = moveCoordinatesByOffset(outside3, leg.angle - 90, semaphoreWidth);
            let inner4 = moveCoordinatesByOffset(outside4, leg.angle - 90, semaphoreWidth);

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
            let legSize = getDistance2D(leg.leftEndPoint, leg.rightEndPoint);

            //angle between the
            let cosine = legSize / distanceBetweenClosestPoints;
            let angle = (cosine * 180/Math.PI) + 90   + leg.angle;
            let newPoint = moveCoordinatesByOffset(closestPointToOtherLeg, angle, legSize);
            return newPoint;
        }

    }

    drawConnectingLane(leg1, leg2, id)
    {

        let closestPoints = this.getClosestPoints(leg1, leg2);


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
            this.fill({ color: selectedColor })
        });
        laneSvg1.on("mouseout", function() {
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
            this.fill({ color: selectedColor })
        });
        laneSvg2.on("mouseout", function() {
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
                if(context.simulation.isSelectedVehicle() && vehicleState.vehicle.id === context.simulation.selectedVehicle.id)
                {
                    updateVehicleInfo(vehicleState);
                }
                let coords = vehicleState.polygonCoordinates.getPointsArray();

                let movedCoords = this.moveListToOffset(coords, true);

                vehicleState.vehicle.svg.animate({
                    ease: '-',
                    duration: SIM_STEP
                }).plot(
                    [
                        [movedCoords[0].__x, movedCoords[0].__y],
                        [movedCoords[1].__x, movedCoords[1].__y],
                        [movedCoords[2].__x, movedCoords[2].__y],
                        [movedCoords[3].__x, movedCoords[3].__y]
                    ]);

                if(vehicleState.isBraking())
                {
                    vehicleState.vehicle.svg.stroke({color: redColor});
                }
                else
                {
                    vehicleState.vehicle.svg.stroke({color: vehicleState.vehicle.originalColor});
                }

                if(vehicleState.isSignallingLeft())
                {

                }
                else
                {

                }

                if(vehicleState.isSignallingRight())
                {

                }
                else
                {

                }


            }
            else
            {
                let coords = vehicleState.polygonCoordinates.getPointsArray();

                let svg = context.__drawPolygon(coords, vehicleState.vehicle.originalColor, 1, vehicleState.vehicle.originalColor, vehicleState.vehicle.id, true);

                let click = function()
                {
                    context.simulation.setSelectedVehicle(vehicleState.vehicle);
                };

                svg.on("click", click, this);

                vehicleState.vehicle.setSvg(svg);
            }
        }

    }


    drawIntersection(intersectionList)
    {
        let offset = 16;

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
                    let lane = leg.laneList[k];

                    let laneSvg = this.drawLane(movedIntersectionCoords, leg, offset, k, lane);

                    let click = function()
                    {
                        this.situation.setSelectedLane(lane);
                    };

                    laneSvg.on("click", click, this);

                    let mouseover = function()
                    {
                        if(!this.situation.isSelectedLane() || this.situation.selectedLane.id !== lane.id)
                        {
                            laneSvg.style("cursor", "pointer");
                            laneSvg.fill({ color: selectedColor })
                        }
                    };

                    let mouseout = function()
                    {
                        if(!this.situation.isSelectedLane() || this.situation.selectedLane.id !== lane.id)
                        {
                            laneSvg.fill({ color: blackColor })
                        }
                    };

                    laneSvg.on("mouseover", mouseover, this);

                    laneSvg.on("mouseout", mouseout, this);



                    lane.setSvg(laneSvg);
                }

                for(let k = leg.outputLanesCount * (-1); k < 0; k++)
                {
                    let laneSvg = this.drawLane(movedIntersectionCoords, leg, offset, k);

                    laneSvg.on("mouseover", function() {
                        this.style("cursor", "pointer");
                        this.fill({ color: selectedColor })
                    });
                    laneSvg.on("mouseout", function() {
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
                    intersectionCenter.fill({ color: selectedColor })
                }
            };

            let mouseout = function()
            {
                if(!this.situation.isSelectedIntersection() || this.situation.selectedIntersection.id !== intersection.id)
                {
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
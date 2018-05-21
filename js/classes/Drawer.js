class Drawer
{
    constructor(situation, simulation)
    {
        this.situation = situation;
        this.simulation = simulation;
    }

    __drawPolygon(coordinatesList, borderColor, borderWidth, fillColor, id)
    {
        let polyString = "";
        for ( let i = 0; i < coordinatesList.length; i++)
        {
            polyString += coordinatesList[i].toPolyString() + " ";
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

    drawLane(lane)
    {
        let laneSvg = this.__drawPolygon(lane.shape.getLanePolygonPoints(), whiteColor, 1, blackColor, lane.legId);

        if(lane.isInputLane())
        {
            let semaphoreWidth = 4;

            //points which are on the lane outer border
            let outside1 = moveCoordinatesByOffset(lane.shape.getLanePolygonPoints()[1], lane.shape.angle - 180, 5);
            let outside2 = moveCoordinatesByOffset(lane.shape.getLanePolygonPoints()[1], lane.shape.angle - 180, 10);
            let outside3 = moveCoordinatesByOffset(lane.shape.getLanePolygonPoints()[1], lane.shape.angle - 180, 15);
            let outside4 = moveCoordinatesByOffset(lane.shape.getLanePolygonPoints()[1], lane.shape.angle - 180, 20);

            //points inside the lane
            let inner1 = moveCoordinatesByOffset(outside1, lane.shape.angle - 90, semaphoreWidth);
            let inner2 = moveCoordinatesByOffset(outside2, lane.shape.angle - 90, semaphoreWidth);
            let inner3 = moveCoordinatesByOffset(outside3, lane.shape.angle - 90, semaphoreWidth);
            let inner4 = moveCoordinatesByOffset(outside4, lane.shape.angle - 90, semaphoreWidth);

            let redSvg = this.__drawPolygon([outside1, outside2, inner2, inner1], whiteColor, 1, blackColor, lane.id+"_r");
            let yellowSvg = this.__drawPolygon([outside2, outside3, inner3, inner2], whiteColor, 1, blackColor, lane.id+"_y");
            let greenSvg = this.__drawPolygon([outside3, outside4, inner4, inner3], whiteColor, 1, blackColor, lane.id+"_g");

            let semaphore = new Semaphore(greenSvg, yellowSvg, redSvg);
            lane.setSemaphore(semaphore);
        }

        return laneSvg;
    }

    drawConnectingLane(connection)
    {
        let laneSvg1 = this.__drawPolygon(connection.shape.getLanePolygonPoints(), whiteColor, 1, blackColor, connection.id);

        laneSvg1.on("mouseover", function() {
            this.style("cursor", "pointer");
            this.fill({ color: selectedColor })
        });
        laneSvg1.on("mouseout", function() {
            this.fill({ color: '#000' })
        });

    }

    drawCenter(intersection)
    {
        return this.__drawPolygon(intersection.shape.coordinateList, redColor, 1, blackColor, intersection.id);
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

                vehicleState.vehicle.setLastTouchedSimStep(step.time);

                vehicleState.vehicle.svg.animate({
                    ease: '-',
                    duration: SIM_STEP
                }).plot(
                    vehicleState.polygonCoordinates.getPlotPointsArray());

                if(vehicleState.isBraking())
                {
                    vehicleState.vehicle.svg.fill({color: redColor});
                }
                else
                {
                    vehicleState.vehicle.svg.fill({color: vehicleState.vehicle.originalColor});
                }

                if(vehicleState.isSignallingLeft())
                {
                    vehicleState.vehicle.svg.attr({
                        'stroke-dasharray': vehicleState.polygonCoordinates.getSignalLeftCoords(),
                        'stroke': orangeColor
                    });
                }
                else if(vehicleState.isSignallingRight())
                {
                    vehicleState.vehicle.svg.attr({
                        'stroke-dasharray': vehicleState.polygonCoordinates.getSignalRightCoords(),
                        'stroke': orangeColor
                    });
                }
                else
                {
                    vehicleState.vehicle.svg.attr({
                        'stroke-dasharray': null,
                        'stroke': vehicleState.vehicle.originalColor
                    });
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


                for(let k = 0; k < leg.inputLaneList.length; k++)
                {
                    let lane = leg.inputLaneList[k];

                    let laneSvg = this.drawLane(lane);

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

                for(let k = 0; k < leg.outputLaneList.length; k++)
                {
                    let lane = leg.outputLaneList[k];

                    let laneSvg = this.drawLane(lane);

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

            }

            let intersectionCenterSvg = this.drawCenter(intersection);
            intersection.setSvg(intersectionCenterSvg);
            let click = function()
            {
                this.situation.setSelectedIntersection(intersection);
            };

            let mouseover = function()
            {
                if(!this.situation.isSelectedIntersection() || this.situation.selectedIntersection.id !== intersection.id)
                {
                    intersectionCenterSvg.style("cursor", "pointer");
                    intersectionCenterSvg.fill({ color: selectedColor })
                }
            };

            let mouseout = function()
            {
                if(!this.situation.isSelectedIntersection() || this.situation.selectedIntersection.id !== intersection.id)
                {
                    intersectionCenterSvg.fill({ color: blackColor })
                }
            };

            intersectionCenterSvg.on("click", click, this);

            intersectionCenterSvg.on("mouseover", mouseover, this);

            intersectionCenterSvg.on("mouseout", mouseout, this);
        }
    }

    drawConnections(connectionList)
    {
        for (let i = 0; i < connectionList.length; i++)
        {
            let connection = connectionList[i];
            let svg = this.drawConnectingLane(connection);
        }
    }

    drawConnectionPolygons(connectionPolygons)
    {
        for (let i = 0; i < connectionPolygons.length; i++)
        {
            let polygon = connectionPolygons[i];
            let svg = this.__drawPolygon(polygon.coordinateList, whiteColor, 1, blackColor, i);
        }
    }


}
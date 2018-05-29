class Situation
{
    constructor()
    {
        this.intersectionCount = undefined;
        this.routesCount = undefined;
        this.boundaryCoordinates = undefined;
        this.intersectionList = [];
        this.connections = [];
        this.connectionPolygons = [];
        this.selectedIntersection = undefined;
        this.selectedLane = undefined;
        this.canvas = undefined;
    }

    setMetadata(
        intersectionCount, routesCount, boundaryCoordinates)
    {
        this.intersectionCount = intersectionCount;
        this.routesCount = routesCount;
        this.boundaryCoordinates = boundaryCoordinates;
        updateSituationSidebar(this);
    }

    addIntersection(intersection)
    {
        this.intersectionList.push(intersection);
    }

    addConnection(connection)
    {
        this.connections.push(connection);
    }

    addConnectionPolygon(connectionPolygon)
    {
        this.connectionPolygons.push(connectionPolygon);
    }

    initCanvas()
    {
        $('#canvas').empty();
        if(this.intersectionCount > 0)
        {
            this.canvas = SVG('canvas').size(this.boundaryCoordinates.x + OFFSET*2, this.boundaryCoordinates.y + OFFSET*2);
        }

    }

    isSelectedIntersection()
    {
        return this.selectedIntersection !== null && this.selectedIntersection !== undefined;
    }

    isSelectedLane()
    {
        return this.selectedLane !== null && this.selectedLane !== undefined;
    }

    setSelectedLane(lane)
    {
        if(this.isSelectedLane())
        {
            this.selectedLane.svg.fill({color:blackColor});
        }
        this.selectedLane = lane;

        //set as selected new one
        lane.svg.fill({color: redColor});

        updateSituationSidebar(this);
    }

    setSelectedIntersection(intersection)
    {
        //graphically unselect previously selected intersection
        if(this.isSelectedIntersection())
        {
            this.selectedIntersection.svg.fill({color:blackColor});
        }

        //set as selected new one
        intersection.svg.fill({color: redColor});
        this.selectedIntersection = intersection;


        updateSituationSidebar(this);
    }
}
class Situation
{
    constructor()
    {
        this.distanceBetweenLegEnds = undefined;
        this.distanceBetweenIntersections = undefined;
        this.xSize = undefined;
        this.ySize = undefined;
        this.intersectionCount = undefined;
        this.routesCount = undefined;
        this.gridDimensions = undefined;
        this.intersectionList = [];
        this.connections = [];
        this.selectedIntersection = undefined;
        this.canvas = undefined;
    }

    setMetadata(distanceBetweenLegEnds, distanceBetweenIntersections, intersectionCount, routesCount, gridDimensions)
    {
        this.distanceBetweenLegEnds = distanceBetweenLegEnds;
        this.distanceBetweenIntersections = distanceBetweenIntersections;
        this.gridDimensions = gridDimensions;
        this.xSize = (
            this.gridDimensions.getGridSizeX() * this.distanceBetweenLegEnds * 5 * 2)
            + ( (this.gridDimensions.getGridSizeX() - 1) * this.distanceBetweenIntersections);
        this.ySize = (
            this.gridDimensions.getGridSizeY() * this.distanceBetweenLegEnds * 5 * 2)
            + ( (this.gridDimensions.getGridSizeY() - 1) * this.distanceBetweenIntersections);
        console.log("Canvas size:", this.xSize, this.ySize);
        this.intersectionCount = intersectionCount;
        this.routesCount = routesCount;
    }

    getOffsetX()
    {
        return (this.gridDimensions.getGridOffsetX() * this.distanceBetweenLegEnds * 5 * 2)
            + ( (this.gridDimensions.getGridOffsetX() - 1) * this.distanceBetweenIntersections);
    }

    getOffsetY()
    {
        return (this.gridDimensions.getGridOffsetY() * this.distanceBetweenLegEnds * 5 * 2)
            + ( (this.gridDimensions.getGridOffsetY() - 1) * this.distanceBetweenIntersections);
    }

    addIntersection(intersection)
    {
        this.intersectionList.push(intersection);
    }

    addConnection(connection)
    {
        this.connections.push(connection);
    }

    initCanvas()
    {
        $('#canvas').empty();
        console.log("Creating canvas:", this.xSize, this.ySize);
        this.canvas = SVG('canvas').size(this.xSize, this.ySize);
    }

    isSelectedIntersection()
    {
        return this.selectedIntersection !== null && this.selectedIntersection !== undefined;
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
        $('#selectedIntersection').html("selected intersection<br>" + intersection.id + " " + intersection.grid.toPolyString());
    }
}
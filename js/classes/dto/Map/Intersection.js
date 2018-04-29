
class Intersection
{
    constructor(id, grid, legList, angle, signalPrograms, shape)
    {
        this.id = parseInt(id);
        this.grid = grid;
        this.legList = legList;
        this.angle = angle;
        this.svg = null;
        this.shape = shape;
        this.signalPrograms = signalPrograms;
        this.selectedSignalProgram = undefined;
    }

    setSelectedSignalProgram(signalProgram)
    {
        this.selectedSignalProgram = signalProgram;
        updateSignalProgramSelection(this, signalProgram);
    }

    setSvg(svg)
    {
        this.svg = svg;
    }

    toString()
    {
        return "Intersection number: " + this.id + " grid position: " + this.grid.toPolyString();
    }
}
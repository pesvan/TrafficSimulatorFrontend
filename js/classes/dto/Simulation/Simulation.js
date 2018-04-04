class Simulation
{
    constructor()
    {
        this.acquisitionActive = false;
        this.activeVehicles = [];
        this.simulationStepsToDraw = [];
        this.lastDownloadedSimTime = undefined;
        this.firstToDrawSimTime = undefined;
    }

    startAcquisition()
    {
        this.acquisitionActive = true;
    }

    stopAcquisition()
    {
        this.acquisitionActive = false;
    }

    isAcquisitionActive()
    {
        return this.acquisitionActive;
    }

    addSimulationStep(simulationStep)
    {
        this.simulationStepsToDraw.push(simulationStep);
        this.lastDownloadedSimStep = this.simulationStepsToDraw[this.simulationStepsToDraw.length-1].time;
        this.firstToDrawSimStep = this.simulationStepsToDraw[0].time;
    }

    getFirstToDraw()
    {
        return this.simulationStepsToDraw.shift();
    }

    addVehicles()
    {
        //add vehicles
    }

    removeInactiveVehicles()
    {
        //go through the active vehicles and check which are not present in the last packet
    }




}
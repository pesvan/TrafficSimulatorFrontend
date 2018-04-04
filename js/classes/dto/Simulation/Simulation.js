class Simulation
{
    constructor()
    {
        this.visualizationRunning = false;
        this.activeVehicles = [];
        this.simulationStepsToDraw = [];
        this.lastDownloadedSimTime = undefined;
        this.firstToDrawSimTime = undefined;
        this.density = undefined;
    }

    startVisualisation()
    {
        this.visualizationRunning = true;
    }

    pauseVisualisation()
    {
        this.visualizationRunning = false;
    }

    runningVisualisation()
    {
        return this.visualizationRunning;
    }

    addSimulationStep(simulationStep)
    {
        this.simulationStepsToDraw.push(simulationStep);
        this.lastDownloadedSimStep = this.simulationStepsToDraw[this.simulationStepsToDraw.length-1].time;
    }

    setDensity(density)
    {
        this.density = 20 - parseInt(density);
        setTrafficDensity(this.density);
    }

    getFirstToDraw()
    {
        this.firstToDrawSimTime = this.simulationStepsToDraw[0].time;
        return this.simulationStepsToDraw.shift();
    }

    addVehicles(vehicles)
    {
        let mergedArray = this.activeVehicles.concat(vehicles);
        let filteredArray = [];
        let len = mergedArray.length;
        const assoc = {};

        while(len--) {
            const item = mergedArray[len];

            if(!assoc[item])
            {
                filteredArray.unshift(item);
                assoc[item] = true;
            }
        }

        this.activeVehicles = filteredArray;

    }

    removeInactiveVehicles()
    {
        //go through the active vehicles and check which are not present in the last packet
    }

    updateStatsInfo()
    {
        let simState = this.runningVisualisation() ? "Running" : "Paused";
        $('#simState').html(simState);

        $('#simTime').html(this.firstToDrawSimTime);

        $('#vehCount').html(this.activeVehicles.length);
    }




}
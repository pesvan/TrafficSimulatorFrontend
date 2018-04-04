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

    stopVisualisation()
    {
        this.visualizationRunning = false;
        this.removeAllVehicles();
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

    removeInactiveVehicles()
    {
        let setVehicles = [];
        for(let i = 0; i < this.activeVehicles.length; i++)
        {
            if(this.activeVehicles[i].vehicleIsSet())
            {
                setVehicles.push(this.activeVehicles[i]);
            }
        }
        let vehiclesInCurrentStep = [];
        for(let i = 0; i < this.simulationStepsToDraw[0].vehicleStates.length; i++)
        {
            vehiclesInCurrentStep.push(this.simulationStepsToDraw[0].vehicleStates[i].vehicle);
        }

        for(let i = 0; i < setVehicles.length; i++)
        {
            let vehicle = findVehicleById(vehiclesInCurrentStep, setVehicles[i].id);
            if(vehicle===null)
            {
                setVehicles[i].svg.remove();
                let index = this.activeVehicles.indexOf(setVehicles[i]);
                if(index > -1)
                {
                    this.activeVehicles.splice(index, 1);
                }
            }
        }
    }

    removeAllVehicles()
    {
        for(let i = 0; i < this.activeVehicles.length; i++)
        {
            if(this.activeVehicles[i].vehicleIsSet())
            {
                this.activeVehicles[i].svg.remove();
            }
        }
        this.activeVehicles = [];
    }

    updateStatsInfo()
    {
        let simState = this.runningVisualisation() ? "Running" : "Paused";
        $('#simState').html(simState);

        $('#simTime').html(this.firstToDrawSimTime);

        $('#vehCount').html(this.activeVehicles.length);
    }




}
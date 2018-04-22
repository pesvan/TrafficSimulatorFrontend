class Simulation
{
    constructor()
    {
        this.visualizationRunning = false;
        this.activeVehicles = [];
        this.simulationStepsToDraw = [];
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
        this.simulationStepsToDraw = [];
        this.firstToDrawSimTime = 0;
        updateSimulationSidebar(this);
        stopSimulation();
    }

    runningVisualisation()
    {
        return this.visualizationRunning;
    }

    addSimulationStep(simulationStep)
    {
        this.simulationStepsToDraw.push(simulationStep);
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
                setVehicles[i].removeSvg();
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
                this.activeVehicles[i].removeSvg();
            }
        }
        this.activeVehicles = [];
    }



}
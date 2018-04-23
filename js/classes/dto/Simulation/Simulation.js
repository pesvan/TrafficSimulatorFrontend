class Simulation
{
    constructor()
    {
        this.visualizationRunning = false;
        this.activeVehicles = [];
        this.simulationStepsToDraw = [];
        this.firstToDrawSimTime = undefined;
        this.density = undefined;
        this.selectedVehicle = undefined;

        this.stepInProgress = undefined;
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
        updateSimulationSidebar(this, undefined);
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
        this.stepInProgress = this.simulationStepsToDraw.shift();
        if(this.stepInProgress !== undefined)
        {
            this.firstToDrawSimTime = this.stepInProgress.time;
        }

        return this.stepInProgress;
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
        for(let i = 0; i < this.stepInProgress.vehicleStates.length; i++)
        {
            vehiclesInCurrentStep.push(this.stepInProgress.vehicleStates[i].vehicle);
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
                if(this.isSelectedVehicle() && this.selectedVehicle.id === setVehicles[i].id){
                    this.selectedVehicle = undefined;
                }
            }
        }
    }

    isSelectedVehicle()
    {
        return this.selectedVehicle !== null && this.selectedVehicle !== undefined;
    }

    setSelectedVehicle(vehicle)
    {
        //graphically unselect previously selected intersection
        if(this.isSelectedVehicle())
        {
            this.selectedVehicle.svg.fill({color:this.selectedVehicle.originalColor});
        }

        //set as selected new one
        vehicle.svg.fill({color: redColor});
        this.selectedVehicle = vehicle;


        updateSimulationSidebar(this, null);
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
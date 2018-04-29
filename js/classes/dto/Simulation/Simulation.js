class Simulation
{
    constructor()
    {
        this.visualizationRunning = false;
        this.activeVehicles = [];
        this.vehicleIdsToRemove = [];
        this.simulationStepsToDraw = [];
        this.firstToDrawSimTime = undefined;
        this.density = undefined;
        this.selectedVehicle = undefined;
        this.stepInProgress = undefined;
    }

    addActiveVehicle(vehicle)
    {
        this.activeVehicles.push(vehicle);
    }

    addVehicleIdToRemove(vehicleId)
    {
        this.vehicleIdsToRemove.push(vehicleId);
    }

    findActiveVehicle(vehId)
    {
        for (let i = 0; i < this.activeVehicles.length; i++)
        {
            if(this.activeVehicles[i].id === vehId)
            {
                return this.activeVehicles[i];
            }
        }

        return null;
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
        for (let i = 0; i < this.vehicleIdsToRemove.length; i++)
        {
            let vehicle = this.findActiveVehicle(this.vehicleIdsToRemove[i]);
            let index = this.activeVehicles.indexOf(vehicle);


            //remove from active vehicles
            if(index > -1)
            {
                this.activeVehicles.splice(index, 1);
            }

            //remove from selected
            if(this.isSelectedVehicle() && this.selectedVehicle.id === this.vehicleIdsToRemove[i]){
                this.selectedVehicle = undefined;
            }

            //remove from map
            vehicle.removeSvg();

        }

        this.vehicleIdsToRemove = [];
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
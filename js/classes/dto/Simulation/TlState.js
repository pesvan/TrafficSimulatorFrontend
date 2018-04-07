class TlState
{
    constructor(lane, state)
    {
        this.lane = lane;
        this.state = state;
    }

    setSemaphoreState()
    {
        if (this.state === 'g')
        {
            this.lane.semaphore.setGreen();
        }
        else if(this.state === 'y')
        {
            this.lane.semaphore.setYellow();
        }
        else if(this.state === 'r')
        {
            this.lane.semaphore.setRed();
        }
        else if(this.state === 'u')
        {
            this.lane.semaphore.setYellowRed();
        }

    }
}
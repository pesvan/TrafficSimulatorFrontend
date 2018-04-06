class Lane
{
    constructor(id, left, right, straight, isInputLane)
    {
        this.id = id;
        this.left = left;
        this.right = right;
        this.straight = straight;
        this.isInputLane = isInputLane;
        this.semaphore = undefined;
    }

    setSemaphore(semaphore)
    {
        this.semaphore = semaphore;
    }

    toString()
    {
        return "Lane "+this.id;
    }


}
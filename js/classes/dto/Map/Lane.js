class Lane
{
    constructor(id, left, right, straight)
    {
        this.id = id;
        this.left = left;
        this.right = right;
        this.straight = straight;
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
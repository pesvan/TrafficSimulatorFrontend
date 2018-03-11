class Lane
{
    constructor(id, left, right, straight)
    {
        this.id = id;
        this.left = left;
        this.right = right;
        this.straight = straight;
    }

    toString()
    {
        return "Lane "+this.id;
    }
}
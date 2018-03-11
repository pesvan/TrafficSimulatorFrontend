function moveCoordinatesByOffset(coordinates, angle, offset)
{

    let sinus = Math.sin(degreesToRadians(angle));
    let cosinus = Math.cos(degreesToRadians(angle)) * -1;

    let newX = coordinates.x + (sinus * offset);
    let newY = coordinates.y + (cosinus * offset);

    return new Coords(newX, newY);
}

function getOffsetTest(coordinates, cosinus, newY)
{
    return (newY - coordinates.y) / cosinus;
}

function getDistance2D(point1, point2)
{
    return Math.sqrt(
        Math.pow(
            point1.x - point2.x, 2
        ) +
        Math.pow(
            point1.y - point2.y, 2
        )
    );
}

function getDistance1D(point1, point2)
{
    return Math.sqrt(
        Math.pow(
            point1 - point2, 2
        )
    );
}

function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}

function radiansToDegrees(radians)
{
    return radians * 180 / Math.PI;
}
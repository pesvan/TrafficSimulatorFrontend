function moveCoordinatesByOffset(coordinates, angle, offset)
{

    let sinus = Math.sin(degreesToRadians(angle));
    let cosinus = Math.cos(degreesToRadians(angle)) * -1;

    let newX = coordinates.__x + (sinus * offset);
    let newY = coordinates.__y + (cosinus * offset);

    return new Coords(newX, newY);
}

function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}
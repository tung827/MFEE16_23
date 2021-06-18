const bear = {
    color : "brown",
    name  : "teddy"
};

exports.getColor = function () {
    return bear.color;
};

exports.setColor = function (color) {
    if (color == "blue"){
        bear.color = color;
    }
}

// module.exports = bear;


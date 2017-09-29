function cost(H, f, l, g) {
    var z = (g * l) / (2 * H);
    var x = (1 - Math.cosh(z));
    var c = (f + (H / g) * x)
    return  c * c;
}

function computeGrad(H, f, l, g) {
    var z = (g * l) / (2 * H);
    var x = (1 - Math.cosh(z));
    return 2 * (f + (H / g) * x) * ((1 / g) * (x) + (H / g) * (Math.sinh(z)) * ((g * l) / (2 * H * H)));
}

function gradientDescend(dt) {
    var epsilon = 0.0001;
    var grad = 0;
    var f = parseFloat($("#f").val());
    var l = parseFloat($("#l").val());
    var g = parseFloat($("#g").val());
    var H = $("#H").val() == "" ? (g * l * l) / (8 * f) : parseFloat($("#H").val());
    do {
        grad = computeGrad(H, f, l, g);
        H = H - dt * grad;
        $("#C").val(cost(H, f, l, g));
        $("#H").val(H);
    }while(Math.abs(grad) > epsilon)
}

$("#play").click(function() { gradientDescend(0.5); });
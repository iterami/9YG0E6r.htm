function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    buffer.save()

    buffer.translate(
      x,
      y
    );

    buffer.strokeStyle = '#fff';
    for(var vertex in vertices){
        buffer.beginPath();
        buffer.moveTo(
          vertices[vertex]['dx'],
          vertices[vertex]['dy']
        );
        buffer.lineTo(
          vertices[vertex]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        buffer.closePath();
        buffer.stroke();

        buffer.beginPath();
        buffer.moveTo(
          vertices[vertex]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        buffer.lineTo(
          vertices[vertices[vertex]['parent']]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        buffer.closePath();
        buffer.stroke();
    }

    buffer.restore();

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    window.requestAnimationFrame(draw);
}

function logic(){
    for(var vertex in vertices){
        vertices[vertex]['loop'] += vertices[vertex]['dl'];
        if(vertices[vertex]['loop'] > 359){
            vertices[vertex]['loop'] = 0;
        }
        vertices[vertex]['dx'] =
          vertices[vertex]['x']
          + vertices[vertex]['r']
          * Math.cos(vertices[vertex]['loop'] * (Math.PI / 180));
        vertices[vertex]['dy'] =
          vertices[vertex]['y']
          + vertices[vertex]['r']
          * Math.sin(vertices[vertex]['loop'] * (Math.PI / 180))
    }
}

function resize(){
    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

var buffer = document.getElementById('buffer').getContext('2d');
var canvas = document.getElementById('canvas').getContext('2d');
var height = 0;
var loop = 0;
var vertices = [];
var width = 0;
var x = 0;
var y = 0;

window.onload = function(e){
    resize();

    var loop_counter = 9;
    do{
        vertices.push({
          'dl': ((Math.floor(Math.random() * 2) - 1) * 10 || 10),
          'dx': 0,
          'dy': 0,
          'loop': Math.floor(Math.random() * 50) + 50,
          'parent': vertices.length - 1,
          'r': Math.random() * 10 + 5,
          'x': Math.floor(Math.random() * 300) - 150,
          'y': Math.floor(Math.random() * 300) - 150,
        });
    }while(loop_counter--);
    vertices[0]['parent'] = vertices.length - 1;

    window.requestAnimationFrame(draw);
    window.setInterval(
      'logic()',
      30
    );
};

window.onresize = resize;

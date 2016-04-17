'use strict';

function draw_logic(){
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

    // Draw vertices_amount and lineWidth.
    buffer.fillText(
      vertices_amount,
      0,
      25
    );
    buffer.fillText(
      buffer.lineWidth,
      0,
      50
    );
}

function logic(){
    for(var vertex in vertices){
        vertices[vertex]['loop'] += vertices[vertex]['speed'];
        if(vertices[vertex]['loop'] > 359){
            vertices[vertex]['loop'] -= 360;

        }else if(vertices[vertex]['loop'] < 0){
            vertices[vertex]['loop'] += 360;
        }

        var rotation = vertices[vertex]['loop'] * degree;

        vertices[vertex]['dx'] =
          x
          + vertices[vertex]['x']
          + vertices[vertex]['radius']
          * Math.cos(rotation);
        vertices[vertex]['dy'] =
          y
          + vertices[vertex]['y']
          + vertices[vertex]['radius']
          * Math.sin(rotation);
    }
}

function randomize(){
    vertices.length = 0;

    var loop_counter = vertices_amount - 1;
    do{
        vertices.push({
          'dx': 0,
          'dy': 0,
          'loop': Math.floor(Math.random() * 50) + 50,
          'parent': vertices_amount - loop_counter,
          'radius': Math.random() * 20 + 5,
          'speed': Math.floor(Math.random() * 10) - 5 * 2,
          'x': Math.floor(Math.random() * 500) - 250,
          'y': Math.floor(Math.random() * 500) - 250,
        });
    }while(loop_counter--);

    vertices[vertices_amount - 1]['parent'] = 0;
}

function resize_logic(){
    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';
    buffer.lineJoin = 'round';
    buffer.strokeStyle = '#fff';

    randomize();
}

var degree = Math.PI / 180;
var vertices = [];
var vertices_amount = 23;

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // A: decrease buffer.lineWidth.
    if(key === 65){
        buffer.lineWidth = Math.max(
          buffer.lineWidth - 1,
          1
        );
        return;

    // D: increase buffer.lineWidth.
    }else if(key === 68){
        buffer.lineWidth += 1;
        return;

    // S: decrease vertices_amount.
    }else if(key === 83){
        vertices_amount = Math.max(
          vertices_amount - 1,
          2
        );

    // W: increase vertices_amount.
    }else if(key === 87){
        vertices_amount += 1;

    // ESC: reset.
    }else if(key === 27){
        buffer.lineWidth = 1;
        vertices_amount = 23;
    }

    randomize();
};

window.onload = init_canvas;
window.onmousedown = randomize;
window.onresize = resize;
window.ontouchstart = randomize;

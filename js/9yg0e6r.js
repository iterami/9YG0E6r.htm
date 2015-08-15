'use strict';

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    buffer.lineJoin = 'round';
    buffer.lineWidth = lineWidth;
    buffer.strokeStyle = '#fff';

    buffer.save()

    buffer.translate(
      x,
      y
    );

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
        vertices[vertex]['loop'] += vertices[vertex]['speed'];
        if(vertices[vertex]['loop'] > 359){
            vertices[vertex]['loop'] -= 360;
        }else if(vertices[vertex]['loop']){
            vertices[vertex]['loop'] += 360;
        }

        var rotation = vertices[vertex]['loop'] * degree;

        vertices[vertex]['dx'] =
          vertices[vertex]['x']
          + vertices[vertex]['radius']
          * Math.cos(rotation);
        vertices[vertex]['dy'] =
          vertices[vertex]['y']
          + vertices[vertex]['radius']
          * Math.sin(rotation)
    }
}

function randomize(){
    for(var vertex in vertices){
        vertices[vertex] = {
          'dx': 0,
          'dy': 0,
          'loop': Math.floor(Math.random() * 50) + 50,
          'parent': vertex - 1,
          'radius': Math.random() * 20 + 5,
          'speed': Math.floor(Math.random() * 10) - 5 * 2,
          'x': Math.floor(Math.random() * 500) - 250,
          'y': Math.floor(Math.random() * 500) - 250,
        };
    }
    vertices[0]['parent'] = vertices.length - 1;
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

var buffer = document.getElementById('buffer').getContext('2d', {
  'alpha': false,
});
var canvas = document.getElementById('canvas').getContext('2d', {
  'alpha': false,
});
var degree = Math.PI / 180;
var height = 0;
var lineWidth = 1;
var vertices = [];
var width = 0;
var x = 0;
var y = 0;

window.onkeydown = function(e){
    var key = e.keyCode || e.which;

    // +: increase lineWidth.
    if(key === 187){
        lineWidth += 1;

    // -: decrease lineWidth.
    }else if(key === 189){
        lineWidth = Math.max(
          lineWidth - 1,
          1
        );

    // ESC: lineWidth = 0;
    }else if(key === 27){
        lineWidth = 1;

    // else: randomize();
    }else{
        randomize();
    }
};

window.onmousedown =
  window.ontouchstart = randomize;

window.onload = function(e){
    resize();

    var loop_counter = 23;
    do{
        vertices.push({});
    }while(loop_counter--);
    randomize();

    window.requestAnimationFrame(draw);
    window.setInterval(
      'logic()',
      30
    );
};

window.onresize = resize;

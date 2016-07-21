'use strict';

function draw_logic(){
    for(var vertex in vertices){
        canvas_buffer.beginPath();
        canvas_buffer.moveTo(
          vertices[vertex]['dx'],
          vertices[vertex]['dy']
        );
        canvas_buffer.lineTo(
          vertices[vertex]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        canvas_buffer.closePath();
        canvas_buffer.stroke();

        canvas_buffer.beginPath();
        canvas_buffer.moveTo(
          vertices[vertex]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        canvas_buffer.lineTo(
          vertices[vertices[vertex]['parent']]['dx'],
          vertices[vertices[vertex]['parent']]['dy']
        );
        canvas_buffer.closePath();
        canvas_buffer.stroke();
    }

    // Draw vertices_amount and lineWidth.
    canvas_buffer.fillText(
      vertices_amount,
      0,
      25
    );
    canvas_buffer.fillText(
      canvas_buffer.lineWidth,
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
          canvas_x
          + vertices[vertex]['x']
          + vertices[vertex]['radius']
          * Math.cos(rotation);
        vertices[vertex]['dy'] =
          canvas_y
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
          'loop': random_integer(50) + 50,
          'parent': vertices_amount - loop_counter,
          'radius': Math.random() * 20 + 5,
          'speed': random_integer(10) - 5 * 2,
          'x': random_integer(500) - 250,
          'y': random_integer(500) - 250,
        });
    }while(loop_counter--);

    vertices[vertices_amount - 1]['parent'] = 0;
}

function resize_logic(){
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.lineJoin = 'round';
    canvas_buffer.strokeStyle = '#fff';

    randomize();
}

var vertices = [];
var vertices_amount = 23;

window.onload = function(e){
    canvas_init();
    input_init(
      {
        27: {
          'todo': function(){
              canvas_buffer.lineWidth = 1;
              if(vertices_amount !== 23){
                vertices_amount = 23;
                randomize();
              }
          },
        },
        65: {
          'todo': function(){
              canvas_buffer.lineWidth = Math.max(
                canvas_buffer.lineWidth - 1,
                1
              );
          },
        },
        68: {
          'todo': function(){
              canvas_buffer.lineWidth += 1;
          },
        },
        83: {
          'todo': function(){
              vertices_amount = Math.max(
                vertices_amount - 1,
                2
              );
              randomize();
          },
        },
        87: {
          'todo': function(){
              vertices_amount += 1;
              randomize();
          },
        },
      },
      {
        'mousedown': {
          'todo': randomize,
        },
      }
    );
};

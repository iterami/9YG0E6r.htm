'use strict';

function draw_logic(){
    for(var vertex in vertices){
        canvas_draw_path(
          [
            {
              'type': 'moveTo',
              'x': vertices[vertex]['dx'],
              'y': vertices[vertex]['dy'],
            },
            {
              'x': vertices[vertex]['dx'],
              'y': vertices[vertices[vertex]['parent']]['dy'],
            },
          ],
          {},
          'stroke'
        );
        canvas_draw_path(
          [
            {
              'type': 'moveTo',
              'x': vertices[vertex]['dx'],
              'y': vertices[vertices[vertex]['parent']]['dy'],
            },
            {
              'x': vertices[vertices[vertex]['parent']]['dx'],
              'y': vertices[vertices[vertex]['parent']]['dy'],
            },
          ],
          {},
          'stroke'
        );
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

        var rotation = vertices[vertex]['loop'] * math_degree;

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
          'loop': random_integer({
            'max': 50,
          }) + 50,
          'parent': vertices_amount - loop_counter,
          'radius': Math.random() * 20 + 5,
          'speed': random_integer({
            'max': 10,
          }) - 5 * 2,
          'x': random_integer({
            'max': 500,
          }) - 250,
          'y': random_integer({
            'max': 500,
          }) - 250,
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
          'solo': true,
          'todo': function(){
              canvas_buffer.lineWidth = Math.max(
                canvas_buffer.lineWidth - 1,
                1
              );
          },
        },
        68: {
          'solo': true,
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
        'all': {
          'todo': randomize,
        },
      },
      {
        'mousedown': {
          'todo': randomize,
        },
      }
    );
};

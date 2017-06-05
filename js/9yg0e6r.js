'use strict';

function draw_logic(){
    for(var vertex in vertices){
        canvas_draw_path({
          'style': 'stroke',
          'vertices': [
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
        });
        canvas_draw_path({
          'style': 'stroke',
          'vertices': [
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
        });
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
        vertices[vertex]['loop'] = math_clamp({
          'max': 360,
          'min': 0,
          'value': vertices[vertex]['loop'] + vertices[vertex]['speed'],
          'wrap': true,
        });

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
          'loop': core_random_integer({
            'max': 360,
          }),
          'parent': vertices_amount - loop_counter,
          'radius': Math.random() * properties['radius'] + 5,
          'speed': core_random_integer({
            'max': properties['speed'],
          }) - properties['speed'] / 2,
          'x': core_random_integer({
            'max': properties['x'],
          }) - properties['x'] / 2,
          'y': core_random_integer({
            'max': properties['y'],
          }) - properties['y'] / 2,
        });
    }while(loop_counter--);

    vertices[vertices_amount - 1]['parent'] = 0;
}

function repo_init(){
    core_events_bind({
      'keybinds': {
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
      'mousebinds': {
        'mousedown': {
          'todo': randomize,
        },
      },
    });
    canvas_init();
}

function resize_logic(){
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.lineJoin = 'round';
    canvas_buffer.strokeStyle = '#fff';

    randomize();
}

var properties = {
  'radius': 20,
  'speed': 15,
  'x': 500,
  'y': 500,
};
var vertices = [];
var vertices_amount = 23;

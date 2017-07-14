'use strict';

function draw_logic(){
    for(var entity in core_entities){
        canvas_draw_path({
          'style': 'stroke',
          'vertices': [
            {
              'type': 'moveTo',
              'x': core_entities[entity]['dx'],
              'y': core_entities[entity]['dy'],
            },
            {
              'x': core_entities[entity]['dx'],
              'y': core_entities[core_entities[entity]['parent']]['dy'],
            },
          ],
        });
        canvas_draw_path({
          'style': 'stroke',
          'vertices': [
            {
              'type': 'moveTo',
              'x': core_entities[entity]['dx'],
              'y': core_entities[core_entities[entity]['parent']]['dy'],
            },
            {
              'x': core_entities[core_entities[entity]['parent']]['dx'],
              'y': core_entities[core_entities[entity]['parent']]['dy'],
            },
          ],
        });
    }
}

function logic(){
    for(var vertex in core_entities){
        core_entities[vertex]['loop'] = math_clamp({
          'max': 360,
          'min': 0,
          'value': core_entities[vertex]['loop'] + core_entities[vertex]['speed'],
          'wrap': true,
        });

        var rotation = core_entities[vertex]['loop'] * math_degree;

        core_entities[vertex]['dx'] =
          canvas_x
          + core_entities[vertex]['x']
          + core_entities[vertex]['radius']
          * Math.cos(rotation);
        core_entities[vertex]['dy'] =
          canvas_y
          + core_entities[vertex]['y']
          + core_entities[vertex]['radius']
          * Math.sin(rotation);
    }

    core_ui_update({
      'ids': {
        'vertices': vertices_amount,
        'width': canvas_buffer.lineWidth,
      },
    });
}

function randomize(){
    core_entity_remove_all();

    var loop_counter = vertices_amount - 1;
    var first_id = false;
    var parent_id = '';
    do{
        var this_id = core_uid();
        if(!first_id){
            first_id = this_id;
        }

        core_entity_create({
          'id': this_id,
          'properties': {
            'dx': 0,
            'dy': 0,
            'loop': core_random_integer({
              'max': 360,
            }),
            'parent': parent_id,
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
          },
        });

        parent_id = this_id;
    }while(loop_counter--);

    core_entities[first_id]['parent'] = parent_id;
}

function repo_init(){
    core_repo_init({
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value=Restart>',
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
      'title': '9YG0E6r.htm',
      'ui': '<input id=ui-vertices>Vertices<br><input id=ui-width>Width',
    });
    canvas_init();

    randomize();
}

function resize_logic(){
    canvas_buffer.lineJoin = 'round';
    canvas_buffer.strokeStyle = '#fff';
}

var properties = {
  'radius': 20,
  'speed': 15,
  'x': 500,
  'y': 500,
};
var vertices_amount = 23;

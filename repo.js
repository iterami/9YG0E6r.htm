'use strict';

function load_data(){
    canvas_setproperties({
      'lineJoin': 'round',
      'lineWidth': core_storage_data['width'],
      'strokeStyle': core_storage_data['color'],
    });

    const speed = core_random_integer({
      'max': core_storage_data['speed'],
    }) - core_storage_data['speed'] / 2;

    let loop_counter = core_storage_data['vertices'] - 1;
    let id = false;
    let parent_id = '';
    do{
        if(!id){
            id = loop_counter;
        }

        entity_create({
          'id': loop_counter,
          'properties': {
            'loop': core_random_integer({
              'max': 360,
            }),
            'parent': parent_id,
            'radius': Math.random() * core_storage_data['radius'],
            'speed': core_storage_data['speed-consistent']
              ? speed
              : core_random_integer({
                'max': core_storage_data['speed'],
              }) - core_storage_data['speed'] / 2,
            'x': core_random_integer({
              'max': core_storage_data['range-x'],
            }) - core_storage_data['range-x'] / 2,
            'y': core_random_integer({
              'max': core_storage_data['range-y'],
            }) - core_storage_data['range-y'] / 2,
          },
          'types': [
            'vertex',
          ],
        });

        parent_id = loop_counter;
    }while(loop_counter--);

    entity_entities[id]['parent'] = parent_id;
}

function repo_drawlogic(){
    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          canvas_draw_path({
            'style': 'stroke',
            'vertices': [
              {
                'type': 'moveTo',
                'x': entity_entities[entity]['dx'],
                'y': entity_entities[entity]['dy'],
              },
              {
                'x': entity_entities[entity]['dx'],
                'y': entity_entities[entity_entities[entity]['parent']]['dy'],
              },
            ],
          });
          canvas_draw_path({
            'style': 'stroke',
            'vertices': [
              {
                'type': 'moveTo',
                'x': entity_entities[entity]['dx'],
                'y': entity_entities[entity_entities[entity]['parent']]['dy'],
              },
              {
                'x': entity_entities[entity_entities[entity]['parent']]['dx'],
                'y': entity_entities[entity_entities[entity]['parent']]['dy'],
              },
            ],
          });
      },
    });
}

function repo_logic(){
    for(const vertex in entity_entities){
        entity_entities[vertex]['loop'] = math_clamp({
          'max': 360,
          'min': 0,
          'value': entity_entities[vertex]['loop'] + entity_entities[vertex]['speed'],
          'wrap': true,
        });

        const rotation = math_degrees_to_radians(entity_entities[vertex]['loop']);

        entity_entities[vertex]['dx'] =
          canvas_properties['width-half']
          + entity_entities[vertex]['x']
          + entity_entities[vertex]['radius'] * Math.cos(rotation);
        entity_entities[vertex]['dy'] =
          canvas_properties['height-half']
          + entity_entities[vertex]['y']
          + entity_entities[vertex]['radius'] * Math.sin(rotation);
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': core_repo_reset,
        },
      },
      'info': '<button id=randomize type=button>Randomize</button>',
      'reset': canvas_setmode,
      'storage': {
        'color': '#206620',
        'radius': 23,
        'range-x': 500,
        'range-y': 500,
        'speed': 15,
        'speed-consistent': false,
        'vertices': 23,
        'width': 1,
      },
      'storage-menu': '<table><tr><td><input id=color type=color><td>Color'
        + '<tr><td><input class=mini id=radius step=any type=number><td>Radius'
        + '<tr><td><input class=mini id=range-x step=any type=number><td>Range X'
        + '<tr><td><input class=mini id=range-y step=any type=number><td>Range Y'
        + '<tr><td><input class=mini id=speed step=any type=number><td>Speed'
        + '<tr><td><input id=speed-consistent type=checkbox><td>Speed Consistency'
        + '<tr><td><input class=mini id=vertices min=2 step=any type=number><td>Vertices'
        + '<tr><td><input class=mini id=width min=1 step=any type=number><td>Width</table>',
      'title': '9YG0E6r.htm',
    });
    entity_set({
      'properties': {
        'dx': 0,
        'dy': 0,
      },
      'type': 'vertex',
    });
    canvas_init();
}

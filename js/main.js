'use strict';

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

        const rotation = math_degrees_to_radians({
          'degrees': entity_entities[vertex]['loop'],
        });

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
      'info': '<input id=randomize type=button value=Randomize>',
      'reset': canvas_setmode,
      'storage': {
        'radius': 23,
        'range-x': 500,
        'range-y': 500,
        'speed': 15,
        'speed-consistent': false,
        'vertices': 23,
        'width': 1,
      },
      'storage-menu': '<table><tr><td><input id=radius step=any type=number><td>Radius'
        + '<tr><td><input id=range-x step=any type=number><td>Range X'
        + '<tr><td><input id=range-y step=any type=number><td>Range Y'
        + '<tr><td><input id=speed step=any type=number><td>Speed'
        + '<tr><td><input id=speed-consistent type=checkbox><td>Speed Consistency'
        + '<tr><td><input id=vertices min=2 step=any type=number><td>Vertices'
        + '<tr><td><input id=width min=1 step=any type=number><td>Width</table>',
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

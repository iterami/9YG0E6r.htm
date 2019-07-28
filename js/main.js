'use strict';

function draw_logic(){
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

function logic(){
    for(let vertex in entity_entities){
        entity_entities[vertex]['loop'] = math_clamp({
          'max': 360,
          'min': 0,
          'value': entity_entities[vertex]['loop'] + entity_entities[vertex]['speed'],
          'wrap': true,
        });

        let rotation = math_degrees_to_radians({
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
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
        },
      },
      'info': '<input id=randomize type=button value=Randomize>',
      'storage': {
        'radius': 23,
        'range-x': 500,
        'range-y': 500,
        'speed': 15,
        'vertices': 23,
        'width': 1,
      },
      'storage-menu': '<table><tr><td><input id=radius><td>Radius'
        + '<tr><td><input id=range-x><td>Range X'
        + '<tr><td><input id=range-y><td>Range Y'
        + '<tr><td><input id=speed><td>Speed'
        + '<tr><td><input id=vertices><td>Vertices'
        + '<tr><td><input id=width><td>Width</table>',
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

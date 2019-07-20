'use strict';

function draw_logic(){
    core_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
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
      },
    });
}

function logic(){
    for(let vertex in core_entities){
        core_entities[vertex]['loop'] = math_clamp({
          'max': 360,
          'min': 0,
          'value': core_entities[vertex]['loop'] + core_entities[vertex]['speed'],
          'wrap': true,
        });

        let rotation = math_degrees_to_radians({
          'degrees': core_entities[vertex]['loop'],
        });

        core_entities[vertex]['dx'] =
          canvas_properties['width-half']
          + core_entities[vertex]['x']
          + core_entities[vertex]['radius'] * Math.cos(rotation);
        core_entities[vertex]['dy'] =
          canvas_properties['height-half']
          + core_entities[vertex]['y']
          + core_entities[vertex]['radius'] * Math.sin(rotation);
    }
}

function repo_init(){
    core_repo_init({
      'entities': {
        'vertex': {
          'properties': {
            'dx': 0,
            'dy': 0,
          },
        },
      },
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
    canvas_init();
}

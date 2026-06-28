'use strict';

function draw_entity(entity){
    canvas_draw_path({
      'style': 'stroke',
      'vertices': [
        [
          'moveTo',
          entity.dx,
          entity.dy,
        ],
        [
          'lineTo',
          entity.dx,
          entity_entities[entity.parent].dy,
        ],
      ],
    });
    canvas_draw_path({
      'style': 'stroke',
      'vertices': [
        [
          'moveTo',
          entity.dx,
          entity_entities[entity.parent].dy,
        ],
        [
          'lineTo',
          entity_entities[entity.parent].dx,
          entity_entities[entity.parent].dy,
        ],
      ],
    });
}

function repo_drawlogic(){
    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': draw_entity,
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'randomize': {
          'onclick': canvas_setmode,
        },
      },
      'info': '<button class=medium id=randomize type=button>Randomize</button>',
      'storage': {
        'color': '#206620',
        'radius': 23,
        'range_x': 500,
        'range_y': 500,
        'speed': 15,
        'speed_consistent': false,
        'vertices': 23,
        'width': 2,
      },
      'storage_menu': '<table><tr><td><input id=color type=color><td>Color'
        + '<tr><td><input class=mini id=radius step=any type=number><td>Radius'
        + '<tr><td><input class=mini id=range_x step=any type=number><td>Range X'
        + '<tr><td><input class=mini id=range_y step=any type=number><td>Range Y'
        + '<tr><td><input class=mini id=speed step=any type=number><td>Speed'
        + '<tr><td class=right><input id=speed_consistent type=checkbox><td><label for=speed_consistent>Speed Consistency</label>'
        + '<tr><td><input class=mini id=vertices min=2 step=1 type=number><td>Vertices'
        + '<tr><td><input class=mini id=width min=.1 step=any type=number><td>Width</table>',
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

function repo_load(){
    canvas_setproperties({
      'lineJoin': 'round',
      'lineWidth': core_storage_data.width,
      'strokeStyle': core_storage_data.color,
    });

    const speed = core_random_integer(core_storage_data.speed) - core_storage_data.speed / 2;
    for(let i = 0; i < core_storage_data.vertices; i++){
        entity_create({
          'id': i,
          'properties': {
            'loop': core_random_integer(360),
            'parent': i - 1,
            'radius': Math.random() * core_storage_data.radius,
            'speed': core_storage_data.speed_consistent
              ? speed
              : core_random_integer(core_storage_data.speed) - core_storage_data.speed / 2,
            'x': core_random_integer(core_storage_data.range_x) - core_storage_data.range_x / 2,
            'y': core_random_integer(core_storage_data.range_y) - core_storage_data.range_y / 2,
          },
          'types': [
            'vertex',
          ],
        });
    }
    entity_entities[0].parent = core_storage_data.vertices - 1;
}

function repo_logic(){
    for(const vertex in entity_entities){
        entity_entities[vertex].loop = math_clamp({
          'max': 360,
          'min': 0,
          'value': entity_entities[vertex].loop + entity_entities[vertex].speed,
          'wrap': true,
        });

        const rotation = math_degrees_to_radians(entity_entities[vertex].loop);

        entity_entities[vertex].dx =
          canvas_properties.width_half
          + entity_entities[vertex].x
          + entity_entities[vertex].radius * Math.cos(rotation);
        entity_entities[vertex].dy =
          canvas_properties.height_half
          + entity_entities[vertex].y
          + entity_entities[vertex].radius * Math.sin(rotation);
    }
}

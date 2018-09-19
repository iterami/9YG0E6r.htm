'use strict';

function load_data(){
    canvas_setproperties({
      'properties': {
        'lineJoin': 'round',
        'lineWidth': core_storage_data['width'],
        'strokeStyle': core_storage_data['color-positive'],
      },
    });

    let loop_counter = core_storage_data['vertices'] - 1;
    let first_id = false;
    let parent_id = '';
    do{
        let this_id = loop_counter;
        if(!first_id){
            first_id = this_id;
        }

        core_entity_create({
          'id': this_id,
          'properties': {
            'loop': core_random_integer({
              'max': 360,
            }),
            'parent': parent_id,
            'radius': Math.random() * core_storage_data['radius'],
            'speed': core_random_integer({
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

        parent_id = this_id;
    }while(loop_counter--);

    core_entities[first_id]['parent'] = parent_id;
}

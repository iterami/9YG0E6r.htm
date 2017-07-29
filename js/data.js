'use strict';

function load_data(){
    randomize();
}

function randomize(){
    core_entity_remove_all();

    canvas_buffer.strokeStyle = core_storage_data['color-positive'];

    var loop_counter = core_storage_data['vertices'] - 1;
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
          'types': [
            'vertex',
          ],
        });

        parent_id = this_id;
    }while(loop_counter--);

    core_entities[first_id]['parent'] = parent_id;
}

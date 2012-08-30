define([
    
    'wol/wol'

], function(wol) {

    "use strict";

    wol.components.add('unit', function(entity) {
        // an event component is required for this like amongst other things.
        entity.addComponent('events');
        // .attack
        // -------
        // attack another unit
        entity.attack = function(otherEntity) {
            entity.emit('unit.attack.start');
            otherEntity.defend(entity);
        };
        // .defend
        // -------
        // enables the unit to defend itself from another. 
        entity.defend = function(otherEntity) {
            entity.emit('unit.defend.start');
        };
        // .hit
        // ----
        // enables the unit to get hit. main usage is for animation.
        entity.hit = function(value) {
            entity.emit('unit.entity.start', value);
        };
    });

});

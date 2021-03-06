define([

    'wol/wol',
    'wol/tile',
    'wol/events',
    'game/hex'
    
],function(wol, Tile, Events, Hex){

    "use strict";

    wol.components.add('hexgrid', function(entity) {
        // The entity is required to have an event emitter component.
        entity.addComponent('events');
        // .moveDuration
        // -------------
        // The amount of time the entity takes to get to one hex tile to another.
        entity.moveDuration = 1000;
        // .move
        // -----
        // Moves the entity to a tile. Supply with an Array, and it will automatically tween
        // between the points.
        entity.move = function(tileOrTiles) {
            var tweenObj, tile, nextTile, currentTile;
            // check if the argument is a tile
            if (wol.isArray(tileOrTiles)) {
                // emit an event that tells the entity we're starting to move to a point
                entity.emit('hex.move.start');
                // initiate a tween.
                tweenObj = wol.tween.get(entity.container);
                // iterate through the array, and assign tween chaining
                wol.each(tileOrTiles, function(tile){
                    var coord = Hex.coord(tile, true);
                    tweenObj = tweenObj
                        .call(function(){
                            entity.container.scaleX = entity._currentPos.x > coord.x ? -1 : 1;
                            entity._currentPos = coord;
                            // we assign the current active tile in the entity for reference.
                            entity.tile = tile;
                        })
                        .to(coord, entity.moveDuration);
                });
                // tells the entity we're finished moving which can be used to do
                // stop a move animation.
                tweenObj.call(function() {
                    entity.emit('hex.move.end');
                });
            }
            else {
                // Immediately move the unit to a tile if it's not an array.
                // This is meant for initialization and/or syncing.
                // Example would be loading a game and you want to immediately place
                // the entities in their right place.
                entity.tile = tileOrTiles;
                entity._currentPos = Hex.position(entity.container, tileOrTiles, true);
            }
        };
    });
});

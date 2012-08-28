define([

    'wol/wol',
    'wol/tile',
    'game/hex'
    
],function(wol, Tile, Hex){

    "use strict";

    return wol.components.hexgrid = function(entity) {
        entity.moveDuration = 1000;
        entity.move = function(tileOrTiles) {
            var tweenObj, tile, nextTile, currentTile;
            if (wol.isArray(tileOrTiles)) {
                tweenObj = wol.tween.get(entity.container);
                entity.events.emit('hex.move.start');
                wol.each(tileOrTiles, function(tile){
                    var coord = Hex.coord(tile, true);
                    tweenObj = tweenObj
                        .call(function(){
                            entity.container.scaleX = entity._currentPos.x > coord.x ? -1 : 1;
                            entity._currentPos = coord;
                        })
                        .to(coord, entity.moveDuration);
                });
            }
            else {
                entity._currentPos = Hex.position(entity.container, tileOrTiles, true);
            }
        }
    }

});

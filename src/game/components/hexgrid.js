define([

    'wol/wol',
    'wol/tile',
    'game/hex'
    
],function(wol, Tile, Hex){

    "use strict";

    wol.components.add('hexgrid', function(entity) {
        entity.moveDuration = 1000;
        entity.move = function(tileOrTiles) {
            var tweenObj, tile, nextTile, currentTile;
            if (wol.isArray(tileOrTiles)) {
                tweenObj = wol.tween.get(entity.container);
                entity.emit('hex.move.start');
                wol.each(tileOrTiles, function(tile){
                    var coord = Hex.coord(tile, true);
                    tweenObj = tweenObj
                        .call(function(){
                            entity.container.scaleX = entity._currentPos.x > coord.x ? -1 : 1;
                            entity._currentPos = coord;
                        })
                        .to(coord, entity.moveDuration);
                });
                tweenObj.call(function() {
                    entity.emit('hex.move.end');
                });
            }
            else {
                entity._currentPos = Hex.position(entity.container, tileOrTiles, true);
            }
        };
    });

});

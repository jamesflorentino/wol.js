define([

    'wol/wol',
    'wol/game',
    'wol/grid',
    'game/textures/elements'

], function(wol, Game, Grid, elements) {
    "use strict";

    var URI_BACKGROUND = 'media/background.png';
    var URI_TERRAIN = 'media/terrain.png';
    var URI_ELEMENTS = 'media/elements.png';

    wol.resources.add(
        URI_BACKGROUND,
        URI_TERRAIN,
        URI_ELEMENTS
    );

    wol.ready(function(wol) {
        wol.spritesheets.add('elements', elements);
    });

    return Game.extend({

        settings: {
            hex: {
                width: 84,
                height: 56
            }
        },

        grid: new Grid(),

        // basic display elements
        background: null,
        terrain: null,
        hexContainer: wol.create.container(),

        init: function() {
            this.parent();
            this.background = wol.create.bitmap(wol.resources.get(URI_BACKGROUND));
            this.terrain = wol.create.bitmap(wol.resources.get(URI_TERRAIN));
            this.add(this.background);
            this.add(this.terrain);
            this.grid.generate(9,8);
            this.createStaticGridDisplay(this.grid);
            wol.tween.get(this.terrain).wait(1000).to({ y: 100 }, 2000, wol.ease.cubicInOut);
            wol.tween.get(this.hexContainer).wait(1000).to({ y: 100 }, 2000, wol.ease.cubicInOut);
        },

        createStaticGridDisplay: function(grid) {
            var i, _len, tile, hex, image, container, _this = this;
            image = wol.spritesheets.extract('elements','hex_bg');
            i = 0;
            this.createTiles(this.grid.tiles, 'hex_bg', function(hex) {
                _this.add(_this.hexContainer, hex);
            });
            wol.wait(0, function(){
                wol.create.cache(this.hexContainer, wol.width, wol.height);
            }.bind(this));
            this.add(this.hexContainer);
        },

        createTiles: function(tiles, type, callback) {
            var image, hex, tile, hexes, hexWidth, hexHeight;
            type || (type = 'hex_select');
            image = wol.spritesheets.extract('elements', type);
            hexes = [];
            hexWidth = this.settings.hex.width;
            hexHeight = this.settings.hex.height;
            for (var i = tiles.length - 1; i >= 0; i--){
                tile = tiles[i];
                hex = wol.create.bitmap(image);
                hex.x = tile.x * hexWidth + (tile.y % 2 ? hexWidth * 0.5 : 0);
                hex.y = tile.y * (hexHeight - hexHeight * 0.25);
                if (wol.isFunction(callback)) {
                    callback.call(this, hex);
                }
            }
            return hexes;
        }
    });

});

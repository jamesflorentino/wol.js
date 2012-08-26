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
                width: 0,
                height: 0
            }
        },

        grid: new Grid(),

        // basic display elements
        background: null,
        terrain: null,
        hexContainer: null,

        init: function() {
            this.parent();
            this.background = wol.create.bitmap(wol.resources.get(URI_BACKGROUND));
            this.terrain = wol.create.bitmap(wol.resources.get(URI_TERRAIN));
            this.add(this.background);
            this.add(this.terrain);
            this.grid.generate(5,5);
            this.createStaticGridDisplay(this.grid);
            wol.tween.get(this.hexContainer)
                .to({y: 400}, 15000, wol.ease.quartOut);
            wol.play();
        },

        createStaticGridDisplay: function(grid) {
            var i, _len, tile, hex, image, container, _this = this;
            image = wol.spritesheets.extract('elements','hex_bg');
            container = wol.create.container();
            this.settings.hex.width = image.width;
            this.settings.hex.height = image.height;
            // generate
            this.createTiles(this.grid.tiles, 'hex_bg', function(hex) {
                _this.add(container, hex);
            });
            wol.create.cache(container, wol.width, wol.height);
            this.hexContainer = container;
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

define([

    'wol/wol',
    'wol/game',
    'wol/grid',
    'game/textures/elements',
    'game/entities/marine',
    'game/hex',
    'game/components/hexgrid'

], function(wol, Game, Grid, elements, Marine, Hex) {
    "use strict";

    var URI_BACKGROUND = 'media/background.png';
    var URI_TERRAIN = 'media/terrain.png';

    // Include assets to the imageQuee
    wol.resources.add(
        URI_BACKGROUND,
        URI_TERRAIN
    );

    // Include the elements sprite sheet
    wol.spritesheets.add('elements', elements);

    return Game.extend({

        grid: new Grid(),

        // basic display elements
        background: null,
        terrain: null,
        hexContainer: wol.create.container(),
        unitContainer: wol.create.container(),

        init: function() {
            this.parent();
            this.background = wol.create.bitmap(wol.resources.get(URI_BACKGROUND));
            this.terrain = wol.create.bitmap(wol.resources.get(URI_TERRAIN));
            this.add(this.background);
            this.add(this.terrain);
            this.add(this.hexContainer);
            this.add(this.unitContainer);
            this.grid.generate(9,8);
            this.createStaticGridDisplay(this.grid);
            this.testUnits();
            this.terrain.y = this.hexContainer.y = this.unitContainer.y = 100;
        },

        createStaticGridDisplay: function(grid) {
            var i, _len, tile, hex, image, container, _this = this;
            image = wol.spritesheets.extract('elements','hex_bg');
            i = 0;
            this.createTiles(this.grid.tiles, 'hex_bg', function(hex) {
                _this.add(_this.hexContainer, hex);
            });
            // Cache the hexTile container.
            // We wait for a tick before we cache it. Because sometimes
            // Chrome fails to render on initial load.
            wol.wait(0, function(){
                wol.create.cache(this.hexContainer, wol.width, wol.height);
            }.bind(this));
        },

        createTiles: function(tiles, type, callback) {
            var image, hex, tile, hexes;
            type || (type = 'hex_select');
            image = wol.spritesheets.extract('elements', type);
            hexes = [];
            for (var i = tiles.length - 1; i >= 0; i--){
                tile = tiles[i];
                hex = wol.create.bitmap(image);
                Hex.position(hex, tile);
                if (wol.isFunction(callback)) {
                    callback.call(this, hex);
                }
            }
            return hexes;
        },

        testUnits: function () {
            // create the unit
            var marine = new Marine();
            marine.addComponent('hexgrid');
            marine.move(this.grid.get(1, 0));
            wol.wait(1000, function() {
                marine.move([
                    this.grid.get(0,0),
                    this.grid.get(1,0),
                    this.grid.get(1,1),
                    this.grid.get(1,2),
                    this.grid.get(1,3),
                    this.grid.get(1,4)
                ]);
            }.bind(this));
            // add to display list
            this.add(this.unitContainer, marine.container);
        }

    });

});

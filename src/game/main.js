define([

    'wol/wol',
    'wol/game',
    'wol/grid',
    'game/textures/elements',
    'game/entities/marine',
    'game/hex',
    'game/components/hexgrid',
    'wol/keys'

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
            this.terrain.y = this.hexContainer.y = this.unitContainer.y = 60;
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
            var _this = this;
            var entity;
            entity = new Marine();
            // adding a unit to the display list.
            this.addEntity(entity);
            // place a unit immediately in a tile.
            entity.move(_this.grid.get(1, 0));
        },

        // This command will add the unit/entity into the proper container
        // and assign the required components the entitiy needs to posess.
        addEntity: function(entity) {
            // since this is a hex-grid game, we should apply a hexgrid component
            // to the entities we add into the display list.
            entity.addComponent('hexgrid');
            this.add(this.unitContainer, entity.container);
        }

    });

});

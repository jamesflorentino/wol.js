define([

    'wol/wol',
    'wol/game',
    'game/hexgrid',
    'game/textures/elements',
    'game/entities/marine',
    'game/hex',
    'game/components/hexgrid',
    'wol/keys',
    'game/components/unit'

], function(wol, Game, HexGrid, elements, Marine, Hex) {

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

        hexgrid: new HexGrid(),

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
            this.hexgrid.generate(9,8);
            this.createStaticGridDisplay(this.hexgrid);
            this.testUnits();
            this.terrain.y = this.hexContainer.y = this.unitContainer.y = 60;
        },

        createStaticGridDisplay: function(grid) {
            var i, _len, tile, hex, image, container, _this = this;
            image = wol.spritesheets.extract('elements','hex_bg');
            i = 0;
            container = wol.create.container();
            this.showTiles(this.hexgrid.tiles, 'hex_bg', function(hex) {
                _this.add(hex, container);
            });
            // Cache the hexTile container.
            // We wait for a tick before we cache it. Because sometimes
            // Chrome fails to render on initial load.
            wol.wait(0, function(){
                wol.create.cache(container, wol.width, wol.height);
            });
            this.add(container, this.hexContainer);
        },

        showTiles: function(tiles, type, callback) {
            var image, hex, tile, hexes;
            type || (type = 'hex_select');
            image = wol.spritesheets.extract('elements', type);
            hexes = [];
            for (var i = tiles.length - 1; i >= 0; i--){
                tile = tiles[i];
                hex = wol.create.bitmap(image);
                Hex.position(hex, tile);
                if (wol.isFunction(callback)) {
                    callback.call(this, hex, i);
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
            entity.move(_this.hexgrid.get(5, 3));
            // showing movable tiles.
            this.showTiles(this.hexgrid.neighbors(entity.tile, 2), 'hex_select', function(hex, i){
                _this.add(hex, _this.hexContainer);
            });
            // assign keys
            var keys, KeyCodes;
            keys = wol.keys;
            KeyCodes = wol.KeyCodes;
            keys
                .on(KeyCodes.A, function(){
                    entity.attack();
                })
                .on(KeyCodes.S, function(){
                    entity.defend();
                })
                .on(KeyCodes.D, function(){
                    entity.hit();
                })
                .on(KeyCodes.F, function () {
                    entity.die();
                })
                ;
        },

        // This command will add the unit/entity into the proper container
        // and assign the required components the entitiy needs to posess.
        addEntity: function(entity) {
            // since this is a hex-grid game, we should apply a hexgrid component
            // to the entities we add into the display list.
            entity.addComponent('hexgrid');
            entity.addComponent('unit');
            console.log(entity);
            this.add(entity.container, this.unitContainer);
        }

    });

});

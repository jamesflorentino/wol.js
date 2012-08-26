define([

    'wol/wol',
    'wol/tile'

], function(wol, Tile) {
    "use strict";

    return wol.Grid = wol.Class.extend({

        columns: 0,
        rows: 0,
        keys: {},
        tiles: [],
        init: function() {
        },
        generate: function(rows, columns) {
            var row, col, tile;
            this.columns = columns;
            this.rows = rows;
            for(col = 0; col < columns; col++) {
                this.keys[col] = {};
                for(row = 0; row < rows; row++) {
                    tile = new Tile(col, row);
                    this.keys[col][row] = tile;
                    this.tiles.push(tile);
                }
            }
        },
        get: function(x, y) {
            return this.keys[x][y];
        }
    });

});

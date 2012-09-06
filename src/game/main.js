define([
    'wol/wol',
    'game/base',
    'game/cookie'

], function(wol, Base, cookie) {

    "use strict";

    return Base.extend({
        socket: null,
        _players: {},
        players: [],
        player: {
            name: null,
            id: null
        },
        init: function() {
            this.parent();
            this.setEvents();
        },
        setEvents: function() {
            this.socket = io.connect('//localhost:3000/game');
            this.socket
                .on('disconnect', this.disconnect.bind(this))
                .on('player.set', this.setPlayer.bind(this))
                .on('players.add', this.addPlayer.bind(this))
                .on('players.remove', this.removePlayer.bind(this))
                .on('game.wait', this.waitGame.bind(this))
                .on('game.start', this.startGame.bind(this))
                .on('game.end', this.endGame.bind(this))
                .emit('player.setAuth');
            return this;
        }
        addPlayer: function(data) {
            var id = data.id;
            var name = data.name;

            if (id !== undefined && name !== undefined) {
                var player = {
                    id:id,
                    name:name
                };
                this.players.push(player);
                this._players[player.id] = player;
            }
        },
        removePlayer: function(data) {
            var player, id;
            id = data.id;
            if(player = this._players[id]) {
                delete this._players[id];
                this.players.splice(this.players.indexOf(player), 1);
            }
        },
        waitGame: function(data) {
            console.log('waiting game', data);
        },
        startGame: function(data) {
            console.log('starting game', data);
        },
        endGame: function(data) {
            console.log('ending game', data);
        },
        setPlayer: function(data) {
            this.player.name = data.name;
            this.player.id = data.id;
            console.log('set player', data);
        },
        disconnect: function () {
        }
    });

});

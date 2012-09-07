define([
    'wol/wol',
    'game/base',
    'cookies',
    'lodash'

], function(wol, Base, Cookies, _) {

    "use strict";

    var vendorName = navigator.vendor.replace(/(^\w+).+/, function (a, b) {
        return b;
    });

    return Base.extend({
        sio: null,
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
            this.sio = io.connect('//localhost:3000/game');
            this.sio
                .on('player.setData', this.setPlayerData.bind(this));
            this.setAuthKey();
            return this;
        },
        setAuthKey: function() {
            this.sio.emit('player.setAuthKey', {
                wol_id: Cookies.get('wol_id')
            });
            return this;
        },
        setPlayerData: function(data) {
            var id = data.id;
            var authKey = data.authKey;
            if (id && authKey) {
                Cookies.set('wol_id', authKey, {
                    expires: data.expiresIn
                });
            }
            this.setName();
            this.findGame();
        },
        setName: function() {
            this.sio.emit('player.setName', { name: vendorName });
        },
        findGame: function() {
            this.sio.emit('game.find');
        }
    });

});

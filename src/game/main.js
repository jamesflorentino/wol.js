define([
    'wol/wol',
    'game/base',
    'cookies',
    'lodash',
    'game/entities/marine'

], function(wol, Base, Cookies, _, Marine) {

    "use strict";

    var vendorName = navigator.vendor.replace(/(^\w+).+/, function (a, b) {
        return b;
    });

    return Base.extend({
        sio: null,
        _players: {},
        players: [],
        units: [],
        player: {
            name: null,
            id: null
        },
        unitClasses: {
            'marine': Marine
        },
        init: function() {
            this.parent();
            this.setEvents();
        },
        findGame: function() {
            this.sio.emit('game.find');
        },
        gameJoin: function() {
            // todo - manage game rooms.
        },
        setAuthKey: function() {
            this.sio.emit('player.setAuthKey', {
                wol_id: Cookies.get('wol_id')
            });
            return this;
        },
        setEvents: function() {
            this.sio = io.connect('//localhost:3000');
            this.sio
                .on('player.setData', this.setPlayerData.bind(this))
                .on('game.join', this.gameJoin.bind(this))
                .on('unit.add', this.unitAdd.bind(this))
            ;
            this.setAuthKey();
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
        unitAdd: function(data) {
            console.log(data);
            var unitClass = this.unitClasses[data.code];
            if (unitClass) {
                var unit = new unitClass();
                this.addEntity(unit);
            }
        }
    });

});

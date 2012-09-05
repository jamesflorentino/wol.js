define([

'wol/wol', 'game/base', 'game/api', 'game/cookie'

], function(wol, Base, api, cookie) {

    "use strict";

    return Base.extend({
        socket: null,
        /**
         */
        init: function() {
            this.parent();
            this.socket = io.connect('//localhost:1337');
            this.setEvents();
            this.auth();
        },
        /**
         */
        auth: function() {
            this.socket
                .emit('setup', { cookie: cookie.readCookie('wol-id') })
                .emit('set_name', { name: 'James' })
                .emit('find_game')
                ;
            return this;
        },
        /**
         */
        setEvents: function() {
            this.socket
                .on('reconnect'  , this.reconnect.bind(this))
                .on('disconnect' , this.disconnect.bind(this))
                .on('set_user'   , this.setUser.bind(this))
                .on('join_game'  , this.joinGame.bind(this))
                .on('list_game' , this.listGame.bind(this))
                ;
            return this;
        },
        /**
         */
        joinGame: function(data) {
        },
        /**
         */
        listGame: function(data) {
        },
        /**
         */
        setUser: function(data) {
            cookie.createCookie('wol-id', data.key, 360);
        },
        /**
         */
        reconnect: function() {
            console.log('reconnect');
        },
        /**
         */
        disconnect: function () {
            console.log('disconnect');
        }
    });

});

define([

    'wol/utils'

], function() {

    "use strict";

    return (function() {

        function Events() {
            this.events = {};
        }

        Events.prototype.on = function(eventName, callback) {
            this.events[eventName] || (this.events[eventName] = []);
            if(isFunction(callback)) {
                this.events[eventName].push(callback);
            }
            return this;
        };

        Events.prototype.off = function(eventName, callback) {
            var callbacks;
            if (eventName === undefined) {
                this.events = {};
            } else if (!isFunction(callback)) {
                this.events[eventName] = [];
            } else if (callbacks = this.events[name]) {
                callbacks.splice(callbacks.indexOf(callback), 1);
            }
            return this;
        };

        Events.prototype.emit = function(eventName, data) {
            var callbacks, callback, i;
            callbacks = this.events[eventName]
            if (isArray(callbacks)) {
                for(i=0; i<callbacks.length; i++) {
                    callback = callbacks[i];
                    callback.call(this, data);
                }
            }
            return this;
        };

        return Events;

    })();

});

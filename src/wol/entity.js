define([

    'wol/wol',
    'wol/events'

], function(wol, Events) {

    "use strict";

    // spritesheet components
    wol.components.add('spritesheet', function(entity, spritesheet) {
        var animation = wol.create.animation(spritesheet);
        entity.container.addChild(animation);
        entity.play = function(frame) {
            animation.gotoAndPlay.apply(animation, arguments);
            return entity;
        };
        entity.stop = function(frame) {
            animation.gotoAndStop.apply(animation, arguments);
            return entity;
        };
        entity.sequence = function(from, to) {
            var fromA;
            if( fromA = animation.spriteSheet.getAnimation(from)) {
                fromA.next = to;
            }
            return entity;
        }
    });

    // event emitters
    wol.components.add('events', function(entity) {
        var events = new Events();
        entity.on = function(name, cb) {
            events.on(name, cb);
        };
        entity.off = function(name, cb) {
            events.off(name, cb);
        };
        entity.emit = function() {
            events.emit.apply(events, arguments);
        };
    });

    return wol.Entity = wol.Class.extend({
        init: function() {
            this._components = [];
            // create a fresh container
            this.container = wol.create.container();
            // add the container to the main display list;
            wol.display.add(this.container);
        },
        LEFT: 'left',
        RIGHT: 'right',
        flip: function(direction) {
            //this.container.scaleX = direction === this.LEFT ? -1 : 1;
            this.container.scaleX = Math.random() > 0.5 ? -1 : 1;
        },
        addComponent: function(name) {
            var component, args;
            if (this._components.indexOf(name) > -1) {
                return this;
            }
            if(component = wol.components.get(name)) {
                args = Array.prototype.slice.call(arguments);
                args.splice(0, 1);
                args.splice(0, 0, this);
                component.apply(this, args);
                this._components.push(name);
            }
        }
    })

})

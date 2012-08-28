define([

	'wol/wol'

], function(wol) {

    "use strict";

    return wol.Entity = wol.Class.extend({
        init: function() {
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
        _componentList: {},
        component: function(component) {
            var name = component.name;
            if (name !== undefined || name.length === 0) {
                if (!this._componentList[name]) {
                    var args = Array.prototype.slice.call(arguments);
                    args.shift();
                    args.splice(0,0,this);
                    component.apply(this, args);
                    this._componentList['sdf'] = true;
                }
            }
            return this;
        }

    })

})

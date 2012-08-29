define([

    'wol/wol',
    'wol/entity',
    'game/textures/marine'

], function(wol, Entity, marine) {
    "use strict";

    var SHEET_NAME = 'game.entities.marine';

    // let's adjust the offset a bit
    marine.frames.regX = 30;
    marine.frames.regY = 77;

    // add spritesheet data to the resource manager
    wol.spritesheets.add(SHEET_NAME, marine);

    /**
    * Marine
    * ============================================
    * super awesome solider
    **/
    return wol.Entity.extend({

        init: function() {
            var _this = this;
            this.parent();
            this.addComponent('spritesheet', wol.spritesheets.get(SHEET_NAME));
            this.addComponent('events');
            this.sequence('moveStart', 'move');
            this.sequence('moveEnd', 'idle');
            this.play('idle');
            this.on('hex.move.start', function(){
                _this.play('moveStart');
            });
            this.on('hex.move.end', function() {
                _this.play('moveEnd');
            });
            //this.component(wol.components.events)
            //    .component(
            //        wol.components.animation,
            //        wol.spritesheets.get(SHEET_NAME)
            //    )
            //this.play('idle');
            //this.events.on('hex.move.start', function(){
            //    console.log('heeey');
            //});
        }
    });
});

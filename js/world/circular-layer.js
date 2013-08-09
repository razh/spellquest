define([
  'world/layer'
], function( Layer ) {
  'use strict';

  function CircularLayer() {
    Layer.call( this );
  }

  CircularLayer.prototype = new Layer();
  CircularLayer.prototype.constructor = CircularLayer;

  CircularLayer.prototype.update = function( elapsedTime, dx ) {
    Layer.prototype.update.call( this, elapsedTime, dx );

    // This assumes we only scroll from right-to-left.
    var x     = this.getX(),
        width = this.getWidth();

    this._props.forEach(function( prop ) {
      if ( prop.getX() + prop.getWidth() + x <= 0 ) {
        prop.setX( prop.getX() + width );
      }
    });
  };

  return CircularLayer;
});

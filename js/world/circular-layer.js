define(
  [ './layer' ],
  function( Layer ) {
    function CircularLayer() {
      Layer.call( this );
    }

    CircularLayer.prototype = new Layer();
    CircularLayer.prototype.constructor = CircularLayer;

    CircularLayer.prototype.update = function( elapsedTime, dx ) {
      Layer.prototype.update.call( this, elapsedTime, dx );

      // This assumes we only scroll from right-to-left.
      var x = this.getX();
      var width = this.getWidth();
      for ( var i = 0, n = this._props.length; i < n; i++ ) {
        if ( this._props[i].getX() + this._props[i].getWidth() + x <= 0 ) {
          this._props[i].setX( this._props[i].getX() + width );
        }
      }
    };

    return CircularLayer;
  }
);

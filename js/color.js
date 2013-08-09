define(function() {
  'use strict';

  function Color() {
    this._red   = 0;
    this._green = 0;
    this._blue  = 0;
    this._alpha = 0.0;

    if ( arguments.length ) {
      this.set.apply( this, arguments );
    }
  }

  Color.prototype.set = function() {
    if ( arguments.length === 1 ) {
      this.setRed(   arguments[0].getRed()   );
      this.setGreen( arguments[0].getGreen() );
      this.setBlue(  arguments[0].getBlue()  );
      this.setAlpha( arguments[0].getAlpha() );
    }
    else if ( arguments.length === 4 ) {
      this.setRed(   arguments[0] );
      this.setGreen( arguments[1] );
      this.setBlue(  arguments[2] );
      this.setAlpha( arguments[3] );
    }
  };

  Color.prototype.getRed = function() {
    return this._red;
  };

  Color.prototype.setRed = function( red ) {
    this._red = red;
  };

  Color.prototype.getGreen = function() {
    return this._green;
  };

  Color.prototype.setGreen = function( green ) {
    this._green = green;
  };

  Color.prototype.getBlue = function() {
    return this._blue;
  };

  Color.prototype.setBlue = function( blue ) {
    this._blue = blue;
  };

  Color.prototype.getAlpha = function() {
    return this._alpha;
  };

  Color.prototype.setAlpha = function( alpha ) {
    this._alpha = alpha;
  };

  Color.prototype.toString = function() {
    return 'rgba( ' + Math.round( this.getRed()   ) +
           ', '     + Math.round( this.getGreen() ) +
           ','      + Math.round( this.getBlue()  ) +
           ','      + this.getAlpha() + ' )';
  };

  return Color;
});

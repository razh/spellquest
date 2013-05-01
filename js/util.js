define(
  function() {
    'use strict';

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame       ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame    ||
             window.oRequestAnimationFrame      ||
             window.msRequestAnimationFrame     ||
             function( callback ) {
                window.setTimeout( callback, 1000 / 60 );
             };
    }) ();

    // Cloning function taken from:
    // http://my.opera.com/GreyWyvern/blog/show.dml/1725165
    Object.prototype.clone = function() {
      var newObj = ( this instanceof Array ) ? [] : {};

      for ( var i in this ) {
        if ( i === 'clone' ) continue;
        if ( this[i] && typeof this[i] === 'object' ) {
          newObj[i] = this[i].clone();
        } else {
          newObj[i] = this[i];
        }
      }

      return newObj;
    };
  }
);

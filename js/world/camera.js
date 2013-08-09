define([
  'entities/entity'
], function( Entity ) {
  'use strict';

  // This isn't used right now.
  function Camera() {
    Entity.call( this );

    this._zoom = 1.0;
  }

  Camera.prototype = new Entity();
  Camera.prototype.constructor = Camera;

  Camera.prototype.getZoom = function() {
    return this._zoom;
  };

  Camera.prototype.setZoom = function( zoom ) {
    this._zoom = zoom;
  };

  return Camera;
});

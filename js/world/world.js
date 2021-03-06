define([
  'entities/entity'
], function( Entity ) {
  'use strict';

  function World() {
    Entity.call( this );

    this._playerEntity = null;
    this._enemies      = [];

    this._layers      = [];
    this._scrollSpeed = -0.1;
  }

  World.prototype = new Entity();
  World.prototype.constructor = World;

  World.prototype.getLayers = function() {
    return this._layers;
  };

  World.prototype.addLayer = function( layer ) {
    this._layers.push( layer );
    this._layers.sort(function( x, y ) {
      return x.getZIndex() - y.getZIndex();
    });
  };

  World.prototype.getPlayerEntity = function() {
    return this._playerEntity;
  };

  World.prototype.setPlayerEntity = function( playerEntity ) {
    this._playerEntity = playerEntity;
  };

  World.prototype.getScrollSpeed = function() {
    return this._scrollSpeed;
  };

  World.prototype.setScrollSpeed = function( scrollSpeed ) {
    this._scrollSpeed = scrollSpeed;
  };

  World.prototype.update = function( elapsedTime ) {
    var scrollSpeed = this.getScrollSpeed();
    this._layers.forEach(function( layer ) {
      layer.update( elapsedTime, elapsedTime * scrollSpeed );
    });
  };

  World.prototype.draw = function( ctx ) {
    ctx.clearRect( 0, 0, this.getWidth(), this.getHeight() );

    ctx.fillStyle = this.getColor().toString();
    ctx.fillRect( 0, 0, this.getWidth(), this.getHeight() );

    this._layers.forEach(function( layer ) {
      layer.draw( ctx );
    });

    var playerEntity = this.getPlayerEntity();
    if ( playerEntity ) {
      playerEntity.draw( ctx );
    }
  };

  World.prototype.hit = function( x, y ) {
    x -= this.getX() - this.getHalfWidth();
    y -= this.getY() - this.getHalfHeight();

    var hit = null;
    for ( var i = this._layers.length - 1; i >= 0; i-- ) {
      hit = this._layers[i].hit( x, y );
      if ( hit !== null ) {
        break;
      }
    }

    return hit;
  };

  return World;
});

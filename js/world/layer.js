
var Layer = function() {
  Entity.call( this );

  this._props = [];

  this._zIndex = 0;
  this._parallaxFactor = 1.0;
};

Layer.prototype = new Entity();
Layer.prototype.constructor = Layer;

Layer.prototype.getProps = function() {
  return this._props;
};

Layer.prototype.addProp = function( prop ) {
  this._props.push( prop );
};

Layer.prototype.getZIndex = function() {
  return this._zIndex;
};

Layer.prototype.setZIndex = function( zIndex ) {
  this._zIndex = zIndex;
};

Layer.prototype.getParallaxFactor = function() {
  return this._parallaxFactor;
};

Layer.prototype.setParallaxFactor = function( parallaxFactor ) {
  this._parallaxFactor = parallaxFactor;
};

Layer.prototype.update = function( elapsedTime, dx ) {
  Entity.prototype.update.call( this, elapsedTime );

  this.setX( this.getX() + dx * this.getParallaxFactor() );
};

Layer.prototype.draw = function( ctx ) {
  ctx.save();
  ctx.translate( this.getX(), this.getY() );

  for ( var i = 0; i < this._props.length; i++ ) {
    this._props[i].draw( ctx );
  }

  ctx.restore();
};

Layer.prototype.hit = function( x, y ) {
  x -= this.getX();
  y -= this.getY();

  for ( var i = 0; i < this._props.length; i++ ) {
    if ( this._props[i].hit( x, y ) !== null ) {
      return this._props[i];
    }
  }

  return null;
};

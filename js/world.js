var World = function() {
  Entity.call( this );

  this._layers = [];
};

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

World.prototype.update = function( elapsedTime ) {
  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].update( elapsedTime );
  }
};

World.prototype.draw = function( ctx ) {
  ctx.fillRect(
    this.getX() - this.getHalfWidth(),
    this.getY() - this.getHalfHeight(),
    this.getWidth(),
    this.getHeight()
  );

  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].draw( ctx );
  }
};

var Camera = function() {
  Entity.call( this );

  this._zoom = 1.0;
};

Camera.prototype = new Entity();
Camera.prototype.constructor = Camera;

Camera.prototype.getZoom = function() {
  return this._zoom;
};

Camera.prototype.setZoom = function( zoom ) {
  this._zoom = zoom;
};

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

Layer.prototype.addProps = function( prop ) {
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
  Entity.prototype.call( this );

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

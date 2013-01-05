var World = function() {
  this._layers = [];
};

World.prototype.getLayers = function() {
  return this._layers;
};

World.prototype.addLayer = function( layer ) {
  this._layers.push( layer );
  this._layers.sort(function( x, y ) {
    return x.getZIndex() - y.getZIndex();
  });
};

World.prototype.draw = function( ctx ) {
  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].draw( ctx );
  }
};

World.prototype.update = function( elapsedTime ) {

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

Layer.prototype.update = function( elapsedTime ) {
  Entity.prototype.call( this );
};

Layer.prototype.draw = function( ctx ) {
  for ( var i = 0; i < this._props.length; i++ ) {
    this._props[i].draw( ctx );
  }
};

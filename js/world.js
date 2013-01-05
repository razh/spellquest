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
    return y.getZIndex() - x.getZIndex();
  });
};

World.prototype.update = function( elapsedTime ) {
  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].update( elapsedTime );
  }
};

World.prototype.draw = function( ctx ) {
  ctx.save();
  ctx.translate(
    this.getX() - this.getHalfWidth(),
    this.getY() - this.getHalfHeight()
  );

  ctx.fillStyle = this.getColor().toString();
  ctx.fillRect(
    0,
    0,
    this.getWidth(),
    this.getHeight()
  );

  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].draw( ctx );
  }

  ctx.restore();
};

World.prototype.hit = function( x, y ) {

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

Layer.prototype.hit = function( x, y ) {
  x -= this.getX();
  y -= this.getY();

  for ( var i = 0; i < this._props.length; i++ ) {
    if ( this._props[i].hit( x, y ) !== null ) {
      return this;
    }
  }

  return null;
};

var LayerFactory = function() {};

LayerFactory.prototype.createTerrainLayer = function( width, height, maxTerrainHeight, segmentCount ) {
  var layer = new Layer();

  var segmentWidth = width / segmentCount;
  var points = [];
  for ( var i = 0; i < segmentCount + 1; i++ ) {
    points.push( Math.random() * maxTerrainHeight );
  }

  var xPos = 0;
  var tempPolygonEntity;
  for ( i = 0; i < segmentCount; i++ ) {
    tempPolygonEntity = new PolygonEntity();
    tempPolygonEntity.setVertices([
      xPos, height,
      xPos, height - points[i],
      xPos + segmentWidth, height - points[ i + 1 ],
      xPos + segmentWidth, height
    ]);
    tempPolygonEntity.setColor( 0, 0, 0, 1.0 );
    layer.addProp( tempPolygonEntity );

    xPos += segmentWidth;
  }

  return layer;
};

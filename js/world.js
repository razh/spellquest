var World = function() {
  Entity.call( this );

  this._playerEntity = null;
  this._enemies = [];

  this._layers = [];
  this._scrollSpeed = -0.1;
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
  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].update( elapsedTime, elapsedTime * this.getScrollSpeed() );
  }
};

World.prototype.draw = function( ctx ) {
  ctx.clearRect( 0, 0, this.getWidth(), this.getHeight() );

  ctx.fillStyle = this.getColor().toString();
  ctx.fillRect( 0, 0, this.getWidth(), this.getHeight() );

  for ( var i = 0; i < this._layers.length; i++ ) {
    this._layers[i].draw( ctx );
  }

  this.getPlayerEntity().draw( ctx );
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

// Loops around.
var CircularLayer = function() {
  Layer.call( this );
};

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

var LayerType = {
  DEFAULT: 0,
  CIRCULAR: 1
};

var LayerFactory = function() {};

LayerFactory.prototype.createLayer = function( options ) {
  var type = options.type || LayerType.DEFAULT;

  var layer = null;
  switch ( type ) {
    case LayerType.DEFAULT:
      layer = new Layer();
      break;

    case LayerType.CIRCULAR:
      layer = new CircularLayer();
      break;
  }

  layer.setWidth( options.width  || 0 );
  layer.setHeight( options.height || 0 );
  layer.setColor( options.color  || new Color( 0, 0, 0, 1.0 ) );
  layer.setZIndex( options.zIndex || 0 );
  layer.setParallaxFactor( options.parallaxFactor || 1.0 );

  return layer;
};

LayerFactory.prototype.createTerrainLayer = function( options ) {
  var layer = this.createLayer( options );

  var width = layer.getWidth();
  var height = layer.getHeight();
  var color = layer.getColor();

  var maxTerrainHeight = options.maxTerrainHeight || 0;
  var segmentCount = options.segmentCount || 1;
  var segmentWidth = width / segmentCount;
  var points = [];
  // Loops back to the first point, so we don't need extra vertex at end.
  for ( var i = 0; i < segmentCount; i++ ) {
    points.push( Math.random() * maxTerrainHeight );
  }

  var tempPolygonEntity;
  for ( i = 0; i < segmentCount; i++ ) {
    tempPolygonEntity = new PolygonEntity();
    tempPolygonEntity.setX( i * segmentWidth );
    tempPolygonEntity.setColor( color );
    tempPolygonEntity.setVertices([
      0, height,
      0, height - points[i],
      // Extra pixel added to x-coordinate to connect segments.
      segmentWidth + 1, height - points[ ( i + 1 ) % segmentCount ],
      segmentWidth + 1, height
    ]);

    layer.addProp( tempPolygonEntity );
  }

  return layer;
};

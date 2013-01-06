var Entity = function() {
  this._position = {
    x: 0,
    y: 0
  };

  this._velocity = {
    x: 0,
    y: 0
  };

  this._width = 0;
  this._height = 0;

  this._color = new Color();
};

Entity.prototype.getX = function() {
  return this.getPosition().x;
};

Entity.prototype.setX = function( x ) {
  this._position.x = x;
};

Entity.prototype.getY = function() {
  return this.getPosition().y;
};

Entity.prototype.setY = function( y ) {
  this._position.y = y;
};

Entity.prototype.getPosition = function() {
  return this._position;
};

Entity.prototype.setPosition = function() {
  if ( arguments.length === 1 ) {
    this.setX( arguments[0].x );
    this.setY( arguments[0].y );
  }
  else if ( arguments.length === 2 ) {
    this.setX( arguments[0] );
    this.setY( arguments[1] );
  }
};

Entity.prototype.getLeft = function() {
  return this.getX() - this.getHalfWidth();
};

Entity.prototype.setLeft = function( left ) {
  this.setX( left + this.getHalfWidth() );
};

Entity.prototype.getTop = function( top ) {
  return this.getY() - this.getHalfHeight();
};

Entity.prototype.setTop = function( top ) {
  this.setY( top + this.getHalfHeight() );
};

Entity.prototype.getRight = function() {
  return this.getX() + this.getHalfWidth();
};

Entity.prototype.setRight = function( right ) {
  this.setX( right - this.getHalfWidth() );
};

Entity.prototype.getBottom = function() {
  return this.getY() + this.getHalfHeight();
};

Entity.prototype.setBottom = function( bottom ) {
  this.setY( bottom - this.getHalfHeight() );
};

Entity.prototype.setTopLeft = function() {
  if ( arguments.length === 1 ) {
    this.setLeft( arguments[0].x );
    this.setTop( arguments[0].y );
  }
  else if ( arguments.length === 2 ) {
    this.setLeft( arguments[0] );
    this.setTop( arguments[1] );
  }
};

Entity.prototype.getVelocityX = function() {
  return this._velocity.x;
};

Entity.prototype.setVelocityX = function( velocityX ) {
  this._velocity.x = velocityX;
};

Entity.prototype.getVelocityY = function() {
  return this._velocity.y;
};

Entity.prototype.setVelocityY = function( velocityY ) {
  this._velocity.y = velocityY;
};

Entity.prototype.getVelocity = function() {
  return this._velocity;
};

Entity.prototype.setVelocity = function() {
  if ( arguments.length === 1 ) {
    this._velocity = arguments[0];
  }
  else if ( arguments.length === 2 ) {
    this.setVelocityX( arguments[0] );
    this.setVelocityY( arguments[1] );
  }
};

Entity.prototype.getWidth = function() {
  return this._width;
};

Entity.prototype.getHalfWidth = function() {
  return this.getWidth() / 2;
};

Entity.prototype.setWidth = function( width ) {
  this._width = width;
};

Entity.prototype.getHeight = function() {
  return this._height;
};

Entity.prototype.getHalfHeight = function() {
  return this.getHeight() / 2;
};

Entity.prototype.setHeight = function( height ) {
  this._height = height;
};

Entity.prototype.getColor = function() {
  return this._color;
};

Entity.prototype.setColor = function() {
  this.getColor().set.apply( this.getColor(), arguments );
};

Entity.prototype.update = function( elapsedTime ) {
  // this.setVelocityX( this.getVelocityX() * 0.95 );
  // this.setVelocityY( this.getVelocityY() * 0.95 );

  if ( Math.abs( this.getVelocityX() ) < _game.EPSILON ) {
    this.setVelocityX( 0 );
  }
  if ( Math.abs( this.getVelocityY() ) < _game.EPSILON ) {
    this.setVelocityY( 0 );
  }

  this.setX( this.getX() + this.getVelocityX() * elapsedTime );
  this.setY( this.getY() + this.getVelocityY() * elapsedTime );

  // if ( this.getX() - this.getHalfWidth() <= 0 ) {
  //   this.setX( this.getHalfWidth() );
  // }
  // if ( this.getX() + this.getHalfWidth() >= _game.WIDTH ) {
  //   this.setX( _game.WIDTH - this.getHalfWidth() );
  // }
  // if ( this.getY() - this.getHalfHeight() <= 0 ) {
  //   this.setY( this.getHalfHeight() );
  // }
  // if ( this.getY() + this.getHalfHeight() >= _game.HEIGHT ) {
  //   this.setY( _game.HEIGHT - this.getHalfHeight() );
  // }
};

Entity.prototype.draw = function( ctx ) {
  ctx.fillStyle = this.getColor().toString();
  ctx.fillRect(
    this.getX() - this.getHalfWidth(),
    this.getY() - this.getHalfHeight(),
    this.getWidth(),
    this.getHeight()
  );
};

Entity.prototype.hit = function( x, y ) {
  if ( this.contains( x, y ) ) {
    return this;
  }

  return null;
};

Entity.prototype.contains = function( x, y ) {
  return Math.abs( x - this.getX() ) <= this.getHalfWidth() &&
         Math.abs( y - this.getY() ) <= this.getHalfHeight();
};


// Color -----------------------------------------------------------------------
var Color = function() {
  this._red = 0;
  this._green = 0;
  this._blue = 0;
  this._alpha = 0.0;

  if ( arguments.length !== 0 ) {
    this.set.apply( this, arguments );
  }
};

Color.prototype.set = function() {
  if ( arguments.length === 1 ) {
    this.setRed( arguments[0].getRed() );
    this.setGreen( arguments[0].getGreen() );
    this.setBlue( arguments[0].getBlue() );
    this.setAlpha( arguments[0].getAlpha() );
  }
  else if ( arguments.length === 4 ) {
    this.setRed( arguments[0] );
    this.setGreen( arguments[1] );
    this.setBlue( arguments[2] );
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
  return 'rgba( ' + ( ( 0.5 + this.getRed() )   << 0 ) +
         ', '     + ( ( 0.5 + this.getGreen() ) << 0 ) +
         ','      + ( ( 0.5 + this.getBlue() )  << 0 ) +
         ','      + this.getAlpha() + ' )';
};


// PolygonEntity ---------------------------------------------------------------
var PolygonEntity = function() {
  Entity.call( this );

  this._vertices = [];

  this._xmin = Number.MAX_VALUE;
  this._ymin = Number.MAX_VALUE;
  this._xmax = Number.MIN_VALUE;
  this._ymax = Number.MIN_VALUE;
};

PolygonEntity.prototype = new Entity();
PolygonEntity.prototype.constructor = PolygonEntity;

PolygonEntity.prototype.getVertices = function() {
  return this._vertices;
};

PolygonEntity.prototype.setVertices = function( vertices ) {
  this._vertices = vertices;

  var x, y;
  for ( var i = 0, n = this.getVertexCount(); i < n; i++ ) {
    x = this._vertices[ 2 * i ];
    y = this._vertices[ 2 * i + 1 ];

    this._xmin = Math.min( x, this._xmin );
    this._ymin = Math.min( y, this._ymin );
    this._xmax = Math.max( x, this._xmax );
    this._ymax = Math.max( y, this._ymax );
  }
};

PolygonEntity.prototype.getVertexCount = function() {
  return this._vertices.length / 2;
};

PolygonEntity.prototype.draw = function( ctx ) {
  ctx.save();
  ctx.translate( this.getX(), this.getY() );

  ctx.beginPath();
  for ( var i = 0, n = this.getVertexCount(); i < n; i++ ) {
    ctx.lineTo( this._vertices[ 2 * i ],
                this._vertices[ 2 * i + 1 ] );
  }
  ctx.closePath();

  ctx.fillStyle = this.getColor().toString();
  ctx.fill();

  ctx.restore();
};

PolygonEntity.prototype.contains = function( x, y ) {
  x -= this.getX();
  y -= this.getY();

  if ( this._xmin > x || x > this._xmax ||
       this._ymin > y || y > this._ymax ) {
    return false;
  }

  var vertexCount = this.getVertexCount();
  var contains = false;
  var xi, yi, xj, yj;
  for ( var i = 0, j = vertexCount - 1; i < vertexCount; j = i++ ) {
    xi = this._vertices[ 2 * i ];
    yi = this._vertices[ 2 * i + 1 ];
    xj = this._vertices[ 2 * j ];
    yj = this._vertices[ 2 * j + 1 ];

    if ( ( ( yi > y ) !== ( yj > y ) ) &&
         ( x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi ) ) {
      contains = !contains;
    }
  }

  return contains;
};

PolygonEntity.prototype.getWidth = function() {
  return this._xmax - this._xmin;
};

PolygonEntity.prototype.getHeight = function() {
  return this._ymax - this._ymin;
};

PolygonEntity.prototype.getHalfWidth = function() {
  return this.getWidth() / 2;
};

PolygonEntity.prototype.getHalfHeight = function() {
  return this.getHeight() / 2;
};

// SpriteEntity ----------------------------------------------------------------
var SpriteEntity = function() {
  Entity.call( this );

  this._sprite = null;

  this._canvas = document.createElement( 'canvas' );
  this._ctx = this._canvas.getContext( '2d' );
};

SpriteEntity.prototype = new Entity();
SpriteEntity.prototype.constructor = SpriteEntity;

SpriteEntity.prototype.getSprite = function() {
  return this._sprite;
};

SpriteEntity.prototype.setSprite = function( sprite ) {
  this._sprite = sprite;
  this.setWidth( this._sprite.width );
  this.setHeight( this._sprite.height );
  this._ctx.drawImage( this._sprite, 0, 0 );
};

SpriteEntity.prototype.getCanvas = function() {
  return this._canvas;
};

SpriteEntity.prototype.setCanvas = function( canvas ) {
  this._canvas = canvas;
};

SpriteEntity.prototype.setWidth = function( width ) {
  Entity.prototype.setWidth.call( this, width );

  this.getCanvas().width = width;
};

SpriteEntity.prototype.setHeight = function( height ) {
  Entity.prototype.setHeight.call( this, height );

  this.getCanvas().height = height;
};


SpriteEntity.prototype.draw = function( ctx ) {
  ctx.drawImage( this.getCanvas(), this.getX(), this.getY() );
};

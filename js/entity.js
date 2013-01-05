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
  this.setVelocityX( this.getVelocityX() * 0.95 );
  this.setVelocityY( this.getVelocityY() * 0.95 );

  if ( Math.abs( this.getVelocityX() ) < _game.EPSILON ) {
    this.setVelocityX( 0 );
  }
  if ( Math.abs( this.getVelocityY() ) < _game.EPSILON ) {
    this.setVelocityY( 0 );
  }

  this.setX( this.getX() + this.getVelocityX() * elapsedTime );
  this.setY( this.getY() + this.getVelocityY() * elapsedTime );

  if ( this.getX() - this.getHalfWidth() <= 0 ) {
    this.setX( this.getHalfWidth() );
  }
  if ( this.getX() + this.getHalfWidth() >= _game.WIDTH ) {
    this.setX( _game.WIDTH - this.getHalfWidth() );
  }
  if ( this.getY() - this.getHalfHeight() <= 0 ) {
    this.setY( this.getHalfHeight() );
  }
  if ( this.getY() + this.getHalfHeight() >= _game.HEIGHT ) {
    this.setY( _game.HEIGHT - this.getHalfHeight() );
  }
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
  if ( this.isHit( x, y ) ) {
    return this;
  }

  return null;
};

Entity.prototype.isHit = function( x, y ) {
  return Math.abs( x - this.getX() ) <= this.getHalfWidth() &&
         Math.abs( y - this.getY() ) <= this.getHalfHeight();
};


// PolygonEntity ---------------------------------------------------------------
var PolygonEntity = function() {
  Entity.call( this );

  this._vertices = [];
};

PolygonEntity.prototype = new Entity();
PolygonEntity.prototype.constructor = PolygonEntity;

PolygonEntity.prototype.getVertices = function() {
  return this._vertices;
};

PolygonEntity.prototype.setVertices = function( vertices ) {
  this._vertices = vertices;
};

PolygonEntity.prototype.draw = function( ctx ) {
  ctx.save();

  ctx.translate( this.getX(), this.getY() );

  ctx.beginPath();
  for ( var i = 0; i < this._vertices.length; i++ ) {
    ctx.lineTo( this._vertices[i].x, this._vertices[i].y );
  }
  ctx.closePath();

  ctx.fillStyle = this.getColor().toString();
  ctx.fill();

  ctx.restore();
};

// SpriteEntity ----------------------------------------------------------------
var SpriteEntity = function() {

};

var Color = function() {
  this._red = 0;
  this._green = 0;
  this._blue = 0;
  this._alpha = 0.0;

  if ( arguments.length !== 0 ) {
    this.set.apply( this, arguments );
  }
}

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
}

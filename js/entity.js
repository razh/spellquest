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

  this._color = {
    red:   0,
    green: 0,
    blue:  0,
    alpha: 0
  };
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
  if ( arguments.length === 1 ) {
    this._color = arguments[0];
  }
  else if ( arguments.length === 4 ) {
    this.setRed( arguments[0] );
    this.setGreen( arguments[1] );
    this.setBlue( arguments[2] );
    this.setAlpha( arguments[3] );
  }
};

Entity.prototype.getRed = function() {
  return this.getColor().red;
};

Entity.prototype.setRed = function( red ) {
  this._color.red = red;
};

Entity.prototype.getGreen = function() {
  return this.getColor().green;
};

Entity.prototype.setGreen = function( green ) {
  this._color.green = green;
};

Entity.prototype.getBlue = function() {
  return this.getColor().blue;
};

Entity.prototype.setBlue = function( blue ) {
  this._color.blue = blue;
};

Entity.prototype.getAlpha = function() {
  return this.getColor().alpha;
};

Entity.prototype.setAlpha = function( alpha ) {
  this._color.alpha = alpha;
};

Entity.prototype.update = function( elapsedTime ) {
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
  ctx.fillStyle = 'rgba( ' + ( ( 0.5 + this.getRed() )   << 0 ) +
                  ', '     + ( ( 0.5 + this.getGreen() ) << 0 ) +
                  ','      + ( ( 0.5 + this.getBlue() )  << 0 ) +
                  ','      + this.getAlpha() + ' )';
  ctx.fillRect(
    this.getX() - this.getHalfWidth(),
    this.getY() - this.getHalfHeight(),
    this.getWidth(),
    this.getHeight()
  );
};

Entity.prototype.hit = function( x, y ) {
  x -= this.getX();
  y -= this.getY();

  if ( ( Math.abs( x ) <= this.getHalfWidth() ) &&
       ( Math.abs( y ) <= this.getHalfHeight() ) ) {
    return this;
  }

  return null;
};

var Letter = function() {
  Entity.call( this );

  this._char = ' ';

  this._textColor = {
    red:   0,
    green: 0,
    blue:  0,
    alpha: 0.0
  };
};

Letter.prototype = new Entity();
Letter.prototype.constructor = Letter;

Letter.prototype.setPosition = function( x, y ) {
  Entity.prototype.setPosition.call( this, x, y );

  if ( _game !== undefined && _game !== null ) {
    for ( var i = _game._entities.length - 1; i >= 0; i-- ) {
      if ( _game._entities[i] instanceof Form ) {
        if ( _game._entities[i].hit( this.getX(), this.getY() ) !== null ) {
          this.setX( _game._entities[i].getX() );
          this.setY( _game._entities[i].getY() );
        }
      }
    }
  }
};

Letter.prototype.draw = function( ctx ) {
  Entity.prototype.draw.call( this, ctx );

  ctx.font = "20pt Helvetica";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba( ' + ( ( 0.5 + this.getTextRed() )   << 0 ) +
                  ', '     + ( ( 0.5 + this.getTextGreen() ) << 0 ) +
                  ','      + ( ( 0.5 + this.getTextBlue() )  << 0 ) +
                  ','      + this.getTextAlpha() + ' )';

  ctx.fillText( this.getChar(), this.getX(), this.getY() );
};

Letter.prototype.getChar = function() {
  return this._char;
};

Letter.prototype.setChar = function( char ) {
  this._char = char;
};


Letter.prototype.getTextColor = function() {
  return this._textColor;
};

Letter.prototype.setTextColor = function() {
  if ( arguments.length === 1 ) {
    this._textColor = arguments[0];
  }
  else if ( arguments.length === 4 ) {
    this.setTextRed( arguments[0] );
    this.setTextGreen( arguments[1] );
    this.setTextBlue( arguments[2] );
    this.setTextAlpha( arguments[3] );
  }
};

Letter.prototype.getTextRed = function() {
  return this.getTextColor().red;
};

Letter.prototype.setTextRed = function( red ) {
  this._textColor.red = red;
};

Letter.prototype.getTextGreen = function() {
  return this.getTextColor().green;
};

Letter.prototype.setTextGreen = function( green ) {
  this._textColor.green = green;
};

Letter.prototype.getTextBlue = function() {
  return this.getTextColor().blue;
};

Letter.prototype.setTextBlue = function( blue ) {
  this._textColor.blue = blue;
};

Letter.prototype.getTextAlpha = function() {
  return this.getTextColor().alpha;
};

Letter.prototype.setTextAlpha = function( alpha ) {
  this._textColor.alpha = alpha;
};

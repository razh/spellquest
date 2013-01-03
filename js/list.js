var List = function() {
  Entity.call( this );

  this._words = [];

  this._horizontalSpacing = 0;
  this._verticalSpacing = 0;

  this._lineWidth = 1;

  this._backgroundColor = new Color();
  this._textColor = new Color();
};

List.prototype = new Entity();
List.prototype.constructor = List;

List.prototype.getWords = function() {
  return this._words;
};

List.prototype.setWords = function( words ) {
  this._words = words;
};

List.prototype.getHorizontalSpacing = function() {
  return this._horizontalSpacing;
};

List.prototype.setHorizontalSpacing = function( horizontalSpacing ) {
  this._horizontalSpacing = horizontalSpacing;
};

List.prototype.getVerticalSpacing = function() {
  return this._verticalSpacing;
};

List.prototype.setVerticalSpacing = function( verticalSpacing ) {
  this._verticalSpacing = verticalSpacing;
};

List.prototype.getLineWidth = function() {
  return this._lineWidth;
};

List.prototype.setLineWidth = function( lineWidth ) {
  this._lineWidth = lineWidth;
};

List.prototype.getBackgroundColor = function() {
  return this._backgroundColor;
};

List.prototype.setBackgroundColor = function( backgroundColor ) {
  if ( arguments.length === 1 ) {
    this.getBackgroundColor().set( arguments[0] );
  } else if ( arguments.length === 4 ) {
    this.getBackgroundColor().set( arguments[0], arguments[1], arguments[2], arguments[3] );
  }
};

List.prototype.getTextColor = function() {
  return this._textColor;
};

List.prototype.setTextColor = function( TextColor ) {
  if ( arguments.length === 1 ) {
    this.getTextColor().set( arguments[0] );
  } else if ( arguments.length === 4 ) {
    this.getTextColor().set( arguments[0], arguments[1], arguments[2], arguments[3] );
  }
};

List.prototype.draw = function( ctx ) {
  this.drawSpaces( ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5 );
};

List.prototype.drawSpaces = function( ctx, x, y, width, height, letterCount ) {
  ctx.lineWidth = this.getLineWidth();
  ctx.strokeStyle = 'rgba( ' + ( ( 0.5 + this.getColor().getRed() )   << 0 ) +
                    ', '     + ( ( 0.5 + this.getColor().getGreen() ) << 0 ) +
                    ','      + ( ( 0.5 + this.getColor().getBlue() )  << 0 ) +
                    ','      + this.getColor().getAlpha() + ' )';

  ctx.strokeRect( x, y, width * letterCount, height );

  ctx.beginPath();
  for ( var i = 1; i < letterCount; i++ ) {
    ctx.moveTo( x + i * width, y );
    ctx.lineTo( x + i * width, y + height );
  }
  ctx.closePath();

  ctx.stroke();
};

var List = function() {
  Entity.call( this );

  this._words = [];
  // Whether or not the player has found the word.
  this._wasFound = [];

  this._horizontalSpacing = 0;
  this._verticalSpacing = 0;
  this._padding = 0;

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
  for ( var i = 0; i < this.getWords().length; i++ ) {
    this._wasFound.push( false );
  }
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
  this.getBackgroundColor().set.apply( this.getBackgroundColor(), arguments );
};

List.prototype.getTextColor = function() {
  return this._textColor;
};

List.prototype.setTextColor = function( TextColor ) {
  this.getTextColor().set.apply( this.getTextColor(), arguments );
};

List.prototype.isWord = function( word ) {
  return this.getWords().lastIndexOf( word ) !== -1;
};

List.prototype.wasWordFound = function( word ) {
  var index = this.getWords().lastIndexOf( word );
  return index === -1 && this._wasFound[ index ];
};

List.prototype.markWord = function( ctx, word ) {
  var index = this.getWords().lastIndexOf( word );
  if ( index !== -1 && !this._wasFound[ index ] ) {
    this._wasFound[ index ] = true;

    var letterCount = word.length;
    ctx.fillStyle = this.getBackgroundColor().toString();

    ctx.fillRect( this.getX(), this.getY() + index * this.getHeight(), this.getWidth() * letterCount, this.getHeight() );

    ctx.font = '9pt Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.getTextColor().toString();

    var yPos = this.getY() + index * this.getHeight() + this.getHalfHeight();
    for ( var i = 0; i < letterCount; i++ ) {
      ctx.fillText( word[i], this.getX() + i * this.getWidth() + this.getHalfWidth(), yPos );
    }
  }
};

List.prototype.draw = function( ctx ) {
  var x = this.getX();
  var y = this.getY();
  var width = this.getWidth();
  var height = this.getHeight();

  var letterCount = 0;
  for ( var i = 0; i < this._words.length; i++ ) {
    letterCount = this._words[i].length;
    this.drawWordSpace( ctx, x, y + i * height, width, height, letterCount );
  }
};

List.prototype.drawWordSpace = function( ctx, x, y, width, height, letterCount ) {
  ctx.lineWidth = this.getLineWidth();
  ctx.strokeStyle = this.getColor().toString();

  ctx.strokeRect( x, y, width * letterCount, height );

  ctx.beginPath();
  for ( var i = 1; i < letterCount; i++ ) {
    ctx.moveTo( x + i * width, y );
    ctx.lineTo( x + i * width, y + height );
  }
  ctx.closePath();

  ctx.stroke();
};

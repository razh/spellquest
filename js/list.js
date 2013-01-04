var List = function() {
  Entity.call( this );

  this._words = [];
  // Where the words are drawn.
  this._wordPositions = [];
  // Whether or not the player has found the word.
  this._wasFound = [];

  this._horizontalSpacing = 0;
  this._verticalSpacing = 0;
  this._padding = 0;
  this._maxHeight = 0;

  this._lineWidth = 1;

  this._backgroundColor = new Color();
  this._textColor = new Color();

  this._fontSize = 12;
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

  this.calculateWordPositions( this.getMaxHeight() );
};

List.prototype.clear = function() {
  this._words = [];
  this._wasFound = [];
  this._wordPositions = [];
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

List.prototype.getPadding = function() {
  return this._padding;
};

List.prototype.setPadding = function( padding ) {
  this._padding = padding;
};

List.prototype.getMaxHeight = function() {
  return this._maxHeight;
};

List.prototype.setMaxHeight = function( maxHeight ) {
  this._maxHeight = maxHeight;
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

List.prototype.getFontSize = function() {
  return this._fontSize;
};

List.prototype.setFontSize = function( fontSize ) {
  this._fontSize = fontSize;
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
    var x = this._wordPositions[ index ].x;
    var y = this._wordPositions[ index ].y;
    var letterCount = word.length;

    ctx.fillStyle = this.getBackgroundColor().toString();
    ctx.fillRect( x, y, this.getWidth() * letterCount, this.getHeight() );

    ctx.font = this.getFontSize() + 'pt Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.getTextColor().toString();

    var yPos = y + this.getHalfHeight();
    for ( var i = 0; i < letterCount; i++ ) {
      ctx.fillText( word[i], x + i * this.getWidth() + this.getHalfWidth(), yPos );
    }

    this._wasFound[ index ] = true;
  }
};

List.prototype.calculateWordPositions = function( maxHeight ) {
  var x = this.getX();
  var y = this.getY();
  var width = this.getWidth();
  var height = this.getHeight();
  var padding = this.getPadding();
  var horizontalSpacing = this.getHorizontalSpacing();

  var xPos = 0;
  var yPos = 0;
  for ( var i = 0; i < this._words.length; i++ ) {
    this._wordPositions[i] = {
      x: x + xPos,
      y: y + yPos
    };

    yPos += height;

    if ( y + yPos + padding > maxHeight ) {
      xPos += this._words[i].length * width + horizontalSpacing;
      yPos = 0;
    }
  }
};

List.prototype.draw = function( ctx ) {
  var width = this.getWidth();
  var height = this.getHeight();

  for ( var i = 0; i < this._words.length; i++ ) {
    this.drawWordSpace( ctx, this._wordPositions[i].x, this._wordPositions[i].y, width, height, this._words[i].length );
  }
};

List.prototype.drawWordSpace = function( ctx, x, y, width, height, letterCount ) {
  ctx.lineWidth = this.getLineWidth();
  ctx.strokeStyle = this.getColor().toString();

  // ctx.strokeRect( x, y, width * letterCount, height );
  roundRect( ctx, x, y, width * letterCount, height, 3, false, true );

  ctx.beginPath();
  for ( var i = 1; i < letterCount; i++ ) {
    ctx.moveTo( x + i * width, y );
    ctx.lineTo( x + i * width, y + height );
  }
  ctx.closePath();

  ctx.stroke();
};

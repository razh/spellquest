define([
  'color',
  'entities/entity',
  'round-rectangle'
], function( Color, Entity, RoundRectangle ) {
  'use strict';

  var roundRect = RoundRectangle.roundRect;

  function List() {
    Entity.call( this );

    this._words = [];
    // Where the words are drawn.
    this._wordPositions = [];
    // Whether or not the player has found the word.
    this._wasFound = [];

    // Spacing between columns.
    this._horizontalSpacing = 0;
    // Spacing between words in a column.
    this._verticalSpacing = 0;
    // Spacing from the maxHeight.
    this._padding = 0;
    // Maximum width. Must call resizeToFit() after setting this.
    this._maxWidth = 0;
    this._maxHeight = 0;

    this._lineWidth = 1;

    this._backgroundColor = new Color();
    this._textColor = new Color();

    this._fontSize = 12;
  }

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

    this.calculateWordPositions();
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

  List.prototype.getMaxWidth = function() {
    return this._maxWidth;
  };

  List.prototype.setMaxWidth = function( maxWidth ) {
    this._maxWidth = maxWidth;
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

  List.prototype.setBackgroundColor = function() {
    this.getBackgroundColor().set.apply( this.getBackgroundColor(), arguments );
  };

  List.prototype.getTextColor = function() {
    return this._textColor;
  };

  List.prototype.setTextColor = function() {
    this.getTextColor().set.apply( this.getTextColor(), arguments );
  };

  List.prototype.getFontSize = function() {
    return this._fontSize;
  };

  List.prototype.setFontSize = function( fontSize ) {
    this._fontSize = fontSize;
  };

  List.prototype.getLeft = function() {
    return this.getX();
  };

  List.prototype.setLeft = function( left ) {
    this.setX( left );
  };

  List.prototype.getTop = function() {
    return this.getY();
  };

  List.prototype.setTop = function( top ) {
    this.setY( top );
  };

  List.prototype.getRight = function() {
    var index = this._words.length - 1;
    var lastPosition = this._wordPositions[ index ];
    return lastPosition.x + this._words[ index ].length * this.getWidth();
  };

  List.prototype.getBottom = function() {
    var ymax = 0;
    for ( var i = 0; i < this._wordPositions.length; i++ ) {
      ymax = Math.max( this._wordPositions[i].y, ymax );
    }

    return ymax + this.getHeight();
  };

  List.prototype.isWord = function( word ) {
    return this.getWords().lastIndexOf( word ) !== -1;
  };

  List.prototype.wasWordFound = function( word ) {
    var index = this.getWords().lastIndexOf( word );
    return index !== -1 && this._wasFound[ index ];
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
        ctx.fillText( word[i].toUpperCase(), x + i * this.getWidth() + this.getHalfWidth(), yPos );
      }

      this._wasFound[ index ] = true;
    }
  };

  // Resize to fit inside maxWidth.
  List.prototype.resizeToFit = function() {
    if ( this.getRight() - this.getX() < this.getMaxWidth() ) {
      return;
    }

    var x = this.getX();
    var y = this.getY();
    var height = this.getHeight();
    var padding = this.getPadding();
    var maxHeight = this.getMaxHeight();

    // How wide the list is in terms of letters (not including padding).
    var letterCount = 0;
    // Number of spaces between the word columns.
    var spaceCount = 0;
    // Loop through word positions, finding the total width of the word spaces.
    for ( var i = 0, n = this._wordPositions.length; i < n; i++ ) {
      y = this._wordPositions[i].y + height;

      // If we've gone past the desired height and not the last word (so below works).
      if ( y + padding > maxHeight && i !== n ) {
        letterCount += this._words[i].length;
        spaceCount++;

        y = this.getY();
      }
    }

    // Add length of last word.
    letterCount += this._words[ this._words.length - 1 ].length;

    var wordWidth = letterCount * this.getWidth();
    var spaceWidth = spaceCount * this.getHorizontalSpacing();
    var totalWidth = wordWidth + spaceWidth;

    var letterWidthRatio = ( wordWidth / totalWidth ) / letterCount;
    var spaceWidthRatio = ( spaceWidth / totalWidth ) / spaceCount;

    this.setWidth( letterWidthRatio * this.getMaxWidth() );
    this.setHeight( this.getWidth() );
    this.setHorizontalSpacing( spaceWidthRatio * this.getMaxWidth() );

    this.calculateWordPositions();
  };

  List.prototype.calculateWordPositions = function() {
    var x = this.getX();
    var y = this.getY();
    var width = this.getWidth();
    var height = this.getHeight();
    var padding = this.getPadding();
    var horizontalSpacing = this.getHorizontalSpacing();
    var maxHeight = this.getMaxHeight();

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

  return List;
});

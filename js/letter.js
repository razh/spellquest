var Letter = function() {
  Entity.call( this );

  this._char = ' ';
  this._fontSize = 12;

  this._textColor = new Color();

};

Letter.prototype = new Entity();
Letter.prototype.constructor = Letter;

Letter.prototype.update = function( x, y ) {
  Entity.prototype.update.call( this, x, y );

  // TODO: This should be removed at some point.
//   if ( _game !== undefined && _game !== null ) {
//     // Snap letter to form element.
//     var formElements = _game.getForm().getFormElements();
//     for ( var i = formElements.length - 1; i >= 0; i-- ) {
//       if ( formElements[i].hit( this.getX(), this.getY() ) !== null ) {
//         this.setPosition( formElements[i].getPosition() );
//         this.setVelocity( 0, 0 );
//         formElements[i].setLetter( this );

//         // Set it to used.
//         var index = _game.getPool()._letterEntities.lastIndexOf( this );
//         if ( index !== -1 ) {
//           _game.getPool()._isUsed[ index ] = true;
//         }

//         break;
//       }
//     }
//   }
};

Letter.prototype.draw = function( ctx ) {
  Entity.prototype.draw.call( this, ctx );

  ctx.font = this.getFontSize() + 'pt Helvetica';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = this.getTextColor().toString();

  ctx.fillText( this.getChar(), this.getX(), this.getY() );
};

Letter.prototype.getChar = function() {
  return this._char;
};

Letter.prototype.setChar = function( char ) {
  this._char = char;
};

Letter.prototype.getFontSize = function() {
  return this._fontSize;
};

Letter.prototype.setFontSize = function( fontSize ) {
  this._fontSize = fontSize;
};

Letter.prototype.getTextColor = function() {
  return this._textColor;
};

Letter.prototype.setTextColor = function() {
  this.getTextColor().set.apply( this.getTextColor(), arguments );
};

Letter.prototype.getTextRed = function() {
  return this.getTextColor().getRed();
};

Letter.prototype.setTextRed = function( red ) {
  this.getTextColor().setRed( red );
};

Letter.prototype.getTextGreen = function() {
  return this.getTextColor().getGreen();
};

Letter.prototype.setTextGreen = function( green ) {
  this.getTextColor().setGreen( green );
};

Letter.prototype.getTextBlue = function() {
  return this.getTextColor().getBlue();
};

Letter.prototype.setTextBlue = function( blue ) {
  this.getTextColor().setBlue( blue );
};

Letter.prototype.getTextAlpha = function() {
  return this.getTextColor().getAlpha();
};

Letter.prototype.setTextAlpha = function( alpha ) {
  this.getTextColor().setAlpha( alpha );
};

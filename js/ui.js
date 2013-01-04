/*
  UI is a collection of buttons.
*/
var UI = function() {
  this._buttons = [];
};

UI.prototype.draw = function( ctx ) {
  for ( var i = 0; i < this._buttons.length; i++ ) {
    this._buttons[i].draw( ctx );
  }
};

UI.prototype.click = function( x, y ) {
  for ( var i = 0; i < this._buttons.length; i++ ) {
    this._buttons[i].click( x, y );
  }
};

UI.prototype.getButtons = function() {
  return this._buttons;
};

UI.prototype.addButton = function( button ) {
  this._buttons.push( button );
};

UI.prototype.clear = function() {
  this._buttons = [];
};


// Button.
var Button = function() {
  Entity.call( this );

  this._text = '';
  this._fontSize = 12;

  this._onClick = [];
};

Button.prototype = new Entity();
Button.prototype.constructor = Button;

Button.prototype.getText = function() {
  return this._text;
};

Button.prototype.setText = function( text ) {
  this._text = text;
};

Button.prototype.getFontSize = function() {
  return this._fontSize;
};

Button.prototype.setFontSize = function( fontSize ) {
  this._fontSize = fontSize;
};

Button.prototype.click = function( x, y ) {
  if ( this.isHit( x, y ) ) {
    for ( var i = 0; i < this._onClick.length; i++ ) {
      this._onClick[i].call( this, x, y );
    }
  }
};

Button.prototype.addOnClick = function( func ) {
  this._onClick.push( func );
};

Button.prototype.draw = function( ctx ) {
  Entity.prototype.draw.call( this, ctx );
};

var ButtonFactory = function() {
  this._buttonClass = Button;
};

var ButtonType = {
  DEFAULT: 0,
  SUBMIT: 1,
  RESET: 2,
  SHUFFLE: 3
};

ButtonFactory.prototype.createButton = function( buttonType ) {
  switch ( buttonType ) {
    case ButtonType.DEFAULT:
      this.setButtonClass( Button );
      break;
    case ButtonType.SUBMIT:
      this.setButtonClass( SubmitButton );
      break;
    case ButtonType.RESET:
      this.setButtonClass( ResetButton );
      break;
    case ButtonType.SHUFFLE:
      this.setButtonClass( ShuffleButton );
      break;
  }

  return new this.getButtonClass();
};

ButtonFactory.prototype.getButtonClass = function() {
  return this._buttonClass;
};

ButtonFactory.prototype.setButtonClass = function( buttonClass ) {
  this._buttonClass = buttonClass;
};

// Gets new word.
var ResetButton = function() {
  Button.call( this );

  this.addOnClick(function() {
    _game.reset();
  });

  this.setText( 'reset' );
};

ResetButton.prototype = new Button();
ResetButton.prototype.constructor = ResetButton;

// Shuffle letters.
var ShuffleButton = function() {
  Button.call( this );

  this.addOnClick(function() {
    _game.getPool().shuffle();
  });

  this.setText( 'shuffle' );
};

ShuffleButton.prototype = new Button();
ShuffleButton.prototype.constructor = ShuffleButton;

// Submit word.
var SubmitButton = function() {
  Button.call( this );

  this.addOnClick(function() {

  })
};

SubmitButton.prototype = new Button();
SubmitButton.prototype.constructor = SubmitButton;

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
  this._textColor = new Color();
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

Button.prototype.getTextColor = function() {
  return this._textColor;
};

Button.prototype.setTextColor = function() {
  this.getTextColor().set.apply( this.getTextColor(), arguments );
};

Button.prototype.getFontSize = function() {
  return this._fontSize;
};

Button.prototype.setFontSize = function( fontSize ) {
  this._fontSize = fontSize;
};

Button.prototype.click = function( x, y ) {
  if ( this.contains( x, y ) ) {
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

  ctx.font = this.getFontSize() + 'pt Helvetica';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = this.getTextColor().toString();

  ctx.fillText( this.getText(), this.getX(), this.getY() );
};

var ButtonFactory = function() {};

var ButtonType = {
  DEFAULT: 0,
  SUBMIT: 1,
  RESET: 2,
  SHUFFLE: 3,
  BACKSPACE: 4
};

ButtonFactory.prototype.createButton = function( buttonType ) {
  var button = new Button();

  switch ( buttonType ) {
    case ButtonType.DEFAULT:
      break;

    case ButtonType.SUBMIT:
      button.addOnClick(function() {
        var word = _game.getForm().getWord().toLowerCase();
        if ( _game.getList().isWord( word ) ) {
          _game.getList().markWord( _game._backgroundCtx, word );
        }
        _game.getPool().reset();
      });

      button.setText( 'submit' );
      break;

    case ButtonType.RESET:
    console.log( "RESET" );
      button.addOnClick(function() {
        _game.reset();
      });

      button.setText( 'reset' );
      break;

    case ButtonType.SHUFFLE:
      button.addOnClick(function() {
        _game.getPool().shuffle();
      });

      button.setText( 'shuffle' );
      break;

    case ButtonType.BACKSPACE:
      button.addOnClick(function() {
        var form = _game.getForm();
        if ( form.getWord().length !== 0 ) {
          _game.getPool().pushLetter( form.getLastLetter() );
        }
      });

      button.setText( '\u2190' );
      break;
  }

  return button;
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
    var word = _game.getForm().getWord().toLowerCase();
    if ( _game.getList().isWord( word ) ) {
      _game.getList().markWord( _game._backgroundCtx, word );
    }
    _game.getPool().reset();
  });

  this.setText( 'submit' );
};

SubmitButton.prototype = new Button();
SubmitButton.prototype.constructor = SubmitButton;

// Deletes right-most character from form.
var BackspaceButton = function() {
  Button.call( this );

  this.addOnClick(function() {
    var form = _game.getForm();
    if ( form.getWord().length !== 0 ) {
      _game.getPool().pushLetter( form.getLastLetter() );
    }
  });

  this.setText( '\u2190' );
};

BackspaceButton.prototype = new Button();
BackspaceButton.prototype.constructor = BackspaceButton;

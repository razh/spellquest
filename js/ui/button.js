define([
  'color',
  'entities/entity'
], function( Color, Entity ) {
  'use strict';

  function Button() {
    Entity.call( this );

    this._text      = '';
    this._textColor = new Color();
    this._fontSize  = 12;

    this._onClick = [];
  }

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

  Button.prototype.click = function( game, x, y ) {
    if ( this.contains( x, y ) ) {
      var that = this;
      this._onClick.forEach(function( fn ) {
        fn.call( that, game, x, y );
      });
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

  Button.Type = {
    DEFAULT:   0,
    SUBMIT:    1,
    RESET:     2,
    SHUFFLE:   3,
    BACKSPACE: 4
  };

  return Button;
});

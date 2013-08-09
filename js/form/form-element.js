define([
  'spellquest',
  'entities/entity',
  'round-rectangle'
], function( Game, Entity, RoundRectangle ) {
  'use strict';

  var roundRectCentered = RoundRectangle.roundRectCentered;

  function FormElement() {
    Entity.call( this );

    this._letter    = null;
    this._lineWidth = 0;
  }

  FormElement.prototype = new Entity();
  FormElement.prototype.constructor = FormElement;

  FormElement.prototype.setLetter = function( letter ) {
    this._letter = letter;
  };

  FormElement.prototype.getLetter = function() {
    return this._letter;
  };

  FormElement.prototype.hasLetter = function() {
    return this._letter !== null;
  };

  FormElement.prototype.getLineWidth = function() {
    return this._lineWidth;
  };

  FormElement.prototype.setLineWidth = function( lineWidth ) {
    this._lineWidth = lineWidth;
  };

  FormElement.prototype.draw = function( ctx ) {
    ctx.lineWidth = this.getLineWidth();
    ctx.strokeStyle = this.getColor().toString();
    roundRectCentered( ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5, false, true );
  };

  return FormElement;
});

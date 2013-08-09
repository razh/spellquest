define(function() {
  'use strict';

  function UI() {
    this._buttons = [];
  }

  UI.prototype.draw = function( ctx ) {
    this._buttons.forEach(function( button ) {
      button.draw( ctx );
    });
  };

  UI.prototype.click = function( game, x, y ) {
    this._buttons.forEach(function( button ) {
      button.click( game, x, y );
    });
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

  return UI;
});

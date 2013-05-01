define(
  function() {
    'use strict';

    function UI() {
      this._buttons = [];
    }

    UI.prototype.draw = function( ctx ) {
      for ( var i = 0; i < this._buttons.length; i++ ) {
        this._buttons[i].draw( ctx );
      }
    };

    UI.prototype.click = function( game, x, y ) {
      for ( var i = 0; i < this._buttons.length; i++ ) {
        this._buttons[i].click( game, x, y );
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

    return UI;
  }
);

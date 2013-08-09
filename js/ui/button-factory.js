define([
  'spellquest',
  'ui/button',
], function( Game, Button ) {
  'use strict';

  return {
    createSubmitButton: function() {
      var button = new Button();

      button.addOnClick(function( game ) {
        game.submit();
      });

      button.setText( 'submit' );

      return button;
    },

    createResetButton: function() {
      var button = new Button();

      button.addOnClick(function( game ) {
        game.reset();
      });

      button.setText( 'reset' );

      return button;
    },

    createShuffleButton: function() {
      var button = new Button();

      button.addOnClick(function( game ) {
        game.getPool().shuffle();
      });

      button.setText( 'shuffle' );

      return button;
    },

    createBackspaceButton: function() {
      var button = new Button();

      button.addOnClick(function( game ) {
        game.backspace();
      });

      button.setText( '\u2190' );

      return button;
    },

    createButton: function( buttonType ) {
      switch ( buttonType ) {
        case Button.Type.DEFAULT:
          return new Button();

        case Button.Type.SUBMIT:
          return this.createSubmitButton();

        case Button.Type.RESET:
          return this.createResetButton();

        case Button.Type.SHUFFLE:
          return this.createShuffleButton();

        case Button.Type.BACKSPACE:
          return this.createBackspaceButton();
      }
    }
  };
});

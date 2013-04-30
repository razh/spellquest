define(
  [ 'spellquest', './button', './button-type' ],
  function( Game, Button, ButtonType ) {
    return {
      createSubmitButton: function() {
        var button = new Button();

        button.addOnClick(function( game ) {
          var word = game.getForm().getWord().toLowerCase();
          if ( game.getList().isWord( word ) ) {
            game.getList().markWord( game._backgroundCtx, word );
          }
          game.getPool().reset();
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
          var form = game.getForm();
          if ( form.getWord().length !== 0 ) {
            game.getPool().pushLetter( form.getLastLetter() );
          }
        });

        button.setText( '\u2190' );

        return button;
      },

      createButton: function( buttonType ) {
        switch ( buttonType ) {
          case ButtonType.DEFAULT:
            return new Button();

          case ButtonType.SUBMIT:
            return this.createSubmitButton();

          case ButtonType.RESET:
            return this.createResetButton();

          case ButtonType.SHUFFLE:
            return this.createShuffleButton();

          case ButtonType.BACKSPACE:
            return this.createBackspaceButton();
        }
      }
    };
  }
);

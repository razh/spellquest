define(
  [ 'spellquest', './button', './button-type' ],
  function( Game, Button, ButtonType ) {
    return {
      createSubmitButton: function() {
        var button = new Button();

        button.addOnClick(function() {
          var word = Game.instance.getForm().getWord().toLowerCase();
          if ( Game.instance.getList().isWord( word ) ) {
            Game.instance.getList().markWord( Game.instance._backgroundCtx, word );
          }
          Game.instance.getPool().reset();
        });

        button.setText( 'submit' );

        return button;
      },

      createResetButton: function() {
        var button = new Button();

        button.addOnClick(function() {
          Game.instance.reset();
        });

        button.setText( 'reset' );

        return button;
      },

      createShuffleButton: function() {
        var button = new Button();

        button.addOnClick(function() {
          Game.instance.getPool().shuffle();
        });

        button.setText( 'shuffle' );

        return button;
      },

      createBackspaceButton: function() {
        var button = new Button();

        button.addOnClick(function() {
          var form = Game.instance.getForm();
          if ( form.getWord().length !== 0 ) {
            Game.instance.getPool().pushLetter( form.getLastLetter() );
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

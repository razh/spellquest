define(
  [ './button', './button-type' ],
  function( Button, ButtonType ) {
    function ButtonFactory() {}

    ButtonFactory.prototype.createSubmitButton = function() {
      var button = new Button();

      button.addOnClick(function() {
        var word = _game.getForm().getWord().toLowerCase();
        if ( _game.getList().isWord( word ) ) {
          _game.getList().markWord( _game._backgroundCtx, word );
        }
        _game.getPool().reset();
      });

      button.setText( 'submit' );

      return button;
    };

    ButtonFactory.prototype.createResetButton = function() {
      var button = new Button();

      button.addOnClick(function() {
        _game.reset();
      });

      button.setText( 'reset' );

      return button;
    };

    ButtonFactory.prototype.createShuffleButton = function() {
      var button = new Button();

      button.addOnClick(function() {
        _game.getPool().shuffle();
      });

      button.setText( 'shuffle' );

      return button;
    };

    ButtonFactory.prototype.createBackspaceButton = function() {
      var button = new Button();

      button.addOnClick(function() {
        var form = _game.getForm();
        if ( form.getWord().length !== 0 ) {
          _game.getPool().pushLetter( form.getLastLetter() );
        }
      });

      button.setText( '\u2190' );

      return button;
    };

    ButtonFactory.prototype.createButton = function( buttonType ) {
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
    };

    return ButtonFactory;
  }
);

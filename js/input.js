define(
  [ 'spellquest' ],
  function( Game ) {
    // Keep track of last three positions.
    var lastPositions = [];

    function inputDown( input ) {
      // console.log( 'down' );
      // Game.instance._backgroundCtx.fillRect( input.x, input.y, 5, 5 );
      var game = Game.getInstance();

      game.getPlayer().setSelected( game.hit( input.x, input.y ) );

      var selected = game.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
        selected.setVelocity( 0, 0 );
      } else {
        game.getUI().click( game, input.x, input.y );
      }
    }

    function inputMove( input ) {
      var game = Game.getInstance();

      // console.log( 'move' );
      while ( lastPositions.length > 1 ) {
        lastPositions.shift();
      }

      lastPositions.push( input );
      // console.log( input.x + ", " + input.y );

      var selected = game.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
      }
    }

    function inputUp( input ) {
      var game = Game.getInstance();

      // console.log( 'up' );
      var selected = game.getPlayer().getSelected();
      if ( selected !== null ) {
        // var dx = lastPositions[1].x - lastPositions[0].x,
        //     dy = lastPositions[1].y - lastPositions[0].y;

        // selected.setVelocity( dx / 50, dy / 50 );

        // TODO: Awful feel.
        // console.log( lastPositions[1].x + ", " + lastPositions[0].x)
        // console.log( dx + ", " +dy)
        // if ( ( dx * dx + dy * dy ) < 400 ) {
        var pool = game.getPool();
        var index = pool._letterEntities.lastIndexOf( selected );
        if ( !pool._isUsed[ index ] ) {
          var formElement = game.getForm().getFirstEmptyFormElement( selected );
          if ( formElement !== null ) {
            selected.setPosition( formElement.getPosition() );
          }
        } else {
          pool.pushLetter( selected );
        }

        // console.log( lastPositions );
        // console.log( dx + ", " + dy );
        // console.log( selected.getVelocity() );
        game.getPlayer().setSelected( null );
      }
    }

    function transformCoords( x, y ) {
      var game = Game.getInstance();

      return {
        x: x - game._canvas.offsetLeft,
        y: y - game._canvas.offsetTop
      };
    }

    function onKeyDown( event ) {
      var game = Game.getInstance();

      // ESC.
      if ( event.keyCode === 27 ) {
        game.stop();
        return;
      }

      if ( 65 <= event.keyCode && event.keyCode <= 90 ) {
        // console.log( String.fromCharCode( event.keyCode ) );
        var letter = game.getPool().getLetterByChar( String.fromCharCode( event.keyCode ) );
        if ( letter !== null ) {
          var currFormElement = game.getForm().getFirstEmptyFormElement();
          if ( currFormElement !== null ) {
            letter.setPosition( currFormElement.getPosition() );
            currFormElement.setLetter( letter );
          }
         }
      }

      else {
        console.log( event.keyCode );
        switch ( event.keyCode ) {
          // Enter.
          case 13:
            var word = game.getForm().getWord().toLowerCase();
            console.log( game.getForm().getWord() );
            console.log( game.getList().isWord( word ) );
            if ( game.getList().isWord( word ) ) {
              game.getList().markWord( game._backgroundCtx, word );
            }
            game.getPool().reset();
            break;
          // Space.
          case 32:
            game.getPool().shuffle();
            break;
          // Backspace.
          case 8:
            event.preventDefault();
            var form = game.getForm();
            if ( form.getWord().length !== 0 ) {
              game.getPool().pushLetter( form.getLastLetter() );
            }
            break;
        }
      }
    }

    return {
      onMouseDown: function( event ) {
        var mouse = transformCoords( event.pageX, event.pageY );
        inputDown( mouse );
      },

      onMouseMove: function( event ) {
        var mouse = transformCoords( event.pageX, event.pageY );
        inputMove( mouse );
      },

      onMouseUp: function( event ) {
        var mouse = transformCoords( event.pageX, event.pageY );
        inputUp( mouse );
      },

      onTouchStart: function( event ) {
        event.preventDefault();
        var touch = transformCoords( event.touches[0].pageX, event.touches[0].pageY );
        inputDown( touch );
      },

      onTouchMove: function( event ) {
        event.preventDefault();
        var touch = transformCoords( event.changedTouches[0].pageX, event.changedTouches[0].pageY );
        inputMove( touch );
      },

      onTouchEnd: function( event ) {
        event.preventDefault();
        inputUp();
      },

      onKeyDown: onKeyDown
    };
  }
);

define(
  [ 'spellquest' ],
  function( Game ) {
    // Keep track of last three positions.
    var lastPositions = [];

    function inputDown( input ) {
      // console.log( 'down' );
      // Game.instance._backgroundCtx.fillRect( input.x, input.y, 5, 5 );

      Game.instance.getPlayer().setSelected( Game.instance.hit( input.x, input.y ) );

      var selected = Game.instance.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
        selected.setVelocity( 0, 0 );
      } else {
        Game.instance.getUI().click( input.x, input.y );
      }
    }

    function inputMove( input ) {
      // console.log( 'move' );
      while ( lastPositions.length > 1 ) {
        lastPositions.shift();
      }

      lastPositions.push( input );
      // console.log( input.x + ", " + input.y );

      var selected = Game.instance.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
      }
    }

    function inputUp( input ) {
      // console.log( 'up' );
      var selected = Game.instance.getPlayer().getSelected();
      if ( selected !== null ) {
        // var dx = lastPositions[1].x - lastPositions[0].x,
        //     dy = lastPositions[1].y - lastPositions[0].y;

        // selected.setVelocity( dx / 50, dy / 50 );

        // TODO: Awful feel.
        // console.log( lastPositions[1].x + ", " + lastPositions[0].x)
        // console.log( dx + ", " +dy)
        // if ( ( dx * dx + dy * dy ) < 400 ) {
        var pool = Game.instance.getPool();
        var index = pool._letterEntities.lastIndexOf( selected );
        if ( !pool._isUsed[ index ] ) {
          var formElement = Game.instance.getForm().getFirstEmptyFormElement( selected );
          if ( formElement !== null ) {
            selected.setPosition( formElement.getPosition() );
          }
        } else {
          pool.pushLetter( selected );
        }

        // console.log( lastPositions );
        // console.log( dx + ", " + dy );
        // console.log( selected.getVelocity() );
        Game.instance.getPlayer().setSelected( null );
      }
    }

    function transformCoords( x, y ) {
      return {
        x: x - Game.instance._canvas.offsetLeft,
        y: y - Game.instance._canvas.offsetTop
      };
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

      onKeyDown: function( event ) {
        // ESC.
        if ( event.keyCode === 27 ) {
          quit();
          return;
        }

        if ( 65 <= event.keyCode && event.keyCode <= 90 ) {
          // console.log( String.fromCharCode( event.keyCode ) );
          var letter = Game.instance.getPool().getLetterByChar( String.fromCharCode( event.keyCode ) );
          if ( letter !== null ) {
            var currFormElement = Game.instance.getForm().getFirstEmptyFormElement();
            if ( currFormElement !== null ) {
              letter.setPosition( currFormElement.getPosition() );
            }
           }
        }

        else {
          console.log( event.keyCode );
          switch ( event.keyCode ) {
            // Enter.
            case 13:
              var word = Game.instance.getForm().getWord().toLowerCase();
              console.log( Game.instance.getForm().getWord() );
              console.log( Game.instance.getList().isWord( word ) );
              if ( Game.instance.getList().isWord( word ) ) {
                Game.instance.getList().markWord( Game.instance._backgroundCtx, word );
              }
              Game.instance.getPool().reset();
              break;
            // Space.
            case 32:
              Game.instance.getPool().shuffle();
              break;
            // Backspace.
            case 8:
              event.preventDefault();
              var form = Game.instance.getForm();
              if ( form.getWord().length !== 0 ) {
                Game.instance.getPool().pushLetter( form.getLastLetter() );
              }
              break;
          }
        }
      }
    };
  }
);

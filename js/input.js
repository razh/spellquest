define(
  [ 'spellquest' ],
  function( SpellQuest ) {
    // Keep track of last three positions.
    var lastPositions = [];

    function onMouseDown( event ) {
      var mouse = transformCoords( event.pageX, event.pageY );
      inputDown( mouse );
    }

    function onMouseMove( event ) {
      var mouse = transformCoords( event.pageX, event.pageY );
      inputMove( mouse );
    }

    function onMouseUp( event ) {
      var mouse = transformCoords( event.pageX, event.pageY );
      inputUp( mouse );
    }

    function onTouchStart( event ) {
      event.preventDefault();
      var touch = transformCoords( event.touches[0].pageX, event.touches[0].pageY );
      inputDown( touch );
    }

    function onTouchMove( event ) {
      event.preventDefault();
      var touch = transformCoords( event.changedTouches[0].pageX, event.changedTouches[0].pageY );
      inputMove( touch );
    }

    function onTouchEnd( event ) {
      event.preventDefault();
      inputUp();
    }

    function inputDown( input ) {
      // console.log( 'down' );
      // _game._backgroundCtx.fillRect( input.x, input.y, 5, 5 );

      _game.getPlayer().setSelected( _game.hit( input.x, input.y ) );

      var selected = _game.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
        selected.setVelocity( 0, 0 );
      } else {
        _game.getUI().click( input.x, input.y );
      }
    }

    function inputMove( input ) {
      // console.log( 'move' );
      while ( lastPositions.length > 1 ) {
        lastPositions.shift();
      }

      lastPositions.push( input );
      // console.log( input.x + ", " + input.y );

      var selected = _game.getPlayer().getSelected();
      if ( selected !== null ) {
        // selected.setPosition( input.x, input.y );
      }
    }

    function inputUp( input ) {
      // console.log( 'up' );
      var selected = _game.getPlayer().getSelected();
      if ( selected !== null ) {
        // var dx = lastPositions[1].x - lastPositions[0].x,
        //     dy = lastPositions[1].y - lastPositions[0].y;

        // selected.setVelocity( dx / 50, dy / 50 );

        // TODO: Awful feel.
        // console.log( lastPositions[1].x + ", " + lastPositions[0].x)
        // console.log( dx + ", " +dy)
        // if ( ( dx * dx + dy * dy ) < 400 ) {
        var pool = _game.getPool();
        var index = pool._letterEntities.lastIndexOf( selected );
        if ( !pool._isUsed[ index ] ) {
          var formElement = _game.getForm().getFirstEmptyFormElement( selected );
          if ( formElement !== null ) {
            selected.setPosition( formElement.getPosition() );
          }
        } else {
          pool.pushLetter( selected );
        }

        // console.log( lastPositions );
        // console.log( dx + ", " + dy );
        // console.log( selected.getVelocity() );
        _game.getPlayer().setSelected( null );
      }
    }

    function onKeyDown( event ) {
      // ESC.
      if ( event.keyCode === 27 ) {
        quit();
        return;
      }

      if ( 65 <= event.keyCode && event.keyCode <= 90 ) {
        // console.log( String.fromCharCode( event.keyCode ) );
        var letter = _game.getPool().getLetterByChar( String.fromCharCode( event.keyCode ) );
        if ( letter !== null ) {
          var currFormElement = _game.getForm().getFirstEmptyFormElement();
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
            var word = _game.getForm().getWord().toLowerCase();
            console.log( _game.getForm().getWord() );
            console.log( _game.getList().isWord( word ) );
            if ( _game.getList().isWord( word ) ) {
              _game.getList().markWord( _game._backgroundCtx, word );
            }
            _game.getPool().reset();
            break;
          // Space.
          case 32:
            _game.getPool().shuffle();
            break;
          // Backspace.
          case 8:
            event.preventDefault();
            var form = _game.getForm();
            if ( form.getWord().length !== 0 ) {
              _game.getPool().pushLetter( form.getLastLetter() );
            }
            break;
        }
      }
    }

    function transformCoords( x, y ) {
      return {
        x: x - _game._canvas.offsetLeft,
        y: y - _game._canvas.offsetTop
      };
    }
  }
);

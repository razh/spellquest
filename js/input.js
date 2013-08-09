define([
  'spellquest'
], function( Game ) {
  'use strict';

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
      // selected.setVelocity( 0, 0 );
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

      var form = game.getForm(),
          pool = game.getPool(),
          index = pool._letterEntities.lastIndexOf( selected );

      if ( !pool._isUsed[ index ] ) {
        game.input( selected.getChar() );
      } else {
        // Remove from form.
        form.getFormElementWithLetter( selected ).setLetter( null );

        // Push to pool.
        pool.pushLetter( selected );
      }

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
      game.input( String.fromCharCode( event.keyCode ) );
    }

    else {
      console.log( event.keyCode );
      switch ( event.keyCode ) {
        // Enter.
        case 13:
          game.submit();
          break;
        // Space.
        case 32:
          game.getPool().shuffle();
          break;
        // Backspace.
        case 8:
          event.preventDefault();
          game.backspace();
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
});

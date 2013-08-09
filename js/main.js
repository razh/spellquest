requirejs.config({
  paths: {
    'jquery': 'jquery-2.0.0.min'
  }
});

define(function( require ) {
  'use strict';

  var Game  = require( 'spellquest' ),
      Util  = require( 'util' ),
      Input = require( 'input' );

  var _game;

  function init() {
    _game = new Game();
    Game.instance = _game;

    if ( 'ontouchstart' in window ) {
      _game._canvas.addEventListener( 'touchstart', Input.onTouchStart, null );
      _game._canvas.addEventListener( 'touchmove', Input.onTouchMove, null );
      _game._canvas.addEventListener( 'touchend', Input.onTouchEnd, null );
    } else {
      _game._canvas.addEventListener( 'mousedown', Input.onMouseDown, null );
      _game._canvas.addEventListener( 'mousemove', Input.onMouseMove, null );
      _game._canvas.addEventListener( 'mouseup', Input.onMouseUp, null );
    }

    document.addEventListener( 'keydown', Input.onKeyDown, null );

    loop();
  }

  function loop() {
    if ( !_game.isRunning() ) {
      return;
    }

    _game.tick();
    window.requestAnimFrame( loop );
  }

  init();
});

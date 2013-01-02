var running = true;

var Game = function() {
  $( 'body' ).append( '<canvas id="spellquest"></canvas>' );
  $( 'body' ).append( '<canvas id="spellquest-background"></canvas>' );
  this._canvas = document.getElementById( 'spellquest' );
  this._ctx = this._canvas.getContext( '2d' );

  this._backgroundCanvas = document.getElementById( 'spellquest-background' );
  this._backgroundCtx = this._backgroundCanvas.getContext( '2d' );

  this.WIDTH = window.innerWidth;
  this.HEIGHT = window.innerHeight;

  this._canvas.width = this.WIDTH;
  this._canvas.height = this.HEIGHT;

  this._backgroundCanvas.style.backgroundColor = "#DDDDDD";
  this._backgroundCanvas.width = this.WIDTH;
  this._backgroundCanvas.height = this.HEIGHT;

  this._prevTime = Date.now();
  this._currTime = this._prevTime;

  this._entities = [];

  this.EPSILON = 1e-20;

  this._pool = new Pool();

  this.dict = new Dictionary();
  var word = this.dict.getRandomWord();
  while ( word.length < 5 )
    word = this.dict.getRandomWord();

  console.log( word );
  this._pool.setLetters( word.split( '' ) );
  var letters = this._pool.getLetters();

  this._form = new Form();
  var formElements = [];
  var tempFormElement = null;
  for ( i = 0; i < letters.length; i++) {
    tempFormElement = new FormElement();
    tempFormElement.setPosition( 100 + i * 90, 400 );
    tempFormElement.setWidth( 75 );
    tempFormElement.setHeight( 75 );
    tempFormElement.setColor( 100, 100, 100, 1.0 );
    tempFormElement.setLineWidth( 5 );
    formElements.push( tempFormElement );
  }
  this._form._formElements = formElements;
  this.add( this._form );
};

Game.prototype.tick = function() {
  this.update();
  this.draw();
};

Game.prototype.update = function() {
  this._currTime = Date.now();
  var elapsedTime = this._currTime - this._prevTime;
  this._prevTime = this._currTime;

  this.getPool().update( elapsedTime );
};

Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  this.getPool().draw( this._ctx );
};

Game.prototype.hit = function( x, y ) {
  return this.getPool().hit( x, y );
};

Game.prototype.add = function( entity ) {
  if ( entity instanceof Form ) {
    entity.draw( this._backgroundCtx );
  }

  this._entities.push( entity );
};

Game.prototype.getPool = function() {
  return this._pool;
};

Game.prototype.getForm = function() {
  return this._form;
};

var selected = null;
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

  selected = _game.hit( input.x, input.y );

  if ( selected !== null ) {
    selected.setPosition( input.x, input.y );
    selected.setVelocity( 0, 0 );
  }
}

function inputMove( input ) {
  // console.log( 'move' );
  while ( lastPositions.length > 1 ) {
    lastPositions.shift();
  }

  lastPositions.push( input );
  // console.log( input.x + ", " + input.y );

  if ( selected !== null ) {
    selected.setPosition( input.x, input.y );
  }
}

function inputUp( input ) {
  // console.log( 'up' );
  if ( selected !== null ) {
    var dx = lastPositions[1].x - lastPositions[0].x,
        dy = lastPositions[1].y - lastPositions[0].y;

    selected.setVelocity( dx / 50, dy / 50 );
    // console.log( lastPositions );
    // console.log( dx + ", " + dy );
    // console.log( selected.getVelocity() );
    selected = null;
  }
}

var currFormElement = 0;
function onKeyDown( event ) {
  // ESC.
  if ( event.keyCode === 27 ) {
    quit();
    return;
  }

  if ( 65 <= event.keyCode && event.keyCode <= 90 ) {
    console.log( String.fromCharCode( event.keyCode ) );
    var letter = _game.getPool().getLetterByChar( String.fromCharCode( event.keyCode ) );
    if ( letter !== null ) {
      letter.setPosition( _game._form._formElements[ currFormElement ].getPosition() );
      if ( currFormElement < _game.getPool().getLetters().length - 1 )
        currFormElement++;
    }
  }

  else {
    console.log( event.keyCode );
    switch ( event.keyCode ) {
      // Enter.
      case 13:
        console.log( _game.getForm().getWord() );
        break;
      // Backspace.
      case 8:
        event.preventDefault();
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

var _game;
function init() {
  _game = new Game();

  _game._canvas.addEventListener( 'mousedown', onMouseDown, null );
  _game._canvas.addEventListener( 'mousemove', onMouseMove, null );
  _game._canvas.addEventListener( 'mouseup', onMouseUp, null );

  _game._canvas.addEventListener( 'touchstart', onTouchStart, null );
  _game._canvas.addEventListener( 'touchmove', onTouchMove, null );
  _game._canvas.addEventListener( 'touchend', onTouchEnd, null );

  document.addEventListener( 'keydown', onKeyDown, null );

  loop();
}

function loop() {
  if ( !running )
    return;

  _game.tick();
  requestAnimFrame( loop );
}

function quit() {
  console.log( 'quit' );
  running = false;
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
         };
}) ();

// Cloning function taken from:
// http://my.opera.com/GreyWyvern/blog/show.dml/1725165
Object.prototype.clone = function() {
  var newObj = ( this instanceof Array ) ? [] : {};

  for ( var i in this ) {
    if ( i === 'clone' ) continue;
    if ( this[i] && typeof this[i] === 'object' ) {
      newObj[i] = this[i].clone();
    } else {
      newObj[i] = this[i];
    }
  }

  return newObj;
};

$(
  function() {
    init();
  }
);

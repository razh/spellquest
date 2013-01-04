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

  // Pool of letters the player can select form.
  this._pool = new Pool();
  this._pool.setPosition( 100, 100 );
  this._pool.setSpacing( 90 );
  this._pool.setWidth( 70 );
  this._pool.setHeight( 70 );
  this._pool.setColor( 240, 63, 53, 1.0 );
  this._pool.setTextColor( 255, 255, 255, 1.0 );
  this._pool.setFontSize( 24 );

  this._dict = new Dictionary();
  var word = this._dict.getRandomWord();
  while ( word.length < 5 )
    word = this._dict.getRandomWord();

  this._dict.createMap();
  this._subWords = this._dict.getSubWords( word );
  for ( i = 0; i < this._subWords.length; i++ ) {
    console.log( this._subWords[i] );
  }

  console.log( word );
  this._pool.setLetters( word.split( '' ) );
  var letters = this._pool.getLetters();

  // Form where player inputs the word guess.
  this._form = new Form();
  this._form.setPosition( 100, 250 );
  this._form.setSpacing( 90 );
  this._form.setWidth( 75 );
  this._form.setHeight( 75 );
  this._form.setColor( 100, 100, 100, 1.0 );
  this._form.setLineWidth( 5 );
  this._form.createFormElements( letters.length );

  // List displaying all correctly spelled words.
  this._list = new List();
  this._list.setPosition( 100, 360 );
  this._list.setWidth( 20 );
  this._list.setHeight( 20 );
  this._list.setColor( 0, 55, 55, 1.0 );
  this._list.setBackgroundColor( 0, 0, 0, 1.0 );
  this._list.setTextColor( 255, 255, 255, 1.0 );
  this._list.setLineWidth( 2 );
  this._list.setHorizontalSpacing( 40 );
  this._list.setPadding( 100 );
  this._list.setMaxHeight( this.HEIGHT );
  this._list.setWords( this._subWords );

  this._ui = new UI();

  var resetButton = new ResetButton();
  resetButton.setPosition( 100, 30 );
  resetButton.setWidth( 80 );
  resetButton.setHeight( 30 );
  resetButton.setColor( 0, 0, 0, 1.0 );
  resetButton.setTextColor( 255, 255, 255, 1.0 );
  this._ui.addButton( resetButton );

  var shuffleButton = new ShuffleButton();
  shuffleButton.setPosition( 200, 30 );
  shuffleButton.setWidth( 80 );
  shuffleButton.setHeight( 30 );
  shuffleButton.setColor( 0, 0, 0, 1.0 );
  shuffleButton.setTextColor( 255, 255, 255, 1.0 );
  this._ui.addButton( shuffleButton );

  var submitButton = new SubmitButton();
  submitButton.setPosition( 300, 30 );
  submitButton.setWidth( 80 );
  submitButton.setHeight( 30 );
  submitButton.setColor( 0, 0, 0, 1.0 );
  submitButton.setTextColor( 255, 255, 255, 1.0 );
  this._ui.addButton( submitButton );

  var backspaceButton = new BackspaceButton();
  backspaceButton.setPosition( 400, 30 );
  backspaceButton.setWidth( 80 );
  backspaceButton.setHeight( 30 );
  backspaceButton.setColor( 0, 0, 0, 1.0 );
  backspaceButton.setTextColor( 255, 255, 255, 1.0 );
  this._ui.addButton( backspaceButton );

  this.drawBackground( this._backgroundCtx );
};

Game.prototype.tick = function() {
  this.update();
  this.draw();
};

Game.prototype.update = function() {
  this._currTime = Date.now();
  var elapsedTime = this._currTime - this._prevTime;
  this._prevTime = this._currTime;

  this.getForm().update( elapsedTime );
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
  this._entities.push( entity );
};

Game.prototype.drawBackground = function( ctx ) {
  ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );
  this.getForm().draw( ctx );
  this.getList().draw( ctx );
  this.getUI().draw( ctx );
}

Game.prototype.getPool = function() {
  return this._pool;
};

Game.prototype.getForm = function() {
  return this._form;
};

Game.prototype.getList = function() {
  return this._list;
};

Game.prototype.getUI = function() {
  return this._ui;
};

Game.prototype.reset = function() {
  this.getPool().clear();
  this.getForm().clear();
  this.getList().clear();

  var word = this._dict.getRandomWord();
  while ( word.length < 5 )
    word = this._dict.getRandomWord();

  this._dict.createMap();
  this._subWords = this._dict.getSubWords( word );
  for ( i = 0; i < this._subWords.length; i++ ) {
    console.log( this._subWords[i] );
  }

  console.log( 'word: ' + word );
  this.getPool().setLetters( word.split( '' ) );
  var letters = this.getPool().getLetters();

  this.getForm().createFormElements( letters.length );
  this.getList().setWords( this._subWords );

  this.drawBackground( this._backgroundCtx );
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

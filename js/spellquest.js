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

  // var testEntity = new Entity();
  // testEntity.setPosition( 200, 200 );
  // testEntity.setVelocity( 0.0001, -0.0001 );
  // testEntity.setWidth( 200 );
  // testEntity.setHeight( 200 );
  // testEntity.setColor( 240, 63, 53, 1.0 );
  // // this.add( testEntity );

  // var testLetter = new Letter();
  // testLetter.setPosition( 50, 50 );
  // // testLetter.setVelocity( 0.0002, 0.0001 );
  // testLetter.setWidth( 70 );
  // testLetter.setHeight( 70 );
  // testLetter.setColor( 240, 63, 53, 1.0 );
  // testLetter.setChar( 'B' );
  // testLetter.setTextColor( 255, 255, 255, 1.0 );
  // this.add( testLetter );

  // var testLetter2 = new Letter();
  // testLetter2.setPosition( 200, 50 );
  // testLetter2.setWidth( 70 );
  // testLetter2.setHeight( 70 );
  // testLetter2.setColor( 240, 63, 53, 1.0 );
  // testLetter2.setChar( 'E' );
  // testLetter2.setTextColor( 255, 255, 255, 1.0 );
  // this.add( testLetter2 );

  // this.add( testLetter2.clone() );
  // var tempLetter = this._entities[ this._entities.length - 1 ];
  // tempLetter.setChar( 'V' );
  // tempLetter.setPosition( 320, 50 );
  // this.add( testLetter2.clone() );
  // tempLetter = this._entities[ this._entities.length - 1 ];
  // tempLetter.setChar( 'P' );
  // tempLetter.setPosition( 70, 170 );
  // this.add( testLetter2.clone() );
  // tempLetter = this._entities[ this._entities.length - 1 ];
  // tempLetter.setChar( 'T' );
  // tempLetter.setPosition( 200, 170 );

  this._pool = new Pool();
  // this._pool.setLetters( this._entities );

  // var testForm = new FormElement();
  // testForm.setPosition( 100, 300 );
  // testForm.setWidth( 75 );
  // testForm.setHeight( 75 );
  // testForm.setColor( 100, 100, 100, 1.0 );
  // testForm.setLineWidth( 5 );
  // this.add( testForm );

  // var tempForm = null;
  // for ( var i = 0; i < 5; i++ ) {
  //   tempForm = new FormElement();

  //   tempForm.setPosition( 100 + i * 95, 300 );
  //   tempForm.setWidth( 75 );
  //   tempForm.setHeight( 75 );
  //   tempForm.setColor( 100, 100, 100, 1.0 );
  //   tempForm.setLineWidth( 5 );

  //   this.add( tempForm );
  // }

  this.dict = new Dictionary();
  var word = this.dict.getRandomWord();
  while ( word.length < 5 )
    word = this.dict.getRandomWord();

  console.log( word );
  this._pool.setLetters( word.split( '' ) );
  var letters = this._pool.getLetters();
  // var letterEntities = [];
  // var tempLetter = null;
  // for ( i = 0; i < letters.length; i++ ) {
  //   tempLetter = new Letter();
  //   tempLetter.setPosition( 100 + i * 90, 200 );
  //   tempLetter.setWidth( 70 );
  //   tempLetter.setHeight( 70 );
  //   tempLetter.setColor( 240, 63, 53, 1.0 );
  //   tempLetter.setChar( letters[i].toUpperCase() );
  //   tempLetter.setTextColor( 255, 255, 255, 1.0 );
  //   letterEntities.push( tempLetter );
  // }
  // this._pool._letterEntities = letterEntities;

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
  // for ( var i = this._entities.length - 1; i >= 0; i-- ) {
  //   this._entities[i].update( elapsedTime );
  // }
};

Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  this.getPool().draw( this._ctx );
  // for ( var i = this._entities.length - 1; i >= 0; i-- ) {
  //   if ( !( this._entities[i] instanceof FormElement ) ) {
  //     this._entities[i].draw( this._ctx );
  //   }
  // }
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
        break;
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

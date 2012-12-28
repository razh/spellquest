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

  var testEntity = new Entity();
  testEntity.setPosition( 200, 200 );
  testEntity.setVelocity( 0.0001, -0.0001 );
  testEntity.setWidth( 200 );
  testEntity.setHeight( 200 );
  testEntity.setColor( 240, 63, 53, 1.0 );
  // this.add( testEntity );

  var testLetter = new Letter();
  testLetter.setPosition( 50, 50 );
  // testLetter.setVelocity( 0.0002, 0.0001 );
  testLetter.setWidth( 50 );
  testLetter.setHeight( 50 );
  testLetter.setColor( 240, 63, 53, 1.0 );
  testLetter.setChar( 'B' );
  testLetter.setTextColor( 255, 255, 255, 1.0 );
  this.add( testLetter );

  var testLetter2 = new Letter();
  testLetter2.setPosition( 200, 50 );
  testLetter2.setWidth( 50 );
  testLetter2.setHeight( 50 );
  testLetter2.setColor( 240, 63, 53, 1.0 );
  testLetter2.setChar( 'E' );
  testLetter2.setTextColor( 255, 255, 255, 1.0 );
  this.add( testLetter2 );

  var testForm = new Form();
  testForm.setPosition( 100, 400 );
  testForm.setWidth( 55 );
  testForm.setHeight( 55 );
  testForm.setColor( 100, 100, 100, 1.0 );
  testForm.setLineWidth( 5 );
  this.add( testForm );

  var tempForm = null;
  for ( var i = 0; i < 5; i++ ) {
    tempForm = new Form();

    tempForm.setPosition( 100 + i * 75, 400 );
    tempForm.setWidth( 55 );
    tempForm.setHeight( 55 );
    tempForm.setColor( 100, 100, 100, 1.0 );
    tempForm.setLineWidth( 5 );

    this.add( tempForm );
  }
};

Game.prototype.tick = function() {
  this.update();
  this.draw();
};

Game.prototype.update = function() {
  this._currTime = Date.now();
  var elapsedTime = this._currTime - this._prevTime;

  for ( var i = this._entities.length - 1; i >= 0; i-- ) {
    this._entities[i].update( elapsedTime );
  }
};

Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  for ( var i = this._entities.length - 1; i >= 0; i-- ) {
    if ( !( this._entities[i] instanceof Form ) ) {
      this._entities[i].draw( this._ctx );
    }
  }
};

Game.prototype.hit = function( x, y ) {
  var hit = null;
  for ( var i = this._entities.length - 1; i >= 0; i-- ) {
    if ( this._entities[i] instanceof Form ) {
      continue;
    }

    hit = this._entities[i].hit( x, y );
    if ( hit !== null ) {
      return hit;
    }
  }

  return null;
};

Game.prototype.add = function( entity ) {
  if ( entity instanceof Form ) {
    entity.draw( this._backgroundCtx );
  }

  this._entities.push( entity );
};

var selected = null;
var lastPosition = {
  x: 0,
  y: 0
};

function onMouseDown( event ) {
  var mouse = transformCoords( event.pageX, event.pageY );

  selected = _game.hit( mouse.x, mouse.y );

  if ( selected !== null ) {
    selected.setPosition( mouse.x, mouse.y );
  }
}

function onMouseMove( event ) {
  var mouse = transformCoords( event.pageX, event.pageY );
  lastPosition = mouse;

  if ( selected !== null )
    selected.setPosition( mouse.x, mouse.y );
}

function onMouseUp( event ){
  var mouse = transformCoords( event.pageX, event.pageY );

  if ( selected !== null ) {
    var dx = lastPosition.x - mouse.x,
        dy = lastPosition.y - mouse.y;

    selected.setVelocity( dx, dy );
    selected = null;
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

  document.addEventListener( 'keydown', (function ( event ) {
    if ( event.keyCode === 81 )
      quit();
  }), null );

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

$(
  function() {
    init();
  }
);

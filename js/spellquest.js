var running = true;

var Game = function() {
  this._backgroundCanvas = document.createElement( 'canvas' );
  this._canvas = document.createElement( 'canvas' );

  // Offscreen canvas for rendering the player world.
  this._worldCanvas = document.createElement( 'canvas' );
  this._worldCanvas.style.visibility = 'hidden';

  document.body.appendChild( this._backgroundCanvas );
  document.body.appendChild( this._canvas );
  document.body.appendChild( this._worldCanvas );

  this._backgroundCtx = this._backgroundCanvas.getContext( '2d' );
  this._ctx = this._canvas.getContext( '2d' );
  this._worldCtx = this._worldCanvas.getContext( '2d' );

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

  this._player = new Player();
  this._world = new World();
  this._ui = new UI();
  this._pool = new Pool();
  this._form = new Form();
  this._list = new List();

  this._dict = new Dictionary();

  this._word = this._dict.getRandomWord();
  while ( this._word.length < 5 ) {
    this._word = this._dict.getRandomWord();
  }

  this._subWords = this._dict.getSubWords( this._word );
  for ( i = 0; i < this._subWords.length; i++ ) {
    console.log( this._subWords[i] );
  }

  var pEntity = new PolygonEntity();
  pEntity.setVertices([
      0, 100,
    100, 100,
    100,  20,
      0,  40
  ]);
  // pEntity.setPosition( 200, 400 );
  pEntity.setColor( 0, 0, 255, 1.0 );
  pEntity.setVelocity( 0.05, 0.001 );

  if ( this.WIDTH > this.HEIGHT ) {
    this._layout = Layout.HORIZONTAL;
    this.generateHorizontalLayout();
  } else {
    this._layout = Layout.VERTICAL;
    this.generateVerticalLayout();
  }

  var layerFactory = new LayerFactory();
  this._world.addLayer(layerFactory.createTerrainLayer({
    type: LayerType.CIRCULAR,
    color: new Color( 255, 0, 0, 1.0 ),
    width: 10 * this._world.getWidth(),
    height: this._world.getHeight(),
    maxTerrainHeight: 0.5 * this._world.getHeight(),
    segmentCount: 40,
    zIndex: 1,
    parallaxFactor: 1.0
  }));
  this._world.addLayer(layerFactory.createTerrainLayer({
    type: LayerType.CIRCULAR,
    color: new Color( 0, 0, 255, 1.0 ),
    width: 20 * this._world.getHeight(),
    height: this._world.getHeight(),
    maxTerrainHeight: 0.9 * this._world.getHeight(),
    segmentCount: 40,
    zIndex: 0,
    parallaxFactor: 0.5
  }));

  var playerEntity = new SpriteEntity();
  playerEntity.setColor( 255, 255, 255, 1.0 );
  this._world.setPlayerEntity( playerEntity );

  var image = new Image();
  image.onload = function() {
    playerEntity.setSprite( this );
    playerEntity.setPosition( 30, _game.getWorld().getHeight() - playerEntity.getHeight() );
  }
  image.src = './img/test.png';

  this.drawBackground( this._backgroundCtx );
};

Game.prototype.generateVerticalLayout = function() {
  var cx = this.WIDTH / 2;
  var cy = this.HEIGHT / 2;

  var px = this.WIDTH / 100;
  var py = this.HEIGHT / 100;

  var padding = 2.5 * py;

  var world = this.getWorld();
  var ui = this.getUI();
  var pool = this.getPool();
  var form = this.getForm();
  var list = this.getList();

  world.setWidth( 80 * px );
  world.setHeight( 10 * px );
  world.setPosition( cx, 2 * padding + world.getHalfHeight() );
  world.setColor( 20, 0, 0, 0.1 );

  this._worldCanvas.width = world.getWidth();
  this._worldCanvas.height = world.getHeight();

  var buttonFactory = new ButtonFactory();

  var buttonWidth = 0.2 * world.getWidth();
  var buttonHeight = 0.5 * world.getHeight();
  var buttonX = world.getLeft()
  var buttonY = world.getBottom() + padding;
  var resetButton = new ResetButton();
  // var resetButton = buttonFactory.createButton( ButtonType.RESET );
  resetButton.setWidth( buttonWidth );
  resetButton.setHeight( buttonHeight );
  resetButton.setTopLeft( buttonX, buttonY );
  resetButton.setColor( 0, 0, 0, 1.0 );
  resetButton.setTextColor( 255, 255, 255, 1.0 );
  resetButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( resetButton );

  var shuffleButton = new ShuffleButton();
  // var shuffleButton = buttonFactory.createButton( ButtonType.SHUFFLE );
  shuffleButton.setWidth( buttonWidth );
  shuffleButton.setHeight( buttonHeight );
  shuffleButton.setTopLeft( buttonX + 1.33 * buttonWidth, buttonY );
  shuffleButton.setColor( 0, 0, 0, 1.0 );
  shuffleButton.setTextColor( 255, 255, 255, 1.0 );
  shuffleButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( shuffleButton );

  var submitButton = new SubmitButton();
  // var submitButton = buttonFactory.createButton( ButtonType.SUBMIT );
  submitButton.setWidth( buttonWidth );
  submitButton.setHeight( buttonHeight );
  submitButton.setTopLeft( buttonX + 2.66 * buttonWidth, buttonY );
  submitButton.setColor( 0, 0, 0, 1.0 );
  submitButton.setTextColor( 255, 255, 255, 1.0 );
  submitButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( submitButton );

  var backspaceButton = new BackspaceButton();
  // var backspaceButton = buttonFactory.createButton( ButtonType.BACKSPACE );
  backspaceButton.setWidth( buttonWidth );
  backspaceButton.setHeight( buttonHeight );
  backspaceButton.setTopLeft( buttonX + 4 * buttonWidth, buttonY );
  backspaceButton.setColor( 0, 0, 0, 1.0 );
  backspaceButton.setTextColor( 255, 255, 255, 1.0 );
  backspaceButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( backspaceButton );

  // Pool of letters the player can select from.
  pool.setSpacing( 12 * px );
  pool.setWidth( 8 * px );
  pool.setHeight( 8 * px );
  pool.setTopLeft( buttonX, resetButton.getBottom() + padding );
  pool.setColor( 240, 63, 53, 1.0 );
  pool.setTextColor( 255, 255, 255, 1.0 );
  pool.setFontSize( Math.floor( 2.5 * px ) );
  console.log( this._word );
  pool.setLetters( this._word.split( '' ) );
  var letters = pool.getLetters();

  // Form where player inputs the word guess.
  form.setLineWidth( 5 );
  form.setSpacing( 12 * px );
  form.setWidth( 8 * px  + form.getLineWidth() );
  form.setHeight( 8 * px + form.getLineWidth() );
  form.setTopLeft( buttonX, pool.getBottom() + form.getLineWidth() + padding );
  form.setColor( 100, 100, 100, 1.0 );
  form.createFormElements( letters.length );

  // List displaying all correctly spelled words.
  list.setTopLeft( buttonX, form.getBottom() + form.getLineWidth() + padding );
  list.setWidth( Math.floor( 2 * px ) );
  list.setHeight( Math.floor( 2 * px ) );
  list.setFontSize( list.getHeight() * 0.6 );
  list.setColor( 0, 55, 55, 1.0 );
  list.setBackgroundColor( 0, 0, 0, 1.0 );
  list.setTextColor( 255, 255, 255, 1.0 );
  list.setLineWidth( 2 );
  list.setHorizontalSpacing( 40 );
  list.setPadding( 10 * px );
  list.setMaxHeight( this.HEIGHT );
  list.setWords( this._subWords );
};

Game.prototype.generateHorizontalLayout = function() {
  var cx = this.WIDTH / 2;
  var cy = this.HEIGHT / 2;

  var px = this.WIDTH / 100;
  var py = this.HEIGHT / 100;

  var padding = 2.5 * px;

  var world = this.getWorld();
  var ui = this.getUI();
  var pool = this.getPool();
  var form = this.getForm();
  var list = this.getList();


  world.setWidth( 64 * px );
  world.setHeight( 8 * px );
  world.setTopLeft( 2 * padding, 2 * padding );
  world.setColor( 20, 0, 0, 0.1 );

  this._worldCanvas.width = world.getWidth();
  this._worldCanvas.height = world.getHeight();

  var buttonFactory = new ButtonFactory();

  var buttonWidth = 0.2 * world.getWidth();
  var buttonHeight = 0.5 * world.getHeight();
  var buttonX = world.getLeft()
  var buttonY = world.getBottom() + padding;
  var resetButton = new ResetButton();
  // var resetButton = buttonFactory.createButton( ButtonType.RESET );
  resetButton.setWidth( buttonWidth );
  resetButton.setHeight( buttonHeight );
  resetButton.setTopLeft( buttonX, buttonY );
  resetButton.setColor( 0, 0, 0, 1.0 );
  resetButton.setTextColor( 255, 255, 255, 1.0 );
  resetButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( resetButton );

  var shuffleButton = new ShuffleButton();
  // var shuffleButton = buttonFactory.createButton( ButtonType.SHUFFLE );
  shuffleButton.setWidth( buttonWidth );
  shuffleButton.setHeight( buttonHeight );
  shuffleButton.setTopLeft( buttonX + 1.33 * buttonWidth, buttonY );
  shuffleButton.setColor( 0, 0, 0, 1.0 );
  shuffleButton.setTextColor( 255, 255, 255, 1.0 );
  shuffleButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( shuffleButton );

  var submitButton = new SubmitButton();
  // var submitButton = buttonFactory.createButton( ButtonType.SUBMIT );
  submitButton.setWidth( buttonWidth );
  submitButton.setHeight( buttonHeight );
  submitButton.setTopLeft( buttonX + 2.66 * buttonWidth, buttonY );
  submitButton.setColor( 0, 0, 0, 1.0 );
  submitButton.setTextColor( 255, 255, 255, 1.0 );
  submitButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( submitButton );

  var backspaceButton = new BackspaceButton();
  // var backspaceButton = buttonFactory.createButton( ButtonType.BACKSPACE );
  backspaceButton.setWidth( buttonWidth );
  backspaceButton.setHeight( buttonHeight );
  backspaceButton.setTopLeft( buttonX + 4 * buttonWidth, buttonY );
  backspaceButton.setColor( 0, 0, 0, 1.0 );
  backspaceButton.setTextColor( 255, 255, 255, 1.0 );
  backspaceButton.setFontSize( Math.floor( 1.75 * px ) );
  ui.addButton( backspaceButton );

  // Pool of letters the player can select from.
  pool.setSpacing( 12 * px );
  pool.setWidth( 8 * px );
  pool.setHeight( 8 * px );
  pool.setTopLeft( buttonX, resetButton.getBottom() + padding );
  pool.setColor( 240, 63, 53, 1.0 );
  pool.setTextColor( 255, 255, 255, 1.0 );
  pool.setFontSize( Math.floor( 2.5 * px ) );
  console.log( this._word );
  pool.setLetters( this._word.split( '' ) );
  var letters = pool.getLetters();

  // Form where player inputs the word guess.
  form.setLineWidth( 5 );
  form.setSpacing( 12 * px );
  form.setWidth( 8 * px  + form.getLineWidth() );
  form.setHeight( 8 * px + form.getLineWidth() );
  form.setTopLeft( buttonX, pool.getBottom() + form.getLineWidth() + padding );
  form.setColor( 100, 100, 100, 1.0 );
  form.createFormElements( letters.length );

  // List displaying all correctly spelled words.
  list.setWidth( Math.floor( 2 * px ) );
  list.setHeight( Math.floor( 2 * px ) );
  list.setTop( world.getTop() );

  var worldRight = world.getRight();
  var formRight = form.getRight();
  if ( formRight > worldRight ) {
    list.setLeft( formRight + list.getWidth() );
  } else {
    list.setLeft( worldRight + list.getWidth() );
  }

  list.setFontSize( list.getHeight() * 0.6 );
  list.setColor( 0, 55, 55, 1.0 );
  list.setBackgroundColor( 0, 0, 0, 1.0 );
  list.setTextColor( 255, 255, 255, 1.0 );
  list.setLineWidth( Math.floor( 0.4 * px ) );
  list.setHorizontalSpacing( 6 * px );
  list.setPadding( 2 * padding );
  list.setMaxHeight( this.HEIGHT );
  list.setWords( this._subWords );
  list.setMaxWidth( this.WIDTH - ( list.getLeft() + 2 * list.getWidth() ) );
  list.resizeToFit();
};

Game.prototype.tick = function() {
  this.update();
  this.draw();
};

Game.prototype.update = function() {
  this._currTime = Date.now();
  var elapsedTime = this._currTime - this._prevTime;
  this._prevTime = this._currTime;

  this.getWorld().update( elapsedTime );

  // Update Form, then Pool.
  this.getForm().update( elapsedTime );
  this.getPool().update( elapsedTime );
};

Game.prototype.draw = function() {
  this._ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  this.getWorld().draw( this._worldCtx );
  this._ctx.drawImage( this._worldCanvas,
                       this.getWorld().getX() - this.getWorld().getHalfWidth(),
                       this.getWorld().getY() - this.getWorld().getHalfHeight() );

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
  // this.getWorld().draw( ctx );
};

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

Game.prototype.getWorld = function() {
  return this._world;
};

Game.prototype.getPlayer = function() {
  return this._player;
};

Game.prototype.reset = function() {
  var pool = this.getPool();
  var form = this.getForm();
  var list = this.getList();

  pool.clear();
  form.clear();
  list.clear();

  this._word = this._dict.getRandomWord();
  while ( this._word.length < 5 ) {
    this._word = this._dict.getRandomWord();
  }

  this._subWords = this._dict.getSubWords( this._word );
  for ( i = 0; i < this._subWords.length; i++ ) {
    console.log( this._subWords[i] );
  }

  console.log( 'word: ' + this._word );
  pool.setLetters( this._word.split( '' ) );
  var letters = pool.getLetters();

  form.createFormElements( letters.length );

  if ( this._layout === Layout.HORIZONTAL ) {
    var px = this.WIDTH / 100;
    list.setWidth( Math.floor( 2 * px ) );
    list.setHeight( Math.floor( 2 * px ) );
    list.setHorizontalSpacing( 6 * px );
    list.setPadding( 5 * px );

    var worldRight = this.getWorld().getRight();
    var formRight = form.getRight();
    if ( formRight > worldRight ) {
      list.setLeft( formRight + list.getWidth() );
    } else {
      list.setLeft( worldRight + list.getWidth() );
    }
  }

  list.setWords( this._subWords );

  if ( this._layout === Layout.HORIZONTAL ) {
    list.setMaxWidth( this.WIDTH - ( list.getLeft() + 2 * list.getWidth() ) );
    list.resizeToFit();
  }

  this.drawBackground( this._backgroundCtx );
};

var Layout = {
  HORIZONTAL: 0,
  VERTICAL: 1
};

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

var _game;
function init() {
  _game = new Game();

  var isTouchSupported = "ontouchend" in document;

  if ( isTouchSupported ) {
    _game._canvas.addEventListener( 'touchstart', onTouchStart, null );
    _game._canvas.addEventListener( 'touchmove', onTouchMove, null );
    _game._canvas.addEventListener( 'touchend', onTouchEnd, null );
  } else {
    _game._canvas.addEventListener( 'mousedown', onMouseDown, null );
    _game._canvas.addEventListener( 'mousemove', onMouseMove, null );
    _game._canvas.addEventListener( 'mouseup', onMouseUp, null );
  }


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

define(function( require ) {
  'use strict';

  var Color         = require( 'color' ),
      Player        = require( 'player' ),
      Layer         = require( 'world/layer' ),
      World         = require( 'world/world' ),
      UI            = require( 'ui/ui' ),
      Pool          = require( 'pool' ),
      Form          = require( 'form/form' ),
      List          = require( 'list' ),
      Button        = require( 'ui/button' ),
      Layout        = require( 'ui/layout' ),
      Dictionary    = require( 'dictionary' ),
      PolygonEntity = require( 'entities/polygon-entity' ),
      SpriteEntity  = require( 'entities/sprite-entity' ),
      ButtonFactory = require( 'ui/button-factory' ),
      LayerFactory  = require( 'world/layer-factory' );

  function Game() {
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

    this.WIDTH  = 320;
    this.HEIGHT = 480;

    this._canvas.width  = this.WIDTH;
    this._canvas.height = this.HEIGHT;

    this._backgroundCanvas.style.backgroundColor = '#DDDDDD';
    this._backgroundCanvas.width  = this.WIDTH;
    this._backgroundCanvas.height = this.HEIGHT;

    this._prevTime = Date.now();
    this._currTime = this._prevTime;
    this._running = true;

    this._entities = [];

    this._player = new Player();
    this._world  = new World();
    this._ui     = new UI();
    this._form   = new Form();
    this._list   = new List();

    this._pool = new Pool();
    this._pool.setForm( this._form );

    this._resetButton     = ButtonFactory.createButton( Button.Type.RESET );
    this._shuffleButton   = ButtonFactory.createButton( Button.Type.SHUFFLE );
    this._submitButton    = ButtonFactory.createButton( Button.Type.SUBMIT );
    this._backspaceButton = ButtonFactory.createButton( Button.Type.BACKSPACE );

    this._ui.addButton( this._resetButton );
    this._ui.addButton( this._shuffleButton );
    this._ui.addButton( this._submitButton );
    this._ui.addButton( this._backspaceButton );

    this._dict = new Dictionary();

    this._word = this._dict.getRandomWord();
    while ( this._word.length < 5 ) {
      this._word = this._dict.getRandomWord();
    }

    this._subWords = this._dict.getSubWords( this._word );
    for ( var i = 0; i < this._subWords.length; i++ ) {
      console.log( this._subWords[i] );
    }

    var pEntity = new PolygonEntity();
    pEntity.setVertices([
      0,   100,
      100, 100,
      100,  20,
      0,    40
    ]);
    // pEntity.setPosition( 200, 400 );
    pEntity.setColor( 0, 0, 255, 1.0 );
    pEntity.setVelocity( 0.05, 0.001 );

    // if ( this.WIDTH > this.HEIGHT ) {
    //   this._layout = Layout.HORIZONTAL;
    //   this.generateHorizontalLayout();
    // } else {
    //   this._layout = Layout.VERTICAL;
    //   this.generateVerticalLayout();
    // }
    // this._aspectRatio = this.WIDTH / this.HEIGHT;
    // if ( this._aspectRatio < 3 / 2 ) {
    //   this._backgroundCanvas.height = this.WIDTH / 2 * 3;
    // } else if ( this._aspectRatio > 3 / 2 ) {
    //   this._backgroundCanvas.width = this.HEIGHT / 3 * 2;
    // }
    // this._backgroundCanvas.height = this.HEIGHT;
    this.generateThreeTwoLayout();

    this._worldCanvas.width = this._world.getWidth();
    this._worldCanvas.height = this._world.getHeight();

    this._world.addLayer(LayerFactory.createTerrainLayer({
      type: Layer.Type.CIRCULAR,
      color: new Color( 255, 0, 0, 1.0 ),
      width: 10 * this._world.getWidth(),
      height: this._world.getHeight(),
      maxTerrainHeight: 0.5 * this._world.getHeight(),
      segmentCount: 40,
      zIndex: 1,
      parallaxFactor: 1.0
    }));
    this._world.addLayer(LayerFactory.createTerrainLayer({
      type: Layer.Type.CIRCULAR,
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

    var world = this._world,
        image = new Image();
    image.onload = function() {
      playerEntity.setSprite( this );
      playerEntity.setPosition( 30, world.getHeight() - playerEntity.getHeight() );
    };
    image.src = './img/test.png';

    this.drawBackground( this._backgroundCtx );
  }

  // Lazy singleton;
  Game.instance = null;

  Game.getInstance = function() {
    return Game.instance;
  };

  Game.prototype.generateVerticalLayout = function() {
    var cx = this.WIDTH / 2;
    var cy = this.HEIGHT / 2;

    var px = this.WIDTH / 100;
    var py = this.HEIGHT / 100;

    var padding = 2.5 * py;

    var world = this.getWorld();
    var pool = this.getPool();
    var form = this.getForm();
    var list = this.getList();

    var resetButton = this._resetButton;
    var shuffleButton = this._shuffleButton;
    var submitButton = this._submitButton;
    var backspaceButton = this._backspaceButton;

    world.setWidth( 80 * px );
    world.setHeight( 10 * px );
    world.setPosition( cx, 2 * padding + world.getHalfHeight() );
    world.setColor( 20, 0, 0, 0.1 );

    this._worldCanvas.width = world.getWidth();
    this._worldCanvas.height = world.getHeight();

    var buttonWidth = 0.2 * world.getWidth();
    var buttonHeight = 0.5 * world.getHeight();
    var buttonX = world.getLeft();
    var buttonY = world.getBottom() + padding;

    resetButton.setWidth( buttonWidth );
    resetButton.setHeight( buttonHeight );
    resetButton.setTopLeft( buttonX, buttonY );
    resetButton.setColor( 0, 0, 0, 1.0 );
    resetButton.setTextColor( 255, 255, 255, 1.0 );
    resetButton.setFontSize( Math.floor( 1.75 * px ) );

    shuffleButton.setWidth( buttonWidth );
    shuffleButton.setHeight( buttonHeight );
    shuffleButton.setTopLeft( buttonX + 1.33 * buttonWidth, buttonY );
    shuffleButton.setColor( 0, 0, 0, 1.0 );
    shuffleButton.setTextColor( 255, 255, 255, 1.0 );
    shuffleButton.setFontSize( Math.floor( 1.75 * px ) );

    submitButton.setWidth( buttonWidth );
    submitButton.setHeight( buttonHeight );
    submitButton.setTopLeft( buttonX + 2.66 * buttonWidth, buttonY );
    submitButton.setColor( 0, 0, 0, 1.0 );
    submitButton.setTextColor( 255, 255, 255, 1.0 );
    submitButton.setFontSize( Math.floor( 1.75 * px ) );

    backspaceButton.setWidth( buttonWidth );
    backspaceButton.setHeight( buttonHeight );
    backspaceButton.setTopLeft( buttonX + 4 * buttonWidth, buttonY );
    backspaceButton.setColor( 0, 0, 0, 1.0 );
    backspaceButton.setTextColor( 255, 255, 255, 1.0 );
    backspaceButton.setFontSize( Math.floor( 1.75 * px ) );

    // Pool of letters the player can select from.
    pool.setSpacing( 12 * px );
    pool.setWidth( 8 * px );
    pool.setHeight( 8 * px );
    pool.setTopLeft( buttonX, resetButton.getBottom() + padding );
    pool.setColor( 240, 63, 53, 1.0 );
    pool.setTextColor( 255, 255, 255, 1.0 );
    pool.setFontSize( Math.floor( 3 * px ) );
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
    list.setWidth( Math.floor( 3 * px ) );
    list.setHeight( Math.floor( 3 * px ) );
    list.setFontSize( Math.floor( list.getHeight() * 0.6 ) );
    list.setColor( 0, 55, 55, 1.0 );
    list.setBackgroundColor( 0, 0, 0, 1.0 );
    list.setTextColor( 255, 255, 255, 1.0 );
    list.setLineWidth( 0.5 * px );
    list.setHorizontalSpacing( 20 );
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
    var pool = this.getPool();
    var form = this.getForm();
    var list = this.getList();

    var resetButton = this._resetButton;
    var shuffleButton = this._shuffleButton;
    var submitButton = this._submitButton;
    var backspaceButton = this._backspaceButton;

    world.setWidth( 64 * px );
    world.setHeight( 8 * px );
    world.setTopLeft( 2 * padding, 2 * padding );
    world.setColor( 20, 0, 0, 0.1 );

    this._worldCanvas.width = world.getWidth();
    this._worldCanvas.height = world.getHeight();

    var buttonWidth = 0.2 * world.getWidth();
    var buttonHeight = 0.5 * world.getHeight();
    var buttonX = world.getLeft();
    var buttonY = world.getBottom() + padding;

    resetButton.setWidth( buttonWidth );
    resetButton.setHeight( buttonHeight );
    resetButton.setTopLeft( buttonX, buttonY );
    resetButton.setColor( 0, 0, 0, 1.0 );
    resetButton.setTextColor( 255, 255, 255, 1.0 );
    resetButton.setFontSize( Math.floor( 1.75 * px ) );

    shuffleButton.setWidth( buttonWidth );
    shuffleButton.setHeight( buttonHeight );
    shuffleButton.setTopLeft( buttonX + 1.33 * buttonWidth, buttonY );
    shuffleButton.setColor( 0, 0, 0, 1.0 );
    shuffleButton.setTextColor( 255, 255, 255, 1.0 );
    shuffleButton.setFontSize( Math.floor( 1.75 * px ) );

    submitButton.setWidth( buttonWidth );
    submitButton.setHeight( buttonHeight );
    submitButton.setTopLeft( buttonX + 2.66 * buttonWidth, buttonY );
    submitButton.setColor( 0, 0, 0, 1.0 );
    submitButton.setTextColor( 255, 255, 255, 1.0 );
    submitButton.setFontSize( Math.floor( 1.75 * px ) );

    backspaceButton.setWidth( buttonWidth );
    backspaceButton.setHeight( buttonHeight );
    backspaceButton.setTopLeft( buttonX + 4 * buttonWidth, buttonY );
    backspaceButton.setColor( 0, 0, 0, 1.0 );
    backspaceButton.setTextColor( 255, 255, 255, 1.0 );
    backspaceButton.setFontSize( Math.floor( 1.75 * px ) );

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

  var AspectRatio = {
    THREE_TWO: 0,
    FOUR_THREE: 1,
    SIXTEEN_NINE: 2,
    SIXTEEN_TEN: 3
  };

  Game.prototype.generateThreeTwoLayout = function() {
    var cx = this.WIDTH / 2;
    var cy = this.HEIGHT / 2;

    var px = this.WIDTH / 160;
    var py = this.HEIGHT / 160;

    var padding = 3 * px;

    var world = this.getWorld();
    var pool = this.getPool();
    var form = this.getForm();
    var list = this.getList();

    var resetButton = this._resetButton;
    var shuffleButton = this._shuffleButton;
    var submitButton = this._submitButton;
    var backspaceButton = this._backspaceButton;

    world.setWidth( 128 * px );
    world.setHeight( 32 * px );

    world.setTop( 5 * padding );
    world.setX( cx );
    world.setColor( 20, 0, 0, 0.1 );

    var buttonWidth = 0.2 * world.getWidth();
    var buttonHeight = 0.4 * world.getHeight();
    var buttonFontSize = Math.floor( 0.4 * buttonHeight );
    var buttonX = world.getLeft();
    var buttonY = world.getBottom() + padding;

    resetButton.setWidth( buttonWidth );
    resetButton.setHeight( buttonHeight );
    resetButton.setTopLeft( buttonX, buttonY );
    resetButton.setColor( 0, 0, 0, 1.0 );
    resetButton.setTextColor( 255, 255, 255, 1.0 );
    resetButton.setFontSize( buttonFontSize );

    shuffleButton.setWidth( buttonWidth );
    shuffleButton.setHeight( buttonHeight );
    shuffleButton.setTopLeft( buttonX + 1.33 * buttonWidth, buttonY );
    shuffleButton.setColor( 0, 0, 0, 1.0 );
    shuffleButton.setTextColor( 255, 255, 255, 1.0 );
    shuffleButton.setFontSize( buttonFontSize );

    submitButton.setWidth( buttonWidth );
    submitButton.setHeight( buttonHeight );
    submitButton.setTopLeft( buttonX + 2.66 * buttonWidth, buttonY );
    submitButton.setColor( 0, 0, 0, 1.0 );
    submitButton.setTextColor( 255, 255, 255, 1.0 );
    submitButton.setFontSize( buttonFontSize );

    backspaceButton.setWidth( buttonWidth );
    backspaceButton.setHeight( buttonHeight );
    backspaceButton.setTopLeft( buttonX + 4 * buttonWidth, buttonY );
    backspaceButton.setColor( 0, 0, 0, 1.0 );
    backspaceButton.setTextColor( 255, 255, 255, 1.0 );
    backspaceButton.setFontSize( buttonFontSize );

    // Pool of letters the player can select from.
    pool.setSpacing( 22 * px );
    pool.setWidth( 18 * px );
    pool.setHeight( 18 * px );
    pool.setTopLeft( buttonX, resetButton.getBottom() + padding );
    pool.setColor( 240, 63, 53, 1.0 );
    pool.setTextColor( 255, 255, 255, 1.0 );
    pool.setFontSize( Math.floor( 0.4 * pool.getWidth() ) );
    console.log( this._word );
    pool.setLetters( this._word.split( '' ) );
    var letters = pool.getLetters();

    // Form where player inputs the word guess.
    form.setLineWidth( px );
    form.setSpacing( 22 * px );
    form.setWidth( 18 * px  + form.getLineWidth() );
    form.setHeight( 18 * px + form.getLineWidth() );
    form.setTopLeft( buttonX, pool.getBottom() + form.getLineWidth() + padding );
    form.setColor( 100, 100, 100, 1.0 );
    form.createFormElements( letters.length );

    // List displaying all correctly spelled words.
    list.setTopLeft( buttonX, form.getBottom() + form.getLineWidth() + padding );
    list.setWidth( Math.floor( 6 * px ) );
    list.setHeight( Math.floor( 6 * px ) );
    list.setFontSize( Math.floor( list.getHeight() * 0.6 ) );
    list.setColor( 0, 55, 55, 1.0 );
    list.setBackgroundColor( 0, 0, 0, 1.0 );
    list.setTextColor( 255, 255, 255, 1.0 );
    list.setLineWidth( 0.5 * px );
    list.setHorizontalSpacing( list.getWidth() );
    list.setPadding( 20 * padding );
    list.setMaxHeight( this.HEIGHT );
    list.setWords( this._subWords );
  };

  Game.prototype.generateFourThreeLayout = function() {
    var cx = this.WIDTH / 2;
    var cy = this.HEIGHT / 2;

    var px = this.WIDTH / 256;
    var py = this.HEIGHT / 256;

    var padding = 3 * px;
  };

  Game.prototype.generateSixteenNineLayout = function() {};

  Game.prototype.generateSixteenTenLayout = function() {};

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

  Game.prototype.isRunning = function() {
    return this._running;
  };

  Game.prototype.setRunning = function( running ) {
    this._running = running;
  };

  Game.prototype.stop = function() {
    this.setRunning( false );
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
    for ( var i = 0; i < this._subWords.length; i++ ) {
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

  Game.prototype.input = function( character ) {
    var letter = this.getPool().getLetterByChar( character );
    if ( letter !== null ) {
      var currFormElement = this.getForm().getFirstEmptyFormElement();
      if ( currFormElement !== null ) {
        letter.setPosition( currFormElement.getPosition() );
        currFormElement.setLetter( letter );
      }
    }
  };

  Game.prototype.submit = function() {
    var word = this.getForm().getWord().toLowerCase();
    console.log( this.getForm().getWord() );
    console.log( 'isWord: ' + this.getList().isWord( word ) );
    if ( this.getList().isWord( word ) ) {
      this.getList().markWord( this._backgroundCtx, word );
    }
    this.getPool().reset();
  };

  Game.prototype.backspace = function() {
    var form = this.getForm();
    if ( form.getWord().length !== 0 ) {
      var formElement = form.getLastUsedFormElement();
      if ( formElement !== null ) {
        this.getPool().pushLetter( formElement.getLetter() );
        formElement.setLetter( null );
      }
    }
  };

  return Game;
});

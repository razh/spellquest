var Pool = function() {
  // Actual letters, in order.
  this._letters = [];
  // Letter entities, in order.
  this._letterEntities = [];
  // Order of the letter entities in the pool.
  this._letterIndices = [];
  // Whether the letter has been used, in order.
  this._isUsed = [];
};

// TODO: Go in order of letter indices.
Pool.prototype.getLetterByChar = function( char ) {
  var index;
  for ( var i = 0; i < this._letterIndices.length; i++ ) {
    index = this._letterIndices[i];
    if ( this._letterEntities[ index ].getChar() === char && !this._isUsed[ index ] ) {
      this._isUsed[ index ] = true;
      return this._letterEntities[ index ];
    }
  }

  return null;
};

Pool.prototype.getLetters = function() {
  return this._letters;
};

Pool.prototype.setLetters = function( letters ) {
  var indices = [];
  for ( var i = 0; i < letters.length; i++ ) {
    indices.push(i);
  }

  this._letters = letters;
  this._letterIndices = fisherYates( indices );

  this.createLetterEntities();
};

Pool.prototype.createLetterEntities = function() {
  var letter = null;
  for ( var i = 0; i < this.getLetters().length; i++ ) {
    letter = new Letter();
    letter.setWidth( 70 );
    letter.setHeight( 70 );
    letter.setColor( 240, 63, 53, 1.0 );
    letter.setChar( this.getLetters()[i].toUpperCase() );
    letter.setTextColor( 255, 255, 255, 1.0 );

    this._letterEntities.push( letter );
    this._isUsed.push( false );
  }

  // Position letters in scrambled order.
  for ( i = 0; i < this._letterIndices.length; i++ ) {
    this._letterEntities[ this._letterIndices[i] ].setPosition( 100 + i * 90, 200 );
  }
};

Pool.prototype.reset = function() {
  var x = 0;
  var letter = null;
  // The new order of the letters.
  var newIndices = [];
  for ( var i = 0; i < this._letterIndices.length; i++ ) {
    if ( !this._isUsed[ this._letterIndices[i] ] ) {
      letter = this._letterEntities[ this._letterIndices[i] ];
      newIndices.push( this._letterIndices[i] );
      letter.setPosition( 100 + x * 90, 200 );
      x++;
    }
  }

  var formElements = _game.getForm().getFormElements();
  for ( i = 0; i < formElements.length; i++ ){
    if ( formElements[i].hasLetter() ) {
      letter = formElements[i].getLetter();

      // Remove from form element.
      formElements[i].setLetter( null );
      letter.setPosition( 100 + x * 90, 200 );

      var index = this._letterEntities.lastIndexOf( letter );
      if ( index !== -1 ) {
        this._isUsed[ index ] = false;
        newIndices.push( index );
      }

      x++;
    }
  }

  this._letterIndices = newIndices;
};

Pool.prototype.pushLetter = function( letter ) {
  var x = 0;
  var newIndices = [];
  for ( var i = 0; i < this._letterIndices.length; i++ ) {
    if ( !this._isUsed[ this._letterIndices[i] ] ) {
      this._letterEntities[ this._letterIndices[i] ].setPosition( 100 + x * 90, 200 );
      newIndices.push( this._letterIndices[i] );
      x++;
    }
  }

  var index = this._letterEntities.lastIndexOf( letter );
  if ( index !== -1 ) {
    this._isUsed[ index ] = false;
    this._letterEntities[ index ].setPosition( 100 + x * 90, 200 );
    newIndices.push( index );
  }

  this._letterIndices = newIndices;
};

Pool.prototype.update = function( elapsedTime ) {
  for ( var i = 0; i < this._letterEntities.length; i++ ) {
    this._letterEntities[i].update( elapsedTime );
  }
};

Pool.prototype.draw = function( ctx ) {
  for ( var i = 0; i < this._letterEntities.length; i++ ) {
    this._letterEntities[i].draw( ctx );
  }
};

Pool.prototype.hit = function( x, y ) {
  for ( var i = 0; i < this._letterEntities.length; i++ ) {
    if ( this._letterEntities[i].hit( x, y ) !== null )
      return this._letterEntities[i];
  }

  return null;
};

// http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
function fisherYates( array ) {
  var i = array.length;
  if ( i === 0 ) return;
  while ( --i ) {
    var j = Math.floor( Math.random() * ( i + 1 ) );
    var tempi = array[i];
    var tempj = array[j];
    array[i] = tempj;
    array[j] = tempi;
  }

  return array;
}

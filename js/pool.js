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

Pool.prototype.getLetterByChar = function( char ) {
  for ( var i = this._letterEntities.length - 1; i >= 0; i-- ) {
    if ( this._letterEntities[i].getChar() === char && !this._isUsed[i] ) {
      this._isUsed[i] = true;
      return this._letterEntities[i];
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
  var index = 0;
  for ( var i = 0; i < this.getLetters().length; i++ ) {
    index = this._letterIndices[i];

    letter = new Letter();
    letter.setPosition( 100 + i * 90, 200 );
    letter.setWidth( 70 );
    letter.setHeight( 70 );
    letter.setColor( 240, 63, 53, 1.0 );
    letter.setChar( this.getLetters()[ index ].toUpperCase() );
    letter.setTextColor( 255, 255, 255, 1.0 );

    this._letterEntities.push( letter );
    this._isUsed.push( false );
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
    letter = formElements[i].getLetter();
    if ( letter !== null ) {
      // Remove from form element.
      formElements[i].setLetter( null );
      letter.setPosition( 100 + x * 90, 300 );
      for ( var j = 0; j < this._letterEntities.length; j++ ) {
        if ( this._letterEntities[j] === letter ) {
          this._isUsed[j] = false;
          newIndices.push(j);
          break;
        }
      }
      x++;
    }
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

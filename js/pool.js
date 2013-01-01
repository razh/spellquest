var Pool = function() {
  this._letters = [];
  this._letterEntities = [];
  this._letterIndices = [];
  this._inPool = [];
};

Pool.prototype.getLetterByChar = function( char ) {
  for ( var i = this._letterEntities.length - 1; i >= 0; i-- ) {
    if ( this._letterEntities[i].getChar() === char && this._inPool[i] ) {
      this._inPool[i] = false;
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
    indices.push( i );
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
    this._inPool.push( true );
  }
};

Pool.prototype.reset = function() {

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

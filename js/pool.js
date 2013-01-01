var Pool = function() {
  this._letters = [];
  this._letterEntities = [];
  this._inPool = [];
};

Pool.prototype.getLetterByChar = function( char ) {
  for ( var i = this._letterEntities.length - 1; i >= 0; i-- ) {
    if ( this._letterEntities[i].getChar() === char ) {
      return this._letterEntities[i];
    }
  }

  return null;
};

Pool.prototype.getLetters = function() {
  return this._letters;
};

Pool.prototype.setLetters = function( letters ) {
  this._letters = fisherYates( letters );

  this.createLetterEntities();
};

Pool.prototype.createLetterEntities = function() {
  var letter = null;
  for ( var i = 0; i < this.getLetters().length; i++ ) {
    letter = new Letter();
    letter.setPosition( 100 + i * 90, 200 );
    letter.setWidth( 70 );
    letter.setHeight( 70 );
    letter.setColor( 240, 63, 53, 1.0 );
    letter.setChar( this.getLetters()[i].toUpperCase() );
    letter.setTextColor( 255, 255, 255, 1.0 );
    this._letterEntities.push( letter );
  }
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
    this._letterEntities[i].hit( x, y );
  }
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

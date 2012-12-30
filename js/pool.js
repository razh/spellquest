var Pool = function() {
  this._letters = [];
};

Pool.prototype.getLetterByChar = function( char ) {
  for ( var i = this._letters.length - 1; i >= 0; i-- ) {
    if ( this._letters[i].getChar() === char ) {
      return char;
    }
  }
};

Pool.prototype.getLetters = function() {
  return this._letters;
};

Pool.prototype.setLetters = function( letters ) {
  this._letters = fisherYates( letters );
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

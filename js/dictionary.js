var Dictionary = function() {
  var jsonURL = './json/dictionary.json';

  this._wordList = (function() {
    var json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': jsonURL,
      'dataType': 'json',
      'success': function( data ) {
        json = data;
      }
    });
    return json;
  }) ();

  this._wordMap = [];
};

Dictionary.prototype.getRandomWord = function() {
  return this._wordList[ Math.floor( Math.random() * ( this._wordList.length + 1 ) ) ];
};


Dictionary.prototype.getSubWords = function( word ) {
  if ( word.length < 3 ) {
    return [];
  }

  var sortedWordArray = word.split( '' ).sort();
  var sortedWord = sortedWordArray.join( '' );

  var subWordsArray = this._wordMap[ sortedWord ];
  if ( subWordsArray === undefined ) {
    subWordsArray = [];
  }

  for ( var i = 0; i < sortedWordArray.length; i++ ) {
    subWordsArray = subWordsArray.concat( this.getSubWords( removeByIndex( sortedWordArray, i ).join( '' ) ) );
  }

  return subWordsArray;
};

// TODO: Check whether to optimize.
Dictionary.prototype.createMap = function() {
  var key, word;
  for ( var i = 0, n = this._wordList.length; i < n; i++ ) {
    word = this._wordList[i].split( '' ).sort().join( '' );
    key = this._wordMap[ word ];

    if ( key === undefined ) {
     key = [];
    }

    key.push( this._wordList[i] );
    this._wordMap[ word ] = key;
  }
};


Dictionary.prototype.isWord = function( word ) {
  return this._wordList.lastIndexOf( word ) !== -1;
}


function removeByIndex( array, index ) {
  var newArray = array.slice( 0, index );
  // console.log( newArray.join('') + ", " + array.slice( index + 1 ).join(''));
  newArray = newArray.concat( array.slice( index + 1 ) );
  return newArray;
}

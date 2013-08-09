define([
  'jquery',
  'text!json/dictionary.json'
], function( $, jsonData ) {
  'use strict';

  function removeByIndex( array, index ) {
    var newArray = array.slice( 0, index );
    newArray = newArray.concat( array.slice( index + 1 ) );
    return newArray;
  }

  function uniqueArray( array ) {
    var newArray = [];
    for ( var i = 0, n = array.length; i < n; i++ ) {
      if ( newArray.lastIndexOf( array[i] ) === -1 ) {
        newArray.push( array[i] );
      }
    }

    return newArray;
  }


  function Dictionary() {
    this._wordList = JSON.parse( jsonData );
    this._wordMap = [];
    this.createMap();
  }

  Dictionary.prototype.getRandomWord = function() {
    return this._wordList[ Math.floor( Math.random() * ( this._wordList.length + 1 ) ) ];
  };

  Dictionary.prototype.getSubWordsRecursive = function( word ) {
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

  Dictionary.prototype.getSubWords = function( word ) {
    return uniqueArray( this.getSubWordsRecursive( word ) ).sort( function( a, b ) {
      if ( a.length === b.length ) {
        return a < b ? -1 : 1;
      }

      return a.length < b.length ? -1 : 1;
    });
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
  };

  return Dictionary;
});

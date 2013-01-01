var Dictionary = function() {
  var jsonURL = '../json/dictionary.json';

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
};

Dictionary.prototype.getRandomWord = function() {
  return this._wordList[ Math.floor( Math.random() * ( this._wordList.length + 1 ) ) ];
};


Dictionary.prototype.getSubWords = function( word ) {

};

Dictionary.prototype.createMap = function() {

};

var Dictionary = function() {
  this._wordList = [];
  this._loaded = false;

  var jsonURL = '../json/dictionary.json';
  $.getJSON( jsonURL, function( data ) {
    this._wordList = data;
    this._loaded = true;
  });
};

Dictionary.prototype.getRandomWord = function() {

};


Dictionary.prototype.getSubWords = function( word ) {

};

Dictionary.prototype.isLoaded = function() {
  return this._loaded;
};

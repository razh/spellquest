var List = function() {
  Entity.call( this );

  this._words = [];
};

List.prototype = new Entity();
List.prototype.constructor = List;

List.prototype.getWords = function() {
  return this._words;
};

List.prototype.setWords = function( words ) {
  this._words = words;
};

List.prototype.draw = function() {

};

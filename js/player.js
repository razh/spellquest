var Player = function() {
  this._score = 0;

  this._selected = null;
};

Player.prototype.getScore = function() {
  return this._score;
};

Player.prototype.setScore = function( score ) {
  this._score = score;
};

Player.prototype.addScore = function( score ) {
  this._score += score;
};

Player.prototype.getSelected = function() {
  return this._selected;
};

Player.prototype.setSelected = function( selected ) {
  this._selected = selected;
};

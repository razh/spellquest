define(
  function() {
    'use strict';

    function Player() {
      this._score = 0;
      this._health = 0;
      this._level = 0;

      this._selected = null;
    }

    Player.prototype.getScore = function() {
      return this._score;
    };

    Player.prototype.setScore = function( score ) {
      this._score = score;
    };

    Player.prototype.addScore = function( score ) {
      this._score += score;
    };

    Player.prototype.getHealth = function() {
      return this._health;
    };

    Player.prototype.setHealth = function( health ) {
      this._health = health;
    };

    Player.prototype.addHealth = function( health ) {
      this._health += health;
    };

    Player.prototype.heal = function( health ) {
      this.addHealth( health );
    };

    Player.prototype.damage = function( damage ) {
      this.addHealth( -damage );
    };

    Player.prototype.getLevel = function() {
      return this._level;
    };

    Player.prototype.setLevel = function( level ) {
      this._level = level;
    };

    Player.prototype.getSelected = function() {
      return this._selected;
    };

    Player.prototype.setSelected = function( selected ) {
      this._selected = selected;
    };

    return Player;
  }
);

/*
  UI is a collection of buttons.
*/
var UI = function() {

};

var Button = function() {
  Entity.call( this );
};

Button.prototype = new Entity();
Button.prototype.constructor = Button;

// Gets new word.
var ResetButton = function() {
  Button.call( this );
};

ResetButton.prototype = new Button();
ResetButton.prototype.constructor = ResetButton;

var ShuffleButton = function() {
  Button.call( this );
};

ShuffleButton.prototype = new Button();
ShuffleButton.prototype.constructor = ShuffleButton;

define([
  'entities/entity',
  'form/form-element'
], function( Entity, FormElement ) {
  'use strict';

  function Form() {
    Entity.call( this );

    this._spacing      = 0;
    this._lineWidth    = 5;
    this._formElements = [];
  }

  Form.prototype = new Entity();
  Form.prototype.constructor = Form;

  Form.prototype.createFormElements = function( letterCount ) {
    var x         = this.getX(),
        y         = this.getY(),
        spacing   = this.getSpacing(),
        width     = this.getWidth(),
        height    = this.getHeight(),
        color     = this.getColor(),
        lineWidth = this.getLineWidth();

    var tempFormElement = null;
    for ( var i = 0; i < letterCount; i++ ) {
      tempFormElement = new FormElement();
      tempFormElement.setPosition( x + i * spacing, y );
      tempFormElement.setWidth( width );
      tempFormElement.setHeight( height );
      tempFormElement.setColor( color );
      tempFormElement.setLineWidth( lineWidth );
      this._formElements.push( tempFormElement );
    }
  };

  Form.prototype.getWord = function() {
    var word = '';

    var letter;
    this._formElements.forEach(function( formElement ) {
      letter = formElement.getLetter();
      if ( letter ) {
        word += letter.getChar();
      }
    });

    return word;
  };

  Form.prototype.draw = function( ctx ) {
    this._formElements.forEach(function( formElement ) {
      formElement.draw( ctx );
    });
  };

  Form.prototype.update = function( elapsedTime ) {
    this._formElements.forEach(function( formElement ) {
      formElement.update( elapsedTime );
    });
  };

  Form.prototype.getSpacing = function() {
    return this._spacing;
  };

  Form.prototype.setSpacing = function( spacing ) {
    this._spacing = spacing;
  };

  Form.prototype.getLineWidth = function() {
    return this._lineWidth;
  };

  Form.prototype.setLineWidth = function( lineWidth ) {
    this._lineWidth = lineWidth;
  };

  Form.prototype.getFormElements = function() {
    return this._formElements;
  };

  Form.prototype.getRight = function() {
    return this._formElements[ this._formElements.length - 1 ].getRight();
  };

  Form.prototype.getLastLetter = function() {
    for ( var i = this._formElements.length - 1; i >= 0; i-- ) {
      if ( this._formElements[i].hasLetter() ) {
        return this._formElements[i].getLetter();
      }
    }

    return null;
  };

  Form.prototype.getFormElementWithLetter = function( letter ) {
    for ( var i = 0, n = this._formElements.length; i < n; i++ ) {
      if ( this._formElements[i].getLetter() === letter ) {
        return this._formElements[i];
      }
    }
  };

  Form.prototype.getLastUsedFormElement = function() {
    for ( var i = this._formElements.length - 1; i >= 0; i-- ) {
      if ( this._formElements[i].hasLetter() ) {
        return this._formElements[i];
      }
    }

    return null;
  };

  Form.prototype.getFirstEmptyFormElement = function() {
    for ( var i = 0; i < this._formElements.length; i++ ) {
      if ( !this._formElements[i].hasLetter() ) {
        return this._formElements[i];
      }
    }

    return null;
  };

  Form.prototype.clear = function() {
    this._formElements = [];
  };

  return Form;
});

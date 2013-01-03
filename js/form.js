// Adapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html.
function roundRect( ctx, x, y, width, height, radius, fill, stroke ) {
  if ( typeof stroke === undefined ) {
    stroke = true;
  }
  if ( typeof radius === undefined ) {
    radius = 5;
  }

  var halfWidth  = width  / 2,
      halfHeight = height / 2;

  var x0 = x - halfWidth,
      y0 = y - halfHeight,
      x1 = x + halfWidth,
      y1 = y + halfHeight;

  ctx.beginPath();

  ctx.moveTo( x0 + radius, y0 );
  ctx.lineTo( x1 - radius, y0 );
  ctx.quadraticCurveTo(
    x1, y0,
    x1, y0 + radius
  );
  ctx.lineTo( x1, y1 - radius );
  ctx.quadraticCurveTo(
    x1, y1,
    x1 - radius, y1
  );
  ctx.lineTo( x0 + radius, y1 );
  ctx.quadraticCurveTo(
    x0, y1,
    x0, y1 - radius
  );
  ctx.lineTo( x0, y0 + radius );
  ctx.quadraticCurveTo(
    x0, y0,
    x0 + radius, y0
  );

  ctx.closePath();

  if ( stroke ) {
    ctx.stroke();
  }
  if ( fill ) {
    ctx.fill();
  }
}

var FormElement = function() {
  Entity.call( this );

  this._letter = null;
  this._lineWidth = 0;
};

FormElement.prototype = new Entity();
FormElement.prototype.constructor = FormElement;

FormElement.prototype.update = function( elapsedTime ) {
  Entity.prototype.update.call( this, elapsedTime );

  // Remove letter if no longer inside the form element.
  if ( this.hasLetter() ) {
    if ( this.getPosition() !== this.getLetter().getPosition() ) {
      this.setLetter( null );
    }
  }
};

FormElement.prototype.setLetter = function( letter ) {
  this._letter = letter;
};

FormElement.prototype.getLetter = function() {
  return this._letter;
};

FormElement.prototype.hasLetter = function() {
  return this._letter !== null;
}

FormElement.prototype.getLineWidth = function() {
  return this._lineWidth;
};

FormElement.prototype.setLineWidth = function( lineWidth ) {
  this._lineWidth = lineWidth;
};

FormElement.prototype.draw = function( ctx ) {
  ctx.lineWidth = this.getLineWidth();
  ctx.strokeStyle = 'rgba( ' + ( ( 0.5 + this.getColor().getRed() )   << 0 ) +
                    ', '     + ( ( 0.5 + this.getColor().getGreen() ) << 0 ) +
                    ','      + ( ( 0.5 + this.getColor().getBlue() )  << 0 ) +
                    ','      + this.getColor().getAlpha() + ' )';
  roundRect( ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5, false, true );
};


var Form = function() {
  Entity.call( this );

  this._spacing = 0;
  this._lineWidth = 5;
  this._formElements = [];
};

Form.prototype = new Entity();
Form.prototype.constructor = Form;

Form.prototype.createFormElements = function( letterCount ) {
  var x = this.getX();
  var y = this.getY();
  var spacing = this.getSpacing();
  var width = this.getWidth();
  var height = this.getHeight();
  var color = this.getColor();
  var lineWidth = this.getLineWidth();

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
}

Form.prototype.getWord = function() {
  var word = '';

  for ( var i = 0, n = this._formElements.length; i < n; i++ ) {
    var letter = this._formElements[i].getLetter();
    if ( letter !== null ) {
      word += letter.getChar();
    }
  }

  return word;
};

Form.prototype.draw = function( ctx ) {
  for ( var i = 0, n = this._formElements.length; i < n; i++ ) {
    this._formElements[i].draw( ctx );
  }
};

Form.prototype.update = function( elapsedTime ) {
  for ( var i = 0; i < this._formElements.length; i++ ) {
    this._formElements[i].update( elapsedTime );
  }
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

Form.prototype.getLastLetter = function() {
  for ( var i = this._formElements.length - 1; i >= 0; i-- ) {
    if ( this._formElements[i].hasLetter() ) {
      return this._formElements[i].getLetter();
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

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

  this._letterCount = 0;
  this._lineWidth = 0;
};

FormElement.prototype = new Entity();
FormElement.prototype.constructor = FormElement;

FormElement.prototype.getLetterCount = function() {
  return this._letterCount;
};

FormElement.prototype.getLineWidth = function() {
  return this._lineWidth;
};

FormElement.prototype.setLineWidth = function( lineWidth ) {
  this._lineWidth = lineWidth;
};

FormElement.prototype.draw = function( ctx ) {
  ctx.lineWidth = this.getLineWidth();
  ctx.strokeStyle = 'rgba( ' + ( ( 0.5 + this.getRed() )   << 0 ) +
                    ', '     + ( ( 0.5 + this.getGreen() ) << 0 ) +
                    ','      + ( ( 0.5 + this.getBlue() )  << 0 ) +
                    ','      + this.getAlpha() + ' )';
  roundRect( ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5, false, true );
};


var Form = function() {
  this._formElements = [];
};

Form.prototype.getWord = function() {
  var word = '';

  for ( var i = 0, n = this._formElements.length; i < n; i++ ) {
    word += this._formElements[i];
  }

  return word;
};

Form.prototype.draw = function( ctx ) {
  for ( var i = 0, n = this._formElements.length; i < n; i++ ) {
    this._formElements[i].draw( ctx );
  }
};

Form.prototype.update = function() {};

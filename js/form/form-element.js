define(
  [ 'entities/entity/' ],
  function( Entity ) {
    // Adapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html.
    function roundRectCentered( ctx, x, y, width, height, radius, fill, stroke ) {
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

    function roundRect( ctx, x, y, width, height, radius, fill, stroke ) {
      roundRectCentered( ctx, x + width / 2, y + height / 2, width, height, radius, fill, stroke );
    }

    function FormElement() {
      Entity.call( this );

      this._letter = null;
      this._lineWidth = 0;
    }

    FormElement.prototype = new Entity();
    FormElement.prototype.constructor = FormElement;

    FormElement.prototype.update = function( elapsedTime ) {
      Entity.prototype.update.call( this, elapsedTime );

      // Remove letter if no longer inside the form element.
      if ( this.hasLetter() ) {
        if ( this.getPosition() !== this.getLetter().getPosition() ) {
          // TODO: pool.setLetterUsed() instead.
          var index = _game.getPool()._letterEntities.lastIndexOf( this.getLetter() );
          if ( index !== -1 ) {
            _game.getPool()._isUsed[ index ] = false;
          }

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
    };

    FormElement.prototype.getLineWidth = function() {
      return this._lineWidth;
    };

    FormElement.prototype.setLineWidth = function( lineWidth ) {
      this._lineWidth = lineWidth;
    };

    FormElement.prototype.draw = function( ctx ) {
      ctx.lineWidth = this.getLineWidth();
      ctx.strokeStyle = this.getColor().toString();
      roundRectCentered( ctx, this.getX(), this.getY(), this.getWidth(), this.getHeight(), 5, false, true );
    };

    return FormElement;
  }
);

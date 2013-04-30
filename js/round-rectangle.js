define(
  function() {
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

    return {
      roundRectCentered: roundRectCentered,
      roundRect: roundRect
    };
  }
);

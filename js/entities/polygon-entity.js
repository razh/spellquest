define(
  [ './entity' ],
  function( Entity ) {
    function PolygonEntity() {
      Entity.call( this );

      this._vertices = [];

      this._xmin = Number.MAX_VALUE;
      this._ymin = Number.MAX_VALUE;
      this._xmax = Number.MIN_VALUE;
      this._ymax = Number.MIN_VALUE;
    }

    PolygonEntity.prototype = new Entity();
    PolygonEntity.prototype.constructor = PolygonEntity;

    PolygonEntity.prototype.getVertices = function() {
      return this._vertices;
    };

    PolygonEntity.prototype.setVertices = function( vertices ) {
      this._vertices = vertices;

      var x, y;
      for ( var i = 0, n = this.getVertexCount(); i < n; i++ ) {
        x = this._vertices[ 2 * i ];
        y = this._vertices[ 2 * i + 1 ];

        this._xmin = Math.min( x, this._xmin );
        this._ymin = Math.min( y, this._ymin );
        this._xmax = Math.max( x, this._xmax );
        this._ymax = Math.max( y, this._ymax );
      }
    };

    PolygonEntity.prototype.getVertexCount = function() {
      return this._vertices.length / 2;
    };

    PolygonEntity.prototype.draw = function( ctx ) {
      ctx.save();
      ctx.translate( this.getX(), this.getY() );

      ctx.beginPath();
      for ( var i = 0, n = this.getVertexCount(); i < n; i++ ) {
        ctx.lineTo( this._vertices[ 2 * i ],
                    this._vertices[ 2 * i + 1 ] );
      }
      ctx.closePath();

      ctx.fillStyle = this.getColor().toString();
      ctx.fill();

      ctx.restore();
    };

    PolygonEntity.prototype.contains = function( x, y ) {
      x -= this.getX();
      y -= this.getY();

      if ( this._xmin > x || x > this._xmax ||
           this._ymin > y || y > this._ymax ) {
        return false;
      }

      var vertexCount = this.getVertexCount();
      var contains = false;
      var xi, yi, xj, yj;
      for ( var i = 0, j = vertexCount - 1; i < vertexCount; j = i++ ) {
        xi = this._vertices[ 2 * i ];
        yi = this._vertices[ 2 * i + 1 ];
        xj = this._vertices[ 2 * j ];
        yj = this._vertices[ 2 * j + 1 ];

        if ( ( ( yi > y ) !== ( yj > y ) ) &&
             ( x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi ) ) {
          contains = !contains;
        }
      }

      return contains;
    };

    PolygonEntity.prototype.getWidth = function() {
      return this._xmax - this._xmin;
    };

    PolygonEntity.prototype.getHeight = function() {
      return this._ymax - this._ymin;
    };

    PolygonEntity.prototype.getHalfWidth = function() {
      return this.getWidth() / 2;
    };

    PolygonEntity.prototype.getHalfHeight = function() {
      return this.getHeight() / 2;
    };

    return PolygonEntity;
  }
);

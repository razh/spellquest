define(
  [ './entity' ],
  function( Entity ) {
    function SpriteEntity() {
      Entity.call( this );

      this._sprite = null;

      this._canvas = document.createElement( 'canvas' );
      this._ctx = this._canvas.getContext( '2d' );
    }

    SpriteEntity.prototype = new Entity();
    SpriteEntity.prototype.constructor = SpriteEntity;

    SpriteEntity.prototype.getSprite = function() {
      return this._sprite;
    };

    SpriteEntity.prototype.setSprite = function( sprite ) {
      this._sprite = sprite;
      this.setWidth( this._sprite.width );
      this.setHeight( this._sprite.height );
      this._ctx.drawImage( this._sprite, 0, 0 );
    };

    SpriteEntity.prototype.getCanvas = function() {
      return this._canvas;
    };

    SpriteEntity.prototype.setCanvas = function( canvas ) {
      this._canvas = canvas;
    };

    SpriteEntity.prototype.setWidth = function( width ) {
      Entity.prototype.setWidth.call( this, width );

      this.getCanvas().width = width;
    };

    SpriteEntity.prototype.setHeight = function( height ) {
      Entity.prototype.setHeight.call( this, height );

      this.getCanvas().height = height;
    };

    SpriteEntity.prototype.draw = function( ctx ) {
      ctx.drawImage( this.getCanvas(), this.getX(), this.getY() );
    };

    return SpriteEntity;
  }
);

define(
  [ 'color',
    'defaults' ],
  function( Color, Defaults ) {
    'use strict';

    function Entity() {
      this._position = {
        x: 0,
        y: 0
      };

      this._velocity = {
        x: 0,
        y: 0
      };

      this._width = 0;
      this._height = 0;

      this._color = new Color();
    }

    Entity.prototype.getX = function() {
      return this.getPosition().x;
    };

    Entity.prototype.setX = function( x ) {
      this._position.x = x;
    };

    Entity.prototype.getY = function() {
      return this.getPosition().y;
    };

    Entity.prototype.setY = function( y ) {
      this._position.y = y;
    };

    Entity.prototype.getPosition = function() {
      return this._position;
    };

    Entity.prototype.setPosition = function() {
      if ( arguments.length === 1 ) {
        this.setX( arguments[0].x );
        this.setY( arguments[0].y );
      }
      else if ( arguments.length === 2 ) {
        this.setX( arguments[0] );
        this.setY( arguments[1] );
      }
    };

    Entity.prototype.getLeft = function() {
      return this.getX() - this.getHalfWidth();
    };

    Entity.prototype.setLeft = function( left ) {
      this.setX( left + this.getHalfWidth() );
    };

    Entity.prototype.getTop = function( top ) {
      return this.getY() - this.getHalfHeight();
    };

    Entity.prototype.setTop = function( top ) {
      this.setY( top + this.getHalfHeight() );
    };

    Entity.prototype.getRight = function() {
      return this.getX() + this.getHalfWidth();
    };

    Entity.prototype.setRight = function( right ) {
      this.setX( right - this.getHalfWidth() );
    };

    Entity.prototype.getBottom = function() {
      return this.getY() + this.getHalfHeight();
    };

    Entity.prototype.setBottom = function( bottom ) {
      this.setY( bottom - this.getHalfHeight() );
    };

    Entity.prototype.setTopLeft = function() {
      if ( arguments.length === 1 ) {
        this.setLeft( arguments[0].x );
        this.setTop( arguments[0].y );
      }
      else if ( arguments.length === 2 ) {
        this.setLeft( arguments[0] );
        this.setTop( arguments[1] );
      }
    };

    Entity.prototype.getVelocityX = function() {
      return this._velocity.x;
    };

    Entity.prototype.setVelocityX = function( velocityX ) {
      this._velocity.x = velocityX;
    };

    Entity.prototype.getVelocityY = function() {
      return this._velocity.y;
    };

    Entity.prototype.setVelocityY = function( velocityY ) {
      this._velocity.y = velocityY;
    };

    Entity.prototype.getVelocity = function() {
      return this._velocity;
    };

    Entity.prototype.setVelocity = function() {
      if ( arguments.length === 1 ) {
        this._velocity = arguments[0];
      }
      else if ( arguments.length === 2 ) {
        this.setVelocityX( arguments[0] );
        this.setVelocityY( arguments[1] );
      }
    };

    Entity.prototype.getWidth = function() {
      return this._width;
    };

    Entity.prototype.getHalfWidth = function() {
      return this.getWidth() / 2;
    };

    Entity.prototype.setWidth = function( width ) {
      this._width = width;
    };

    Entity.prototype.getHeight = function() {
      return this._height;
    };

    Entity.prototype.getHalfHeight = function() {
      return this.getHeight() / 2;
    };

    Entity.prototype.setHeight = function( height ) {
      this._height = height;
    };

    Entity.prototype.getColor = function() {
      return this._color;
    };

    Entity.prototype.setColor = function() {
      this.getColor().set.apply( this.getColor(), arguments );
    };

    Entity.prototype.update = function( elapsedTime ) {
      // this.setVelocityX( this.getVelocityX() * 0.95 );
      // this.setVelocityY( this.getVelocityY() * 0.95 );

      if ( Math.abs( this.getVelocityX() ) < Defaults.EPSILON ) {
        this.setVelocityX( 0 );
      }
      if ( Math.abs( this.getVelocityY() ) < Defaults.EPSILON ) {
        this.setVelocityY( 0 );
      }

      this.setX( this.getX() + this.getVelocityX() * elapsedTime );
      this.setY( this.getY() + this.getVelocityY() * elapsedTime );

      // if ( this.getX() - this.getHalfWidth() <= 0 ) {
      //   this.setX( this.getHalfWidth() );
      // }
      // if ( this.getX() + this.getHalfWidth() >= Game.instance.WIDTH ) {
      //   this.setX( Game.instance.WIDTH - this.getHalfWidth() );
      // }
      // if ( this.getY() - this.getHalfHeight() <= 0 ) {
      //   this.setY( this.getHalfHeight() );
      // }
      // if ( this.getY() + this.getHalfHeight() >= Game.instance.HEIGHT ) {
      //   this.setY( Game.instance.HEIGHT - this.getHalfHeight() );
      // }
    };

    Entity.prototype.draw = function( ctx ) {
      ctx.fillStyle = this.getColor().toString();
      ctx.fillRect(
        this.getX() - this.getHalfWidth(),
        this.getY() - this.getHalfHeight(),
        this.getWidth(),
        this.getHeight()
      );
    };

    Entity.prototype.hit = function( x, y ) {
      if ( this.contains( x, y ) ) {
        return this;
      }

      return null;
    };

    Entity.prototype.contains = function( x, y ) {
      return Math.abs( x - this.getX() ) <= this.getHalfWidth() &&
             Math.abs( y - this.getY() ) <= this.getHalfHeight();
    };

    return Entity;
  }
);

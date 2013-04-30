define(
  [ 'color', 'spellquest', 'entities/entity', 'entities/letter' ],
  function( Color, Game, Entity, Letter ) {
    // http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
    function fisherYates( array ) {
      var i = array.length;
      if ( i === 0 ) return;
      while ( --i ) {
        var j = Math.floor( Math.random() * ( i + 1 ) );
        var tempi = array[i];
        var tempj = array[j];
        array[i] = tempj;
        array[j] = tempi;
      }

      return array;
    }

    function Pool() {
      Entity.call( this );

      this._spacing = 0;
      // Actual letters, in order.
      this._letters = [];
      // Letter entities, in order.
      this._letterEntities = [];
      // Order of the letter entities in the pool.
      this._letterIndices = [];
      // Whether the letter has been used, in order.
      this._isUsed = [];

      this._textColor = new Color();
      this._fontSize = 12;
    }

    Pool.prototype = new Entity();
    Pool.prototype.constructor = Pool;

    // TODO: Go in order of letter indices.
    Pool.prototype.getLetterByChar = function( character ) {
      var index;
      for ( var i = 0; i < this._letterIndices.length; i++ ) {
        index = this._letterIndices[i];
        if ( this._letterEntities[ index ].getChar() === character && !this._isUsed[ index ] ) {
          this._isUsed[ index ] = true;
          return this._letterEntities[ index ];
        }
      }

      return null;
    };

    Pool.prototype.getSpacing = function() {
      return this._spacing;
    };

    Pool.prototype.setSpacing = function( spacing ) {
      this._spacing = spacing;
    };

    Pool.prototype.getTextColor = function() {
      return this._textColor;
    };

    Pool.prototype.setTextColor = function() {
      this.getTextColor().set.apply( this.getTextColor(), arguments );
    };

    Pool.prototype.getFontSize = function() {
      return this._fontSize;
    };

    Pool.prototype.setFontSize = function( fontSize ) {
      this._fontSize = fontSize;
    };

    Pool.prototype.clear = function() {
      this._letters = [];
      this._letterEntities = [];
      this._letterIndices = [];
      this._isUsed = [];
    };

    Pool.prototype.getLetters = function() {
      return this._letters;
    };

    Pool.prototype.setLetters = function( letters ) {
      var indices = [];
      for ( var i = 0; i < letters.length; i++ ) {
        indices.push(i);
      }

      this._letters = letters;
      this._letterIndices = fisherYates( indices );

      this.createLetterEntities();
    };

    Pool.prototype.createLetterEntities = function() {
      var width = this.getWidth();
      var height = this.getHeight();
      var color = this.getColor();
      var textColor = this.getTextColor();
      var fontSize = this.getFontSize();

      var letter = null;
      for ( var i = 0; i < this.getLetters().length; i++ ) {
        letter = new Letter();
        letter.setWidth( width );
        letter.setHeight( height );
        letter.setColor( color );
        letter.setChar( this.getLetters()[i].toUpperCase() );
        letter.setTextColor( textColor );
        letter.setFontSize( fontSize );

        this._letterEntities.push( letter );
        this._isUsed.push( false );
      }

      var x = this.getX();
      var y = this.getY();
      var spacing = this.getSpacing();
      // Position letters in scrambled order.
      for ( i = 0; i < this._letterIndices.length; i++ ) {
        this._letterEntities[ this._letterIndices[i] ].setPosition( x + i * spacing, y );
      }
    };

    Pool.prototype.reset = function() {
      var x = this.getX();
      var y = this.getY();
      var spacing = this.getSpacing();
      // x-position of letter in pool.
      var xPos = 0;
      var letter = null;
      // The new order of the letters.
      var newIndices = [];
      var formElements = Game.instance.getForm().getFormElements();

      // We want the letters in the form to be first.
      for ( i = 0; i < formElements.length; i++ ){
        if ( formElements[i].hasLetter() ) {
          letter = formElements[i].getLetter();

          // Remove from form element.
          formElements[i].setLetter( null );
          letter.setPosition( x + xPos * spacing, y );

          var index = this._letterEntities.lastIndexOf( letter );
          if ( index !== -1 ) {
            newIndices.push( index );
          }

          xPos++;
        }
      }

      // Shift letters in pool to the right.
      for ( var i = 0; i < this._letterIndices.length; i++ ) {
        if ( !this._isUsed[ this._letterIndices[i] ] ) {
          letter = this._letterEntities[ this._letterIndices[i] ];
          newIndices.push( this._letterIndices[i] );
          letter.setPosition( x + xPos * spacing, y );
          xPos++;
        }
      }

      // Mark all not used.
      for ( i = 0; i < this._isUsed.length; i++ ) {
        this._isUsed[ i ] = false;
      }

      this._letterIndices = newIndices;
    };

    Pool.prototype.pushLetter = function( letter ) {
      var x = this.getX();
      var y = this.getY();
      var spacing = this.getSpacing();

      var xPos = 0;
      var newIndices = [];
      for ( var i = 0; i < this._letterIndices.length; i++ ) {
        if ( !this._isUsed[ this._letterIndices[i] ] ) {
          this._letterEntities[ this._letterIndices[i] ].setPosition( x + xPos * spacing, y );
          newIndices.push( this._letterIndices[i] );
          xPos++;
        }
      }

      // Move to last available position in pool.
      var index = this._letterEntities.lastIndexOf( letter );
      if ( index !== -1 ) {
        this._isUsed[ index ] = false;
        this._letterEntities[ index ].setPosition( x + xPos * spacing, y );
        newIndices.push( index );
      }

      this._letterIndices = newIndices;
    };

    Pool.prototype.update = function( elapsedTime ) {
      for ( var i = 0; i < this._letterEntities.length; i++ ) {
        this._letterEntities[i].update( elapsedTime );
      }
    };

    Pool.prototype.draw = function( ctx ) {
      for ( var i = 0; i < this._letterEntities.length; i++ ) {
        this._letterEntities[i].draw( ctx );
      }
    };

    Pool.prototype.hit = function( x, y ) {
      for ( var i = 0; i < this._letterEntities.length; i++ ) {
        if ( this._letterEntities[i].hit( x, y ) !== null )
          return this._letterEntities[i];
      }

      return null;
    };

    Pool.prototype.shuffle = function() {
      var index = this._isUsed.lastIndexOf( true );

      // Only shuffle if all letters are not used/in pool.
      if ( index === -1 ) {
        var x = this.getX();
        var y = this.getY();
        var spacing = this.getSpacing();

        var xPos = 0;
        this._letterIndices = fisherYates( this._letterIndices );
        for ( var i = 0; i < this._letterIndices.length; i++ ) {
          this._letterEntities[ this._letterIndices[i] ].setPosition( x + xPos * spacing, y );
          xPos++;
        }
      }
    };

    return Pool;
  }
);

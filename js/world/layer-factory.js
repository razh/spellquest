define([
  'color',
  'world/layer-type',
  'world/layer',
  'world/circular-layer',
  'entities/polygon-entity'
], function( Color, LayerType, Layer, CircularLayer, PolygonEntity ) {
  'use strict';

  return {
    createLayer: function( options ) {
      var type = options.type || LayerType.DEFAULT;

      var layer = null;
      switch ( type ) {
        case LayerType.DEFAULT:
          layer = new Layer();
          break;

        case LayerType.CIRCULAR:
          layer = new CircularLayer();
          break;
      }

      layer.setWidth( options.width || 0 );
      layer.setHeight( options.height || 0 );
      layer.setColor( options.color || new Color( 0, 0, 0, 1.0 ) );
      layer.setZIndex( options.zIndex || 0 );
      layer.setParallaxFactor( options.parallaxFactor || 1.0 );

      return layer;
    },

    createTerrainLayer: function( options ) {
      var layer = this.createLayer( options );

      var width = layer.getWidth();
      var height = layer.getHeight();
      var color = layer.getColor();

      var maxTerrainHeight = options.maxTerrainHeight || 0;
      var segmentCount = options.segmentCount || 1;
      var segmentWidth = width / segmentCount;
      var points = [];
      // Loops back to the first point, so we don't need extra vertex at end.
      for ( var i = 0; i < segmentCount; i++ ) {
        points.push( Math.random() * maxTerrainHeight );
      }

      var tempPolygonEntity;
      for ( i = 0; i < segmentCount; i++ ) {
        tempPolygonEntity = new PolygonEntity();
        tempPolygonEntity.setX( i * segmentWidth );
        tempPolygonEntity.setColor( color );
        tempPolygonEntity.setVertices([
          0, height,
          0, height - points[i],
          // Extra pixel added to x-coordinate to connect segments.
          segmentWidth + 1, height - points[ ( i + 1 ) % segmentCount ],
          segmentWidth + 1, height
        ]);

        layer.addProp( tempPolygonEntity );
      }

      return layer;
    }
  };
});

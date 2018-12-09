require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "widgets/wgs",
  "widgets/config"
],
function(
  Map, MapView,
  FeatureLayer,
  SimpleRenderer,
  wgs,
  config
) {

  var map = new Map({
    basemap: "dark-gray-vector"
  });

  var view = new MapView({
    container: "map",
    map: map,
    extent: {
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: 102100
    },
    zoom: 3
  });

  var renderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      outline: { // autocasts as new SimpleLineSymbol()
        color: "lightgray",
        width: 0.5
      }
    },
    label: "tree",
    visualVariables: [{
      type: "size",
      field: "POP",
      valueUnit: "inches",
      valueRepresentation: "radius"
    }]
  };

  var featureLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/XRQ58kpEa17kSlHX/ArcGIS/rest/services/World_Cities/FeatureServer/0",
    renderer: renderer
  });

  map.add(featureLayer);

  view.when(function() {
    wgs = new wgs({
      view: view,
      initialCenter: [-100.33, 43.69]
    });
    view.ui.add(wgs, "top-right");
  });

});
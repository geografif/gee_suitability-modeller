//============================================================================================================
// Title: Create panel showing vector attribute upon clicked
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);
Map.style().set('cursor', 'crosshair');

// DEFINE VECTOR DATASET
var legPBPH = ee.FeatureCollection('projects/ee-afiffauzan/assets/PBPH'); //to-be-preprocessed
Map.addLayer(legPBPH);

// CREATE EMPTY PANEL
var panelFeatureInfo = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '10px',
    width: '150px'
  }
});
Map.add(panelFeatureInfo);

// CREATE FUNCTION TO DISPLAY ATTRIBUTE ON THE PANEL
var updateFeatureInfoPanel = function(feature) {
  panelFeatureInfo.clear();

  if (feature) {
    var properties = feature.toDictionary();
    var propertyNames = ['namaobj', 'sk_awal', 'Developer']; // Specify the property names you want to display

    propertyNames.forEach(function(propertyName) {
      var value = ee.String(properties.get(propertyName)).getInfo(); // Retrieve property value as a string
      var label = ui.Label(propertyName + ':', {fontWeight:'bold',fontSize: '11px' }); // Set font size to 11px
      var text = ui.Label(value, { fontSize: '11px' }); // Set font size to 11px

      panelFeatureInfo.add(label);
      panelFeatureInfo.add(text);
    });
  }
};


Map.onClick(function(coords) {
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var clickedFeatures = legPBPH.filterBounds(point);

  var feature = ee.Feature(clickedFeatures.first());

  updateFeatureInfoPanel(feature);
});

//============================================================================================================
// Title: Filter raster based on provided value range, return filtered raster with value of 0 (outside range) and 1 (inside range)
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE SAMPLE RASTER DATASET
var image = ee.Image('projects/ee-afiffauzan/assets/envPrecip');

// CREATE TEXTBOXES FOR VALUE RANGE INPUT
var minValueBox = ui.Textbox('Minimum Value', '');
var maxValueBox = ui.Textbox('Maximum Value', '');

// CREATE CHECKBOX FOR DISPLAY CONTROL
var displayCheckbox = ui.Checkbox('Display Filtered Image', false);

// Function to filter the image based on input values
var filterImage = function() {
  var minValue = parseFloat(minValueBox.getValue());
  var maxValue = parseFloat(maxValueBox.getValue());

  // Apply the value range filter
  //var filteredImage = image.updateMask(image.gte(minValue).and(image.lte(maxValue))).reclassify([1]);
   
  var filteredImage = ee.Image(1).where(image.lt(minValue), 0)
    .where(image.gte(minValue).and(image.lte(maxValue)), 1)
    .where(image.gt(maxValue), 0)
    .updateMask(image.gt(0))
   
  return filteredImage;
};

// Function to update the map based on checkbox state
var updateMap = function() {
  Map.layers().forEach(function(layer) {
    if (layer.getName() === 'Filtered Image') {
      Map.remove(layer);
    }
  });

  if (displayCheckbox.getValue()) {
    var filteredImage = filterImage();
    Map.addLayer(filteredImage, {}, 'Filtered Image');
  }
};

// Register event handlers for textbox and checkbox changes
minValueBox.onChange(updateMap);
maxValueBox.onChange(updateMap);
displayCheckbox.onChange(updateMap);

// Add the textboxes and checkbox to the panel
var panel = ui.Panel([minValueBox, maxValueBox, displayCheckbox], ui.Panel.Layout.flow('horizontal'));
ui.root.insert(0, panel);

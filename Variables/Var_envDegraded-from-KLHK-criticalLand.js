//============================================================================================================
// Title: Remove background pixels from KLHK's Critical Land raster (was rasterized in desktop GIS beforehand)
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE RASTER
var envDegradedLand1 = ee.Image('projects/ee-afiffauzan/assets/criticalLand')

// FILTER RASTER WITH PIXEL VALUE GREATER THAN 0
var envDegradedLand1 = envDegradedLand1.updateMask(envDegradedLand1.gt(0));

// DISPLAY RASTER
Map.addLayer(envDegradedLand1, {
  min: 1,
  max: 3,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
}, '');

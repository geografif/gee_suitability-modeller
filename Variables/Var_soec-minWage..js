//============================================================================================================
// Title: Display Regional Minimum Wage (raster)
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE MINIMUM WAGE DATASET
var minWage = ee.Image('projects/ee-afiffauzan/assets/soecWage');

// DISPLAY
Map.addLayer(minWage, {
  min: 1800000,
  max: 5200000,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
}, 'minWage', 1);

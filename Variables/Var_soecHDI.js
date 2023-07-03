//============================================================================================================
// Title: Display Human Development Index (raster)
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE MINIMUM WAGE DATASET
var HDI = ee.Image('projects/ee-afiffauzan/assets/soecHDI');

// DISPLAY
Map.addLayer(minWage, {
  min: 34,
  max: 90,
  palette: ['EE2E31', 'F4C095', '679289', '1D7874', '071E22']
}, 'HDI', 1);

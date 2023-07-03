//============================================================================================================
// Title: Average Humidity 30 years, export to asset
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================


//======================================DEFINE DATASETS==========================================================
// Define: AOI---------------------------------------------------------------------------------------------------
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
//var aoi_idn = aoi_idn.map(function(f) {
//  return f.intersection(aoi_idn_west, 1)}); //option to select analysis scope from nationwide to priority region

// Define: Humidity------------------------------------------------------------------------------
var envHumid = ee.ImageCollection('NASA/FLDAS/NOAH01/C/GL/M/V001').filterDate('1992-01-01', '2022-12-31').select('Qair_f_tavg');

//======================================PREPROCESSING==========================================================
//// Average humidity over 30 years
var envHumid = envHumid.mean();
print(envHumid, 'Average Humidity 30 years period')

//======================================VISUALIZATION==========================================================
Map.addLayer(envHumid, {min: 0, max: 0.02, palette: ['purple', 'cyan', 'green']}, 'Mean humidity');
Map.centerObject(aoi_idn, 5);

//======================================EXPORT==========================================================
//// To GDrive
// Export.image.toDrive({
//   image: envPrecip,
//   description: 'envPrecip',
//   folder: 'GIStool', 
//   region: aoi_idn,
//   maxPixels:1e13,
//   //crs: 'EPSG:32647'
//   //scale: 10,
// });

//// To EE Asset
Export.image.toAsset({
  image: envHumid,
  description: 'envHumid',
  assetId: 'envHumid',
  region: aoi_idn,
  maxPixels:1e13,
  //crs: 'EPSG:32647'
  //scale: 10,
});



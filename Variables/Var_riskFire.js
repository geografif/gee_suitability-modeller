//============================================================================================================
// Title: Fire hazard based on historical burned event frequency in month
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================


//======================================DEFINE DATASETS==========================================================
// Define: AOI---------------------------------------------------------------------------------------------------
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
//var aoi_idn = aoi_idn.map(function(f) {
//  return f.intersection(aoi_idn_west, 1)}); //option to select analysis scope from nationwide to priority region

// Define: Temperature------------------------------------------------------------------------------
var riskFire = ee.ImageCollection('MODIS/061/MCD64A1').filter(ee.Filter.date('2000-01-01', '2023-03-01')).select('BurnDate');

//======================================PREPROCESSING==========================================================
//// Convert date into frequency
var conversion = function(img){
  img = img.where(img.gt(0), 1);
  return img.clip(aoi_idn);
};

var riskFire = riskFire.map(conversion).sum();

//======================================VISUALIZATION==========================================================
Map.addLayer(riskFire, {min: 0, max: 10, palette: ['purple', 'cyan', 'red']}, 'Mean humidity');
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
  image: riskFire,
  description: 'riskFire',
  assetId: 'riskFire',
  region: aoi_idn,
  maxPixels:1e13,
  //crs: 'EPSG:32647'
  //scale: 10,
});


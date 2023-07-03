//============================================================================================================
// Title: Annual precipitation, average 30 years
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================


//======================================DEFINE DATASETS==========================================================
// Define: AOI---------------------------------------------------------------------------------------------------
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
//var aoi_idn = aoi_idn.map(function(f) {
//  return f.intersection(aoi_idn_west, 1)}); //option to select analysis scope from nationwide to priority region

// Define: Precipitation------------------------------------------------------------------------------
var envPrecip = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY").select('precipitation').filterDate('1992-01-01', '2022-12-31'); //to-be-preprocessed
//print(envPrecip, 'CHIRPS daily precipitation');

//======================================PREPROCESSING==========================================================
//// Average Annual Precipitation over 30 years
var year = ee.List.sequence(1992, 2022);

var annualAggregate = function(y){
  var range = ee.Filter.calendarRange(y, y, 'year');
  return envPrecip.select('precipitation').filter(range).sum().set('Year', y).clip(aoi_idn);
};

var envPrecip = ee.ImageCollection(year.map(annualAggregate));
var envPrecip = envPrecip.mean();
print(envPrecip, 'Average Annual Rainfall 30 years period')

//======================================VISUALIZATION==========================================================
Map.addLayer(envPrecip, {min: 700, max: 7000, palette: ['caeeff', '418dff', '0000ff']}, 'Climate - Annual Rainfall');
Map.centerObject(aoi_idn, 5);

//======================================EXPORT==========================================================
// To GDrive
// Export.image.toDrive({
//   image: envPrecip,
//   description: 'envPrecip',
//   folder: 'GIStool', 
//   region: aoi_idn,
//   maxPixels:1e13,
//   //crs: 'EPSG:32647'
//   //scale: 10,
// });

// To EE Asset
Export.image.toAsset({
  image: envPrecip,
  description: 'envPrecip',
  assetId: 'envPrecip',
  region: aoi_idn,
  maxPixels:1e13,
  //crs: 'EPSG:32647'
  //scale: 10,
});



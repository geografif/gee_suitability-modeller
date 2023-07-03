//============================================================================================================
// Title: Flood risk based on historical flood event frequency in month
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

//======================================DEFINE DATASETS==========================================================
// Define: AOI---------------------------------------------------------------------------------------------------
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
//var aoi_idn = aoi_idn.map(function(f) {
//  return f.intersection(aoi_idn_west, 1)}); //option to select analysis scope from nationwide to priority region

// Define: Historical flood------------------------------------------------------------------------------
var riskFlood = ee.ImageCollection("GLOBAL_FLOOD_DB/MODIS_EVENTS/V1").filterDate('2000-01-01', '2023-03-01').select(['flooded','jrc_perm_water']);

//======================================PREPROCESSING==========================================================
//// Define permanent water
var permanentWater = riskFlood.select('jrc_perm_water').sum().clip(aoi_idn).gte(1);

//// Convert date into frequency
var conversion = function(img){
  var img1 = img.select('flooded');
  var img2 = img1.where(img1.neq(0), 1);
  return img2.clip(aoi_idn);
};

//// Select flooded not on permanentwater
var riskFlood = riskFlood.map(conversion);
var riskFlood = riskFlood.sum().neq(0).selfMask().updateMask(permanentWater.neq(1));

//======================================VISUALIZATION==========================================================
Map.addLayer(riskFlood, {min: 0, max: 9, palette: ['purple', 'cyan', 'red']}, 'Flooded');
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
  image: riskFlood,
  description: 'riskFlood',
  assetId: 'riskFlood',
  region: aoi_idn,
  scale: 500,
  maxPixels:1e13,
  //crs: 'EPSG:32647'
  //scale: 10,
});


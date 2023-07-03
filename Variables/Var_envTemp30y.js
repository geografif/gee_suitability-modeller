//============================================================================================================
// Title: Temperature, averaged 30 years
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
var envTemp = ee.ImageCollection('ECMWF/ERA5/MONTHLY').filterDate('1992-01-01', '2022-12-31').select('mean_2m_air_temperature'); //to-be-preprocessed

//======================================PREPROCESSING==========================================================
//// Average temperature over 30 years
var KtoC = function(img){
  var envTemp = img.subtract(273.15).rename('TempC');
  return img.addBands(envTemp).select('TempC').clip(aoi_idn);
};

var envTemp = envTemp.map(KtoC).mean();
print(envTemp, 'Average Temperature 30 years period')

//======================================VISUALIZATION==========================================================
Map.addLayer(envTemp, {min: 13, max: 30, palette: ['418dff', 'fff933','ff8b39']}, 'Climate - Temperature', 0);
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
  image: envTemp,
  description: 'envTemp',
  assetId: 'envTemp',
  region: aoi_idn,
  maxPixels:1e13,
  //crs: 'EPSG:32647'
  //scale: 10,
});



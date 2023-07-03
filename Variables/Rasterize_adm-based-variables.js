//============================================================================================================
// Title: Rasterize city/regency administrative-based variables: Human Development Index & Minimum Wage
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));

// CLIP AOI (OPTIONAL)
//var aoi_idn = aoi_idn.map(function(f) {
//  return f.intersection(aoi_idn_west, 1)}); //option to select analysis scope from nationwide to priority region

//Map.setCenter(-99.976, 40.38, 5);
Map.centerObject(aoi_idn);

// LOAD ADMINISTRATIVE-BASED VARIABLE POLYGONS
var counties = ee.FeatureCollection('projects/ee-afiffauzan/assets/wageHDI');

// SELECT ATTRIBUTE TO BE ASSIGN TO RASTER PIXEL & RASTERIZE
var landAreaImg = counties
  .filter(ee.Filter.notNull(['HDIndex'])) //change ['HDIndex'] to ['MinWage'] and vice versa
  .reduceToImage({
    properties: ['HDIndex'], //change ['HDIndex'] to ['MinWage'] and vice versa
    reducer: ee.Reducer.first()
});

// DISPLAY RASTER
Map.addLayer(landAreaImg, {
  min: 10,
  max: 100,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
}, '', 0);

// EXPORT RASTER TO EE ASSET
Export.image.toAsset({
  image: landAreaImg,
  description: 'soecHDI', //rename
  assetId: 'soecHDI', //rename
  region: aoi_idn,
  maxPixels:1e13,
  //crs: 'EPSG:32647' //set change projection
  //scale: 10, //set pixel size
});

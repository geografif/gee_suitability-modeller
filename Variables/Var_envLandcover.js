//============================================================================================================
// Title: Land cover KLHK
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE RASTER
var landCover = ee.Image('projects/ee-afiffauzan/assets/landcoverKLHK21')

// FILTER PIXEL GREATER OR EQUAL THAN 1, REMOVE BACKGROUND WITH PIXEL VALUE OF 0
var landCover = landCover.updateMask(landCover.gte(1));

// DISPLAY
Map.addLayer(landCover, {min:1, max:14, palette:['blue','green','yellow','red']})

//============================================================================================================
// Title: Create buffer based on raster data
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));

// DEFINE SETTLEMENT RASTER DATASET
var soecSettlement = ee.ImageCollection('projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS').filterDate('2022-01-01','2022-12-31').mosaic().clip(aoi_idn).eq(7).selfMask();
Map.addLayer(soecSettlement, {palette:'orange'}, 'built-up area')

// CREATE BUFFER
var soecSettlement = soecSettlement.focal_min({radius:30000, units:'meters'}); //integrate this to button;
Map.addLayer(soecSettlement, {palette:'red', opacity:0.3}, 'Buffer')

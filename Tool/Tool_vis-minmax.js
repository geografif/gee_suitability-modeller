//============================================================================================================
// Title: Display raster based on its minimum and maximum pixel value
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// LOAD SAMPLE DATASET
var image1 = ee.Image('projects/ee-afiffauzan/assets/soecHDI').clip(aoi_idn);
Map.addLayer(image1)

// EXTRACT MINIMUM & MAXIMUM VALUE OF A RASTER
var minMax = image1.reduceRegion({
      reducer: ee.Reducer.minMax(),
      geometry: aoi_idn,
      scale: 10000
});
    
print(minMax, 'Minimum and maximum value')

// EXTRACT NUMBERS/VALUES FROM THE 'minMax' VARIABLE AS SINGLE VALUE
var minValueSuit = ee.Number(minMax.get('first_min')).getInfo();
var maxValueSuit = ee.Number(minMax.get('first_max')).getInfo();
print('Min Value:', minValueSuit);
print('Max Value:', maxValueSuit);

// DEFINE THE VALUES IN VISUALIZATION PARAMETER
var vizParams = {
      min: minValueSuit,
      max: maxValueSuit,
      palette: ['red', 'yellow', 'green']
    };

// DISPLAY THE RASTER
Map.addLayer(image1, vizParams, 'Suitability');

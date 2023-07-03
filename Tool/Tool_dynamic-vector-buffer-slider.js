//============================================================================================================
// Title: Slider for defining buffer distance from (offtaker) points
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

// DEFINE AOI
var aoi_idn = ee.FeatureCollection("FAO/GAUL/2015/level0").filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'));
Map.centerObject(aoi_idn);

// DEFINE VECTOR POINT DATASET
var soecOfftaker = ee.FeatureCollection('projects/ee-afiffauzan/assets/Offtaker');//to-be-preprocessed
Map.addLayer(soecOfftaker, {})

// CREATE SIDE PANEL
var panelMain = ui.Panel();
panelMain.style().set({
  width: '350px',
  position: 'bottom-right',
  border : '1px solid #000000',
});


// CREATE PANEL ITEM
var panelOfftaker = ui.Panel({layout: ui.Panel.Layout.Flow('horizontal')});

var typeOfftaker = soecOfftaker.aggregate_array('Category');
var selectOfftaker = ui.Select({
  //items: degradedList.getInfo(),
  //items: ['TFP', 'NTFP', 'All'],
  items: ee.List(['All']).cat(ee.List(typeOfftaker)).distinct().getInfo(),
  placeholder: ('Select offtaker'),
  style: {width: '120px'},
  onChange: updateSelectOfftaker
});

var sliderOfftaker = ui.Slider({
  min:0,
  max:100000,
  value:30000,
  step:1000,
  style: {width: '320px', fontSize:'10px', position:'top-center'},
  onChange: updateBufferOfftaker,
});

var checkboxOfftaker = ui.Checkbox({
  label: 'Distance from offtakers (m)',
  value: false,
  style: {fontSize:'11px', fontWeight:'bold', width: '150px', height:'30px'},
  onChange: updateBufferOfftaker,
});

var filteredOfftaker = soecOfftaker; //initialize

function updateSelectOfftaker() {
  var selectedOfftakerCat = selectOfftaker.getValue();
  if (selectedOfftakerCat == 'All') {
    filteredOfftaker = soecOfftaker;
  } else {
    filteredOfftaker = soecOfftaker.filter(ee.Filter.eq('Category', selectedOfftakerCat));
  }
  updateBufferOfftaker();//still not filtering
}

function updateBufferOfftaker() {
  // Get the slider value
  var bufferOfftakerSize = sliderOfftaker.getValue();

  // Perform the buffer operation on the geometry
  var bufferOfftaker = filteredOfftaker.geometry().buffer(bufferOfftakerSize);

  // Convert the buffer to a raster with a value of 1
  var bufferOfftakerRast = ee.Image.constant(1).clip(bufferOfftaker);

  // Remove the previous buffer layer from the map
  Map.layers().forEach(function(layer) {
    if (layer.getName() === 'Distance from offtakers') {
      Map.remove(layer);
    }
  });

  // Check if the checkbox is checked
  if (checkboxOfftaker.getValue()) {
    // Add the new buffer layer to the map
    Map.addLayer(bufferOfftakerRast, {palette: 'yellow', opacity:0.5}, 'Distance from offtakers');
  }
}

updateBufferOfftaker();
panelOfftaker.add(checkboxOfftaker);
panelOfftaker.add(selectOfftaker);
panelMain.add(panelOfftaker);
panelMain.add(sliderOfftaker);

ui.root.add(panelMain);

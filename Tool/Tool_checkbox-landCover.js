//============================================================================================================
// Title: Checkbox to filter landcover (KLHK)
// Category: Tool
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

var envLandcover = ee.Image('projects/ee-afiffauzan/assets/landcoverKLHK21');
var image = envLandcover.updateMask(envLandcover.gte(1));
print(image);

// Define the unique pixel values in your image
var uniqueValues = ee.List.sequence(1, 14);

// Define the labels for the checkboxes
var checkboxLabels = [
  'Primary dryland forest',
  'Open land',
  'Shrubs',
  'Secondary dryland forest',
  'Grassland',
  'Agriculture',
  'Primary wetland forest',
  'Mining',
  'Plantation',
  'Secondary wetland forest',
  'Plantation forest',
  'Primary mangrove forest',
  'Secondary mangrove forest',
  'Aquaculture'
];

// Create a main panel for the checkboxes
var mainPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    position: 'bottom-right',
    width: '420px',
    height: '400px',
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid black',
    fontSize: '10px'
  }
});

// Create subpanels for each row of checkboxes
var subpanels = [];

// Create an empty dictionary to store the filter states
var filterStates = {};

// Create checkboxes for each unique pixel value
uniqueValues.getInfo().forEach(function(value, index) {
  var checkbox = ui.Checkbox({
    label: checkboxLabels[index],
    value: false,
    style: {fontSize: '10px'}, // Set the font size for the checkboxes
  });
  checkbox.onChange(function(checked) {
    // Update the filter state for the corresponding checkbox value
    filterStates[value] = checked;

    // Filter the image based on the selected checkbox values
    var filteredImage = ee.Image.constant(0);
    for (var key in filterStates) {
      if (filterStates[key]) {
        filteredImage = filteredImage.where(image.eq(Number(key)), Number(key));
      }
    }

    // Display the filtered image on the map
    Map.layers().set(0, filteredImage.updateMask(filteredImage).visualize({
      min: 1,
      max: 14,
      palette: [
        '#1f4423',  // Primary dryland forest (dark green)
        '#ffd700',  // Open land (gold)
        '#8b4513',  // Shrubs (saddle brown)
        '#228b22',  // Secondary dryland forest (forest green)
        '#7cfc00',  // Grassland (chartreuse)
        '#00ff00',  // Agriculture (lime)
        '#006400',  // Primary wetland forest (dark green)
        '#808080',  // Mining (gray)
        '#556b2f',  // Plantation (dark olive green)
        '#2e8b57',  // Secondary wetland forest (sea green)
        '#00ff7f',  // Plantation forest (spring green)
        '#006400',  // Primary mangrove forest (dark green)
        '#32cd32',  // Secondary mangrove forest (lime green)
        '#00bfff'   // Aquaculture (deep sky blue)
      ]
    }));

    // Assign the filteredImage to a variable for use in other operations
    var filteredImageForOtherOperations = filteredImage.where(image.eq(Number(key)), 1);
    return filteredImageForOtherOperations

    // Call your other functions here, passing the filteredImageForOtherOperations variable
    // otherFunction(filteredImageForOtherOperations);
  });

  // Create a subpanel for each row
  if (index % 3 === 0) {
    var subpanel = ui.Panel({
      layout: ui.Panel.Layout.flow('horizontal')
    });
    subpanels.push(subpanel);
  }

  // Add the checkbox to the current subpanel
  subpanels[subpanels.length - 1].add(checkbox);
});

// Add the subpanels to the main panel
subpanels.forEach(function(subpanel) {
  mainPanel.add(subpanel);
});

// Add the main panel to the Map
Map.add(mainPanel);

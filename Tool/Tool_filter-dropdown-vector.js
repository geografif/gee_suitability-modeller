//============================================================================================================
// Title: Display and return filtered vector attribute, return as raster
// Category: Variable
// Author: M. Afif Fauzan
// Date: 3 Jul 2023
//============================================================================================================

var legStateForest = ee.Image('projects/ee-afiffauzan/assets/stateForest');
legStateForest = legStateForest.updateMask(legStateForest.gt(1));

// UI: Main Panel
var panelMain = ui.Panel();
panelMain.style().set({
  width: '350px',
  position: 'bottom-right',
  border: '1px solid #000000',
});

panelMain.add(ui.Label('Legal:', { fontWeight: 'bold', fontSize: '12px', color: 'green' }));

// State Forest checkbox
var panelLegStateForest = ui.Panel({ layout: ui.Panel.Layout.Flow('horizontal') });
var checkboxLegStateForest = ui.Checkbox({ label: 'On state forests', style: { fontWeight: 'bold', fontSize: '11px', height: '30px', width: '150px' } });

var selectLegStateForest = ui.Select({
  items: ['All', 'Production', 'Protection'],
  placeholder: 'Function',
  style: { width: '120px' },
});

var stateForestLayer = null; // Variable to store the layer

var updateLegStateForest = function() {
  var selectedFunction = selectLegStateForest.getValue();

  // Remove the previous layer from the map if it exists
  if (stateForestLayer !== null) {
    Map.remove(stateForestLayer);
    stateForestLayer = null; // Reset the layer variable
  }

  var filteredLegStateForest;
  if (selectedFunction === 'Production') {
    filteredLegStateForest = legStateForest.eq(3).selfMask();
  } else if (selectedFunction === 'Protection') {
    filteredLegStateForest = legStateForest.eq(2).selfMask();
  } else {
    // When 'All' is selected, return the original image
    filteredLegStateForest = legStateForest;
  }

  // Add the new layer to the map if the checkbox is checked
  if (checkboxLegStateForest.getValue()) {
    stateForestLayer = ui.Map.Layer(filteredLegStateForest, { min: 2, max: 3, palette: ['green', 'lime'], opacity: 0.5 }, 'State Forest');
    Map.layers().add(stateForestLayer);
  }
};

selectLegStateForest.onChange(updateLegStateForest);
checkboxLegStateForest.onChange(updateLegStateForest);

panelLegStateForest.add(checkboxLegStateForest);
panelLegStateForest.add(selectLegStateForest);
panelMain.add(panelLegStateForest);

ui.root.add(panelMain);

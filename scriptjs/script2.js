document.getElementById('calculateButton').addEventListener('click', function() {
    // Get elements
     const cargoSelect = document.getElementById('cargo-select');
    const volumeInput = document.getElementById('volume-counter');
    const productRow = document.getElementById('productRow');
      const calculationSection = document.getElementById('calculationSection')
     const totalVolumeElement = document.getElementById('total-volume');
     const totalWeightElement = document.getElementById('total-weight');
     const itemsLabel = document.getElementById('items-label'); // Get the label element
    // Extract values and ensure volume is a number
    const cargoType = cargoSelect.value;
    const volume = parseInt(volumeInput.value, 10) || 0;
    if(!productRow){
         console.error("Error: Table row with id = productRow not found");
        return;
    }
    if(!calculationSection){
          console.error("Error: Section with id = calculationSection not found");
        return;
    }
    if(!totalVolumeElement){
         console.error("Error: Total volume element with id = total-volume not found");
        return;
    }
    if(!totalWeightElement){
         console.error("Error: Total weight element with id = total-weight not found");
         return;
    }
    if(!itemsLabel){
       console.error("Error: Item label element with id = items-label not found");
         return;
    }

    // Define prices per cubic meter (encapsulated for better management)
    const prices = {
        'Щебень': 2690.40,
        'Плодородный грунт': 1857.10,
        'Навоз': 87.10,
        'Песок': 412.80,
    };

    //Get price from object
    const pricePerCubicMeter = prices[cargoType] || 0;


    const weight = volume * 1.5;
    const totalCost = volume * pricePerCubicMeter;

    // Update table row with formatted numbers
    productRow.cells[0].textContent = cargoType;                                               // Type of cargo
    productRow.cells[1].textContent = volume;                                          // Volume
    productRow.cells[2].textContent = weight.toFixed(2);                                 // Weight
    productRow.cells[3].textContent = pricePerCubicMeter.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    productRow.cells[4].textContent = totalCost.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

    // Update the IOTOG: values
      totalVolumeElement.textContent = `${volume} м³`;
      totalWeightElement.textContent = `${weight.toFixed(2)} тонн`;

      //show the items label
        itemsLabel.classList.remove('hidden-items');


    calculationSection.scrollIntoView({ behavior: 'smooth' });
});





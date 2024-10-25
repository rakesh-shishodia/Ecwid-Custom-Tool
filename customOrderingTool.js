// JavaScript File: customOrderingTool.js

Ecwid.OnAPILoaded.add(function() {
    document.addEventListener("DOMContentLoaded", function() {
        let rowsContainer = document.getElementById('rowsContainer');
        let addRowButton = document.getElementById('addRowButton');
        let addAllButton = document.getElementById('addAllToCart');
        let grandTotalLengthElem = document.getElementById('grandTotalLength');
        let grandTotalPcsElem = document.getElementById('grandTotalPcs');
        let grandTotalCostElem = document.getElementById('grandTotalCost');
        let costPerMm = 10;

        // Fetch product price from the server
        fetch('http://localhost:3000/api/product-price')
            .then(response => response.json())
            .then(data => {
                if (data.price) {
                    costPerMm = data.price / 1000;
                }
            })
            .catch(error => {
                console.error('Error fetching product price:', error);
            });

        // Add initial rows
        for (let i = 0; i < 5; i++) {
            addRow();
        }

        function addRow() {
            let row = document.createElement('tr');

            let lengthInput = document.createElement('input');
            lengthInput.type = 'text';
            lengthInput.className = 'input-field input-length';
            lengthInput.placeholder = 'Enter length in mm';

            let quantityInput = document.createElement('input');
            quantityInput.type = 'text';
            quantityInput.className = 'input-field input-pcs';
            quantityInput.placeholder = 'Enter pcs';

            let costElem = document.createElement('td');
            costElem.className = 'cost cost-field';
            costElem.innerText = '0';

            lengthInput.addEventListener('input', updateRow);
            quantityInput.addEventListener('input', updateRow);

            function updateRow() {
                let length = parseInt(lengthInput.value) || 0;
                let quantity = parseInt(quantityInput.value) || 0;
                let cost = length * quantity * costPerMm;

                costElem.innerText = `${cost}`;

                updateGrandTotals();
            }

            let lengthTd = document.createElement('td');
            lengthTd.appendChild(lengthInput);
            let quantityTd = document.createElement('td');
            quantityTd.appendChild(quantityInput);

            row.appendChild(lengthTd);
            row.appendChild(quantityTd);
            row.appendChild(costElem);

            rowsContainer.appendChild(row);
        }

        function updateGrandTotals() {
            let rows = rowsContainer.querySelectorAll('tr');
            let grandTotalLength = 0;
            let grandTotalPcs = 0;
            let grandTotalCost = 0;

            rows.forEach(function(row) {
                let lengthInput = row.querySelector('input');
                let quantityInput = row.querySelectorAll('input')[1];
                let length = parseInt(lengthInput.value) || 0;
                let quantity = parseInt(quantityInput.value) || 0;
                let cost = length * quantity * costPerMm;

                grandTotalLength += length * quantity;
                grandTotalPcs += quantity;
                grandTotalCost += cost;
            });

            grandTotalLengthElem.innerText = `${grandTotalLength} mm`;
            grandTotalPcsElem.innerText = `${grandTotalPcs}`;
            grandTotalCostElem.innerText = `${grandTotalCost}`;
        }

        addRowButton.addEventListener('click', addRow);
        addAllButton.addEventListener('click', function() {
            let rows = rowsContainer.querySelectorAll('tr');
            let items = [];

            rows.forEach(function(row) {
                let lengthInput = row.querySelector('input');
                let quantityInput = row.querySelectorAll('input')[1];
                let length = parseInt(lengthInput.value) || 0;
                let quantity = parseInt(quantityInput.value) || 0;
                if (quantity > 0) {
                    items.push({
                        length: length,
                        quantity: quantity,
                        pricePerMm: costPerMm
                    });
                }
            });

            if (items.length > 0) {
                // Construct the cart URL
                let cartItems = items.map(item => ({
                    id: 704928053, // Replace with your product ID
                    quantity: item.quantity,
                    options: {
                        "Length": `${item.length} mm`
                    }
                }));

                let cart = {
                    "gotoCheckout": false,
                    "products": cartItems
                };

                let cartCode = encodeURIComponent(JSON.stringify(cart));
                let cartUrl = `https://store109477254.company.site/#!/~/cart/create=${cartCode}`;

                // Open the cart URL
                window.open(cartUrl, '_blank');
            }
        });
    });
});

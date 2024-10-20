// ==UserScript==
// @name         Ready to Ship Quantity in Smart Doll Store
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Displays inventory quantity on individual product pages in Smart Doll Store.
// @author       Vega Starlight vel Piotr Hałaczkiewicz
// @match        https://shop.smartdoll.jp/*/products/*
// @match        https://shop.smartdoll.jp/products/*
// @grant        none
// @license      MIT License Copyright (c) 2024 Piotr Hałaczkiewicz
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL and append ".js" to form the URL of the JSON file
    var currentUrl = window.location.href;
    var jsonUrl = currentUrl + ".js";

    // Function to create and add a span element with the id and inventory quantity
    function addInventoryInfo(targetDiv, id, inventoryQuantity) {
        // Create a new span element
        var spanElement = document.createElement('span');
        // Set the text content with ID and inventory quantity
        //spanElement.textContent = `ID: ${id}, Qty: ${inventoryQuantity}`;
        spanElement.textContent = ` Ready to ship: ${inventoryQuantity}`;
        // Add the span element to the target div
        targetDiv.appendChild(spanElement);
    }

    // Fetch the JSON file from the constructed URL
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            // Find the "variants" key in the JSON data
            var variants = data.variants;

            // Find all divs with the class "variant-selector"
            var variantDivs = document.querySelectorAll('div.variant-selector');

            // Find the div with class "product__buy"
            var buyDiv = document.querySelector('div.product__buy');

            // Only proceed if the product__buy div is found
            if (buyDiv) {
                // Iterate through each "variant-selector" div
                variantDivs.forEach(function(variantDiv) {
                    // Try to find <li> elements first
                    var listItems = variantDiv.querySelectorAll('li');

                    if (listItems.length > 0) {
                        // Iterate through each <li> element
                        listItems.forEach(function(listItem) {
                            // Find the <input> element inside the <li>
                            var inputElement = listItem.querySelector('input');

                            // Check if input exists
                            if (inputElement) {
                                // Get the value of the input (this is the id)
                                var inputValue = inputElement.value;

                                // Find the variant in the JSON with the matching id
                                var variant = variants.find(v => v.id == inputValue);

                                // If the variant is found, get the inventory_quantity
                                if (variant) {
                                    var inventoryQuantity = variant.inventory_quantity;

                                    // Find the <label> element inside the <li>
                                    var labelElement = listItem.querySelector('label');

                                    if (labelElement) {
                                        // Find the <span> with class "product-variant__title" inside the label
                                        var spanElement = labelElement.querySelector('span.product-variant__title');

                                        // Append the input value and inventory quantity
                                        if (spanElement) {
                                            //spanElement.textContent += ` ${inputValue} (Qty: ${inventoryQuantity})`;
                                            spanElement.textContent += ` (Ready to ship: ${inventoryQuantity})`;
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        // If no listItems are found, try to find <option> elements
                        var optionItems = variantDiv.querySelectorAll('option');

                        // Iterate through each <option> element
                        optionItems.forEach(function(optionItem) {
                            // Get the value of the option (this is the id)
                            var optionValue = optionItem.value;

                            // Find the variant in the JSON with the matching id
                            var variant = variants.find(v => v.id == optionValue);

                            // If the variant is found, get the inventory_quantity
                            if (variant) {
                                var inventoryQuantity = variant.inventory_quantity;

                                // Append the inventory info to the product__buy div
                                addInventoryInfo(buyDiv, optionValue, inventoryQuantity);
                            }
                        });
                    }
                });
            }

            // Find all divs with the class "variant-grid-item"
            var variantGridItems = document.querySelectorAll('div.variant-grid-item');

            // Iterate through each variant-grid-item div
            variantGridItems.forEach(function(gridItem) {
                // Get the value of the data-product-variant attribute (this is the id)
                var variantId = gridItem.getAttribute('data-product-variant');

                // Check if variantId exists
                if (variantId) {
                    // Find the variant in the JSON with the matching id
                    var variant = variants.find(v => v.id == variantId);

                    // If the variant is found, get the inventory_quantity
                    if (variant) {
                        var inventoryQuantity = variant.inventory_quantity;

                        // Append the inventory info to the gridItem div
                        addInventoryInfo(gridItem, variantId, inventoryQuantity);
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching or processing JSON file:', error));
})();

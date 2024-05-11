document.getElementById("searchButton").addEventListener("click", function() {
    var searchTerm = document.getElementById("searchInput").value.trim().toLowerCase().replace(/[^\w\s]/g, '');

    // Check if the search term is empty or only whitespace
    if (!searchTerm) {
        displayEmptySearchMessage();
        return; // Exit the function
    }

    // Fetch the boycott list JSON
    fetch('https://raw.githubusercontent.com/TechForPalestine/boycott-israeli-consumer-goods-dataset/main/raw/boycott_list_formatted.json')
    .then(response => response.json())
    .then(data => {
        // Check if the search term is in the boycott list
        var found = data.find(item => item.attributes.name.toLowerCase().replace(/[^\w\s]/g, '') === searchTerm);
        if (found) {
            // Display details for found product
            displayProductDetails(found.attributes);
        } else {
            // Display message for not found product
            displayNotFoundMessage();
        }
    })
    .catch(error => {
        console.error('Error fetching boycott list:', error);
    });
});

function displayProductDetails(product) {
    var resultsDiv = document.getElementById("searchResults");
    
    // Check if the product is boycotted
    var boycottMessage = product.boycotted ? "<strong>No Thank You</strong>" : "";
    
    // Generate HTML for search result
    var resultHTML = `
      <div class="result-card">
        <img src="${product.imageUrl}" class="brand-image" alt="${product.name}">
        <div>
          <h5>${product.name}</h5>
          <p>${boycottMessage}</p>
          ${product.proof ? `<p>${boldifyText(product.proof)}</p>` : ''}
          ${product.proofUrl ? `<a href="${product.proofUrl}" class="btn btn-primary">Proof Link</a>` : ''}
        </div>
      </div>
    `;
    
    resultsDiv.innerHTML = resultHTML;
    
    // Function to boldify text based on the pattern "**(text)**"
    function boldifyText(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
}

function displayNotFoundMessage() {
    var resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = `
        <div class="alert alert-warning" role="alert">
            No boycott found for the entered product.
        </div>
    `;
}

function displayEmptySearchMessage() {
    var resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = `
        <div class="alert alert-warning" role="alert">
            Please enter a product.
        </div>
    `;
}

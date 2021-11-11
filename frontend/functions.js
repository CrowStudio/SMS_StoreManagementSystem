/*--------------------------------------------------------------------------------------------*/
/*                                    Global variables                                        */
/*--------------------------------------------------------------------------------------------*/
let prevVal = 1;
let stockId = 1;
let stock = '';


/*--------------------------------------------------------------------------------------------*/
/*                                  Functions for main.js                                     */
/*--------------------------------------------------------------------------------------------*/
// Start DIV
function createMenu() {
  let buttonDiv = document.createElement('div');
  buttonDiv.className = 'buttonDiv';
  buttonDiv.innerHTML = `
    <div class="menu">
      <p class="buttonParagraf">
        Handle Warehouses:
        <button class="show_warehouse_button">Warehouse Info/Stock</button>
        <button class="add_warehouse_button">Add a new Warehouse</button>
        <button class="update_warehouse_button">Update Warehouse Info</button>
        <button class="delete_warehouse_button">Delete a Warehouse</button>
      </p>
      <p class="buttonParagraf">
        Handle Products:
        <button class="show_products_button">Product Info/Stock</button>
        <button class="add_product_button">Add a new Product</button>
        <button class="update_product_button">Update Product Info</button>
        <button class="delete_product_button">Delete a Product</button>
      </p>
    </div>
    <div class="emptyDiv">
    </div>`;

  document.querySelector('.content').append(buttonDiv);
}


/*--------------------------------------------------------------------------------------------*/
/*                            Funcations for sending API-requests                             */
/*--------------------------------------------------------------------------------------------*/
// Fetch API request
async function sendQuery(query, opt) {
  let rawData = await fetch('/api/' + query);
  let search = await rawData.json();
  // Depending on search query and option, different HTML is injected into the DIV "content"
  showQuery(search, opt);
}

// Inject HMTL with data depending on fetched JSON data
async function showQuery(search, opt) {
  let html = ``;

  // Show Warehouses
  if (opt == 5) {
    html += `
          <div class="menu">
            <p class="buttonParagraf">
              Return to:
              <button class="back_button">Main Menu</button>
            </p>
          </div>
          <div class="innerDiv">
            <h2 class="centeredHeader" >Warehouse Info</h2>`;

    for (let { id, warehouseName, streetAddress, postalCode, city, email, phone, duns } of search) {
      html += `
            <span title="click to show/hide info">
            <div class="cardDiv">
              <h3>${warehouseName}</h3>
              <p class="minType"> id: ${id}</p>
              <div class="info">
                <p>DUNS: ${duns}</p>
                <p>Address:</br>
                ${streetAddress}</br>
                ${postalCode}</br>
                ${city}
                <p>Email: ${email}</p>
              </div>
              <p class="bottomParagraf">Phone: ${phone}
              <button class="warehouse_stock_button" id="wStock: ${id}" value="${warehouseName}">Show Warehouse Stock</button>
              </p>
            </div>`;
    }

    html += '</div></span>';

    // Show Product Stock in Warehouse if button is clicked
    document.body.addEventListener('click', event => {
      warehouseButton = event.target.closest('.warehouse_stock_button');
      if (!warehouseButton) { return; }

      // Set global variables to Warehouse ID and name
      stockId = event.target.id.slice(8);
      stockName = event.target.value;
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      let que = 'warehouseStock/' + stockId;
      // Show Product Stock in Warehouse
      sendQuery(que, 10);
    })

  }

  // Show Product Stock in Warehouse
  if (opt == 10) {
    html += `
            <div class="menu">
              <p class="buttonParagraf">
                Return to:
                <button class="back_button">Main Menu</button>
                <button class="back_to_warehouse_button">Warehouse Info</button>
              </p>
            </div>
            <div class="innerDiv">
              <h2>${stockName} - <br>
              Stock:</h2>`;

    for (let { productId, productName } of search) {
      html += `<div class="houseDiv" id="dwp-${productId}">
                <h3>${productName}</h3>
                <p class="minType">Part no: ${productId}</br>
                <p class="bottomParagraf">Quantity:
                <form class="update_stock_form" id="wp-${productId}" action="" method="put">
                  <label>
                      <input class="quant" id="q${productId}" type="number" name="quantity" step="1" required>
                  </label>
                  <input class="update_stock_button" type="submit" value="Update Stock">
                </form></p>
              </div>`;

      // Set Product Quantity and add Update button
      selectWarehouseStock('/api/warehouseSupply/' + stockId + '/' + productId);
    }

    html += `</div>`;

    // Go back to previous Warehouse overview
    document.body.addEventListener('click', event => {
      let showProductButton = event.target.closest('.back_to_warehouse_button');
      if (!showProductButton) { return; }
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      sendQuery('warehouse', 5);
    })
  }

  // Add new Warehouse
  if (opt == 6) {
    html += `
        <div class="menu">
          <p class="buttonParagraf">
            Return to:
            <button class="back_button">Main Menu</button>
          </p>
        </div>
        <div class="innerDiv">
          <h2 class="centeredHeader" >Add new Warehouse</h2>
          <form class="add_warehouse_form" action="/api/warehouse" method="post">
            <label>
              Warehouse Name:
              <input type="text" placeholder="MAKEA name of city" name="warehouseName"  required minlength="1">
            </label>
            <label>
              Street Address:
              <input type="text" placeholder="Route 66" name="streetAddress" required minlength="1">
            </label>
            <label>
              Postal Code:
              <input type="tele" placeholder="123 45" name="postalCode" pattern="[0-9]{3} [0-9]{2"} required>
            </label>
            <label>
              City:
              <input type="text" placeholder="Gotham City" name="city" required minlength="1">
            </label>
            <label>
              Email:
              <input type="email" placeholder="city@makea.se" name="email" required>
            </label>
            <label>
              Phone:
              <input type="tele" placeholder="123 45 67 890" name="phone" pattern="[0-9]{3} [0-9]{2} [0-9]{2} [0-9]{3}" required>
            </label>
            <label>
              DUNS:
              <input type="tele" placeholder="56 789 1234" name="duns" pattern="[0-9]{2} [0-9]{3} [0-9]{4}" required>
            </label>
            <input class="submit" type="submit" value="Add Warehouse">
          </form>
        </div>`;
  }

  // Update Warehouse info
  if (opt == 7) {
    html = `
      <div class="menu">
        <p class="buttonParagraf">
          Return to:
          <button class="back_button">Main Menu</button>
        </p>
      </div>
      <div class="innerDiv">
        <h2 class="centeredHeader" >Update Warehouse info</h2>
        <label for="warehouse">
          Select a Warehouse:
       
        <select class="dropdownW" name="id">
          <option disabled selected value> -- warehouses -- </option>`;

    // Populate Warehouse options
    for (let { id, warehouseName } of search) {
      html += `<option value="${id}">${warehouseName}</option>`;
    }

    // When selecting Warehouse, set API route and populate form with Warehouse information
    document.body.addEventListener('change', event => {
      let dropdownSet = event.target.closest('.dropdownW');
      if (!dropdownSet) {
        return;
      }

      let dropVal = document.querySelector('.dropdownW').value;
      document.querySelector('.update_warehouse_form').setAttribute('action', '/api/warehouse/' + dropVal);

      // Populate form depending on Warehouse selected
      dropSelectWarehouse('/api/warehouse/' + dropVal);
    })

    // Reset form
    document.body.addEventListener('click', event => {
      let cancelButton = event.target.closest('.cancel_button3');
      if (!cancelButton) { return; }
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      sendQuery('warehouse', 7);
    })

    html += `
      </select>
       </label>
      <form class="update_warehouse_form" action="" method="put">
          <label>
            Warehouse Name:
            <input class="nam" type="text" name="warehouseName"  required minlength="1">
          </label>
          <label>
            Street Address:
            <input class="strAdd" type="text" name="streetAddress" required minlength="1">
          </label>
          <label>
            Postal Code:
            <input class="postal" type="tele" name="postalCode" pattern="[0-9]{3} [0-9]{2}">
          </label>
          <label>
            City:
            <input class="cityNam" type="text" name="city" required minlength="1">
          </label>
          <label>
            Email:
            <input class="e-mail" type="email" name="email" required>
          </label>
          <label>
            Phone:
            <input class="phoneNo" type="text" name="phone" required minlength="9">
          </label>
          <label>
            DUNS:
            <input class="dunsNo" type="tele" name="duns" pattern="[0-9]{2} [0-9]{3} [0-9]{4}">
          </label>
          <input class="submit" type="submit" value="Update Warehouse info">
          <button class="cancel_button3">Reset Input Fields</button>
      </form>
    </div>`;
  }

  // Delete Warehouse
  if (opt == 8) {
    html = `
        <div class="menu">
          <p class="buttonParagraf">
            Return to:
            <button class="back_button">Main Menu</button>
          </p>
        </div>
        <div class="innerDiv">
          <h2 class="centeredHeader" >Delete a Warehouse</h2>
          <label for="product">
            Select a Warehouse:
            <select class="dropdownW" name="id" >
              <option disabled selected value="1"> -- warehouses -- </option>`;

    // Populate Warehouse options
    for (let { id, warehouseName } of search) {
      html += `<option value="${id}">${warehouseName}</option>`;
    }

    html += ` </select>
            </label>`;

    for (let { id, warehouseName, streetAddress, postalCode, city, email, phone, duns } of search) {
      html += `
            <div class="cardDiv" id="warhouse: ${id}">
            <span title="click to show/hide info">
              <h3>${warehouseName}</h3>
              <p class="minType"> id: ${id}</p>
              <div class="info">
                <p>DUNS: ${duns}</p>
                <p>Address:</br>
                ${streetAddress}</br>
                ${postalCode}</br>
                ${city}
                <p>Email: ${email}</p>
              </div>
              <p class="bottomParagraf">Phone: ${phone}</p>
              <div class="deleteB" id="db-${id}">
                <button class="delete_button2">Delete</button>
                <button class="cancel_button4">Cancel</button>
              </div>
              </span>
            </div>`;
    }

    html += '</div>';

    // When selecting Warehouse, set API route, mark Warhouse and show/hide Delete/Cancel buttons
    document.body.addEventListener('change', event => {
      let dropdownSet = event.target.closest('.dropdownW');
      if (!dropdownSet) { return; }

      let dropVal = document.querySelector('.dropdownW').value;

      // If selecting new Warehouse, unmark previous Warehouse and hide Delete/Cancel buttons
      if (prevVal != dropVal) {
        document.getElementById('warhouse\: ' + prevVal).style.backgroundColor = "rgb(242, 242, 242)";
        let div = document.getElementById('db-' + prevVal);
        div.style.display = 'none';
      }

      prevVal = dropVal;

      // Mark selected Warehouse and show Delete/Cancel buttons
      if (prevVal == dropVal) {
        document.getElementById('warhouse\: ' + dropVal).style.backgroundColor = "rgb(211, 136, 136)";
        let div = document.getElementById('db-' + prevVal);
        div.style.display = 'block';
      }

      prevVal = dropVal;

      // Set API route
      let deleteId = '/api/warehouse/' + dropVal;

      // Send API DELETE request for selected Warehouse
      document.body.addEventListener('click', async event => {
        let deleteButton = event.target.closest('.delete_button2');
        if (!deleteButton) { return; }
        // Send DELETE request
        await fetch(deleteId, { method: 'DELETE' })
        // Prepare new HTML injection
        document.querySelector('.bodyDiv').remove();
        sendQuery('warehouse', 8);
        prevVal = 1;
      })

      // Unmark selected Warehouse
      document.body.addEventListener('click', event => {
        let cancelButton = event.target.closest('.cancel_button4');
        if (!cancelButton) { return; }
        // Prepare new HTML injection
        document.querySelector('.bodyDiv').remove();
        sendQuery('warehouse', 8);
        prevVal = 1;
      })
    })
  }

  // Show Products
  if (opt == 1) {
    html += `
          <div class="menu">
            <p class="buttonParagraf">
              Return to:
              <button class="back_button">Main Menu</button>
            </p>
          </div>
          <div class="innerDiv">
            <h2 class="centeredHeader" >Product Info</h2>`;

    for (let { id, productName, category, description, image, price } of search) {
      html += `
            <span title="click to show/hide info">
            <div class="cardDiv">
              <h3>${productName}</h3>
              <p class="minType">Part no: ${id}</br>
              Category: ${category}</p>
              <div class="info">
                <object class="images" data="${image}" type="image/png" width="300">
                  <img class="images" src="images/default.png" alt="product image"width=300"</br>
                </object>
                <br>Description: ${description}</p>
                <p class="bottomParagraf">Price: ${price} freedom bucks</p>
              </div>
              <button class="product_stock_button" id="stock: ${id}">Show Stock</button>
            </div>`;
    }

    html += '</div></span>';

    // Show Product Stock, for Warehouses it's available at, if button is clicked
    document.body.addEventListener('click', event => {
      stockButton = event.target.closest('.product_stock_button');
      if (!stockButton) { return; }
      // Set global variables to Product ID
      stockId = event.target.id;
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      let que = 'productStock/' + stockId.slice(7);
      sendQuery(que, 9);
    })
  }

  // Show Product Stock, for Warehouses it's available at
  if (opt == 9) {
    html += `
          <div class="menu">
            <p class="buttonParagraf">
              Return to:
              <button class="back_button">Main Menu</button>
              <button class="back_to_products_button">Product Info</button>
            </p>
          </div>
          <div class="innerDiv">
            <h2 class="centeredHeader" >Product Stock</h2>`;

    // Single out first Product ID from database tabel
    let stringJson = JSON.stringify(search[0]);
    let prevId = stringJson[6];
    // Init variables to keep count
    let prodCount = 0;
    let count = 0;

    for (let { id, productName, warehouseName, quantity } of search) {
      // If new Product close previous Product DIV
      if (prevId != JSON.stringify(id)) {
        html += ` </div>`;

        startId = prevId;
        prodCount = 0;
      }

      // Only print Product Name and ID once
      if (prodCount == 0) {
        html += `<div class="prodDiv">
                    <h3>${productName}</h3>
                    <p class="minType">Part no: ${id}</p>`;
        prodCount++;
      }


      html += `
          <p class="bottomParagraf">Warehouse: ${warehouseName}</br>
          Quantity: ${quantity}</p>`;

      // Close last Product DIV
      count++;
      if (count == Object.keys(search).length) {
        html += `</div>`;
      }

      prodCount++;
      prevId = JSON.stringify(id);
    }

    html += `
      </div>`;

    // Go back to previous Product overview
    document.body.addEventListener('click', event => {
      let showProductButton = event.target.closest('.back_to_products_button');
      if (!showProductButton) { return; }
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      sendQuery('product', 1);
    })
  }

  // Add new Product
  if (opt == 2) {
    html += `
          <div class="menu">
            <p class="buttonParagraf">
              Return to:
              <button class="back_button">Main Menu</button>
            </p>
          </div>
          <div class="innerDiv">
            <h2 class="centeredHeader" >Add new Product</h2>
            <form class="add_product_form" action="/api/product" method="post">
              <label>
                Product Name:
                <input type="text" placeholder="product name" name="productName" required minlength="1">
              </label>
              <label>
                Category:
                <input type="text" placeholder="eg. shelf" name="category" required minlength="1">
              </label>
              <label>
                Description:
                <input type="text" placeholder="what does it do?" name="description" required minlength="1">
              </label>
              <label>
                Image link:
                <input type="text" name="image" required value="images/default.png">
              </label>
              <label>
                Price:
                <input type="number" placeholder="66.6" name="price" step="0.1" required>
              </label>
              <input class="submit" type="submit" value="Add Product">
            </form>
          </div>`;
  }

  // Update Product info
  if (opt == 3) {
    html = `
        <div class="menu">
          <p class="buttonParagraf">
            Return to:
            <button class="back_button">Main Menu</button>
          </p>
        </div>
        <div class="innerDiv">
          <h2 class="centeredHeader" >Update Product info</h2>
          <label for="product">
            Select a Product:
            <select class="dropdownP" name="id">
              <option disabled selected value> -- products -- </option>`;

    // Populate Product options
    for (let { id, productName } of search) {
      html += `<option value="${id}">${productName}</option>`;
    }

    // When selecting Product, set API route and populate form with Product information
    document.body.addEventListener('change', event => {
      let dropdownSet = event.target.closest('.dropdownP');
      if (!dropdownSet) { return; }

      let dropVal = document.querySelector('.dropdownP').value;
      document.querySelector('.update_product_form').setAttribute('action', '/api/product/' + dropVal);

      // Populate form depending on Product selected
      dropSelectProduct('/api/product/' + dropVal);

    })

    // Reset form
    document.body.addEventListener('click', event => {
      let cancelButton = event.target.closest('.cancel_button1');
      if (!cancelButton) { return; }
      // Prepare new HTML injection
      document.querySelector('.bodyDiv').remove();
      sendQuery('product', 3);
    })

    html += `
          </select>
        </label>
        <form class="update_product_form" action="" method="put" required>
          <label>
            Product Name:
            <input class="nam" type="text" name="productName" required>
          </label>
          <label>
            Category:
            <input class="cat" type="text" name="category" required>
          </label>
          <label>
            Description:
            <input class="descr" type="text" name="description" required>
          </label>
          <label>
            Image link:
            <input class="img"type=" text" name="image" required>
          </label>
          <label>
            Price:
            <input class="bucks" type="number" name="price" step="0.1" required>
          </label>
          <input class="submit" type="submit" value="Update Product">
          <button class="cancel_button1">Reset Input Fields</button>

        </form>
      </div>`;
  }

  // Delete Product
  if (opt == 4) {
    html = `
        <div class="menu">
          <p class="buttonParagraf">
            Return to:
            <button class="back_button">Main Menu</button>
          </p>
        </div>
        <div class="innerDiv">
          <h2 class="centeredHeader" >Delete a Product</h2>
          <label for="product">
            Select a Product:
            <select class="dropdownP" name="id" >
              <option disabled selected value="1"> -- products -- </option>`;

    // Populate Product options
    for (let { id, productName } of search) {
      html += `<option value="${id}">${productName}</option>`;
    }

    html += ` </select>
            </label>`;

    for (let { id, productName, category, description, image, price } of search) {
      html += `
           
            <div class="cardDiv" id="prod: ${id}">
              <span title="click to show/hide info">
              <h3>${productName}</h3>
              <p class="minType">Part no: ${id}</br>
              Category: ${category}</p>
              <div class="info">
                <p><img alt="product image" src="${image}" width=300"></br>
                Description: ${description}</p>
                <p class="bottomParagraf">Price: ${price} freedom bucks</p>
              </div>
              <div class="deleteB" id="db-${id}">
                <button class="delete_button1">Delete</button>
                <button class="cancel_button2">Cancel</button>
              </div>
              </span>
            </div>`;
    }

    html += '</div>';

    // When selecting Product, set API route, mark Product and show/hide Delete/Cancel buttons
    document.body.addEventListener('change', event => {
      let dropdownSet = event.target.closest('.dropdownP');
      if (!dropdownSet) { return; }

      let dropVal = document.querySelector('.dropdownP').value;

      // If selecting new Product, unmark previous Product and hide Delete/Cancel buttons
      if (prevVal != dropVal) {
        document.getElementById('prod\: ' + prevVal).style.backgroundColor = "rgb(242, 242, 242)";
        let div = document.getElementById('db-' + prevVal);
        div.style.display = 'none';
      }

      prevVal = dropVal;

      // Mark selected Product and show Delete/Cancel buttons
      if (prevVal == dropVal) {
        document.getElementById('prod\: ' + dropVal).style.backgroundColor = "rgb(211, 136, 136)";
        let div = document.getElementById('db-' + prevVal);
        div.style.display = 'block';
      }

      prevVal = dropVal;

      // Set API route
      let deleteId = '/api/product/' + dropVal;

      // Mark selected Product and show Delete/Cancel buttons
      document.body.addEventListener('click', async event => {
        let deleteButton = event.target.closest('.delete_button1');
        if (!deleteButton) { return; }
        // Send DELETE request
        await fetch(deleteId, { method: 'DELETE' })
        // Prepare new HTML injection
        document.querySelector('.bodyDiv').remove();
        sendQuery('product', 4);
        prevVal = 1;
      })

      // Unmark selected Product
      document.body.addEventListener('click', event => {
        let cancelButton = event.target.closest('.cancel_button2');
        if (!cancelButton) { return; }
        // Prepare new HTML injection
        document.querySelector('.bodyDiv').remove();
        sendQuery('product', 4);
        prevVal = 1;
      })
    })
  }

  createDiv(html);
}

// Add DIV with injected HTML to "content" DIV in index.html
function createDiv(html) {
  let bodyDiv = document.createElement('div');
  bodyDiv.className = 'bodyDiv';
  bodyDiv.innerHTML = html;
  document.querySelector('.content').append(bodyDiv);
}


/*--------------------------------------------------------------------------------------------*/
/*                                       Populate forms                                       */
/*--------------------------------------------------------------------------------------------*/
// Populate Product form with selected Product information
async function dropSelectProduct(instance) {
  let rawData = await fetch(instance);
  let search = await rawData.json();

  for (let { productName, category, description, image, price } of search) {
    document.querySelector('.nam').setAttribute('value', productName);
    document.querySelector('.cat').setAttribute('value', category);
    document.querySelector('.descr').setAttribute('value', description);
    document.querySelector('.img').setAttribute('value', image);
    document.querySelector('.bucks').setAttribute('value', price);
  }
}


// Populate Warehouse form with selected Warehouse information
async function dropSelectWarehouse(instance) {
  let rawData = await fetch(instance);
  let search = await rawData.json();

  for (let { warehouseName, streetAddress, postalCode, city, email, phone, duns } of search) {
    document.querySelector('.nam').setAttribute('value', warehouseName);
    document.querySelector('.strAdd').setAttribute('value', streetAddress);
    document.querySelector('.postal').setAttribute('value', postalCode);
    document.querySelector('.cityNam').setAttribute('value', city);
    document.querySelector('.e-mail').setAttribute('value', email);
    document.querySelector('.phoneNo').setAttribute('value', phone);
    document.querySelector('.dunsNo').setAttribute('value', duns);
  }
}


// Populate Product quantity form with currnet Product quantity and set API route
async function selectWarehouseStock(instance) {
  let rawData = await fetch(instance);
  let search = await rawData.json();

  for (let { product, quantity } of search) {
    document.querySelector('.update_stock_form').setAttribute('action', '/api/warehouseSupply/' + stockId + '/' + product);
    document.getElementById('q' + product).setAttribute('value', quantity);
  }
}




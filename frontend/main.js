////////////////////////////////////////////////////////////////////////////////////////////////
// Main Menu HTML injection
createMenu()

////////////////////////////////////////////////////////////////////////////////////////////////
// Events are grouped by DIV content

// cardDiv -
// Show Products on button click
document.body.addEventListener('click', event => {
  let showProductButton = event.target.closest('.show_products_button');
  if (!showProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('product', 1);
})

// Delete Product on button click
document.body.addEventListener('click', event => {
  let updateProductButton = event.target.closest('.delete_product_button');
  if (!updateProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('product', 4);
})


// Show Wererhouses on button click
document.body.addEventListener('click', event => {
  let showWererhousesButton = event.target.closest('.show_warehouse_button');
  if (!showWererhousesButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('warehouse', 5);
})

// Delete Warehouse on button click
document.body.addEventListener('click', event => {
  let updateProductButton = event.target.closest('.delete_warehouse_button');
  if (!updateProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('warehouse', 8);
})

/*--------------------------------------------------------------------------------------------*/

// Show extended info whe clicking cardDiv
document.body.addEventListener('click', event => {
  let cardDivClicked = event.target.closest('.cardDiv');
  if (!cardDivClicked) { return; }
  let infoDiv = cardDivClicked.querySelector('.info');
  infoDiv.style.display = infoDiv.style.display === 'block' ? 'none' : 'block';
})

/*--------------------------------------------------------------------------------------------*/
/*                               DIVs containing forms                                        */
/*--------------------------------------------------------------------------------------------*/


// Add new Product on button click
document.body.addEventListener('click', event => {
  let addProductButton = event.target.closest('.add_product_button');
  if (!addProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('product', 2);
})

// Update Product on button click
document.body.addEventListener('click', event => {
  let updateProductButton = event.target.closest('.update_product_button');
  if (!updateProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('product', 3);
})


// Add new Warehouse on button click
document.body.addEventListener('click', event => {
  let addWarehouseButton = event.target.closest('.add_warehouse_button');
  if (!addWarehouseButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('warehouse', 6);
})

// Update Warehouse on button click
document.body.addEventListener('click', event => {
  let updateProductButton = event.target.closest('.update_warehouse_button');
  if (!updateProductButton) { return; }
  document.querySelector('.buttonDiv').remove();
  sendQuery('warehouse', 7);
})

/*--------------------------------------------------------------------------------------------*/
/*                                         Forms                                              */
/*--------------------------------------------------------------------------------------------*/

// Handle forms
document.body.addEventListener('submit', async event => {
  // Prevent default behavior (page reload)
  event.preventDefault();

  // Get info about the form
  let form = event.target;
  let route = form.getAttribute('action');
  let method = form.getAttribute('method');
  // Collect the data from the form
  // (does not work with check and radio boxes yet)
  let requestBody = {};
  for (let { name, value } of form.elements) {
    if (!name) { continue; }
    requestBody[name] = value;
  }

  // Send the data via our REST api
  let rawResult = await fetch(route, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })

  console.log(await rawResult.json());

  // Empty the fields
  for (let element of form.elements) {
    if (!element.name) { continue; }
    element.value = '';
  }
})

/*--------------------------------------------------------------------------------------------*/
/*                                       Start DIV                                            */
/*--------------------------------------------------------------------------------------------*/

// Return to Main Menu on button back click
document.body.addEventListener('click', event => {
  let backButton = event.target.closest('.back_button');
  if (!backButton) { return; }
  document.querySelector('.bodyDiv').remove();
  createMenu()
})
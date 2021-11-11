////////////////////////////////////////////////////////////////////////////////////////////////
// Init database connections and web server

// Import the database driver
const dbDriver = require('better-sqlite3');

// Connect to the database
const db = dbDriver('products_stores_warehouse.sqlite3');

// Import Express (a web server for Node.js)
const express = require('express');

// Create a new Express-based web server
const app = express();

// Serve all files in the frontend folder
app.use(express.static('frontend'));

// Allow express to read request bodies
app.use(express.json());


////////////////////////////////////////////////////////////////////////////////////////////////
// Create routes

// Dynamic setup of all routes except X-table
function setUpRoutesForOneDbTable(tableName, type) {

  // Get all
  app.get('/api/' + tableName, (req, res) => {
    let statement = db.prepare(`
    SELECT * FROM ${tableName}
  `);

    let result = statement.all();
    res.json(result);
  })

  // Get one
  app.get('/api/' + tableName + '/:id', (req, res) => {
    let searchId = req.params.id;
    let statement = db.prepare(`
    SELECT * FROM ${tableName} WHERE id = :searchId
  `);

    let result = statement.all({ searchId });
    res.json(result || null);
  })


  // If it's a view rather than a table then do nothing more
  if (type === 'view') { return; }

  // Create one
  app.post('/api/' + tableName, (req, res) => {
    let statement = db.prepare(`
    INSERT INTO ${tableName} (${Object.keys(req.body).join(', ')})
    VALUES (${Object.keys(req.body).map(x => ':' + x).join(', ')})
  `);
    let result;
    try {

      result = statement.run(req.body);
    }

    catch (error) {
      result = { error: error + '' };
    }

    res.json(result);
  })

  // Delete one
  app.delete('/api/' + tableName + '/:id', (req, res) => {
    let statement = db.prepare(`
    DELETE FROM ${tableName}
    WHERE id = :idToDelete
  `);

    let result = statement.run({ idToDelete: req.params.id });
    res.json(result);
  })

  // Change one
  app.put('/api/' + tableName + '/:id', (req, res) => {
    let result;
    try {
      let statement = db.prepare(`
      UPDATE ${tableName}
      SET ${Object.keys(req.body).map(x => x + ' = :' + x).join(', ')}
      WHERE id = :id
    `)
      result = statement.run({ ...req.body, id: req.params.id });
    }

    catch (error) {
      result = { error: error + '' }
    }

    res.json(result);
  })

}

/*--------------------------------------------------------------------------------------------*/

// Manual setup of X-table routes
function setupStock() {
  // Get Stock
  app.get('/api/warehouseSupply/:warehouse/:product', (req, res) => {
    let statement = db.prepare(`
        SELECT * FROM warehouseSupply
        WHERE warehouse = :warehouse AND product = :product
      `)

    let result = statement.all({ warehouse: req.params.warehouse, product: req.params.product });
    res.json(result);
  })

  // Create Stock
  app.post('/api/warehouseSupply/', (req, res) => {
    let statement = db.prepare(`
    INSERT INTO warehouseSupply (${Object.keys(req.body).join(', ')})
    VALUES (${Object.keys(req.body).map(x => ':' + x).join(', ')})
  `);
    let result;
    try {

      result = statement.run(req.body);
    }

    catch (error) {
      result = { error: error + '' };
    }

    res.json(result);
  })

  // Update Stock
  app.put('/api/warehouseSupply/:warehouse/:product', (req, res) => {
    let result;
    try {
      let statement = db.prepare(`
      UPDATE warehouseSupply
      SET ${Object.keys(req.body).map(x => x + ' = :' + x).join(', ')}
      WHERE warehouse = :warehouse AND product = :product
    `)
      result = statement.run({ ...req.body, warehouse: req.params.warehouse, product: req.params.product });
    }

    catch (error) {
      result = { error: error + '' }
    }

    res.json(result);
  })

  // Delete Stock
  app.delete('/api/warehouseSupply/:warehouse/:product', (req, res) => {
    let statement = db.prepare(`
    DELETE FROM warehouseSupply
    WHERE warehouse = :warehouseDelete AND product = :productDelete
  `);

    let result = statement.run({ warehouseDelete: req.params.warehouse, productDelete: req.params.product });
    res.json(result);
  })

  console.log('Routes created for the table warehouseSupply');
}

// Setup all routes
function setupAllRoutes() {
  // Get all tables and views in the database
  // Exlude SQLite specific + X-table
  let statement = db.prepare(`
    SELECT name, type FROM sqlite_schema
    WHERE
      type IN ('table', 'view')
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE 'warehouseSupply'
  `);

  let tablesAndViews = statement.all();

  // Loop tables and views and setup routes
  for (let { name, type } of tablesAndViews) {
    setUpRoutesForOneDbTable(name, type);
    console.log('Routes created for the', type, name);
  }

  // Add static X-table routes
  setupStock();
}

////////////////////////////////////////////////////////////////////////////////////////////////

setupAllRoutes();

// Start the web server on port 3000
app.listen(3000, () => {
  console.log('Listening on port 3000');
})

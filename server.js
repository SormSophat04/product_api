// server.js
require("dotenv").config(); // Load .env variables

const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST, // from .env
  port: process.env.DB_PORT, // from .env (make sure this is a number)
  user: process.env.DB_USER, // from .env
  password: process.env.DB_PASS, // from .env
  database: process.env.DB_NAME, // from .env
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
  console.log("Connected to MySQL database");
});

// Sample route
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

// Listen on dynamic port from environment or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get single product
app.get("/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) throw err;
      res.json(results[0] || {});
    }
  );
});

// Add a product
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, name, price });
    }
  );
});

// Update a product
app.put("/products/:id", (req, res) => {
  const { name, price } = req.body;
  db.query(
    "UPDATE products SET name = ?, price = ? WHERE id = ?",
    [name, price, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ id: req.params.id, name, price });
    }
  );
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.status(204).send();
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

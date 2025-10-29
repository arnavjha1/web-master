const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, "../database/my_database.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database!");
    }
});

// API endpoint to get all resources
app.get("/api/resources", (req, res) => {
    db.all("SELECT * FROM resources", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// API endpoint to add a new resource
app.post("/api/resources", (req, res) => {
    const { name, category, description, website, location, phone } = req.body;
    const sql = `INSERT INTO resources 
                 (name, category, description, website, location, phone) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, category, description, website, location, phone], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

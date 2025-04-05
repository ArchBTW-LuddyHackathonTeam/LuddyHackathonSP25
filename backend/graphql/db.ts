import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

// Determine if the database file already exists
const dbPath = path.resolve("igps++.db");
const dbExists = fs.existsSync(dbPath);

// Connect to the database
console.log("Connecting to database");
const db: DBType = new Database("igps++.db");
db.pragma("journal_mode = WAL");

// Initialize it if it does not exist before connecting
if (!dbExists) {
    console.log("Initializing database tables");
    const sqlFilePath = path.resolve("sql/db.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf-8");
    
    db.exec(sql);

    // Add dummy data 
    console.log("Adding dummy data");
    const dataFilePath = path.resolve("sql/dummy_data.sql");
    const data = fs.readFileSync(dataFilePath, "utf-8");

    db.exec(data);

    console.log("Initialized database tables");
}

console.log("Connected to database successfully");

export default db;

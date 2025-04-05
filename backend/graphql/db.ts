import Database from "better-sqlite3";
import type { Database as DBType } from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

// Determin if the database file already exists
const basePath = path.resolve("../");
const dbPath = path.resolve(basePath, "igps++.db");
const dbExists = fs.existsSync(dbPath);

// Connect to the database
console.log("Connecting to database");
const db: DBType = new Database("igps++.db");
db.pragma("journal_mode = WAL");

// Initialize it if it does not exist before connecting
if (!dbExists) {
    console.log("Initializing database tables");
    const sqlFilePath = path.resolve(basePath, "sql/db.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf-8");
    
    db.exec(sql);

    console.log("Initialized database tables");
}

console.log("Connected to database successfully");

export default db;

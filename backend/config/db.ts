import sqlite3 from 'sqlite3';
import path from 'path';

// Use an environment variable for the database path, or default to the root of the backend folder.
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite');
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Metrics Table
    db.run(`
      CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        weight REAL,
        protein INTEGER,
        carbs INTEGER,
        fats INTEGER,
        calories INTEGER,
        move_progress REAL,
        exercise_progress REAL,
        stand_progress REAL,
        hrv INTEGER,
        resting_heart_rate INTEGER,
        blood_pressure TEXT,
        blood_glucose INTEGER,
        logged_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create Integrations Table
    db.run(`
      CREATE TABLE IF NOT EXISTS integrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        provider TEXT,
        status TEXT DEFAULT 'disconnected',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, provider)
      )
    `);

    // Create Goals Table
    db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        target_weight REAL,
        daily_calories INTEGER DEFAULT 2000,
        daily_protein INTEGER DEFAULT 150,
        daily_carbs INTEGER DEFAULT 200,
        daily_fats INTEGER DEFAULT 65,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }
});

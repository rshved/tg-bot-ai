const Database = require('better-sqlite3');
const path = require('path');
const runMigrations = require('./migrations.js');

// __dirname и __filename в CommonJS есть автоматически
// поэтому никакого fileURLToPath не нужно

// путь до файла базы
const dbPath = path.join(__dirname, 'database.db');

// создаём подключение
const db = new Database(dbPath);

// прогоняем миграции (создание таблиц)
runMigrations(db);

module.exports = db;

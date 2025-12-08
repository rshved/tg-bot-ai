import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import runMigrations from './migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// путь до файла базы
const dbPath = path.join(__dirname, 'database.db');

// создаём подключение
const db = new Database(dbPath);

// прогоняем миграции (создание таблиц)
runMigrations(db);

export default db;

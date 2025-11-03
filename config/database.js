// config/database.js
const path = require('path'); // <<< FALTOU ESTA LINHA
require('dotenv').config();

// Caminho absoluto para database.sqlite na raiz do projeto
const DB_STORAGE_PATH = path.resolve(__dirname, '..', 'database.sqlite'); 

const config = {
  development: {
    dialect: 'sqlite',
    // Agora DB_STORAGE_PATH está definido!
    storage: process.env.DB_STORAGE || DB_STORAGE_PATH, 
    logging: false,
  },
  test: { 
    // 1. O Sequelize precisa saber qual banco usar: SQLite
    dialect: 'sqlite', 
    
    // 2. Use o ':memory:' para criar um banco de dados temporário na RAM.
    // Isso torna os testes muito rápidos e garante que eles sejam isolados.
    storage: ':memory:', 
    
    // Opcional: Desliga logs SQL durante os testes
    logging: false 
  },
};

module.exports = config;
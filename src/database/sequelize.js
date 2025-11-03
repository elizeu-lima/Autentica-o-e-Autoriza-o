const { Sequelize } = require('sequelize');
const config = require('../../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Banco de dados conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
  }
}

module.exports = sequelize;
module.exports.connectDB = connectDB;

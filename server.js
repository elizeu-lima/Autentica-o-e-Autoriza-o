require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/database/sequelize');
const routes = require('./src/api/routes');

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

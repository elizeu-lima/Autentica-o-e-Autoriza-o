const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  async register(email, password) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error('Email já registrado.');

    const user = await UserRepository.create({ email, password_hash: password });
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email, true);
    if (!user) throw new Error('Usuário não encontrado.');

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) throw new Error('Senha inválida.');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    return token;
  }
}

module.exports = new AuthService();

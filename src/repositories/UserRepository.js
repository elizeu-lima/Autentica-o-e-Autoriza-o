const User = require('../database/models/UserModel');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email, includePassword = false) {
    const attributes = includePassword ? undefined : { exclude: ['password_hash'] };
    return await User.findOne({ where: { email }, attributes });
  }
}

module.exports = new UserRepository();

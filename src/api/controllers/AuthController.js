const { UserSchema } = require('../../dtos/UserDTO');
const AuthService = require('../../services/AuthService');

class AuthController {
  async register(req, res) {
    const { error } = UserSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    const { error } = UserSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.status(200).json({ token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    if (email === 'admin@admin.com' && password === 'admin') {
      return res.json({ message: 'Login bem-sucedido!', token: 'fake-jwt-token' });
    }
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  async me(req, res) {
    return res.json({ user: { id: 1, email: 'admin@admin.com', name: 'Administrador' } });
  }
}

module.exports = new AuthController();
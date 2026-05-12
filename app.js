const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');

class App {
  constructor() {
    this.server = express();
    
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // Permite que o frontend (React/Vite) acesse a API
    this.server.use(cors());
    
    // Habilita a leitura de JSON nas requisições
    this.server.use(express.json());
  }

  routes() {
    // Prefixo padrão para todas as rotas da sua cliente
    this.server.use('/api', apiRoutes);
  }

  exceptionHandler() {
    // Middleware para capturar erros e não travar o servidor
    this.server.use((err, req, res, next) => {
      console.error(err.stack);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        message: err.message 
      });
    });
  }
}

// Exporta uma instância do servidor configurado
const app = new App().server;

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Backoffice do Condomínio rodando na porta ${PORT}`);
});

module.exports = app;
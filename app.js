const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // Configuração de CORS permitindo frontend em Vercel e Codespaces
    const corsOptions = {
      origin: [
        "https://condominio-frontend-rho.vercel.app",
        'https://reimagined-dollop-7vvwww6vqg562x4vj.github.dev',
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
        /https:\/\/.+\.vercel\.app$/,
        /https:\/\/.+\.github\.dev$/,
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };

    this.server.use(cors(corsOptions));

    // Habilita a leitura de JSON nas requisições
    this.server.use(express.json());
  }

  routes() {
    // Rota base para verificar se API está respondendo
    this.server.get("/", (req, res) => {
      return res.json({
        message: "API Condomínios respondendo corretamente",
        status: "online",
        timestamp: new Date().toLocaleString("pt-BR"),
      });
    });

    // Rota v1 para validação de versão
    this.server.get("/v1", (req, res) => {
      const dataHora = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return res.json({
        message: "Api v1 respondendo no container docker...",
        chamada_em: dataHora,
        versao: "1.1.0",
      });
    });

    // Prefixo padrão para todas as rotas da sua cliente
    this.server.use("/api", apiRoutes);
  }

  exceptionHandler() {
    // Middleware para capturar erros e não travar o servidor
    this.server.use((err, req, res, next) => {
      console.error(err.stack);
      return res.status(500).json({
        error: "Erro interno no servidor",
        message: err.message,
      });
    });
  }
}

// Exporta uma instância do servidor configurado
const app = new App().server;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backoffice do Condomínio rodando na porta ${PORT}`);
});

module.exports = app;
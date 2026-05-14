const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Log para verificar a conexão com o banco de dados
prisma.$connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados com sucesso!');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  });

module.exports = prisma;
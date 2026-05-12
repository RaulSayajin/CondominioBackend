const prisma = require('../../prisma/prisma-client');
const CobrancaService = require('../services/CobrancaService');

class CobrancaController {
  // Lista as cobranças de um mês para conferência (R$ 324,81 por unidade)
  async listarCobrancas(req, res) {
    const { condominioId } = req.params;
    const { mes } = req.query;

    try {
      const unidades = await prisma.unidade.findMany({
        where: { condominioId },
        include: {
          cobrancas: { where: { mesReferencia: mes } }
        }
      });
      return res.json(unidades);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar cobranças' });
    }
  }

  // Rota para ela atualizar o status de pagamento manualmente
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body; // 'PAGO', 'ATRASADO', etc.

    try {
      const cobranca = await prisma.cobranca.update({
        where: { id: Number(id) },
        data: { status }
      });
      return res.json(cobranca);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar pagamento' });
    }
  }
}

module.exports = new CobrancaController();
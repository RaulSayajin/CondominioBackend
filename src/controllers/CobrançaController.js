const prisma = require('../../prisma/prisma-client');
const CobrancaService = require('../services/cobrancaService');

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
      console.error(`❌ Erro ao buscar cobranças do condomínio ${condominioId}:`, error);
      return res.status(500).json({ error: 'Erro ao buscar cobranças', details: error.message });
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
      console.error(`❌ Erro ao atualizar status da cobrança ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao atualizar pagamento', details: error.message });
    }
  }

  // Registra pagamento com informações completas
  async registrarPagamento(req, res) {
    const { id } = req.params;

    const {
      status,
      dataPagamento,
      valorPago
    } = req.body;

    try {
      const cobranca = await prisma.cobranca.update({
        where: {
          id: Number(id)
        },
        data: {
          status,
          dataPagamento,
          valorPago
        }
      });

      return res.json(cobranca);
    } catch (error) {
      console.error(
        `❌ Erro ao registrar pagamento da cobrança ${id}:`,
        error
      );

      return res.status(400).json({
        error: 'Erro ao registrar pagamento',
        details: error.message
      });
    }
  }
}

module.exports = new CobrancaController();
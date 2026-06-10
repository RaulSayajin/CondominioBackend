const prisma = require('../../prisma/prisma-client');
const BalanceteService = require('../services/balanceteService');

class FinanceiroController {
  // Gera o balancete mensal para prestação de contas
  async gerarBalancete(req, res) {
    const { condominioId } = req.params;
    const { mes } = req.query; // ex: 04/2026[cite: 3]

    try {
      const resumo = await BalanceteService.gerarResumoMensal(Number(condominioId), mes);
      return res.json(resumo);
    } catch (error) {
      console.error(`❌ Erro ao gerar balancete do condomínio ${condominioId}:`, error);
      return res.status(400).json({ error: 'Erro ao gerar balancete', details: error.message });
    }
  }

  // Registra uma nova despesa (ex: Portaria ou CPFL)[cite: 3]
  async storeDespesa(req, res) {
    const { condominioId, data, descricao, valor, categoriaId } = req.body;
    
    try {
      const despesa = await prisma.despesa.create({
        data: {
          condominioId,
          dataPagamento: new Date(data),
          descricao,
          valor,
          categoriaId
        }
      });
      return res.status(201).json(despesa);
    } catch (error) {
      console.error(`❌ Erro ao lançar despesa no condomínio ${condominioId}:`, error);
      return res.status(400).json({ error: 'Erro ao lançar despesa', details: error.message });
    }
  }
}

module.exports = new FinanceiroController();
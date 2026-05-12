const RateioService = require('../services/rateioService');

class RateioController {
  // POST /rateio/:condominioId/gerar?mes=05/2026
  // Calcula as despesas do mês e distribui igualmente entre as unidades
  async gerarRateio(req, res) {
    const { condominioId } = req.params;
    const { mes } = req.query;

    if (!mes) {
      return res.status(400).json({ error: 'Informe o mês de referência (ex: 05/2026)' });
    }

    try {
      const resultado = await RateioService.gerarCobrancasMensais(Number(condominioId), mes);
      return res.status(201).json(resultado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /rateio/:condominioId?mes=05/2026
  // Lista as cobranças geradas por unidade com status de pagamento
  async listarRateio(req, res) {
    const { condominioId } = req.params;
    const { mes } = req.query;

    if (!mes) {
      return res.status(400).json({ error: 'Informe o mês de referência (ex: 05/2026)' });
    }

    try {
      const dados = await RateioService.listarRateioMensal(Number(condominioId), mes);
      return res.json(dados);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar rateio' });
    }
  }
}

module.exports = new RateioController();

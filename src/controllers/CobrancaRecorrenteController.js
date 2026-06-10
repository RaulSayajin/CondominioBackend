const prisma = require('../../prisma/prisma-client');

class CobrancaRecorrenteController {
  // GET /condominios/:id/cobrancas-recorrentes
  async index(req, res) {
    const { id } = req.params;
    try {
      const cobrancas = await prisma.cobrancaRecorrente.findMany({
        where: { condominioId: Number(id) },
        orderBy: { descricao: 'asc' }
      });
      return res.json(cobrancas);
    } catch (error) {
      console.error(`❌ Erro ao listar cobranças recorrentes do condomínio ${id}:`, error);
      return res.status(500).json({ error: 'Erro ao listar cobranças recorrentes', details: error.message });
    }
  }

  // POST /condominios/:id/cobrancas-recorrentes
  async store(req, res) {
    const { id } = req.params;
    const { descricao, valor } = req.body;

    if (!descricao || valor == null) {
      return res.status(400).json({ error: 'descricao e valor são obrigatórios' });
    }

    try {
      const cobranca = await prisma.cobrancaRecorrente.create({
        data: { condominioId: Number(id), descricao, valor: Number(valor), ativo: true }
      });
      return res.status(201).json(cobranca);
    } catch (error) {
      console.error(`❌ Erro ao criar cobrança recorrente para condomínio ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao criar cobrança recorrente', details: error.message });
    }
  }

  // PUT /cobrancas-recorrentes/:id
  async update(req, res) {
    const { id } = req.params;
    const { descricao, valor, ativo } = req.body;
    try {
      const cobranca = await prisma.cobrancaRecorrente.update({
        where: { id: Number(id) },
        data: { descricao, valor: valor != null ? Number(valor) : undefined, ativo }
      });
      return res.json(cobranca);
    } catch (error) {
      console.error(`❌ Erro ao atualizar cobrança recorrente ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao atualizar cobrança recorrente', details: error.message });
    }
  }

  // DELETE /cobrancas-recorrentes/:id
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await prisma.cobrancaRecorrente.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch (error) {
      console.error(`❌ Erro ao excluir cobrança recorrente ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao excluir cobrança recorrente', details: error.message });
    }
  }
}

module.exports = new CobrancaRecorrenteController();

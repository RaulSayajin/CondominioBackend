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
    } catch {
      return res.status(500).json({ error: 'Erro ao listar cobranças recorrentes' });
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
    } catch {
      return res.status(400).json({ error: 'Erro ao criar cobrança recorrente' });
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
    } catch {
      return res.status(400).json({ error: 'Erro ao atualizar cobrança recorrente' });
    }
  }

  // DELETE /cobrancas-recorrentes/:id
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await prisma.cobrancaRecorrente.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch {
      return res.status(400).json({ error: 'Erro ao excluir cobrança recorrente' });
    }
  }
}

module.exports = new CobrancaRecorrenteController();

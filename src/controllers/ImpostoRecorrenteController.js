const prisma = require('../../prisma/prisma-client');

class ImpostoRecorrenteController {
  // GET /condominios/:id/impostos
  async index(req, res) {
    const { id } = req.params;
    try {
      const impostos = await prisma.impostoRecorrente.findMany({
        where: { condominioId: Number(id) },
        orderBy: { descricao: 'asc' }
      });
      return res.json(impostos);
    } catch {
      return res.status(500).json({ error: 'Erro ao listar impostos recorrentes' });
    }
  }

  // POST /condominios/:id/impostos
  async store(req, res) {
    const { id } = req.params;
    const { descricao, valor } = req.body;
    if (!descricao || valor == null) {
      return res.status(400).json({ error: 'descricao e valor são obrigatórios' });
    }
    try {
      const imposto = await prisma.impostoRecorrente.create({
        data: { condominioId: Number(id), descricao, valor: Number(valor), ativo: true }
      });
      return res.status(201).json(imposto);
    } catch {
      return res.status(400).json({ error: 'Erro ao criar imposto recorrente' });
    }
  }

  // PUT /impostos/:id
  async update(req, res) {
    const { id } = req.params;
    const { descricao, valor, ativo } = req.body;
    try {
      const imposto = await prisma.impostoRecorrente.update({
        where: { id: Number(id) },
        data: { descricao, valor: valor != null ? Number(valor) : undefined, ativo }
      });
      return res.json(imposto);
    } catch {
      return res.status(400).json({ error: 'Erro ao atualizar imposto recorrente' });
    }
  }

  // DELETE /impostos/:id
  async destroy(req, res) {
    const { id } = req.params;
    try {
      await prisma.impostoRecorrente.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch {
      return res.status(400).json({ error: 'Erro ao excluir imposto recorrente' });
    }
  }
}

module.exports = new ImpostoRecorrenteController();

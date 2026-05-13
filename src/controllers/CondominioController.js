const prisma = require('../../prisma/prisma-client');
const FinanceiroService = require('../services/financeiroService');

class CondominioController {
  // Lista todos os condomínios da carteira da sua cliente
  async index(req, res) {
    try {
      const condominios = await prisma.condominio.findMany({
        include: { _count: { select: { unidades: true } } }
      });
      return res.json(condominios);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar condomínios' });
    }
  }

  // Retorna o dashboard financeiro específico de um condomínio (ex: Dom Bosco)
  async getDashboard(req, res) {
    const { id } = req.params;
    const { mes } = req.query; // ex: 05/2026

    try {
      const repasse = await FinanceiroService.calcularRepasseMensal(Number(id), mes);
      return res.json(repasse);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao processar dados financeiros' });
    }
  }

  // Criar um novo condomínio
  async store(req, res) {
    const { nome, cnpj, endereco, percentualGarantidora, honorarioMensal } = req.body;
    try {
      const condominio = await prisma.condominio.create({
        data: {
          nome,
          cnpj,
          endereco,
          percentualGarantidora,
          honorarioMensal
        }
      });
      return res.status(201).json(condominio);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar condomínio', details: error.message });
    }
  }

  // Listar unidades de um condomínio
  async getUnidades(req, res) {
    const { id } = req.params;
    try {
      const unidades = await prisma.unidade.findMany({
        where: { condominioId: Number(id) }
      });
      return res.json(unidades);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao listar unidades' });
    }
  }

  // Criar uma unidade
  async storeUnidade(req, res) {
    const { id } = req.params;
    const { numeroUnidade, nomeSacado } = req.body;
    try {
      const unidade = await prisma.unidade.create({
        data: {
          condominioId: Number(id),
          numeroUnidade,
          nomeSacado
        }
      });
      return res.status(201).json(unidade);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar unidade' });
    }
  }

  // Atualizar unidade
  async updateUnidade(req, res) {
    const { id } = req.params;
    const { numeroUnidade, nomeSacado } = req.body;
    try {
      const unidade = await prisma.unidade.update({
        where: { id: Number(id) },
        data: { numeroUnidade, nomeSacado }
      });
      return res.json(unidade);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar unidade' });
    }
  }

  // Deletar unidade
  async deleteUnidade(req, res) {
    const { id } = req.params;
    try {
      await prisma.unidade.delete({
        where: { id: Number(id) }
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao deletar unidade' });
    }
  }
}

module.exports = new CondominioController();
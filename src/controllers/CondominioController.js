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
      console.error('❌ Erro ao listar condomínios:', error);
      return res.status(500).json({ error: 'Erro ao listar condomínios', details: error.message });
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
      console.error(`❌ Erro ao listar unidades do condomínio ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao listar unidades', details: error.message });
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
      console.error(`❌ Erro ao criar unidade para condomínio ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao criar unidade', details: error.message });
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
      console.error(`❌ Erro ao atualizar unidade ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao atualizar unidade', details: error.message });
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
      console.error(`❌ Erro ao deletar unidade ${id}:`, error);
      return res.status(400).json({ error: 'Erro ao deletar unidade', details: error.message });
    }
  }

    // Buscar condomínio por ID
  async show(req, res) {
    const { id } = req.params;

    try {
      const condominio = await prisma.condominio.findUnique({
        where: {
          id: Number(id)
        },
        include: {
          _count: {
            select: {
              unidades: true
            }
          }
        }
      });

      if (!condominio) {
        return res.status(404).json({
          error: 'Condomínio não encontrado'
        });
      }

      return res.json(condominio);
    } catch (error) {
      console.error(`❌ Erro ao buscar condomínio ${id}:`, error);
      return res.status(500).json({
        error: 'Erro ao buscar condomínio',
        details: error.message
      });
    }
  }

  // Atualizar condomínio
  async update(req, res) {
    const { id } = req.params;
    const {
      nome,
      cnpj,
      endereco,
      percentualGarantidora,
      honorarioMensal
    } = req.body;

    try {
      const condominio = await prisma.condominio.update({
        where: {
          id: Number(id)
        },
        data: {
          nome,
          cnpj,
          endereco,
          percentualGarantidora,
          honorarioMensal
        }
      });

      return res.json(condominio);
    } catch (error) {
      console.error(`❌ Erro ao atualizar condomínio ${id}:`, error);
      return res.status(400).json({
        error: 'Erro ao atualizar condomínio',
        details: error.message
      });
    }
  }

  // Excluir condomínio
  async delete(req, res) {
    const { id } = req.params;

    try {
      await prisma.condominio.delete({
        where: {
          id: Number(id)
        }
      });

      return res.status(204).send();
    } catch (error) {
      console.error(`❌ Erro ao excluir condomínio ${id}:`, error);
      return res.status(400).json({
        error: 'Erro ao excluir condomínio',
        details: error.message
      });
    }
  }
}

module.exports = new CondominioController();
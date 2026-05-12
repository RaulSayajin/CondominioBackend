const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CobrancaService {
  /**
   * Automatiza o incremento de taxas extras (Ex: Pintura 25/62)
   * Baseado no documento: CRÉDITO DO CONDOMÍNIO[cite: 1]
   */
  async processarProximaParcela(condominioId) {
    const projetos = await prisma.taxaExtra.findMany({
      where: { condominioId }
    });

    for (const projeto of projetos) {
      if (projeto.parcelaAtual < projeto.totalParcelas) {
        await prisma.taxaExtra.update({
          where: { id: projeto.id },
          data: { parcelaAtual: projeto.parcelaAtual + 1 }
        });
      }
    }
  }

  /**
   * Retorna a composição da cobrança de uma unidade (R$ 324,81)[cite: 2]
   */
  async getComposicaoUnidade(unidadeId, mesReferencia) {
    return await prisma.cobranca.findFirst({
      where: { unidadeId, mesReferencia }
    });
  }

  /**
   * Gera cobranças em lote para todas as unidades de um condomínio
   */
  async gerarCobrancasLote(condominioId, mesReferencia, dataVencimento) {
    const unidades = await prisma.unidade.findMany({
      where: { condominioId }
    });

    const cobrancasGeradas = [];

    for (const unidade of unidades) {
      // 1. Calcular Valor Base (Ex: Rateio fixo ou baseado em fração ideal)
      // Aqui poderíamos integrar com o RateioService
      const valorBase = 300.00; 

      // 2. Buscar Taxas Extras Ativas
      const taxasExtras = await prisma.taxaExtra.findMany({
        where: { condominioId, status: 'ATIVO' }
      });

      const totalTaxas = taxasExtras.reduce((acc, t) => acc + Number(t.valor), 0);
      const totalBruto = valorBase + totalTaxas;

      // 3. Criar Cobrança
      const cobranca = await prisma.cobranca.create({
        data: {
          unidadeId: unidade.id,
          mesReferencia,
          dataVencimento: new Date(dataVencimento),
          totalBruto,
          status: 'PENDENTE',
          pixCopiaECola: `00020101021226850014br.gov.bcb.pix0123... (Simulado para ${unidade.numero})`
        }
      });

      cobrancasGeradas.push(cobranca);
    }

    return cobrancasGeradas;
  }
}

module.exports = new CobrancaService();
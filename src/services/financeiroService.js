const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FinanceiroService {
  /**
   * Calcula o crédito líquido que o condomínio deve receber
   * Baseado no documento: CRÉDITO DO CONDOMÍNIO DOM BOSCO
   */
  async calcularRepasseMensal(condominioId, mesReferencia) {
    const condominio = await prisma.condominio.findUnique({
      where: { id: condominioId }
    });

    // Soma todas as cobranças do mês (Ex: R$ 62.363,52)
    const cobrancas = await prisma.cobranca.aggregate({
      where: { 
        unidade: { condominioId },
        mesReferencia 
      },
      _sum: { totalBruto: true }
    });

    const totalRateio = cobrancas._sum.totalBruto || 0;
    
    // Cálculo da Garantidora (4%)[cite: 1]
    const percentualGarantidora = Number(condominio.percentualGarantidora) / 100;
    const custoGarantidora = totalRateio * percentualGarantidora;

    // Simulação de Tarifas Bancárias (Ex: R$ 526,81 totais)[cite: 1]
    const tarifasBancarias = 526.81; 

    const creditoLiquido = totalRateio - custoGarantidora - tarifasBancarias;

    return {
      totalRateio,        // R$ 62.363,52
      custoGarantidora,   // R$ 2.494,54
      tarifasBancarias,   // R$ 526,81
      creditoLiquido      // R$ 59.342,17
    };
  }

  /**
   * Gera os dados para o DRE (Demonstrativo de Resultados)
   */
  async gerarDRE(condominioId, mesReferencia) {
    // 1. Receitas do Mês (Cobranças Pagas)
    const receitas = await prisma.cobranca.aggregate({
      where: {
        unidade: { condominioId },
        mesReferencia,
        status: 'PAGO'
      },
      _sum: { totalBruto: true }
    });

    // 2. Despesas Agrupadas por Categoria
    const despesasPorCategoria = await prisma.despesa.groupBy({
      by: ['categoria'],
      where: {
        condominioId,
        // Filtro simplificado por mês (assumindo formato MM/YYYY no mesReferencia)
        // Em produção, filtrar por range de data no campo dataPagamento
      },
      _sum: { valor: true }
    });

    // 3. Fundo de Reserva (Simulação baseada em % ou Taxa Extra específica)
    const fundoReserva = (receitas._sum.totalBruto || 0) * 0.05; // Ex: 5% fixo

    return {
      receitas: receitas._sum.totalBruto || 0,
      despesas: despesasPorCategoria,
      fundoReserva,
      resultadoLiquido: (receitas._sum.totalBruto || 0) - (despesasPorCategoria.reduce((acc, d) => acc + Number(d._sum.valor), 0))
    };
  }

  /**
   * Relatório de Inadimplência
   */
  async relatorioInadimplencia(condominioId) {
    const pendentes = await prisma.cobranca.findMany({
      where: {
        unidade: { condominioId },
        status: 'PENDENTE',
        dataVencimento: { lt: new Date() } // Vencidas
      },
      include: {
        unidade: true
      }
    });

    const totalInadimplente = pendentes.reduce((acc, c) => acc + Number(c.totalBruto), 0);

    return {
      totalInadimplente,
      unidades: pendentes
    };
  }
}

module.exports = new FinanceiroService();
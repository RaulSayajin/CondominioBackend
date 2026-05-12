const prisma = require('../../prisma/prisma-client');

class RateioService {
  /**
   * Divide as despesas do mês igualmente entre as unidades do condomínio.
   * Cria (ou recalcula) uma Cobranca para cada unidade.
  * Se não houver despesas registradas, usa as CobrancasRecorrentes ativas como base.
   */
  async gerarCobrancasMensais(condominioId, mesReferencia) {
    const unidades = await prisma.unidade.findMany({ where: { condominioId } });
    if (unidades.length === 0) throw new Error('Condomínio sem unidades cadastradas');

    // Despesas reais lançadas no mês
    const despesasDoMes = await prisma.despesa.findMany({
      where: {
        condominioId,
        dataPagamento: {
          gte: this._primeiroDoMes(mesReferencia),
          lte: this._ultimoDoMes(mesReferencia)
        }
      }
    });
    const totalDespesas = despesasDoMes.reduce((acc, d) => acc + Number(d.valor), 0);

    // Cobranças recorrentes ativas (fallback se não houver despesas)
    const cobrancasRecorrentesAtivas = await prisma.cobrancaRecorrente.findMany({
      where: { condominioId, ativo: true }
    });
    const totalCobrancasRecorrentes = cobrancasRecorrentesAtivas.reduce((acc, i) => acc + Number(i.valor), 0);

    const baseCalculo = totalDespesas > 0 ? totalDespesas : totalCobrancasRecorrentes;
    const valorPorUnidade = baseCalculo / unidades.length;

    const cobrancas = [];
    for (const unidade of unidades) {
      const existente = await prisma.cobranca.findFirst({
        where: { unidadeId: unidade.id, mesReferencia }
      });
      const dados = {
        valorCondominio: valorPorUnidade,
        valorTaxaExtra: 0,
        totalBruto: valorPorUnidade
      };
      if (existente) {
        cobrancas.push(await prisma.cobranca.update({ where: { id: existente.id }, data: dados }));
      } else {
        cobrancas.push(await prisma.cobranca.create({
          data: { unidadeId: unidade.id, mesReferencia, ...dados, status: 'PENDENTE' }
        }));
      }
    }

    return {
      mesReferencia,
      totalUnidades: unidades.length,
      totalDespesas,
      totalCobrancasRecorrentes,
      baseCalculo,
      valorPorUnidade,
      totalGerado: cobrancas.length
    };
  }

  /**
   * Lista o rateio do mês com status por unidade e totalizadores.
   * Marca automaticamente VENCIDO cobranças PENDENTE após o vencimento.
   */
  async listarRateioMensal(condominioId, mesReferencia) {
    const unidades = await prisma.unidade.findMany({
      where: { condominioId },
      include: { cobrancas: { where: { mesReferencia } } },
      orderBy: { numeroUnidade: 'asc' }
    });

    const hoje = new Date();
    const [mes, ano] = mesReferencia.split('/');
    const vencimento = new Date(Number(ano), Number(mes), 10); // dia 10 do mês seguinte

    for (const unidade of unidades) {
      for (const cob of unidade.cobrancas) {
        if (cob.status === 'PENDENTE' && hoje > vencimento) {
          await prisma.cobranca.update({ where: { id: cob.id }, data: { status: 'VENCIDO' } });
          cob.status = 'VENCIDO';
        }
      }
    }

    const resultado = unidades.map(u => ({
      unidadeId: u.id,
      numeroUnidade: u.numeroUnidade,
      nomeSacado: u.nomeSacado,
      cobranca: u.cobrancas[0] || null
    }));

    const totalArrecadado = resultado
      .filter(u => u.cobranca?.status === 'PAGO')
      .reduce((acc, u) => acc + Number(u.cobranca.totalBruto), 0);

    const totalPendente = resultado
      .filter(u => ['PENDENTE', 'VENCIDO', 'ATRASADO'].includes(u.cobranca?.status))
      .reduce((acc, u) => acc + Number(u.cobranca?.totalBruto || 0), 0);

    const contadores = {
      PAGO:        resultado.filter(u => u.cobranca?.status === 'PAGO').length,
      PENDENTE:    resultado.filter(u => u.cobranca?.status === 'PENDENTE').length,
      VENCIDO:     resultado.filter(u => u.cobranca?.status === 'VENCIDO').length,
      ATRASADO:    resultado.filter(u => u.cobranca?.status === 'ATRASADO').length,
      SEM_COBRANCA: resultado.filter(u => !u.cobranca).length
    };

    return { mesReferencia, unidades: resultado, totalArrecadado, totalPendente, contadores };
  }

  _primeiroDoMes(mesReferencia) {
    const [mes, ano] = mesReferencia.split('/');
    return new Date(`${ano}-${mes.padStart(2, '0')}-01T00:00:00.000Z`);
  }

  _ultimoDoMes(mesReferencia) {
    const [mes, ano] = mesReferencia.split('/');
    const ultimo = new Date(Number(ano), Number(mes), 0).getDate();
    return new Date(`${ano}-${mes.padStart(2, '0')}-${ultimo}T23:59:59.999Z`);
  }
}

module.exports = new RateioService();

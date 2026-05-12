const express = require('express');
const router = express.Router();

// Importação dos Controllers
const CondominioController = require('../controllers/CondominioController');
const FinanceiroController = require('../controllers/FinanceiroController');
const CobrancaController = require('../controllers/CobrançaController');
const RateioController = require('../controllers/RateioController');
const CobrancaRecorrenteController = require('../controllers/CobrancaRecorrenteController');
const UsuarioController = require('../controllers/UsuarioController');

/**
 * 👤 ROTAS DE USUÁRIOS & RBAC
 */
router.get('/usuarios', UsuarioController.listar);
router.post('/usuarios', UsuarioController.criar);
router.patch('/usuarios/:id/status', UsuarioController.atualizarStatus);

/**
 * 🏢 ROTAS DE CONDOMÍNIOS (CLIENTES)
 */
// Lista todos os condomínios na carteira da administradora
router.get('/condominios', CondominioController.index);
router.post('/condominios', CondominioController.store);

// Gerenciamento de Unidades por Condomínio
router.get('/condominios/:id/unidades', CondominioController.getUnidades);
router.post('/condominios/:id/unidades', CondominioController.storeUnidade);
router.put('/unidades/:id', CondominioController.updateUnidade);
router.delete('/unidades/:id', CondominioController.deleteUnidade);

// Cobranças recorrentes por condomínio
router.get('/condominios/:id/cobrancas-recorrentes', CobrancaRecorrenteController.index);
router.post('/condominios/:id/cobrancas-recorrentes', CobrancaRecorrenteController.store);
router.put('/cobrancas-recorrentes/:id', CobrancaRecorrenteController.update);
router.delete('/cobrancas-recorrentes/:id', CobrancaRecorrenteController.destroy);

// Dashboard financeiro com cálculo de repasse (Rateio - 4% Garantidora)
router.get('/condominios/:id/dashboard', CondominioController.getDashboard);


/**
 * 💸 ROTAS FINANCEIRAS (DRE / BALANCETE)
 */
// Gera o balancete analítico mensal
router.get('/financeiro/:condominioId/balancete', FinanceiroController.gerarBalancete);

// Lança uma nova despesa (ex: Portaria, Energia, Manutenção)[cite: 3]
router.post('/financeiro/despesas', FinanceiroController.storeDespesa);


/**
 * 💰 ROTAS DE COBRANÇAS (RECEITAS)
 */
// Lista a composição das cobranças das unidades (R$ 324,81)
router.get('/cobrancas/:condominioId', CobrancaController.listarCobrancas);

// Atualiza o status de pagamento (PAGO/PENDENTE) para controle interno
router.patch('/cobrancas/:id/status', CobrancaController.updateStatus);


/**
 * 🧮 ROTAS DE RATEIO (DIVISÃO DAS CONTAS ENTRE CONDÔMINOS)
 */
// Gera/recalcula as cobranças mensais dividindo despesas entre todas as unidades
router.post('/rateio/:condominioId/gerar', RateioController.gerarRateio);

// Lista o rateio mensal com status de pagamento por unidade
router.get('/rateio/:condominioId', RateioController.listarRateio);


/**
 * 📝 ROTAS DE CONTRATOS (GESTÃO DA CLIENTE)
 */
// Aqui você pode adicionar rotas para ela controlar os honorários dela (ex: R$ 3.236,54)[cite: 3]
// router.get('/honorarios', HonorarioController.index);

module.exports = router;
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO');

-- CreateTable
CREATE TABLE "Condominio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT,
    "percentualGarantidora" DECIMAL(5,2) NOT NULL DEFAULT 4.00,
    "bancoInfo" JSONB,
    "honorarioMensal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Condominio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id" SERIAL NOT NULL,
    "numeroUnidade" TEXT NOT NULL,
    "nomeSacado" TEXT NOT NULL,
    "condominioId" INTEGER NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cobranca" (
    "id" SERIAL NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "valorCondominio" DECIMAL(10,2) NOT NULL,
    "valorTaxaExtra" DECIMAL(10,2) NOT NULL,
    "totalBruto" DECIMAL(10,2) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDENTE',
    "unidadeId" INTEGER NOT NULL,

    CONSTRAINT "Cobranca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxaExtra" (
    "id" SERIAL NOT NULL,
    "nomeProjeto" TEXT NOT NULL,
    "parcelaAtual" INTEGER NOT NULL,
    "totalParcelas" INTEGER NOT NULL,
    "condominioId" INTEGER NOT NULL,

    CONSTRAINT "TaxaExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" SERIAL NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "comprovanteUrl" TEXT,
    "condominioId" INTEGER NOT NULL,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FechamentoMensal" (
    "id" SERIAL NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "totalArrecadadoBruto" DECIMAL(12,2) NOT NULL,
    "custoGarantidora" DECIMAL(10,2) NOT NULL,
    "totalDespesas" DECIMAL(12,2) NOT NULL,
    "saldoFinalCaixa" DECIMAL(12,2) NOT NULL,
    "condominioId" INTEGER NOT NULL,

    CONSTRAINT "FechamentoMensal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condominio_cnpj_key" ON "Condominio"("cnpj");

-- AddForeignKey
ALTER TABLE "Unidade" ADD CONSTRAINT "Unidade_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cobranca" ADD CONSTRAINT "Cobranca_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxaExtra" ADD CONSTRAINT "TaxaExtra_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechamentoMensal" ADD CONSTRAINT "FechamentoMensal_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

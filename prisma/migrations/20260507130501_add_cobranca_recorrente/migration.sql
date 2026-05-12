-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'VENCIDO';

-- AlterTable
ALTER TABLE "TaxaExtra" ADD COLUMN     "valorMensalTotal" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CobrancaRecorrente" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "condominioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CobrancaRecorrente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CobrancaRecorrente" ADD CONSTRAINT "CobrancaRecorrente_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

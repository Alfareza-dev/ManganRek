-- AlterEnum
ALTER TYPE "VoucherStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "status" SET DEFAULT 'PENDING';

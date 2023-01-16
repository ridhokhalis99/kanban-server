-- AlterTable
ALTER TABLE "column" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "sub_task" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

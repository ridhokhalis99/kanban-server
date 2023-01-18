-- AlterTable
ALTER TABLE "board" ADD COLUMN     "user_id" INTEGER;

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT '',
    "email" VARCHAR NOT NULL DEFAULT '',
    "password" VARCHAR NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

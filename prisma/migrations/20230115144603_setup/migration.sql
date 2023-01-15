-- CreateTable
CREATE TABLE "board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_task" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "task_id" INTEGER,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sub_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL DEFAULT '',
    "description" TEXT DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "column_id" INTEGER,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "column" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "board_id" INTEGER,

    CONSTRAINT "column_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_task" ADD CONSTRAINT "sub_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "column"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "column" ADD CONSTRAINT "column_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

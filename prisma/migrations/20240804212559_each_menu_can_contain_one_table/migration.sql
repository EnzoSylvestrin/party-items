/*
  Warnings:

  - A unique constraint covering the columns `[menuId]` on the table `Table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tableId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Menu_name_key";

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "tableId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Table_menuId_key" ON "Table"("menuId");

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

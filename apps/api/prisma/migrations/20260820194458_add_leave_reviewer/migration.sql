-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewerId" TEXT;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

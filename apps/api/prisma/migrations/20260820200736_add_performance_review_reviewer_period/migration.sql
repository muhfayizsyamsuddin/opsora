-- AlterTable
ALTER TABLE "PerformanceReview" ADD COLUMN     "reviewPeriod" TEXT,
ADD COLUMN     "reviewerId" TEXT,
ALTER COLUMN "reviewer" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

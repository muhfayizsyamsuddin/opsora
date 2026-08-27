export type PerformanceReviewEmployee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  salary: number | string;
  hireDate: string;
  status: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type PerformanceReviewReviewer = {
  id: string;
  name: string;
  email: string;
} | null;

export type PerformanceReview = {
  id: string;
  employeeId: string;
  reviewerLegacy: string | null;
  reviewerId: string | null;
  reviewPeriod: string | null;
  score: number;
  comments: string | null;
  reviewDate: string;
  createdAt: string;
  updatedAt: string;

  employee: PerformanceReviewEmployee;
  reviewer: PerformanceReviewReviewer;
};

export type PerformanceReviewListResponse = {
  data: PerformanceReview[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type PerformanceReviewQueryParams = {
  page?: number;
  per_page?: number;
  employee_id?: string;
  reviewer_id?: string;
  review_period?: string;
  score_min?: number;
  score_max?: number;
  search?: string;
  sort_by?: "reviewDate" | "score" | "createdAt";
  sort_order?: "asc" | "desc";
};

export type CreatePerformanceReviewInput = {
  employee_id: string;
  reviewer_id: string;
  review_period: string;
  score: number;
  comments?: string;
};

export type UpdatePerformanceReviewInput = {
  reviewer_id?: string;
  review_period?: string;
  score?: number;
  comments?: string;
};
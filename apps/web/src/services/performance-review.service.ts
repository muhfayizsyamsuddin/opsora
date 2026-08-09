import { api } from "@/lib/api";

export type PerformanceReview = {
  id: string;
  employeeId: string;
  reviewer: string;
  score: number;
  comments?: string;
  reviewDate: string;
  createdAt: string;
  employee: {
    id: string;
    name: string;
    email: string;
    department: {
      id: string;
      name: string;
    };
  };
};

export type GetPerformanceReviewsParams = {
  page?: number;
  limit?: number;
  employeeId?: string;
  reviewer?: string;
  scoreMin?: number;
  scoreMax?: number;
  search?: string;
  sort?: "reviewDate" | "score" | "createdAt";
  order?: "asc" | "desc";
};

type PerformanceReviewsResponse = {
  data: PerformanceReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getPerformanceReviews(
  params: GetPerformanceReviewsParams = {},
) {
  const response = await api.get(
    "/performance-reviews",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        employeeId:
          params.employeeId || undefined,
        reviewer:
          params.reviewer || undefined,
        scoreMin: params.scoreMin ?? undefined,
        scoreMax: params.scoreMax ?? undefined,
        search:
          params.search || undefined,
        sort:
          params.sort ?? "reviewDate",
        order:
          params.order ?? "desc",
      },
    },
  );

  return response.data.data as PerformanceReviewsResponse;
}

export async function getPerformanceReviewById(
  id: string,
) {
  const response = await api.get(
    `/performance-reviews/${id}`,
  );

  return response.data.data as PerformanceReview;
}

export type CreatePerformanceReviewPayload = {
  employeeId: string;
  reviewer: string;
  score: number;
  comments?: string;
  reviewDate: string;
};

export async function createPerformanceReview(
  data: CreatePerformanceReviewPayload,
) {
  const response = await api.post(
    "/performance-reviews",
    data,
  );

  return response.data.data as PerformanceReview;
}

export type UpdatePerformanceReviewPayload = {
  reviewer?: string;
  score?: number;
  comments?: string;
  reviewDate?: string;
};

export async function updatePerformanceReview(
  id: string,
  data: UpdatePerformanceReviewPayload,
) {
  const response = await api.put(
    `/performance-reviews/${id}`,
    data,
  );

  return response.data.data as PerformanceReview;
}

export async function deletePerformanceReview(
  id: string,
) {
  const response = await api.delete(
    `/performance-reviews/${id}`,
  );

  return response.data;
}
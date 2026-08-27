import { api } from "@/lib/api";
import { API } from "@/constants/api";

import type { ApiResponse } from "@/types/api";

import type {
  PerformanceReview,
  PerformanceReviewListResponse,
  PerformanceReviewQueryParams,
  CreatePerformanceReviewInput,
  UpdatePerformanceReviewInput,
} from "@/features/performance-reviews/types/performance-review";

export async function getPerformanceReviews(
  params?: PerformanceReviewQueryParams,
): Promise<PerformanceReviewListResponse> {
  const response =
    await api.get<
      ApiResponse<PerformanceReviewListResponse>
    >(API.PERFORMANCE_REVIEWS, {
      params,
    });

  return response.data.data;
}

export async function getPerformanceReviewById(
  id: string,
): Promise<PerformanceReview> {
  const response =
    await api.get<ApiResponse<PerformanceReview>>(
      `${API.PERFORMANCE_REVIEWS}/${id}`,
    );

  return response.data.data;
}

export async function createPerformanceReview(
  data: CreatePerformanceReviewInput,
): Promise<PerformanceReview> {
  const response =
    await api.post<ApiResponse<PerformanceReview>>(
      API.PERFORMANCE_REVIEWS,
      data,
    );

  return response.data.data;
}

export async function updatePerformanceReview(
  id: string,
  data: UpdatePerformanceReviewInput,
): Promise<PerformanceReview> {
  const response =
    await api.put<ApiResponse<PerformanceReview>>(
      `${API.PERFORMANCE_REVIEWS}/${id}`,
      data,
    );

  return response.data.data;
}

export async function deletePerformanceReview(
  id: string,
): Promise<void> {
  await api.delete(
    `${API.PERFORMANCE_REVIEWS}/${id}`,
  );
}

export async function getEmployeePerformanceHistory(
  employeeId: string,
  params?: Omit<
    PerformanceReviewQueryParams,
    "employee_id"
  >,
): Promise<PerformanceReviewListResponse> {
  const response =
    await api.get<
      ApiResponse<PerformanceReviewListResponse>
    >(
      `${API.PERFORMANCE_REVIEWS}/employee/${employeeId}`,
      {
        params,
      },
    );

  return response.data.data;
}
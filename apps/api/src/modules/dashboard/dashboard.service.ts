import { DashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  static async getStatistics() {
    return DashboardRepository.getStatistics();
  }
}
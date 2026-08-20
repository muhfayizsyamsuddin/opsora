import { DashboardRepository } from "./dashboard.repository.js";

export class DashboardService {
  static async getStatistics() {
    return DashboardRepository.getStatistics();
  }

  static async getSummary() {
    return DashboardRepository.getSummary();
  }

  static async getRecentTransactions() {
    return DashboardRepository.getRecentTransactions();
  }

  static async getLowStock() {
    return DashboardRepository.getLowStock();
  }

  static async getPeopleSummary() {
    return DashboardRepository.getPeopleSummary();
  }
}
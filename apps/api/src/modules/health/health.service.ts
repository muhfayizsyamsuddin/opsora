export class HealthService {
  static getHealth() {
    return {
      success: true,
      message: "API is running",
      timestamp: new Date().toISOString(),
    };
  }
}
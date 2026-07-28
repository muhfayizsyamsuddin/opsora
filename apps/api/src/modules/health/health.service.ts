export class HealthService {
  static getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
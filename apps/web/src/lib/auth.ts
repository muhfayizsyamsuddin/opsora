import { storage } from "@/services/storage";

export function isAuthenticated() {
  return !!storage.getAccessToken();
}
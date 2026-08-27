"use client";

import { useEffect, useRef } from "react";

import { me } from "@/services/auth.service";
import { storage } from "@/services/storage";
import { useAuthStore } from "@/stores/auth.store";

export function AuthBootstrap() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const accessToken = storage.getAccessToken();

    if (!accessToken) {
      return;
    }

    me()
      .then((user) => {
        useAuthStore.getState().setUser(user);
      })
      .catch(() => {
        // Axios interceptor handles token refresh.
        // If refresh also fails, it will clear auth
        // and redirect to /login.
      });
  }, []);

  return null;
}
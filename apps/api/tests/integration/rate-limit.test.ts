import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { apiRateLimit, authLoginRateLimit, authRefreshRateLimit } from "../../src/middlewares/rate-limit.middleware.js";

describe("Auth login rate limit", () => {
  it("blocks the 6th request within the same minute", async () => {
    const app = express();

    app.use(authLoginRateLimit);

    app.post("/login", (_req, res) => {
      return res.status(200).json({
        success: true,
      });
    });

    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post("/login")
        .send({});

      expect(response.status).toBe(200);
    }

    const blockedResponse = await request(app)
      .post("/login")
      .send({});

    expect(blockedResponse.status).toBe(429);

    expect(blockedResponse.body).toEqual({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message:
          "Too many login attempts. Please try again later.",
      },
    });
  });
});

describe("Auth refresh rate limit", () => {
  it("blocks the 21st request within the same minute", async () => {
    const app = express();

    app.use(authRefreshRateLimit);

    app.post("/refresh", (_req, res) => {
      return res.status(200).json({
        success: true,
      });
    });

    for (let i = 0; i < 20; i++) {
      const response = await request(app)
        .post("/refresh")
        .send({});

      expect(response.status).toBe(200);
    }

    const blockedResponse = await request(app)
      .post("/refresh")
      .send({});

    expect(blockedResponse.status).toBe(429);

    expect(blockedResponse.body).toEqual({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message:
          "Too many refresh attempts. Please try again later.",
      },
    });
  });
});

describe("Global API rate limit", () => {
  it("blocks the 301st request within the same minute", async () => {
    const app = express();

    app.use(apiRateLimit);

    app.get("/test", (_req, res) => {
      return res.status(200).json({
        success: true,
      });
    });

    for (let i = 0; i < 300; i++) {
      const response = await request(app)
        .get("/test");

      expect(response.status).toBe(200);
    }

    const blockedResponse = await request(app)
      .get("/test");

    expect(blockedResponse.status).toBe(429);

    expect(blockedResponse.body).toEqual({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message:
          "Too many requests. Please try again later.",
      },
    });
  });
});
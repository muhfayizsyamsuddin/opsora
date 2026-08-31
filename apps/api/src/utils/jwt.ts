import { randomUUID } from "node:crypto";
import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET!;

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

const JWT_REFRESH_EXPIRES_IN =
  (process.env.JWT_REFRESH_EXPIRES_IN ?? "30d") as SignOptions["expiresIn"];

function durationToMs(value: string) {
  const match = value.match(
    /^(\d+)(ms|s|m|h|d)$/,
  );

  if (!match) {
    throw new Error(
      `Unsupported duration format: ${value}`,
    );
  }

  const amount = Number(match[1]);

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  } as const;

  return amount * multipliers[
    match[2] as keyof typeof multipliers
  ];
}

export function getRefreshTokenExpiresAt() {
  return new Date(
    Date.now() +
      durationToMs(
        String(JWT_REFRESH_EXPIRES_IN),
      ),
  );
}

export function generateAccessToken(payload: {
  id: string;
  email: string;
}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & {
    id: string;
    email: string;
  };
}

export function generateRefreshToken(payload: {
  id: string;
}) {
  return jwt.sign(
    {
      ...payload,
      jti: randomUUID(),
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    },
  );
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    JWT_REFRESH_SECRET,
  ) as JwtPayload & {
    id: string;
  };
}
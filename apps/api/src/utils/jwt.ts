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
import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

export function getEnv(key: string, defaultValue?: any) {
  const value = process.env[key];

  if (value === undefined || value === "") {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export function convertBase64(buffer: Buffer, mimetype: string) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}

export function getTokens(id: string): {
  refreshToken: string;
  accessToken: string;
} {
  const refreshTokenSecret = getEnv("JWT_REFRESH_TOKEN_SECRET");
  const refreshTokenExpiresIn = getEnv("JWT_REFRESH_TOKEN_EXPIRES_IN");
  const accessTokenSecret = getEnv("JWT_ACCESS_TOKEN_SECRET");
  const accessTokenExpiresIn = getEnv("JWT_ACCESS_TOKEN_EXPIRES_IN");

  const refreshToken = jwt.sign({ id }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  const accessToken = jwt.sign({ id }, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });

  return { refreshToken, accessToken };
}

export function getCookieOptions(): {
  refreshTokenCookieOptions: CookieOptions;
  accessTokenCookieOptions: CookieOptions;
} {
  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: getEnv("NODE_ENV") === "production",
    sameSite: "strict",
    expires: new Date(
      Date.now() +
        getEnv("COOKIE_REFRESH_TOKEN_EXPIRES_IN") * 24 * 60 * 60 * 1000
    ),
  };

  const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: getEnv("NODE_ENV") === "production",
    sameSite: "strict",
    expires: new Date(
      Date.now() + getEnv("COOKIE_ACCESS_TOKEN_EXPIRES_IN") * 60 * 1000
    ),
  };

  return { refreshTokenCookieOptions, accessTokenCookieOptions };
}

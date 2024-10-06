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
  refresh_token: string;
  access_token: string;
} {
  const refreshTokenSecret = getEnv("JWT_REFRESH_TOKEN_SECRET");
  const refreshTokenExpiresIn = getEnv("JWT_REFRESH_TOKEN_EXPIRES_IN");
  const accessTokenSecret = getEnv("JWT_ACCESS_TOKEN_SECRET");
  const accessTokenExpiresIn = getEnv("JWT_ACCESS_TOKEN_EXPIRES_IN");

  const refresh_token = jwt.sign({ id }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  const access_token = jwt.sign({ id }, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  });

  return { refresh_token, access_token };
}

export function getCookieOptions(): {
  refreshTokenCookieOptions: CookieOptions;
  accessTokenCookieOptions: CookieOptions;
  loggedInCookieOptions: CookieOptions;
} {
  const isProduction = getEnv("NODE_ENV") === "production";

  const refreshExpiresIn = new Date(
    Date.now() +
      parseInt(getEnv("COOKIE_REFRESH_TOKEN_EXPIRES_IN"), 10) *
        24 *
        60 *
        60 *
        1000
  );
  const accessExpiresIn = new Date(
    Date.now() +
      parseInt(getEnv("COOKIE_ACCESS_TOKEN_EXPIRES_IN"), 10) * 60 * 1000
  );

  const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    path: "/",
    expires: refreshExpiresIn,
  };

  const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    path: "/",
    expires: accessExpiresIn,
  };

  const loggedInCookieOptions: CookieOptions = {
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    path: "/",
    expires: accessExpiresIn,
  };

  return {
    refreshTokenCookieOptions,
    accessTokenCookieOptions,
    loggedInCookieOptions,
  };
}

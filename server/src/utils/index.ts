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

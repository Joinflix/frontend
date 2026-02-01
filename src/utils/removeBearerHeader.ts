export const removeBearerHeader = (token: string) => {
  if (!token) return "";
  return token.replace(/^Bearer\s+/i, "").trim();
};

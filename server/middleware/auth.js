function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  return req.cookies?.access_token || null;
}

module.exports = { getToken };

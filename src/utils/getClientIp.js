const getClientIp = (req) => {
  const forwardedForHeader = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedForHeader)
    ? forwardedForHeader[0]
    : forwardedForHeader?.split(",")[0];

  const rawIp = forwardedIp || req.ip || req.socket?.remoteAddress || "";

  // Express may expose IPv4 addresses as ::ffff:1.2.3.4 when the app is behind IPv6.
  return rawIp.replace("::ffff:", "").trim();
};

export { getClientIp };

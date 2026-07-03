const getClientIp = (req) => {
  const forwardedForHeader =
    req.headers["cf-connecting-ip"] ||
    req.headers["true-client-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedForHeader)
    ? forwardedForHeader[0]
    : forwardedForHeader?.split(",")[0];

  const rawIp = forwardedIp || req.ip || req.socket?.remoteAddress || "";

  // Express may expose IPv4 addresses as ::ffff:1.2.3.4 when the app is behind IPv6.
  const ip = rawIp.replace("::ffff:", "").trim();

  if (ip.startsWith("[") && ip.includes("]")) {
    return ip.slice(1, ip.indexOf("]"));
  }

  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) {
    return ip.slice(0, ip.lastIndexOf(":"));
  }

  return ip;
};

export { getClientIp };

/**
 * Security headers middleware
 * Adds protection headers to all HTTP responses
 */

const securityHeaders = (req, res, next) => {
  // Prevent browsers from sniffing MIME types
  // Stops attackers from uploading malicious files that browsers might misinterpret
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Disable framing completely (prevents clickjacking)
  // Stops attackers from embedding your site in a malicious iframe
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS filter in older browsers
  // Provides legacy XSS protection (though modern browsers use CSP)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Control referrer information sent with requests
  // Prevents leaking full URLs to external sites (protects query params)
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Remove Express fingerprint (already removed by helmet, but double-safe)
  // Makes it harder for attackers to identify your stack
  res.removeHeader("X-Powered-By");

  next();
};

// Optional: Export individual headers for testing or selective use
const headerNames = {
  xContentTypeOptions: "X-Content-Type-Options",
  xFrameOptions: "X-Frame-Options",
  xssProtection: "X-XSS-Protection",
  referrerPolicy: "Referrer-Policy",
};

export { securityHeaders, headerNames };

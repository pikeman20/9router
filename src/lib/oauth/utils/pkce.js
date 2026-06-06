import crypto from "crypto";

/**
 * Generate PKCE code verifier (43-128 characters)
 *
 * @param {number} [bytes=32] number of random bytes (xAI uses 96)
 */
export function generateCodeVerifier(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

/**
 * Generate PKCE code challenge from verifier (S256 method)
 */
export function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

/**
 * Generate random state for CSRF protection
 */
export function generateState() {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Extract profileArn from an AWS idToken JWT.
 * The AWS SSO OIDC token endpoint may return profileArn in the top-level
 * response body, but for Organization (IDC) auth it is sometimes absent there
 * and present only as a claim inside the idToken JWT payload.
 *
 * @param {string|null|undefined} idToken - JWT string from the token endpoint
 * @returns {string|null} profileArn claim, or null if not found / on error
 */
export function extractProfileArnFromIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") return null;
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1];
    while (payload.length % 4) payload += "=";
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.arn || decoded.profileArn || null;
  } catch (e) {
    return null;
  }
}

/**
 * Generate complete PKCE pair
 */
export function generatePKCE(bytes = 32) {
  const codeVerifier = generateCodeVerifier(bytes);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  return {
    codeVerifier,
    codeChallenge,
    state,
  };
}

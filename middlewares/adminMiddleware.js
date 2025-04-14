const { verifyAccessToken } = require("../utils/jwt");

function adminMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "No authorization" });
    }

    const token = authorization.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decryptedToken = verifyAccessToken(token);
    if (!decryptedToken.isAdmin) {
      return res.status(403).json({ message: "Not an admin" });
    }

    req.userId = decryptedToken.userId;
    req.isAdmin = decryptedToken.isAdmin || false;
    next();
    
  } catch (error) {
    console.warn("Error: Authorizing endpoint", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = adminMiddleware;

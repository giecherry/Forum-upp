const { verifyAccessToken } = require("../utils/jwt");

function adminMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("No authorization");
    }

    const token = authorization.split(" ")?.[1];
    if (!token) {
      throw new Error("No token");
    }
    const decryptedToken = verifyAccessToken(token);
    if(!decryptedToken.isAdmin) {
      throw new Error("Not an admin")
    }
    req.userId = decryptedToken.userId
    req.isAdmin = decryptedToken.isAdmin || false
    next();
    return;
  } catch (error) {
    console.warn("Error: Authorizing endpoint", error)
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = adminMiddleware

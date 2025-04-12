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
    const decyptedToken = verifyAccessToken(token);
    if(!decyptedToken.isAdmin) {
      throw new Error("Not an admin")
    }
    req.userId = decyptedToken.userId
    req.isAdmin = decyptedToken.isAdmin || false
    next();
    return;
  } catch (error) {
    console.warn("Error: authroizing endpoint", error)
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = adminMiddleware

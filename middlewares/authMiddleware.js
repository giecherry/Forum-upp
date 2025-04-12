const { verifyAccessToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("No authorization");
    }

    const token = authorization.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decyptedToken = verifyAccessToken(token);
    console.log(decyptedToken);
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

module.exports = authMiddleware

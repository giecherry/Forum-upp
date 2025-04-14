const { verifyAccessToken } = require("../utils/jwt.js");

function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "No authorization" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decryptedToken = verifyAccessToken(token);
    console.log("Decrypted Token:", decryptedToken);
    req.user = {
      userId: decryptedToken.userId,
      isAdmin: decryptedToken.isAdmin || false,
    };
    next();

  } catch (error) {
    console.warn("Error: authorizing endpoint", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authMiddleware;

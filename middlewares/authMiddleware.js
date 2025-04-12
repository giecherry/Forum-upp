const { verifyAccessToken } = require("../utils/jwt.js");

function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("No authorization");
    }

    const token = authorization.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decryptedToken = verifyAccessToken(token);
    console.log("Decrypted Token:", decryptedToken); 
    console.log(decryptedToken);
    req.user = {
      userId: decryptedToken.userId,
      isAdmin: decryptedToken.isAdmin || false,
    };
    next();
    return;
  } catch (error) {
    console.warn("Error: authorizing endpoint", error)
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = authMiddleware

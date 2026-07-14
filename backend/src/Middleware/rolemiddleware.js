const jwt = require("jsonwebtoken");

function authRole(...roles) {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Not Authorized",
        });
      }

      req.user = decoded;
      next();

    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  };
}

module.exports = {authRole};
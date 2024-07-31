import jwt from "jsonwebtoken";

//middleware
async function authMiddleware(req, res, next) {
  try {
    //header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return req.status(401).json({
        message: "Authorization header is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token is provided",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export {authMiddleware}

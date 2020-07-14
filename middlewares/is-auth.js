const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Invalid token");
    error.statusCode = 401; // Unauthorized
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  // We use try and catch because it might fail
  try {
    //Verify the token sent by the user through the header jwt.verify --- This will decode and verify the token
    decodedToken = jwt.verify(token, "somesuperscretscret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

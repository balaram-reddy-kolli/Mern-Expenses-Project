const jwt = require("jsonwebtoken");
require('dotenv').config();

// const createToken = (userId) => {
//   const payload = {
//     id: userId,
//   };
//   const secretKey = process.env.SECRET_KEY; // Store secret key in environment variable
//   const options = {
//     expiresIn: "1h", // Token expiration time
//   };

//   return jwt.sign(payload, secretKey, options);
// };

const isAuthenticated = async (req, res, next) => {
  //! Get the token from the header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  //! Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token expired, login again" });
    } else {
      //! Save the user req obj
      req.user = decoded.id;
      next();
    }
  });
};

module.exports = isAuthenticated;
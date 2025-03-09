const jwt = require("jsonwebtoken");

// const createToken = (userId) => {
//   const payload = {
//     id: userId,
//   };
//   const secretKey = "masynctechKey"; // You should store this in an environment variable
//   const options = {
//     expiresIn: "1h", // Token expiration time
//   };

//   return jwt.sign(payload, secretKey, options);
// };
const isAuthenticated = async (req, res, next) => {
  //! Get the token from the header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  //!Verify the token
  const verifyToken = jwt.verify(token, "masynctechKey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  if (verifyToken) {
    //!Save the user req obj
    req.user = verifyToken.id;
    next();
  } else {
    const err = new Error("Token expired, login again");
    next(err);
  }
};

module.exports = isAuthenticated;

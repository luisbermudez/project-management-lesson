const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const { headload, signature } = req.cookies;
  jwt.verify(
    `${headload}.${signature}`,
    process.env.TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      User.findById(decoded.userId)
        .then((user) => {
          if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          req.currentUser = user;
          next();
        })
        .catch((error) => {
          return res.status(401).json({ message: error });
        });
    }
  );
};

exports.clearRes = (data) => {
    const {password, __v, updatedAt, ...cleared } = data;
    return cleared;
}

// const jwt = require("express-jwt");

// const isAuthenticated = jwt({
//     secret: process.env.TOKEN_SECRET,
//     algorithms: ["HS256"],
//     requestProperty: 'payload',
//     getToken: getTokenFromHeaders
// });

// function getTokenFromHeaders (req) {
//     if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
//         const token = req.headers.authorization.split(" ")[1];
//         return token;
//     }

//     return null;
// }

// module.exports = {
//     isAuthenticated
// }


const { messageHandler } = require("../utils/messageHandler");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const isAuthenticated = async (req, res , next) => {
  try {
    const { token } = req.cookies;
    // const {token} = req.query
    const secretKey = process.env.SECRET_KEY;

    if (!token) {
      return messageHandler(res, 403, "No token Detected | Forbidden");
    }

    jwt.verify(token, secretKey, (error, resolve) => {
      if (error) {
        return messageHandler(res, 401, "UnAuthorized");
      } else {
    
        req.userId = resolve.userId
        return  next()
      }
    });


  } catch (error) {
    console.error(error);
  }
};

module.exports = { isAuthenticated };

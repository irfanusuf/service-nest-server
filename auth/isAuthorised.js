const { messageHandler } = require("../utils/messageHandler");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const isAuthorised = async (req, res) => {
  try {
    const { token } = req.cookies;
    const secretKey = process.env.SECRET_KEY;

    if (!token) {
      return messageHandler(res, 403, "No token Detected | Forbidden");
    }

    jwt.verify(token, secretKey, (error, resolve) => {
      if (error) {
        return messageHandler(res, 401, "UnAuthorized");
      } else {
        const  userId = resolve.userId
        return messageHandler(res, 200, "Token verified" , userId);
      }
    });

    // const verifyToken = jwt.verify(token, secretKey);

    // if (verifyToken) {
    //   return messageHandler(res, 200, "Token verified");
    // } else {
    //   return messageHandler(res, 401, "UnAuthorized");
    // }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { isAuthorised };

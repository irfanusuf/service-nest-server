const { messageHandler } = require("./messageHandler");

const cloudinary = require("cloudinary").v2;
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadTocloud = async (imagePath) => {
  try {
    const upload = await cloudinary.uploader.upload(imagePath, {
      folder: "Service nest",
    });

      return upload
  
   
  } catch (error) {
    console.log(error);
  }
};


module.exports = {uploadTocloud}
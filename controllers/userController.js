const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../utils/nodemailer");
const { messageHandler } = require("../utils/messageHandler");
const { uploadTocloud } = require("../utils/cloudinary");
require("dotenv").config();

const registerHandler = async (req, res) => {
  try {
    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password
    const { username, email, password } = req.body;

    if (username !== "" && email !== "" && password !== "") {
      const findUser = await User.findOne({ email });

      if (findUser) {
        return res.json({ message: `user Already Exists` });
      }

      const hashPass = await bcrypt.hash(password, 10);

      const createUser = await User.create({
        username,
        email,
        password: hashPass,
      });

      if (createUser) {
        return res.json({ message: `User created Succesfully!` });
      }
    } else {
      res.json({ message: `All credentials Required` });
    }
  } catch (error) {
    console.error(error);
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.status(400).json({ message: "All credentials Required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    const passverify = await bcrypt.compare(password, user.password);

    if (passverify) {
      const userId = user._id;
      const secretKey = process.env.SECRET_KEY;

      const token = jwt.sign({ userId }, secretKey);

      if (token) {
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, // one month in miiliseconds
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
      }

      return res.status(200).json({
        message: "Logged in Succesfully",
      });
    } else {
      return res.status(400).json({ message: "Password Incorrect!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server Error!" });
  }
};

const forgotPassHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (email === "") {
      return res.status(400).json({ message: "Email Required!" });
    }

    const user = await User.findOne({ email });

    const id = user._id;
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not found , Kindly Register." });
    }

    // const passwordResetLink = `http://localhost:4000/user/password/reset/${id}`;

    const passwordResetLink = `http://localhost:3000/user/resetPass/${id}`;

    // const sendMail = await transporter.sendMail({

    //   from : "services@stylehouse.world",
    //   to : email,
    //   subject : "Password reset Link ",
    //   text : passwordResetLink,

    // })

    // if(sendMail){
    //   return res
    //   .status(200)
    //   .json({
    //     message: "Password Rest link sent to your mail Succesfully",
    //   });
    // }

    transporter.sendMail(
      {
        from: "services@stylehouse.world",
        to: email,
        // bcc : "services@stylehouse.world",
        subject: "Password reset Link ",
        text: passwordResetLink,
        // html : "<h1> ur pass link is here all the css in the html string will be inline </h1>"
      },
      (reject, resolve) => {
        if (reject) {
          console.log(reject);
          return res.status(500).json({ message: "Server Error" });
        }

        return res.status(200).json({
          message: "Password Rest link sent to your mail Succesfully",
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resetPassHandler = async (req, res) => {
  try {
    // const {email , newPass , confirmPass} = req.body

    // const user = await User.findOne({email})

    // const userId = user._id

    // if(newPass !== confirmPass) {
    //   return res.status(400).json("Password Doesnot match!")
    // }

    // const hashPass = await bcrypt.hash(newPass , 10)

    // const updatePass = await User.findByIdAndUpdate(userId , {

    //   password : hashPass

    // })

    const { newPass, confirmPass } = req.body;

    const { userId } = req.params;

    if (newPass !== confirmPass) {
      return res.status(400).json("Password Doesnot match!");
    }

    const hashPass = await bcrypt.hash(newPass, 10);

    const updatePass = await User.findByIdAndUpdate(userId, {
      password: hashPass,
    });

    if (updatePass) {
      return res.status(200).json({ message: "Password Changed Succesfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Some error . Kindly try again after sometime" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const  userId = req.userId;

    const { password } = req.body;

    if(!password){
     return messageHandler(res , 400 , "Password not given!")
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user Not found!" });
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (verifyPass) {
      const deleteUser = await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "user deleted Sucessfully!" });
    } else {
      return res.status(400).json({ message: "Password Doesnot Match" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server Error!" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId)
    .populate({path :"services"}).populate({path: "orders"})

    if (user) {
      res.status(200).json({ message: "user Found", payload: user });
    } else {
      res.status(404).json({ message: "user not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server Error" });
  }
};

const changePasshandler = async (req, res) => {
  try {
    const { userId } = req.userId;

    const { oldpass, newPass, confirmPass } = req.body;

    if (oldpass === "" || newPass !== confirmPass) {
      return res.status(400).json({
        message:
          "All credentails Required! | newPass and confirm pass doesnot match",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ messgae: "user not found!" });
    }

    const verifyPass = await bcrypt.compare(oldpass, user.password);

    if (verifyPass) {
      const hashPass = await bcrypt.hash(newPass, 10);

      await User.findByIdAndUpdate(userId, {
        password: hashPass,
      });

      res.status(200).json({ message: "password changed Succesfully!" });
    } else {
      res.status(400).json({ message: "Old password is incorrect!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return messageHandler(res, 404, "User not Found");
    }
    const imagePath = req.file.path;
    
    const upload = await uploadTocloud(imagePath);

    if (upload) {
      user.profilepicUrl = upload.secure_url;
      await user.save();

      return messageHandler(res, 200, "upload Succesfull", upload);
    } else {
      return messageHandler(res, 400 , "Some error , Try after Sometime");
    }
  } catch (error) {
    messageHandler(res, 500, "Server Error");
    console.error(error);
  }
};


const logoutHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return messageHandler(res, 404, "User not Found");
    }

    res.clearCookie('token');
    messageHandler(res , 200 , "Logged Out succesfully!")

 
  } catch (error) {
    messageHandler(res, 500, "Server Error");
    console.error(error);
  }
};







module.exports = {
  registerHandler,
  loginHandler,
  forgotPassHandler,
  resetPassHandler,
  deleteUserHandler,
  getUser,
  changePasshandler,
  uploadProfilePic,
  logoutHandler
};

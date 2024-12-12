const express = require("express"); // import express from node modules
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const {
  registerHandler,
  loginHandler,
  forgotPassHandler,
  resetPassHandler,
  deleteUserHandler,
  getUser,
  changePasshandler,
  uploadProfilePic,
} = require("./controllers/userController"); // import function from controllers
const { connectDb } = require("./config/connectDb");
const { isAuthorised } = require("./auth/isAuthorised");
const { isAuthenticated } = require("./auth/isAuthenticated");
const {
  createService,
  getAllservices,
  getServiceById,
  editServiceById,
  delServicebyId,
  UploadServicePic,
} = require("./controllers/serviceControllers");
const { createOrder, cancelOrder, getorderById, getAllOrders } = require("./controllers/orderControllers");
const { createPaymentIntent } = require("./controllers/paymentController");
const { multmid } = require("./middlewares/multer");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

connectDb();

//middle wares

app.use(express.json());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded())
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.json({ message: "hello from the server " });
});

app.get("/user/isAuth", isAuthorised);

// user routes
app.post("/user/register", registerHandler); // done
app.post("/user/login", loginHandler); // done
app.post("/user/forgotPass", forgotPassHandler); // done
app.put("/user/password/reset/:userId", resetPassHandler); // done
app.post("/user/upload/profile" ,multmid, isAuthenticated , uploadProfilePic)  //done

// secure user Routes
app.post("/user/delete", isAuthenticated, deleteUserHandler); //done
app.put("/user/changepassword", isAuthenticated, changePasshandler); // done
app.get("/user/getuser", isAuthenticated, getUser); // done

// service Routes
app.post("/seller/create/service", isAuthenticated, createService);  // done
app.post("/seller/upload/serviceImage" , multmid , isAuthenticated , UploadServicePic)   // done
app.put("/seller/edit/service", isAuthenticated, editServiceById);    // done
app.delete("/seller/delete/service", isAuthenticated, delServicebyId);   // done

app.get("/services/all", isAuthenticated, getAllservices); 
app.get("/service", isAuthenticated, getServiceById);   // done 


// order Routes
app.post("/customer/create/order", isAuthenticated, createOrder);
app.put("/customer/cancel/order", isAuthenticated, cancelOrder);
app.get("/customer/fetch/orders" ,isAuthenticated , getAllOrders )
app.get("/customer/fetch/order" ,isAuthenticated , getorderById )




// payment routes

app.post("/customer/pay/order", isAuthenticated, createPaymentIntent);






app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

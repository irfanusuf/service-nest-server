const { Order } = require("../models/OrderModel");
const { Service } = require("../models/serviceModel");
const { User } = require("../models/userModel");
const { messageHandler } = require("../utils/messageHandler");

const createOrder = async (req, res) => {
  try {
    const { serviceId } = req.query;
    const userId = req.userId;
    // const { paymentMode } = req.body;
    const service = await Service.findById(serviceId);
    const user = await User.findById(userId);

    if (!service ) {
      return messageHandler(res, 404, "service unavailable!");
    }

    if(service.isActive === false){
      return messageHandler(res, 400, "This service is inactive!");
    }

    if (!user ) {
      return messageHandler(
        res,
        404,
        "No user Found! "
      );
    }

    const orderCost =
      service.serviceCost - (service.discount / 100) * service.serviceCost;

    const order = await Order.create({
      service: serviceId,
      orderCost: orderCost,
      // paymentMode: paymentMode,
      customer: userId,
    });

    const updateUserOrdersArr = user.orders.push(order._id);

    if (updateUserOrdersArr) {
      await user.save();
      return messageHandler(res, 200, "Booking Succesfull", order);
    }
  } catch (error) {
    console.error(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Order.findById(orderId);
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return messageHandler(res, 404, "user not Found");
    }

    if (!order) {
      return messageHandler(res, 404, "order not Found");
    }

    const ownerOFOrder = order.customer._id.toString() === userId;

    if (ownerOFOrder) {
      const updatedOrder = (order.orderStatus = "cancelled");

      await order.save();
      return messageHandler(res, 200, "Order cancelled succesfully", updatedOrder);
    } else {
      return messageHandler(res, 200, "Order cancellation not possible");
    }
  } catch (error) {
    console.error(error);
    messageHandler(res, 500, "server Error");
  }
};

const getorderById = async (req, res) => {
  try {
    const { orderId } = req.query;

    const order = await Order.findById(orderId);

    if (!order) {
      return messageHandler(res, 404, "Order not Found");
    }

    return messageHandler(res, 200, "Order Found", order);
  } catch (error) {
    console.error(error);
    messageHandler(res, 500, "server Error");
  }
};

const getAllOrders = async (req,res)=>{

try {

  const orders = await Order.find()
  if(orders){
  return  messageHandler(res, 200 , `${orders.length} orders found` , orders )
  }

  
} catch (error) {
  return messageHandler (res , 500 , "server Error")
  console.log(error)
}


}



module.exports = { createOrder, cancelOrder, getorderById  , getAllOrders};

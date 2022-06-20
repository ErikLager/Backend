const express = require("express");
const orderRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const Order = require("../models/Order");
const User = require("../models/User");
// const { orderConfirmed } = require("../serverices/emailService");
const orderConfirmed = require("../serverices/emailService")



// Add new order
orderRouter.post("/neworder", (req, res) => {
    console.log(req.body);
    const newOrder = new Order(req.body);
    newOrder.save((e) => {
        if (e) {
            res.status(500).json(
                {
                    message: {
                        msgBody: "An error occured while adding order",
                        msgError: true,
                        error: e
                    }
                },
            );
        } else {
            if (req.body.userId) {
                User.findById({ _id: req.body.userId }, (e, user) => {
                    if (e) {
                        res.status(500).json(
                            {
                                message: {
                                    msgBody: "An error occured while retrieving user",
                                    msgError: true,
                                    error: e
                                }
                            },
                        );
                    } else {
                        user.orderHistory.push(newOrder);
                        user.save((e) => {
                            if (e) {
                                res.status(500).json(
                                    {
                                        message: {
                                            msgBody: "An error occured while adding order to order history",
                                            msgError: true,
                                            error: e
                                        }
                                    },
                                );
                            } else {
                                res.status(201).json({
                                    message: {
                                        msgBody: "Successfully created order and put it in your order history",
                                        msgError: false
                                    }
                                });
                                orderConfirmed(req.body)
                            };
                        });
                    };
                });
            } else {
                res.status(201).json({
                    message: {
                        msgBody: "Successfully created order",
                        msgError: false
                    }
                });
                orderConfirmed(req.body)
            };
        };
    });
});

// get all orders
orderRouter.get("/getorders", passport.authenticate("admin-rule", { session: false }), (req, res) => {
    Order.find({}, (e, orders) => {
        if (e) {
            res.status(500).json(
                {
                    message: {
                        msgBody: "An error occured while retrieving orders",
                        msgError: true,
                        error: e
                    }
                },
            );
        } else {
            res.status(200).json(
                {
                    orders,
                    message: {
                        msgBody: "Successfully retrieved orders",
                        msgError: false,
                    },
                },
            );
            console.log(orders)
        };
    });
});

// Handle Order
// orderRouter.put(
//     "/handleorder/:id",
//     passport.authenticate("admin-rule", { session: false }),
//     (req, res) => {
//         Order.findByIdAndUpdate(
//             { _id: req.params.id },
//             { handled: req.body.handled },
//             (err) => {
//                 if (err) {
//                     res.status(500).json({
//                         message: {
//                             msgBody: "An error occured handling order",
//                             msgError: true,
//                         },
//                     });
//                 } else {
//                     res.status(200).json({
//                         message: {
//                             msgBody: "Successfully handled order",
//                             msgError: false,
//                         },
//                     });
//                 }
//             }
//         );
//     }
// );
orderRouter.put("/handleorder/:id", passport.authenticate("admin-rule", { session: false }), (req, res) => {
    Order.findByIdAndUpdate({ _id: req.params.id }, { handled: req.body.handled }, (e) => {
        if (e) {
            res.status(500).json(
                {
                    message: {
                        msgBody: "An error occured while handling order",
                        msgError: true,
                        error: e
                    }
                },
            );
        } else {
            res.status(200).json(
                {
                    message: {
                        msgBody: "Successfully upådated handler",
                        msgError: false,
                    }
                }
            );
        };
    });
});

// delete order
orderRouter.delete("/delete/:id", passport.authenticate("admin-rule", { session: false }), (req, res) => {
    Order.findByIdAndDelete({ _id: req.params.id }, (e) => {
        if (e) {
            res.status(500).json(
                {
                    message: {
                        msgBody: "An error occured deleting order",
                        msgError: true,
                        error: e
                    }
                },
            );
        } else {
            res.status(200).json(
                {
                    message: {
                        msgBody: "Successfully deleted order",
                        msgError: false,
                    }
                }
            );
        };
    });
});

module.exports = orderRouter;
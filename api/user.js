const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { findById } = require("../models/User");

// Development env
require("dotenv").config();

// Function that creates our json web toiken (cookie)
const signToken = (userId) => {
    return jwt.sign({
        iss: "ErikDr",
        sub: userId
    },
        process.env.JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24,
        }
    );
}

// save new user to db
userRouter.post("/register", (req, res) => {
    const { username, password, role } = req.body;
    User.findOne({ username }, (e, user) => {
        if (e) {
            res.status(500)
                .json(
                    {
                        msg: {
                            msgBody: "An error occurd",
                            msgError: true
                        }
                    }
                );
        }
        if (user) {
            res.status(400)
                .json(
                    {
                        msg: {
                            msgBody: "Username already taken",
                            msgError: true
                        }
                    }
                );

        } else {
            const newUser = new User({ username, password, role });
            newUser.save((e) => {
                if (e) {
                    res.status(500)
                        .json(
                            {
                                msg: {
                                    msgBody: "An error occurd",
                                    msgError: true
                                }
                            }
                        );
                } else {
                    res.status(201)
                        .json(
                            {
                                msg: {
                                    msgBody: "User created",
                                    msgError: false
                                }
                            }
                        );
                }
            });
        };
    });
});

userRouter.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        if (req.isAuthenticated()) {
            const { _id, username, role } = req.user;
            const token = signToken(_id);
            res.cookie("access-token", token, { httpOnly: true, sameSite: true });
            res.status(200).json({
                isAuthenticated: true,
                user: { _id, username, role },
                msg: { msgBody: "Successfully logged in", msgError: false },
            });
        };
    }
);

userRouter.get(
    "/authenticated",
    passport.authenticate("user-rule", { session: false }),
    (req, res) => {
        const { _id, username, role, firstname, lastname, email, phone, street, zipCode, town, country } = req.user;
        res.status(200).json({
            isAuthenticated: true,
            user: { _id, username, role, firstname, lastname, email, phone, street, zipCode, town, country }
        });
    });

userRouter.get("/logout", passport.authenticate("user-rule", { session: false }), (req, res) => {
    res.clearCookie("access-token");
    res.status(200)
        .json(
            {
                msg: {
                    msgBody: "Logged out",
                    msgError: false
                }
            }
        );
});

// Update user
userRouter.put("/update/:id", passport.authenticate("user-rule", { session: false }), (req, res) => {
    const { firstname, lastname, email, phone, street, zipCode, town, country } = req.body;
    User.findByIdAndUpdate({ _id: req.params.id }, { firstname, lastname, email, phone, street, zipCode, town, country }, (e) => {
        if (e) {
            res.status(500)
                .json(
                    {
                        msg: {
                            msgBody: "An error occurd updating your account",
                            msgError: true
                        }
                    }
                );
        } else {
            res.status(200).json(
                {
                    msg: {
                        msgBody: "Successfully updated your account",
                        msgError: false
                    }
                }
            );
        }
    });
});

// get order history
userRouter.get("/getorderhistory", passport.authenticate("user-rule", { session: false }), (req, res) => {
    User.findById({ _id: req.user._id })
        .populate("orderHistory")
        .exec((e, user) => {
            if (e) {
                res.status(500)
                    .json(
                        {
                            msg: {
                                msgBody: "An error occurd retrieving orderhistory",
                                msgError: true
                            }
                        }
                    );
            } else {
                res.status(200)
                    .json(
                        {
                            orderHistory: user.orderHistory,
                            msg: {
                                msgBody: "Successfully retrieved orderhistory",
                                msgError: false
                            }
                        }
                    );
            };
        });
});



module.exports = userRouter;
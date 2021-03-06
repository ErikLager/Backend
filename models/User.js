const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userRouter = require("../api/user");
const passport = require("passport");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    street: {
        type: String
    },
    zipCode: {
        type: String
    },
    town: {
        type: String
    },
    country: {
        type: String
    },
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
});

// middlewear that runs before every mongodb save call via mongoose
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) next();
    bcrypt.hash(this.password, 10, (e, passwordHashed) => {
        if (e) return next(e);
        this.password = passwordHashed;
        next();
    });
});


// gets called from passport local strategy to compare password submitted from client with password on user in db
UserSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (e, isMatch) => {
        if (e){
            return cb(e)
        }else{
            if(!isMatch) return cb(null, isMatch)
            return cb(null, this)
        }
    });
};

module.exports = mongoose.model("User", UserSchema);

const passport = require("passport");
const localStategy = require("passport-local").Strategy;
const jwtStategy = require("passport-jwt").Strategy;
const User = require("./models/User");

// dev env vars
require("dotenv").config();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies["access-token"];
    return token;
}

// jwt stategy - gets run every time the passport "jwt" argument set on passport authenticate param on request handler

// user authentication strategy
passport.use(
    "user-rule",
    new jwtStategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET,
        }, (payload, done) => {
            User.findById({ _id: payload.sub }, (e, user) => {
                if (e) return done(e);
                if (!user) return done(null, false);
                return done(null, user);
            });
        }
    )
);

// admin authentication stategy
passport.use(
    "admin-rule",
    new jwtStategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_SECRET,
        },
        (payload, done) => {
            User.findById({ _id: payload.sub }, (e, user) => {
                if (e) return done(e);
                if(user && user.role === "admin") return done(null, user);
                return done(null, false);
            });
        }
    )
);


// local stategy - gets run every time the passport "local" argument is set on passports authenticate param on request handler
passport.use(new localStategy((username, password, done) => {
    User.findOne({ username }, (e, user) => {
        if (e) return done(e);
        if (!user) return done(null, false);
        user.comparePassword(password, done);
    });
}));
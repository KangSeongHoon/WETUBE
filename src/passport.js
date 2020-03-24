
import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import { githubLoginCallback, facebookCallback } from "./controller/userController";
import routes from "./routes";


passport.use(User.createStrategy());

passport.use(new GithubStrategy({
    clientID: process.env.GIT_ID,
    clientSecret: process.env.GIT_SECRET,
    callbackURL: `http://localhost:4000${routes.githubCallback}`

}, githubLoginCallback
)
);

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CALLBACK + routes.facebookCallback,
    profileFields: ["id", "displayName", "photos", "email"],
    scope: ["public_profile", "email"]
},
    facebookCallback
)
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
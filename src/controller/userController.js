import passport from "passport";
import routes from "../routes";
import User from "../models/User";


export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password1, password2 }
    } = req;
    if (password1 != password2) {
        res.status(400);
        res.render("join", { pageTitle: "Join" });
        console.log("비밀번호가 틀립니다");
    } else {
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password2);
            next();

        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }

    }
};

export const getLogin = (req, res) =>
    res.render("Login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {

    const { _json: { id, avatar_url: avatarUrl, name, email } } = profile;
    try {
        const user = await User.findOne({ email })
        if (user) {
            user.githubId = id;
            user.name = name;
            user.save();
            return cb(null, user);
        }

        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);

    } catch (error) {
        return cb(error);

    }

};
export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
}

export const facebooklogin = passport.authenticate("facebook");


export const facebookCallback = async (
    _,
    __,
    profile,
    cb
) => {
    const { _json: { id, name, email } } = profile;
    try {
        const user = await User.findOne({ email })
        if (user) {
            user.facebookId = id;
            user.avatarUrl = avatarUrl;
            user.name = name;
            user.save();
            return cb(null, user);
        }

        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
        });
        return cb(null, newUser);
    } catch (error) {
        return debug(error)
    }

};

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);

}


export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};


export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "User Detail", user: req.user });
}

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id).populate("videos");
        console.log(user);
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (erorr) {
        res.redirect(routes.home);
    }
}


export const getEditProfile = (req, res) => {
    res.render("editProfile", { pageTitle: "Edit Profile" });

}


export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.location : req.user.avatarUrl
        });
        res.redirect(routes.me);
    } catch (error) {
        res.redirect(routes.editProfilet);
        console.log(error);
    }


}

export const getChangePassword = (req, res) =>
    res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
    const {
        body: {
            oldPassword,
            newPassword1,
            newPassword2
        }
    } = req;
    try {
        if (newPassword1 !== newPassword2) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword1);
        res.redirect(routes.home);

    } catch (error) {
        res.redirect(`/users${routes.changePassword}`);
        console.log(error);
    }
}


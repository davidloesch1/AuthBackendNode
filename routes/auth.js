const express = require("express");
const passport = require("passport");
const router = express.Router();

// url routes ending in /auth

//Auth with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

//Google Auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send(req.user);
  }
);

//Auth with Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

//Facebook Auth callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => res.redirect("/dashboard")
);

//Auth with Username and Password
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/",
//   }),
//   (req, res) => {
//     console.log(req.user);
//   }
// );
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send(info.message);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});
//logout user
router.get("/logout", (req, res) => {
  req.logout();
  res.send("successfully logged out")
});

module.exports = router;

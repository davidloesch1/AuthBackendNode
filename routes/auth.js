const express = require("express");
const passport = require("passport");
const router = express.Router();

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
  (req, res) => res.redirect("/dashboard")
);

//logout user
router.get('/logout', (req, res) => {
    req.logout()
    req.redirect('/')
})


module.exports = router;

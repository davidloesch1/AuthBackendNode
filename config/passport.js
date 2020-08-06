const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  //Google Strategy for finding or creating user in MongoDB
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
        };

        try {
          let user = await User.findOne({ email: newUser.email });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {}
      }
    )
  );

  //Facebook Strategy for finding or creating user in MongoDB
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
        enableProof: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          facebookId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
        };
        try {
          let user = await User.findOne({ email: newUser.email });
          console.log(user);
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {}
      }
    )
  );

  passport.use(
    new LocalStrategy(async (email, password, done) => {
      console.log(email, password)
      const newUser = {
        email: email,
        password: password,
      };
      try {
        let user = await User.findOne({ email: newUser.email });
        console.log(user);
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          console.log("This is a new user", user);
          done(null, user);
        }
      } catch (err) {}
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

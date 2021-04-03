const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user");

passport.serializeUser(function(user, done) {
    if(user) done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use(
    new GoogleStrategy({
            clientID: "618840554237-42lmi03gta5otvct0j2npsddnjidtorm.apps.googleusercontent.com",
            clientSecret: "B1XQ-T2ph-JJjvSrThYV71up",
            callbackURL: "/auth/google/callback", 
        }, function (req, token, refreshToken, data, done) {
            console.log(data.name.familyName.value);
            process.nextTick(function () {
                User.findOne({ 'email': data.emails[0].value, 'firstName': data.name.givenName, 'lastName': data.name.familyName }, function (err, user) {
                    if (err) return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = {
                            email: data.emails[0].value,
                            firstName: data.name.givenName,
                            lastName: data.name.familyName,
                        };

                        User.create(newUser, function (err, added) {
                            if (err) {
                                console.log("err: " + err);
                            }
                            return done(null, added);
                        });
                    }
                });
            });
        }
    )
);

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user");

passport.serializeUser(function (user, done) {
    if (user) done(null, user);
});

passport.deserializeUser(function (id, done) {
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


exports.getDetails = (req, res, next) => {
    User.findById(req.params.id).then(user => {
        // console.log(user.eventsJoined);
        if (user) {
            const details = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                balance: user.balance
            }
            res.status(200).json(details);
        } else {
            res.status(404).json({ message: "User not found!" });
        }
    })
        .catch(error => {
            res.status(500).json({
                message: "Fetching User failed!"
            });
        });
};

// exports.getBalance = (req, res, next) => {
//     User.findOne({ "email": req.body.email }, function(err, user) {
//         if (err) return done(err);
//         if (user) {
//             const details = {
//                 balance: user.balance
//             }
//             res.status(200).json(details);
//         } else {
//             res.status(404).json({ message: "User not found!" });
//         }
//     })
// };

exports.addFunds = (req, res, next) => {
    User.findByIdAndUpdate(req.body.id, {$inc: { balance: req.body.amount }}).then(result => {
        if (result) {
            res.status(200).json({ message: "disabled successfully" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Disabling Users failed!"
        });
    }); 
};
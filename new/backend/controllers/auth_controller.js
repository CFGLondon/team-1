var express = require("express");
var router = express.Router();
var User = require("../models/user");
var authTokenService = require("../services/auth_token");
var Company = require("../models/company");

router.route("/authenticate")

    .post(function (req, res) {
        var type = req.body.type;
        var email = req.body.email ? req.body.email.trim() : req.body.email;
        var password = req.body.password ? req.body.password.trim() : req.body.password;

        if (!email || !password) return res.sendError(401, "Email and password are required.");

        if (type == "user") {
            User.findOneByEmail(email, function (err, user) {
                if (err) return res.sendError(500, err);

                if (!user) return res.sendError(401, "Incorrect email.");

                user.comparePassword(password, function (err, match) {
                    if (err) return res.sendError(500, err);

                    if (!match) return res.sendError(401, "Incorrect password.");

                    authTokenService.issueToken(user, function (err, token) {
                        if (err) return res.sendError(err.message);

                        return res.sendOk({token: token, id: user.id});
                    });
                });
            });
        } else {
            Company.findOneByEmail(email, function (err, company) {
                if (err) return res.sendError(500, err);

                if (!company) return res.sendError(401, "Incorrect email or password.");

                company.comparePassword(password, function (err, match) {
                    if (err) return res.sendError(500, err);

                    if (!match) return res.sendError(401, "Incorrect email or password.");

                    authTokenService.issueToken(company, function (err, token) {
                        if (err) return res.sendError(err.message);

                        return res.sendOk({token: token, id: company._id});
                    });
                });
            });
        }
    });

module.exports = router;
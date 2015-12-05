/**
 * Created by manas on 05-12-2015.
 */

var express = require("express");
var router = express.Router();
var Company = require("../models/company");
var authTokenService = require("../services/auth_token");
var authenticationMiddleware = require("../middleware/authentication");
var ownUserMiddleware = require("../middleware/own_user");

router.route("/companies")

    .post(function (req, res) {
        var name = req.body.name ? req.body.name.trim() : undefined;
        var email = req.body.email ? req.body.email.trim() : undefined;
        var password = req.body.password ? req.body.password.trim() : undefined;
        var description = req.body.description;
        var type = req.body.type;

        var company = new Company({
            name: name,
            email: email,
            password: password,
            description: description,
            type: type
        });

        company.hashPassword(function (err) {
            if (err) return res.sendError(500, err.message);

            company.save(function (err) {
                if (err) return res.sendError(500, err.message);

                // finally, issue auth token
                authTokenService.issueToken(company, function (err, token) {
                    if (err) return res.sendError(err.message);

                    return res.sendOk({token: token});
                });
            });
        });
    })

    .get(function (req, res) {
        Company.find(function (err, users) {
            if (err) return res.sendError(500, err.message);

            return res.sendOk(users);
        });
    });

router.get("/companies/:id", function (req, res) {
    Company.findById(req.params.id, function (err, user) {
        if (!user) return res.sendError(404, "No company found with id '" + req.params.user_id +"'");

        if (err) return res.sendError(500, err.message);

        return res.sendOk(user);
    });
});

module.exports = router;
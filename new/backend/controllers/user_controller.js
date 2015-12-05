var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Opportunity = require("../models/opportunity");
var async = require("async");
var authTokenService = require("../services/auth_token");
var authenticationMiddleware = require("../middleware/authentication");
var ownUserMiddleware = require("../middleware/own_user");

router.route("/users")

    /**
     * POST new user.
     */

    .post(function (req, res) {
        var name = req.body.name ? req.body.name.trim() : undefined;
        var email = req.body.email ? req.body.email.trim() : undefined;
        var password = req.body.password ? req.body.password.trim() : undefined;
        var location = req.body.location;

        var user = new User({
            name: name,
            email: email,
            password: password,
            location: location
        });

        // perform validation
        user.validateInfo({}, function (err) {
            if (err) return res.sendError(400, err.message);

            // now that validation has been performed, hash password before saving user
            user.hashPassword(function (err) {
                if (err) return res.sendError(500, err.message);

                user.save(function (err) {
                    if (err) return res.sendError(500, err.message);

                    // finally, issue auth token
                    authTokenService.issueToken(user, function (err, token) {
                        if (err) return res.sendError(err.message);

                        return res.sendOk({token: token});
                    });
                });
            });
        });
    })


    /**
     * GET all users.
     */

    .get(authenticationMiddleware, function (req, res) {
        User.find(function (err, users) {
            if (err) return res.sendError(500, err.message);

            return res.sendOk(users);
        });
    });


router.route("/users/:user_id")

    /**
     * GET user.
     */

    .get(authenticationMiddleware, function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (!user) return res.sendError(404, "No user found with id '" + req.params.user_id +"'");

            if (err) return res.sendError(500, err.message);

            return res.sendOk(user);
        });
    })

    /**
     * PUT updated user info.
     */

    .put(authenticationMiddleware, ownUserMiddleware, function (req, res) {
        var name = req.body.name ? req.body.name.trim() : undefined;
        var email = req.body.email ? req.body.email.trim() : undefined;
        var password = req.body.password ? req.body.password.trim() : undefined;

        User.findById(req.params.user_id, function (err, user) {
            if (!user) return res.sendError(404, "No user found with id '" + req.params.user_id +"'");

            if (err) return res.sendError(500, err.message);

            // only validate email if it is provided and is not the same as the current email address
            var shouldValidateEmail = (email != undefined) && (email !== user.email);

            if (name) user.name = name;
            if (email) user.email = email;
            if (password) user.password = password;

            async.series([
                function (callback) {
                    // perform validation
                    user.validateInfo({
                        shouldValidateEmail: shouldValidateEmail,
                        shouldValidatePassword: password != undefined // only validate password if it is provided
                    }, function (err) {
                        if (err)
                            return res.sendError(400, err.message);

                        return callback(null);
                    });
                },
                function (callback) {
                    // now that validation has been performed, hash password before saving user
                    if (password) {
                        user.hashPassword(function (err) {
                            if (err)
                                return res.sendError(500, err.message);

                            return callback(null);
                        });
                    } else {
                        return callback(null);
                    }
                },
                function () {
                    // finally, save user
                    user.save(function (err) {
                        if (err)
                            return res.sendError(500, err.message);

                        return res.sendOk();
                    });
                }
            ]);
        });
    })


    /**
     * DELETE user.
     */

    .delete(authenticationMiddleware, ownUserMiddleware, function (req, res) {
        User.findByIdAndRemove(req.params.user_id, function (err, user) {
            if (!user)
                return res.sendError(404, "No user found with id '" + req.params.user_id +"'");

            if (err)
                return res.sendError(500, err.message);

            return res.sendOk();
        });
    });

router.post("/users/:user_id/like-opportunity/:opportunity_id", authenticationMiddleware, function (req, res) {
    var opportunityId = req.params.opportunity_id;
    var userId = req.params.user_id;

    User.findById(userId, function (err, user) {
        user.likedOpportunities.push(opportunityId);

        if (user.likedOpportunities.indexOf(opportunityId) > -1) {
            user.dislikedOpportunities.splice(user.likedOpportunities.indexOf(opportunityId), 1);
        }

        user.save(function (err) {
            return res.sendOk();
        });
    });
});

router.post("/users/:user_id/dislike-opportunity/:opportunity_id", function (req, res) {
    var opportunityId = req.params.opportunity_id;
    var userId = req.params.user_id;

    User.findById(userId, function (err, user) {
        user.dislikedOpportunities.push(opportunityId);

        if (user.likedOpportunities.indexOf(opportunityId) > -1) {
            user.likedOpportunities.splice(user.likedOpportunities.indexOf(opportunityId), 1);
        }

        user.save(function (err) {
            return res.sendOk();
        });
    });
});

router.post("/users/recompute-clusters", function (req, res) {
    var get_division_weights = function(type) {
        console.log(type);
        switch (type) {
            case "technology":
                return [1, 0.5, 0.4, 0.5, 0.5, 0.2, 0.3, 0, 0, 0, 0];
            case "science":
                return [0.5, 1, 0.7, 0.4, 0.2, 0, 0.3, 0, 0, 0, 0];
            case "teaching":
                return [0.4, 0.7, 1, 0.1, 0.1, 0, 0.5, 0, 0, 0, 0];
            case "management":
                return [0.5, 0.4, 0.1, 1, 0.6, 0.4, 0.5, 0, 0, 0, 0];
            case "finance":
                return [0.5, 0.2, 0.1, 0.6, 1, 0.4, 0.5, 0, 0, 0, 0];
            case "marketing":
                return [0.2, 0, 0, 0.4, 0.4, 1, 0.6, 0, 0, 0, 0];
            case "consulting":
                return [0.3, 0.3, 0.5, 0.5, 0.5, 0.6, 1, 0, 0, 0, 0];
        }
    };

    var get_type_weights = function(type) {
        console.log(type);
        switch (type) {
            case "part-time":
                return [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
            case "graduate":
                return [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
            case "competition":
                return [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
            case "apprenticeship":
                return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        }
    };

    var vectors = [];
    User.find({}, function (err, users) {
        async.series([
            function(callback){
                async.each(users, function(user, callback){

                    var vector = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
                    var totalOpportunities = user.likedOpportunities.length + user.dislikedOpportunities.length;


                    async.each(user.likedOpportunities, function(likedOpportunity, callback) {
                        if (user.likedOpportunities.length) {
                            console.log(likedOpportunity);
                            Opportunity.find({_id: likedOpportunity}, function (err, op) {
                                console.log(op);
                                var weights = get_type_weights(op.type);
                                var weights2 = get_division_weights(op.division);
                                for (var jj = 0; jj < vector.length; jj++) {
                                    vector[jj] += weights[jj];
                                    vector[jj] += weights2[jj];
                                }
                                callback();
                            });
                        }

                    }, function() {
                        console.log(" XXX" +user.dislikedOpportunities);
                        if (user.dislikedOpportunities.length > 0)
                        {
                            async.each(user.dislikedOpportunities, function(dislikedOpportunity, callback) {
                                Opportunity.find({_id: dislikedOpportunity}, function (err, op) {
                                    console.log(op);
                                    var weights = get_type_weights(op.type);
                                    var weights2 = get_division_weights(op.division);

                                    for (var ll = 0; ll < vector.length; ll++) {
                                        vector[ll] -= weights[ll];
                                        vector[ll] -= weights2[ll];
                                    }
                                    callback();
                                });
                            }, function() {
                                callback();
                            });
                        }
                        callback();
                    });
                }, function(){
                    for (var l = 0; l < vector.length; l++) {
                        vector[l] /= Math.max(totalOpportunities,1);
                        if (vector[l] < 0) vector[l] = 0;
                        if (vector[l] > 1) vector[l] = 1;
                    }
                    vectors.push(vector);
                    callback();
                });
            }, function(callback) {
                console.log(" FOR LOOP ENDED." );
                var kmeans = require('node-kmeans');
                kmeans.clusterize(vectors, {k: Math.floor(Math.sqrt(users.length))}, function (err, res) {
                    if (err) console.error(err);
                    else {
                        console.log('%o', res);
                        //update user cluster
                    }
                });
            }
        ]);
    });
});

module.exports = router;
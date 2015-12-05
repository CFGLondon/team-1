/**
 * Created by manas on 05-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var API_BASE = "http://localhost:4000/api";

var authController = {
    login: function (options) {
        var self = this;

        $.ajax({
            url: API_BASE + "/authenticate",
            method: "POST",
            dataType: "json",
            data: options.data,
            success: function (response) {
                if (response.success) {
                    self.getAccount({
                        type: options.type,
                        accessToken: response.data.token,
                        id: response.data.id,
                        success: function (user) {
                            if (options.success) options.success();
                        },
                        error: function (error) {
                            if (options.error) options.error(error);
                        }
                    });
                } else {
                    if (options.error) options.error(response.error);
                }
            }
        });
    },
    logout: function () {
        localStorage.clear();
        Backbone.history.navigate("home", {trigger: true});
        $(document).trigger("deauthenticated");
    },
    createAccount: function (options) {
        var self = this;

        var types = {
            "user": API_BASE + "/users",
            "company": API_BASE + "/companies"
        };

        if (Object.keys(types).indexOf(options.type) == -1) {
            throw new Error("Invalid account type provided. Allowed values are: " + Object.keys(types));
        }

        $.ajax({
            url: types[options.type],
            method: "POST",
            dataType: "json",
            data: options.data,
            success: function (response) {
                console.log(response);
                if (response.success) {
                    self.getAccount({
                        type: options.type,
                        accessToken: response.data.token,
                        id: response.data.id,
                        success: function (user) {
                            if (options.success) options.success();
                        },
                        error: function (error) {
                            if (options.error) options.error(error);
                        }
                    });
                } else {
                    if (options.error) options.error(response.error);
                }
            }
        });
    },
    getAccount: function (options) {
        console.log(options);
        var account = this.getAccountFromCache();

        var url = null;

        if (account) {
            url = account.type == "user" ? API_BASE + "/users/" +  account.id : API_BASE + "/companies/" + account.id;
        } else {
            url = options.type == "user" ? API_BASE + "/users/" +  options.id : API_BASE + "/companies/" + options.id;
        }

        console.log("here");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader("Authorization", account ? "Bearer " + user.accessToken : "Bearer " + options.accessToken);
            },
            success: function (response) {
                if (account && account.type == "user") {
                    localStorage.setItem(
                        "account",
                        JSON.stringify({
                            id: account.id,
                            accessToken: account.accessToken,
                            name: response.data.name,
                            email: response.data.email
                        })
                    );
                } else if (account && account.type == "company") {
                    localStorage.setItem(
                        "account",
                        JSON.stringify({
                            id: account.id,
                            accessToken: account.accessToken,
                            name: response.data.name,
                            email: response.data.email,
                            description: response.data.description,
                            type: response.data.type
                        })
                    );
                } else if (options.type == "user") {
                    localStorage.setItem(
                        "account",
                        JSON.stringify({
                            id: options.id,
                            accessToken: options.accessToken,
                            name: response.data.name,
                            email: response.data.email
                        })
                    );
                } else {
                    localStorage.setItem(
                        "account",
                        JSON.stringify({
                            id: options.id,
                            accessToken: options.accessToken,
                            name: response.data.name,
                            email: response.data.email,
                            description: response.data.description,
                            type: response.data.type
                        })
                    );
                }
                if (response.success) {
                    if (options.success) options.success(response.data);
                } else {
                    if (options.error) options.error(response.error);
                }
            }
        });
    },
    getAccountFromCache: function () {
        var account = localStorage.getItem("account");
        if (account) {
            return JSON.parse(account);
        } else {
            return undefined;
        }
    },
    isAuthenticated: function () {
        return (localStorage.getItem("account") != undefined);
    }
};

module.exports = authController;
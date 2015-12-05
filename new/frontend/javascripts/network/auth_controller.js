/**
 * Created by manas on 05-12-2015.
 */

var $ = require("jquery");
var API_BASE = "http://ec2-54-78-233-20.eu-west-1.compute.amazonaws.com:4000";

var authController = {
    login: function (options) {
        var self = this;

        var types = {
            "user": API_BASE + "/auth/api/users/",
            "company": API_BASE + "/auth/api/companies/"
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
                if (response.status == 200) {
                    self.getAccount({
                        type: type,
                        accessToken: response.data.accessToken,
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
    createAccount: function (options) {
        var self = this;

        var types = {
            "user": API_BASE + "/auth/api/user/register/",
            "company": API_BASE + "/auth/api/company/register/"
        };

        if (Object.keys(types).indexOf(options.type) == -1) {
            throw new Error("Invalid account type provided. Allowed values are: " + Object.keys(types));
        }

        $.ajax({
            url: types[options.type],
            method: "POST",
            dataType: "json",
            crossDomain: true,
            data: options.data,
            success: function (response) {
                if (response.status == 200) {
                    self.getAccount({
                        type: type,
                        accessToken: response.data.accessToken,
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
        var account = this.getAccountFromCache();

        $.ajax({
            url: account ? API_BASE + "/users/" + account.userId : API_BASE + "/users/" + options.userId,
            method: "GET",
            dataType: "json",
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader("Authorization", user ? "gwt " + user.accessToken : "gwt " + options.accessToken);
            },
            success: function (response) {
                if (response.status == 200) {
                    if (account && account.type == "user") {
                        localStorage.setItem(
                            "account",
                            JSON.stringify({
                                type: account.type,
                                accessToken: account.accessToken,
                                name: response.data.name,
                                location: response.data.location
                            })
                        );
                    } else if (account && account.type == "company") {
                        localStorage.setItem(
                            "account",
                            JSON.stringify({
                                type: account.type,
                                accessToken: account.accessToken,
                                name: response.data.name,
                                email: response.data.email,
                                description: response.data.description
                            })
                        );
                    } else if (options.type == "user") {
                        localStorage.setItem(
                            "account",
                            JSON.stringify({
                                type: options.type,
                                accessToken: options.accessToken,
                                name: response.data.name,
                                location: response.data.location
                            })
                        );
                    } else {
                        localStorage.setItem(
                            "account",
                            JSON.stringify({
                                type: options.type,
                                accessToken: options.accessToken,
                                name: response.data.name,
                                email: response.data.email,
                                description: response.data.description
                            })
                        );
                    }
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
    }
};

module.exports = authController;
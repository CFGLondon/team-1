/**
 * Created by manas on 04-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");
var authController = require("../network/auth_controller");
var notification = require("../notification");

var LoginView = Backbone.View.extend({
    el: "#content",
    template: $("#login-template").html(),
    events: {
        "submit #user-login-form": "userLogin",
        "submit #company-login-form": "companyLogin"
    },
    render: function () {
        var compiledTemplate = swig.render(this.template);
        this.$el.html(compiledTemplate);

        this.$userLoginButton = $("#user-login-submit-button");
        this.$userEmailInput = $("#user-login-email-input");
        this.$userPasswordInput = $("#user-login-password-input");
        this.$companyLoginButton = $("#company-login-submit-button");
        this.$companyEmailInput = $("#company-login-email-input");
        this.$companyPasswordInput = $("#company-login-password-input");
    },
    userLogin: function (event) {
        event.preventDefault();

        this.$userLoginButton.text("Loading...");
        this.$userLoginButton.attr("disabled", true);

        var email = this.$userEmailInput.val().trim();
        var password = this.$userPasswordInput.val().trim();

        var self = this;
        authController.login({
            data: {
                email: email,
                password: password,
                type: "user"
            },
            success: function () {
                self.$userLoginButton.text("Login");
                self.$userLoginButton.attr("disabled", false);

                Backbone.history.navigate("me", {trigger: true});

                $(document).trigger("authenticated");

                new Notification({
                    $container: $("#notifications"),
                    message: "Logged in as: <strong>" + authController.getAccountFromCache().name + "</strong>",
                    style: "info"
                }).notify("show");

                console.log("success");
            },
            error: function (error) {
                self.$userLoginButton.text("Login");
                self.$userLoginButton.attr("disabled", false);

                new Notification({
                    $container: $("#notifications"),
                    message: "<strong>Error! </strong>" + error,
                    style: "danger"
                }).notify("show");

                console.log("nope error!");
            }
        });
    },
    companyLogin: function (event) {
        event.preventDefault();

        this.$companyLoginButton.text("Loading...");
        this.$companyLoginButton.attr("disabled", true);

        var email = this.$companyEmailInput.val().trim();
        var password = this.$companyPasswordInput.val().trim();

        var self = this;
        authController.login({
            data: {
                email: email,
                password: password,
                type: "company"
            },
            success: function () {
                self.$companyLoginButton.text("Login");
                self.$companyLoginButton.attr("disabled", false);

                Backbone.history.navigate("me", {trigger: true});

                $(document).trigger("authenticated");

                new Notification({
                    $container: $("#notifications"),
                    message: "Logged in as: <strong>" + authController.getAccountFromCache().name + "</strong>",
                    style: "info"
                }).notify("show");

                console.log("success");
            },
            error: function (error) {
                self.$companyLoginButton.text("Login");
                self.$companyLoginButton.attr("disabled", false);

                new Notification({
                    $container: $("#notifications"),
                    message: "<strong>Error! </strong>" + error,
                    style: "danger"
                }).notify("show");

                console.log("nope error!");
            }
        });
    }
});

module.exports = new LoginView();
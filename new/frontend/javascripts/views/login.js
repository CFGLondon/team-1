/**
 * Created by manas on 04-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");

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

        alert(email + " USER " + password);
    },
    companyLogin: function (event) {
        event.preventDefault();

        this.$companyLoginButton.text("Loading...");
        this.$companyLoginButton.attr("disabled", true);

        var email = this.$companyEmailInput.val().trim();
        var password = this.$companyPasswordInput.val().trim();

        alert(email + " COMPANY " + password);
    }
});

module.exports = new LoginView();
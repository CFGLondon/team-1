/**
 * Created by manas on 04-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");
var authController = require("../network/auth_controller");

var CreateAccountView = Backbone.View.extend({
    el: "#content",
    template: $("#create-account-template").html(),
    events: {
        "submit #create-user-account-form": "createUserAccount",
        "submit #create-company-account-form": "createCompanyAccount"
    },
    render: function () {
        var compiledTemplate = swig.render(this.template);
        this.$el.html(compiledTemplate);

        this.$createUserAccountButton = $("#create-user-account-submit-button");
        this.$createUserAccountEmailInput = $("#create-user-account-email-input");
        this.$createUserAccountNameInput = $("#create-user-account-name-input");
        this.$createUserAccountPasswordInput = $("#create-user-account-password-input");
        this.$createUserAccountLocationInput = $("#create-user-account-location-input");
        this.$createCompanyAccountNameInput = $("#create-company-account-name-input");
        this.$createCompanyAccountEmailInput = $("#create-company-account-email-input");
        this.$createCompanyAccountPasswordInput = $("#create-company-account-password-input");
        this.$createCompanyAccountTypeSelect = $("#create-company-account-type-select");
        this.$createCompanyAccountDescriptionInput = $("#create-company-account-description-input");
    },
    createUserAccount: function (event) {
        event.preventDefault();

        var email = this.$createUserAccountEmailInput.val().trim();
        var name = this.$createUserAccountNameInput.val().trim();
        var password = this.$createUserAccountPasswordInput.val().trim();
        var location = this.$createUserAccountLocationInput.val().trim();

        this.$createUserAccountButton.text("Loadng...");
        this.$createUserAccountButton.attr("disabled", true);

        var self = this;
        authController.createAccount({
            type: "user",
            data: {
                username: email,
                //name: name,
                password: password,
                location: location
            },
            success: function () {
                self.$createUserAccountButton.text("Create account");
                self.$createUserAccountButton.attr("disabled", false);

                //Backbone.history.navigate("me", {trigger: true});

                //$(document).trigger("authenticated");

                //new Notification({
                //    $container: $("#notifications"),
                //    message: "Logged in as: <strong>" + authController.getUserFromCache().userName + "</strong>",
                //    style: "info"
                //}).notify("show");

                console.log("success");
            },
            error: function (error) {
                self.$createUserAccountButton.text("Create account");
                self.$createUserAccountButton.attr("disabled", false);

                //new Notification({
                //    $container: $("#notifications"),
                //    message: "<strong>Error! </strong>" + error,
                //    style: "danger"
                //}).notify("show");

                console.log("error");
            }
        });
    },
    createCompanyAccount: function (event) {
        event.preventDefault();

        var name = this.$createCompanyAccountNameInput.val().trim();
        var email = this.$createCompanyAccountEmailInput.val().trim();
        var password = this.$createCompanyAccountPasswordInput.val().trim();
        var type = this.$createCompanyAccountTypeSelect.val().trim();
        var description = this.$createCompanyAccountDescriptionInput.val().trim();

        console.log(name);
        console.log(email);
        console.log(password);
        console.log(type);
        console.log(description);
    }
});

module.exports = new CreateAccountView();
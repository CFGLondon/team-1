/**
 * Created by manas on 04-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");

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

        alert("CREATE USER ACCOUNT");
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
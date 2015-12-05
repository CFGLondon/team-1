/**
 * Created by manas on 05-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");

var MeView = Backbone.View.extend({
    el: "#content",
    template: $("#me-template").html(),
    render: function () {
        var compiledTemplate = swig.render(this.template);
        this.$el.html(compiledTemplate);
    }
});

module.exports = new MeView();
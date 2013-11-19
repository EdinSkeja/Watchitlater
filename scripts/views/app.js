//Main application..
define(['backbone'], function(Backbone) {
	var App = Backbone.View.extend({
        el: $('#hello_container'),
        initialize: function() {
            this.render();
        },
        render: function() {
           // the `variables` 
            var variables = { hello: "Hello World!" }; 
            var template = _.template( $("#hello_template").html(), variables );
            $(this.el).html(template);
        }
	});
	return App;
});
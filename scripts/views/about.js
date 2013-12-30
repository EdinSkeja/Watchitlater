define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/about.html'
], function ($, _, Backbone, aboutTemplate) { 
    
    var AboutView = Backbone.View.extend({
        
        el: '#movielistapp',
        
        template: _.template(aboutTemplate),

        initialize: function() {

        },

        render: function() {
            this.$el.html('');
            this.$el.html(this.template(this));
            return this;
        }
            
    });
    return AboutView;
});